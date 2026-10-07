import { describe, expect, it } from 'vitest';
import { capture } from '../../src/artifacts/capture';
import { locatorFactory, snapshotBuilder } from '../../src/adapters/shared';
describe('artifact and evidence identity', () => {
  it('hashes exact input, distinguishes sides and retains repeated occurrences', async () => {
    const raw = 'same\r\nsame';
    const a = await capture(raw, 'source');
    expect(a).toEqual(await capture(raw, 'source'));
    expect(a.artifactId).not.toBe((await capture(raw, 'target')).artifactId);
    const b = snapshotBuilder(a),
      p = b.participant('DEBTOR'),
      loc = locatorFactory(raw);
    const one = b.add(p, 'address.addressLines', 'same', loc('line[1]', 0, 4));
    const two = b.add(p, 'address.addressLines', 'same', loc('line[2]', 6, 10));
    expect(one.elementId).not.toBe(two.elementId);
    expect(two.sourceLocator).toMatchObject({ line: 2, column: 1 });
    for (const n of b.snapshot.nodes)
      expect(raw.slice(n.sourceLocator.start, n.sourceLocator.end)).toBe(
        n.rawValue,
      );
  });
  it('bounds UTF-8 bytes before hashing', async () => {
    await expect(capture('😀'.repeat(70_000), 'source')).rejects.toThrow(
      'INPUT_TOO_LARGE',
    );
  });
});
