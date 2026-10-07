import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { evaluate } from '../../src/application/evaluate';
const source = readFileSync(
  'fixtures/raw-pairs/a-clean-preservation/source.mt103',
  'utf8',
);
const target = readFileSync(
  'fixtures/raw-pairs/a-clean-preservation/target.pacs008.xml',
  'utf8',
);
const expected = JSON.parse(
  readFileSync('fixtures/raw-pairs/a-clean-preservation/manifest.json', 'utf8'),
) as {
  expectedPreservationEdges: number;
  expectedMaterialNodesPerArtifact: number;
};
describe('Fixture A end to end without UI', () => {
  it('accounts for every material node, preserves evidence and replays identically', async () => {
    const result = await evaluate({ source, target });
    if (!result.ok) throw new Error('Expected success');
    const { graph, source: s, target: t } = result.report;
    expect(graph.lineageEdges).toHaveLength(expected.expectedPreservationEdges);
    expect(graph.unresolved).toEqual([]);
    expect(s.snapshot.nodes.filter((n) => n.material)).toHaveLength(
      expected.expectedMaterialNodesPerArtifact,
    );
    expect(t.snapshot.nodes.filter((n) => n.material)).toHaveLength(
      expected.expectedMaterialNodesPerArtifact,
    );
    const material = graph.semanticNodes
      .filter((n) => n.material)
      .map((n) => n.elementId)
      .sort();
    expect(
      graph.lineageEdges
        .flatMap((e) => [...e.sourceElementIds, ...e.targetElementIds])
        .sort(),
    ).toEqual(material);
    const evidenceIds = new Set(
      [...s.snapshot.evidence, ...t.snapshot.evidence].map((e) => e.evidenceId),
    );
    for (const e of graph.lineageEdges) {
      expect(e.taxonomyEvents).toEqual([{ type: 'PRESERVED' }]);
      expect(e.evidenceRefs.every((id) => evidenceIds.has(id))).toBe(true);
    }
    expect(s.unmapped.length).toBeGreaterThan(0);
    expect(t.unmapped.length).toBeGreaterThan(0);
    expect(await evaluate({ source, target })).toEqual(result);
  });
  it('keeps repeated identical lines distinct by occurrence and location', async () => {
    const r = await evaluate({
      source: source.replace('TEST SUITE ALPHA', '12 FICTION LANE'),
      target: target.replace('TEST SUITE ALPHA', '12 FICTION LANE'),
    });
    if (!r.ok) throw new Error('Expected success');
    const lines = r.report.source.snapshot.nodes.filter(
      (n) => n.value === '12 FICTION LANE',
    );
    expect(lines).toHaveLength(2);
    expect(lines[0]!.elementId).not.toBe(lines[1]!.elementId);
    expect(lines[0]!.sourceLocator.start).not.toBe(
      lines[1]!.sourceLocator.start,
    );
    expect(r.report.graph.unresolved).toEqual([]);
  });
  it('reports both sides of unexplained differences without inventing loss', async () => {
    const r = await evaluate({
      source,
      target: target.replace('EXAMPLE TOWN', 'OTHER TOWN'),
    });
    if (!r.ok) throw new Error('Expected success');
    expect(r.report.graph.lineageEdges).toHaveLength(9);
    expect(r.report.graph.unresolved.map((u) => u.side)).toEqual([
      'SOURCE',
      'TARGET',
    ]);
    expect(
      r.report.graph.lineageEdges.every((e) =>
        e.taxonomyEvents.every((t) => t.type === 'PRESERVED'),
      ),
    ).toBe(true);
  });
  it('does not cross-match participant roles or silently normalize whitespace', async () => {
    const r = await evaluate({
      source,
      target: target
        .replace('FABLE PARTS TEST', 'IMAGINARY SUPPLY TEST')
        .replace('12 FICTION LANE', ' 12 FICTION LANE '),
    });
    if (!r.ok) throw new Error('Expected success');
    expect(r.report.graph.unresolved).toHaveLength(4);
  });
  it('validates the untrusted boundary and rejects extra configuration', async () => {
    expect((await evaluate({ source, target, sendToServer: true })).ok).toBe(
      false,
    );
    expect((await evaluate({ source: 1, target })).ok).toBe(false);
    const r = await evaluate({
      source,
      target: target.replaceAll('pacs.008.001.14', 'pacs.008.001.13'),
    });
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.diagnostics[0]!.code).toBe('UNSUPPORTED_MESSAGE_VERSION');
  });
});
