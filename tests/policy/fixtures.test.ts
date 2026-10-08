import { expect, it } from 'vitest';
import { evaluate } from '../../src/application/evaluate';
import { policyContext } from '../../src/policy/context';
for (const fixtureId of ['P1', 'P2', 'P3', 'P4', 'P5']) {
  it(`${fixtureId} has unchanged fictional source/target evidence`, async () => {
    const result = await evaluate({ fixtureId });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.report.graph.unresolved).toHaveLength(0);
    expect(
      result.report.graph.lineageEdges.every(
        (e) =>
          e.taxonomyEvents.length === 1 &&
          e.taxonomyEvents[0]!.type === 'PRESERVED',
      ),
    ).toBe(true);
    expect(
      policyContext(result.report, true, '2026-10-07').targetCapability
        ?.targetArtifactId,
    ).toBe(result.report.target.artifact.artifactId);
  });
}
