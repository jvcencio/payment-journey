import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { capture } from '../../src/artifacts/capture';
import { parsePacs008, PACS_NAMESPACE } from '../../src/adapters/pacs008';
const raw = readFileSync(
  'fixtures/raw-pairs/a-clean-preservation/target.pacs008.xml',
  'utf8',
);
const parse = async (text = raw) => parsePacs008(await capture(text, 'target'));
const wrap = (body: string) =>
  `<Document xmlns="${PACS_NAMESPACE}"><FIToFICstmrCdtTrf><CdtTrfTxInf>${body}</CdtTrfTxInf></FIToFICstmrCdtTrf></Document>`;
describe('bounded saxes adapter', () => {
  it('preserves exact locators and explicit values independently of React', async () => {
    const r = await parse();
    if (!r.ok) throw new Error('Expected success');
    expect(r.snapshot.nodes.filter((n) => n.material)).toHaveLength(10);
    expect(
      r.unmapped.some((u) => u.rawValue.includes('FICTIONAL TEST PAYMENT')),
    ).toBe(true);
    for (const n of r.snapshot.nodes) {
      expect(raw.slice(n.sourceLocator.start, n.sourceLocator.end)).toBe(
        n.rawValue,
      );
      expect(n.rawValue).toContain(n.value);
    }
    expect(await parse()).toEqual(r);
  });
  it('handles prefixes, entity references, unicode, CRLF, and self-closing unknowns', async () => {
    const text = wrap(
      '<Dbtr><Nm>FABLE &amp; 😀</Nm><PstlAdr><AdrLine>LINE</AdrLine></PstlAdr></Dbtr><Extra/>',
    ).replaceAll('><', '>\r\n<');
    const r = await parse(text);
    if (!r.ok) throw new Error('Expected success');
    expect(r.snapshot.nodes[0]!.value).toBe('FABLE & 😀');
    for (const n of r.snapshot.nodes)
      expect(text.slice(n.sourceLocator.start, n.sourceLocator.end)).toBe(
        n.rawValue,
      );
    expect(r.unmapped.some((u) => u.rawValue === '<Extra/>')).toBe(true);
    const prefixed = text
      .replace('xmlns=', 'xmlns:p=')
      .replace(/<(\/?)([A-Za-z][\w]*)(?=[\s/>])/g, '<$1p:$2');
    const pr = await parse(prefixed);
    expect(pr.ok).toBe(true);
  });
  it('does not interpret lookalike tags in foreign namespaces', async () => {
    const r = await parse(
      wrap(
        '<Dbtr><Nm>KNOWN</Nm><PstlAdr><AdrLine xmlns="urn:evil">UNMAPPED</AdrLine></PstlAdr></Dbtr>',
      ),
    );
    if (!r.ok) throw new Error('Expected success');
    expect(r.snapshot.nodes).toHaveLength(1);
    expect(r.unmapped.some((u) => u.rawValue.includes('UNMAPPED'))).toBe(true);
  });
  it.each([
    ['DTD', '<!DOCTYPE Document>' + raw, 'UNSAFE_XML_DOCTYPE'],
    [
      'external entity',
      '<!DOCTYPE Document [<!ENTITY x SYSTEM "https://example.invalid/payload">]>' +
        wrap('<Dbtr><Nm>&x;</Nm></Dbtr>'),
      'UNSAFE_XML_DOCTYPE',
    ],
    [
      'entity bomb',
      '<!DOCTYPE Document [<!ENTITY a "x"><!ENTITY b "&a;&a;&a;">]>' +
        wrap('<Dbtr><Nm>&b;</Nm></Dbtr>'),
      'UNSAFE_XML_DOCTYPE',
    ],
    [
      'unknown entity',
      wrap('<Dbtr><Nm>&unknown;</Nm></Dbtr>'),
      'MALFORMED_XML',
    ],
    ['mismatched tags', wrap('<Dbtr><Nm>x</Dbtr>'), 'MALFORMED_XML'],
    ['undeclared prefix', wrap('<evil:Dbtr/>'), 'MALFORMED_XML'],
    [
      'wrong version',
      raw.replaceAll('pacs.008.001.14', 'pacs.008.001.13'),
      'UNSUPPORTED_MESSAGE_VERSION',
    ],
    [
      'multiple transactions',
      raw.replace('</CdtTrfTxInf>', '</CdtTrfTxInf><CdtTrfTxInf/>'),
      'UNSUPPORTED_MULTIPLE_TRANSACTIONS',
    ],
    ['duplicate party', wrap('<Dbtr/><Dbtr/>'), 'UNSUPPORTED_REPEATED_ELEMENT'],
    [
      'deep input',
      wrap('<X>'.repeat(70) + '</X>'.repeat(70)),
      'RESOURCE_LIMIT',
    ],
    ['many nodes', wrap('<X/>'.repeat(10_001)), 'RESOURCE_LIMIT'],
    [
      'large value',
      wrap(`<Dbtr><Nm>${'x'.repeat(65_537)}</Nm></Dbtr>`),
      'RESOURCE_LIMIT',
    ],
    [
      'large attribute',
      wrap(`<X a="${'x'.repeat(65_537)}"/>`),
      'RESOURCE_LIMIT',
    ],
    [
      'nested scalar',
      wrap('<Dbtr><Nm><X>NAME</X></Nm></Dbtr>'),
      'UNSUPPORTED_COMPLEX_VALUE',
    ],
    ['encoding', raw.replace('UTF-8', 'UTF-16'), 'UNSUPPORTED_XML_ENCODING'],
  ])('rejects %s explicitly', async (_label, text, code) => {
    const r = await parse(text);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.diagnostics[0]!.code).toBe(code);
  });
  it('enforces byte limit even when called directly with an artifact', async () => {
    const a = await capture(raw, 'target');
    const r = parsePacs008({ ...a, rawPayload: 'x'.repeat(262_145) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.diagnostics[0]!.code).toBe('INPUT_TOO_LARGE');
  });
  it('never fetches schemas or executes processing instructions', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('Network forbidden'));
    try {
      const r = await parse(
        wrap(
          '<?xml-stylesheet href="https://example.invalid/a"?><Dbtr><Nm>SAFE</Nm></Dbtr>',
        ),
      );
      expect(r.ok).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
  });
});
