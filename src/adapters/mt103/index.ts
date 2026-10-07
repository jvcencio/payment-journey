import type { Artifact, ParseResult } from '../../domain/model';
import { withinSize } from '../../artifacts/capture';
import {
  failure,
  locatorFactory,
  ParseFailure,
  snapshotBuilder,
} from '../shared';

/** Project block-4-only Option-F contract. This is not comprehensive FIN validation. */
export function parseMt103(artifact: Artifact): ParseResult {
  const raw = artifact.rawPayload;
  try {
    if (!withinSize(raw))
      throw new ParseFailure('INPUT_TOO_LARGE', 'Input exceeds 256 KiB.');
    if (artifact.formatFamily !== 'MT')
      throw new ParseFailure(
        'UNSUPPORTED_MESSAGE',
        'Source must be the MT103 subset.',
      );
    const envelope =
      /^\{4:(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)-\}(?:\r\n|\n)?$/.exec(raw);
    if (!envelope)
      throw new ParseFailure(
        'UNSUPPORTED_MT_ENVELOPE',
        'Expected a block-4-only MT103 subset: {4: followed by field lines and -}. FIN transport envelopes are not supported.',
      );
    const body = envelope[1]!;
    const offset = raw.indexOf('\n') + 1;
    const loc = locatorFactory(raw),
      b = snapshotBuilder(artifact);
    const fields: {
      tag: string;
      start: number;
      end: number;
      lines: { text: string; start: number; end: number }[];
    }[] = [];
    for (const match of body.matchAll(/[^\r\n]*(?:\r\n|\n|$)/g)) {
      if (!match[0]) continue;
      const text = match[0].replace(/\r?\n$/, '');
      const start = offset + match.index;
      if (
        text.includes('\r') ||
        /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)
      )
        throw new ParseFailure(
          'MALFORMED_MT',
          'Unsupported control character.',
          start,
        );
      const header = /^:([0-9]{2}[A-Z]?):(.*)$/.exec(text);
      if (header) {
        if (fields.length >= 1000)
          throw new ParseFailure(
            'RESOURCE_LIMIT',
            'Too many MT fields.',
            start,
          );
        const tag = header[1]!,
          value = header[2]!;
        fields.push({
          tag,
          start,
          end: start + text.length,
          lines: [
            {
              text: value,
              start: start + tag.length + 2,
              end: start + text.length,
            },
          ],
        });
      } else {
        const field = fields.at(-1);
        if (!field || text.startsWith(':'))
          throw new ParseFailure(
            'MALFORMED_MT',
            'Expected a field header or a valid continuation line.',
            start,
          );
        if (field.lines.length >= 1000)
          throw new ParseFailure(
            'RESOURCE_LIMIT',
            'Too many field lines.',
            start,
          );
        field.lines.push({ text, start, end: start + text.length });
        field.end = start + text.length;
      }
    }
    if (!fields.length)
      throw new ParseFailure('MALFORMED_MT', 'No fields found.');
    for (const tag of ['50F', '59F'])
      if (fields.filter((f) => f.tag === tag).length > 1)
        throw new ParseFailure(
          'UNSUPPORTED_REPEATED_PARTICIPANT',
          `Only one ${tag} occurrence is supported.`,
        );
    const recognized = new Set([
      '20',
      '23B',
      '32A',
      '50F',
      '57A',
      '59F',
      '70',
      '71A',
    ]);
    fields.forEach((field, fieldIndex) => {
      const path = `block4/:${field.tag}:[${fieldIndex + 1}]`;
      if (field.tag !== '50F' && field.tag !== '59F') {
        b.unknown(
          loc(path, field.start, field.end),
          recognized.has(field.tag)
            ? 'Recognized field; outside first-slice semantic analysis.'
            : 'Unsupported field; retained without interpretation.',
        );
        return;
      }
      const p = b.participant(field.tag === '50F' ? 'DEBTOR' : 'CREDITOR');
      let countrySeen = false;
      field.lines.forEach((line, index) => {
        const linePath = `${path}/line[${index + 1}]`;
        if (index === 0 && line.text.startsWith('/') && line.text.length > 1) {
          b.add(
            p,
            'account',
            line.text.slice(1),
            loc(linePath, line.start + 1, line.end),
          );
          return;
        }
        const numbered = /^([1-8])\/(.*)$/.exec(line.text);
        if (!numbered) {
          b.unknown(
            loc(linePath, line.start, line.end),
            'Uninterpreted Option-F identification or continuation; numbered 1/2/3 data only.',
          );
          b.warnings.push({
            code: 'UNINTERPRETED_OPTION_F_LINE',
            message: 'An Option-F line is outside the supported encoding.',
            locator: loc(linePath, line.start, line.end),
          });
          return;
        }
        const code = numbered[1]!,
          value = numbered[2]!;
        if (!['1', '2', '3'].includes(code)) {
          b.unknown(
            loc(linePath, line.start, line.end),
            'Numbered line outside the supported semantic subset.',
          );
          return;
        }
        if (!value.trim())
          throw new ParseFailure(
            'EMPTY_OPTION_F_VALUE',
            'A supported Option-F line must have a non-empty value.',
            line.start,
          );
        if (code === '1' || code === '2') {
          b.add(
            p,
            code === '1' ? 'name' : 'address.addressLines',
            value,
            loc(linePath, line.start + 2, line.end),
          );
          return;
        }
        if (countrySeen)
          throw new ParseFailure(
            'UNSUPPORTED_OPTION_F_CONTINUATION',
            'Repeated 3/ country/town lines require interpretation outside this subset.',
            line.start,
          );
        const countryTown = /^([A-Z]{2})(?:\/(.+))?$/.exec(value);
        if (!countryTown)
          throw new ParseFailure(
            'MALFORMED_OPTION_F_COUNTRY',
            'Expected 3/CC or 3/CC/TOWN; country-code membership is not validated.',
            line.start,
          );
        countrySeen = true;
        b.add(
          p,
          'address.country',
          countryTown[1]!,
          loc(`${linePath}/country`, line.start + 2, line.start + 4),
        );
        if (countryTown[2])
          b.add(
            p,
            'address.townName',
            countryTown[2],
            loc(`${linePath}/town`, line.start + 5, line.end),
          );
      });
      if (!p.identity.nameRefs.length)
        throw new ParseFailure(
          'MISSING_OPTION_F_NAME',
          'A supported participant requires a numbered 1/ name line.',
          field.start,
        );
    });
    for (const role of ['DEBTOR', 'CREDITOR'])
      if (
        !b.snapshot.transactions[0]!.participants.some((p) => p.role === role)
      )
        b.warnings.push({
          code: 'PARTICIPANT_NOT_INTERPRETED',
          message: `${role} not interpreted; expected ${role === 'DEBTOR' ? '50F' : '59F'}. Other fields remain visible.`,
        });
    return b.finish();
  } catch (error) {
    return failure(artifact, error);
  }
}
