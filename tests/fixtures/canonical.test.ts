import { witnessRaw } from '../helpers/witness';
import { describe, expect, it } from 'vitest';
import { canonicalWitness } from '../../src/fixtures/canonical';
describe('canonical witness evidence', () => {
  it.each(['C', 'D', 'E', 'F', 'J'])(
    'retains raw %s records and context references',
    async (id) => {
      const raw = witnessRaw(id),
        w = await canonicalWitness(raw);
      expect(w.source.artifact.formatFamily).toBe('CANONICAL_TEST');
      for (const parsed of [w.source, w.target])
        for (const n of parsed.snapshot.nodes)
          expect(
            parsed.artifact.rawPayload.slice(
              n.sourceLocator.start,
              n.sourceLocator.end,
            ),
          ).toBe(n.rawValue);
      expect(w.context.evidence[0]!.rawValue).toBe(raw.context);
      expect(await canonicalWitness(raw)).toEqual(w);
    },
  );
  it('rejects duplicate occurrence identities instead of silently overwriting', async () => {
    const raw = witnessRaw('D');
    raw.source += raw.source.split('\n')[0] + '\n';
    await expect(canonicalWitness(raw)).rejects.toThrow('occurrences');
  });
});
