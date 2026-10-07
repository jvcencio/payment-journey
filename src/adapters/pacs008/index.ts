import { SaxesParser } from 'saxes';
import type { Artifact, ParseResult } from '../../domain/model';
import { withinSize } from '../../artifacts/capture';
import {
  failure,
  locatorFactory,
  ParseFailure,
  snapshotBuilder,
} from '../shared';
export const PACS_NAMESPACE = 'urn:iso:std:iso:20022:tech:xsd:pacs.008.001.14';
export const XML_LIMITS = Object.freeze({
  depth: 64,
  nodes: 10_000,
  valueChars: 65_536,
  attributes: 10_000,
});
interface XmlElement {
  local: string;
  uri: string;
  path: string;
  start: number;
  end: number;
  text: string;
  children: XmlElement[];
  attributes: string[];
  childCounts: Map<string, number>;
}
/** No DOM, external resolver, custom entities or schema fetching. Pure bounded parsing. */
export function parsePacs008(artifact: Artifact): ParseResult {
  const raw = artifact.rawPayload;
  try {
    if (!withinSize(raw))
      throw new ParseFailure('INPUT_TOO_LARGE', 'Input exceeds 256 KiB.');
    if (artifact.formatFamily !== 'pacs')
      throw new ParseFailure(
        'UNSUPPORTED_MESSAGE',
        'Target must be pacs.008.001.14.',
      );
    if (/<!DOCTYPE/i.test(raw))
      throw new ParseFailure(
        'UNSAFE_XML_DOCTYPE',
        'DOCTYPE/DTD input is not accepted.',
      );
    const loc = locatorFactory(raw),
      b = snapshotBuilder(artifact);
    const parser = new SaxesParser({ xmlns: true, position: true });
    const stack: XmlElement[] = [],
      all: XmlElement[] = [];
    const extras: { start: number; end: number; reason: string }[] = [];
    let root: XmlElement | undefined,
      openingStart = 0,
      attributes = 0;
    parser.on('error', () => {
      throw new ParseFailure(
        'MALFORMED_XML',
        'XML is not well formed; check the indicated location.',
        parser.position,
      );
    });
    parser.on('doctype', () => {
      throw new ParseFailure(
        'UNSAFE_XML_DOCTYPE',
        'DOCTYPE/DTD input is not accepted.',
        parser.position,
      );
    });
    parser.on('xmldecl', (declaration) => {
      if (
        declaration.encoding &&
        declaration.encoding.toUpperCase() !== 'UTF-8'
      )
        throw new ParseFailure(
          'UNSUPPORTED_XML_ENCODING',
          'Only UTF-8 XML text is accepted.',
        );
      extras.push({
        start: raw.indexOf('<?xml'),
        end: parser.position,
        reason: 'XML declaration retained as artifact metadata.',
      });
    });
    parser.on('processinginstruction', () => {
      extras.push({
        start: raw.lastIndexOf('<?', parser.position - 1),
        end: parser.position,
        reason:
          'Processing instruction retained as inert evidence; never executed.',
      });
    });
    parser.on('comment', () => {
      extras.push({
        start: raw.lastIndexOf('<!--', parser.position - 1),
        end: parser.position,
        reason: 'Comment retained as inert evidence.',
      });
    });
    parser.on('opentagstart', () => {
      openingStart = raw.lastIndexOf('<', parser.position - 1);
    });
    parser.on('opentag', (tag) => {
      if (stack.length >= XML_LIMITS.depth || all.length >= XML_LIMITS.nodes)
        throw new ParseFailure(
          'RESOURCE_LIMIT',
          'XML depth or node count exceeds the supported limit.',
          openingStart,
        );
      const parent = stack.at(-1),
        key = `${tag.uri}:${tag.local}`;
      const ordinal = (parent?.childCounts.get(key) ?? 0) + 1;
      parent?.childCounts.set(key, ordinal);
      const node: XmlElement = {
        local: tag.local,
        uri: tag.uri,
        path: `${parent?.path ?? ''}/${tag.name}[${ordinal}]`,
        start: openingStart,
        end: parser.position,
        text: '',
        children: [],
        attributes: [],
        childCounts: new Map(),
      };
      for (const attribute of Object.values(tag.attributes)) {
        attributes++;
        if (
          attributes > XML_LIMITS.attributes ||
          attribute.value.length > XML_LIMITS.valueChars
        )
          throw new ParseFailure(
            'RESOURCE_LIMIT',
            'XML attribute limit exceeded.',
            openingStart,
          );
        if (attribute.uri !== 'http://www.w3.org/2000/xmlns/')
          node.attributes.push(attribute.name);
      }
      if (parent) parent.children.push(node);
      else root = node;
      all.push(node);
      stack.push(node);
    });
    const text = (value: string) => {
      const node = stack.at(-1);
      if (!node) return;
      if (node.text.length + value.length > XML_LIMITS.valueChars)
        throw new ParseFailure(
          'RESOURCE_LIMIT',
          'XML value exceeds the supported limit.',
          node.start,
        );
      node.text += value;
    };
    parser.on('text', text);
    parser.on('cdata', text);
    parser.on('closetag', () => {
      const node = stack.pop()!;
      node.end = parser.position;
    });
    parser.write(raw).close();
    if (!root || root.local !== 'Document' || root.uri !== PACS_NAMESPACE)
      throw new ParseFailure(
        'UNSUPPORTED_MESSAGE_VERSION',
        'Expected Document in the exact pacs.008.001.14 namespace.',
      );
    const children = (node: XmlElement, local: string) =>
      node.children.filter(
        (c) => c.local === local && c.uri === PACS_NAMESPACE,
      );
    const single = (
      node: XmlElement,
      name: string,
      required = false,
    ): XmlElement | undefined => {
      const found = children(node, name);
      if (found.length > 1)
        throw new ParseFailure(
          'UNSUPPORTED_REPEATED_ELEMENT',
          `Only one ${name} is supported at this location.`,
          node.start,
        );
      if (required && !found.length)
        throw new ParseFailure(
          'MISSING_REQUIRED_SUBSET_ELEMENT',
          `Expected ${name} in the supported namespace.`,
          node.start,
        );
      return found[0];
    };
    const message = single(root, 'FIToFICstmrCdtTrf', true)!;
    const txs = children(message, 'CdtTrfTxInf');
    if (txs.length > 1)
      throw new ParseFailure(
        'UNSUPPORTED_MULTIPLE_TRANSACTIONS',
        'Exactly one CdtTrfTxInf is supported.',
        txs[1]!.start,
      );
    if (!txs.length)
      throw new ParseFailure(
        'MISSING_TRANSACTION',
        'Expected one CdtTrfTxInf in the supported namespace.',
        message.start,
      );
    const tx = txs[0]!,
      consumed = new Set<XmlElement>();
    for (const [tag, role] of [
      ['Dbtr', 'DEBTOR'],
      ['Cdtr', 'CREDITOR'],
    ] as const) {
      const party = single(tx, tag);
      if (!party) {
        b.warnings.push({
          code: 'PARTICIPANT_NOT_INTERPRETED',
          message: `${role} is absent or outside the supported namespace.`,
        });
        continue;
      }
      const p = b.participant(role);
      const add = (node: XmlElement, concept: string) => {
        if (node.children.length)
          throw new ParseFailure(
            'UNSUPPORTED_COMPLEX_VALUE',
            'A supported scalar element contains nested elements.',
            node.start,
          );
        if (!node.text.trim()) {
          b.unknown(
            loc(node.path, node.start, node.end),
            'Empty value; not interpreted as a semantic element.',
          );
          consumed.add(node);
          return;
        }
        b.add(p, concept, node.text, loc(node.path, node.start, node.end));
        consumed.add(node);
      };
      const name = single(party, 'Nm');
      if (name) add(name, 'name');
      const address = single(party, 'PstlAdr');
      if (address) {
        for (const [element, concept] of [
          ['Ctry', 'country'],
          ['TwnNm', 'townName'],
        ] as const) {
          const node = single(address, element);
          if (node) add(node, `address.${concept}`);
        }
        for (const line of children(address, 'AdrLine'))
          add(line, 'address.addressLines');
      }
      const account = single(tx, `${tag}Acct`);
      if (account) {
        const id = single(account, 'Id');
        if (id) {
          const iban = single(id, 'IBAN'),
            other = single(id, 'Othr');
          if (iban && other)
            throw new ParseFailure(
              'UNSUPPORTED_ACCOUNT_CHOICE',
              'Multiple account identifier representations are not interpreted.',
              id.start,
            );
          const value = iban ?? (other ? single(other, 'Id') : undefined);
          if (value) add(value, 'account');
        }
      }
    }
    for (const node of all) {
      if (!consumed.has(node) && (!node.children.length || node.text.trim()))
        b.unknown(
          loc(node.path, node.start, node.end),
          'Outside first-slice semantic interpretation; retained without validation.',
        );
      if (node.attributes.length)
        b.unknown(
          loc(
            `${node.path}/@${node.attributes.join(',@')}`,
            node.start,
            node.end,
          ),
          'Attributes retained in their containing raw element; outside semantic interpretation.',
        );
    }
    for (const extra of extras)
      b.unknown(loc('XML metadata', extra.start, extra.end), extra.reason);
    return b.finish();
  } catch (error) {
    return failure(artifact, error);
  }
}
