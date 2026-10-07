import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { capture } from '../../src/artifacts/capture';
import { parseMt103 } from '../../src/adapters/mt103';
const raw = readFileSync(
  'fixtures/raw-pairs/a-clean-preservation/source.mt103',
  'utf8',
);
const parse = async (text = raw) => parseMt103(await capture(text, 'source'));
describe('MT103 Option-F subset', () => {
  it('interprets explicit values and preserves all other fields', async () => {
    const r = await parse();
    if (!r.ok) throw new Error('Expected success');
    expect(r.snapshot.nodes.filter((n) => n.material)).toHaveLength(10);
    expect(r.snapshot.transactions[0]!.participants.map((p) => p.role)).toEqual(
      ['DEBTOR', 'CREDITOR'],
    );
    expect(r.snapshot.nodes.map((n) => n.semanticPath)).not.toContain(
      'address.streetName',
    );
    expect(r.unmapped).toHaveLength(6);
    expect(
      r.snapshot.nodes.every((n) => n.interpretationConfidence === 'EXPLICIT'),
    ).toBe(true);
    for (const n of r.snapshot.nodes)
      expect(raw.slice(n.sourceLocator.start, n.sourceLocator.end)).toBe(
        n.rawValue,
      );
    expect(await parse()).toEqual(r);
  });
  it('retains unknown fields and unknown numbered lines', async () => {
    const r = await parse(
      raw
        .replace(':71A:SHA', ':72:UNKNOWN TEST\n:71A:SHA')
        .replace('3/US/', '4/UNKNOWN TEST\n3/US/'),
    );
    if (!r.ok) throw new Error('Expected success');
    expect(r.unmapped.some((u) => u.rawValue.includes(':72:'))).toBe(true);
    expect(r.unmapped.some((u) => u.rawValue.includes('4/UNKNOWN'))).toBe(true);
  });
  it('accepts CRLF with precise locators', async () => {
    const text = raw.replaceAll('\n', '\r\n');
    const r = await parse(text);
    if (!r.ok) throw new Error('Expected success');
    for (const n of r.snapshot.nodes)
      expect(text.slice(n.sourceLocator.start, n.sourceLocator.end)).toBe(
        n.rawValue,
      );
  });
  it.each([
    ['bad envelope', raw.replace('{4:', '{5:'), 'UNSUPPORTED_MT_ENVELOPE'],
    [
      'bad country',
      raw.replace('3/US/', '3/USA/'),
      'MALFORMED_OPTION_F_COUNTRY',
    ],
    [
      'repeat country',
      raw.replace('3/US/EXAMPLE TOWN', '3/US/EXAMPLE TOWN\n3/US/OTHER'),
      'UNSUPPORTED_OPTION_F_CONTINUATION',
    ],
    [
      'empty name',
      raw.replace('1/FABLE PARTS TEST', '1/'),
      'EMPTY_OPTION_F_VALUE',
    ],
    [
      'duplicate role',
      raw.replace(':71A:SHA', ':50F:/TEST\n1/DUPLICATE\n:71A:SHA'),
      'UNSUPPORTED_REPEATED_PARTICIPANT',
    ],
  ])('reports %s', async (_label, text, code) => {
    const r = await parse(text);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.diagnostics[0]!.code).toBe(code);
  });
});
