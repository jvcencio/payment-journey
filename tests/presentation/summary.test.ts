import { expect, it } from 'vitest';
import { evaluate } from '../../src/application/evaluate';
import { resultSummary } from '../../src/ui/presentation';
it('derives the answer from actual events, not scenario identity', async () => {
  const r = await evaluate({ fixtureId: 'D' });
  if (!r.ok) throw Error('fixture failed');
  const observed = resultSummary(r.report);
  expect(observed.title).toContain('meaning was degraded');
  expect(observed.changes.join(' ')).toContain('suite / room');
  expect(observed.changes.join(' ')).not.toContain('address.');
  // Keep the D identity but change facts: a canned fixture summary would be wrong.
  for (const e of r.report.graph.lineageEdges)
    e.taxonomyEvents = [{ type: 'PRESERVED' }];
  expect(resultSummary(r.report).title).toBe(
    'The evaluated information retained its meaning.',
  );
  expect(resultSummary(r.report).changes).toEqual([]);
});
it('does not imply preservation when observations are absent or unresolved', async () => {
  const r = await evaluate({ fixtureId: 'P1' });
  if (!r.ok) throw Error('fixture failed');
  r.report.graph.lineageEdges = [];
  expect(resultSummary(r.report).title).toContain(
    'not enough interpreted information',
  );
  r.report.graph.unresolved = [
    {
      elementId: r.report.graph.semanticNodes[0]!.elementId,
      side: 'SOURCE',
      reason: 'Uncertain',
      candidateElementIds: [],
    },
  ];
  expect(resultSummary(r.report).title).toContain('could not be established');
});
