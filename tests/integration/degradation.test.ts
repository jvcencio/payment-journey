import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { evaluate } from '../../src/application/evaluate';
interface Expectation {
  side: 'SOURCE' | 'TARGET';
  role: string;
  concept: string;
  occurrence: number;
  events: string[];
}
describe('bundled degradation demos through application boundary', () => {
  it.each(['C', 'D', 'E', 'F', 'J'])(
    'matches independent oracle %s and accounts for every node',
    async (fixtureId) => {
      const oracle = JSON.parse(
        readFileSync(`fixtures/canonical/${fixtureId}/expected.json`, 'utf8'),
      ) as {
        expectedObservations: Expectation[];
        expectedUnresolved: number;
        groupedComponents: number;
      };
      const result = await evaluate({ fixtureId });
      if (!result.ok) throw new Error('Expected success');
      const { source, target, graph, transformation } = result.report;
      for (const expected of oracle.expectedObservations) {
        const node = (
          expected.side === 'SOURCE' ? source : target
        ).snapshot.nodes.find(
          (n) =>
            n.role === expected.role &&
            n.semanticPath === expected.concept &&
            n.occurrence === expected.occurrence,
        )!;
        const edges = graph.lineageEdges.filter((e) =>
          (expected.side === 'SOURCE'
            ? e.sourceElementIds
            : e.targetElementIds
          ).includes(node.elementId),
        );
        expect(edges).toHaveLength(1);
        expect(edges[0]!.taxonomyEvents.map((t) => t.type)).toEqual(
          expected.events,
        );
      }
      expect(graph.unresolved).toHaveLength(oracle.expectedUnresolved);
      expect(
        graph.lineageEdges.filter((e) => e.relationshipGroupId),
      ).toHaveLength(oracle.groupedComponents);
      const allEvidence = [
        ...source.snapshot.evidence,
        ...target.snapshot.evidence,
        ...transformation.context!.evidence,
      ];
      const allArtifacts = [
        source.artifact,
        target.artifact,
        ...transformation.context!.artifacts,
      ];
      for (const e of graph.lineageEdges)
        for (const id of e.evidenceRefs) {
          const evidence = allEvidence.find((e) => e.evidenceId === id)!;
          expect(evidence).toBeDefined();
          const artifact = allArtifacts.find(
            (a) => a.artifactId === evidence.artifactId,
          )!;
          expect(
            artifact.rawPayload.slice(
              evidence.locator.start,
              evidence.locator.end,
            ),
          ).toBe(evidence.rawValue);
        }
      const accounted = new Set(
        graph.lineageEdges.flatMap((e) => [
          ...e.sourceElementIds,
          ...e.targetElementIds,
        ]),
      );
      for (const n of graph.semanticNodes.filter((n) => n.material))
        expect(accounted.has(n.elementId)).toBe(true);
      expect(await evaluate({ fixtureId })).toEqual(result);
    },
  );
  it('does not expose arbitrary canonical import or accept extra provenance claims', async () => {
    expect(
      (await evaluate({ fixtureId: 'D', sourceCoverage: 'COMPLETE' })).ok,
    ).toBe(false);
    expect((await evaluate({ fixtureId: 'Z' })).ok).toBe(false);
  });
});
