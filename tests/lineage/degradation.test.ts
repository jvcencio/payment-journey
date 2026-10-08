import { describe, expect, it } from 'vitest';
import { canonicalWitness } from '../../src/fixtures/canonical';
import { classify } from '../../src/lineage/classify';
import { witnessRaw } from '../helpers/witness';
import type { Transformation } from '../../src/domain/model';
async function example(id: string) {
  const w = await canonicalWitness(witnessRaw(id));
  const tx: Transformation = {
    transformationId: 'test',
    sourceArtifactIds: [w.source.artifact.artifactId],
    targetArtifactIds: [w.target.artifact.artifactId],
    pairing: 'USER_SUPPLIED',
    context: w.context,
  };
  return {
    w,
    tx,
    run: () => classify(w.source.snapshot, w.target.snapshot, tx),
  };
}
describe('evidence-bound degradation', () => {
  it.each(['C', 'D'])(
    'classifies %s as grouped components with selective placement',
    async (id) => {
      const { w, run } = await example(id),
        g = run(),
        grouped = g.lineageEdges.filter((e) => e.relationshipGroupId);
      expect(grouped).toHaveLength(3);
      expect(new Set(grouped.map((e) => e.relationshipGroupId)).size).toBe(1);
      expect(new Set(grouped.flatMap((e) => e.targetElementIds)).size).toBe(1);
      for (const e of grouped) {
        const n = w.source.snapshot.nodes.find(
          (n) => n.elementId === e.sourceElementIds[0],
        )!;
        expect(e.taxonomyEvents.map((e) => e.type)).toEqual([
          'PRESERVED',
          'COLLAPSED',
          ...(id === 'D' && n.semanticPath !== 'address.streetName'
            ? ['MISPLACED']
            : []),
        ]);
        expect(e.evidenceRefs).toContain(w.context.evidence[0]!.evidenceId);
      }
      expect(g.unresolved).toEqual([]);
      expect(run()).toEqual(g);
    },
  );
  it('never assigns a group-wide misplacement to StreetName', async () => {
    const { w, run } = await example('D');
    const n = w.source.snapshot.nodes.find(
      (n) => n.semanticPath === 'address.streetName',
    )!;
    expect(
      run().lineageEdges.find((e) => e.sourceElementIds.includes(n.elementId))!
        .taxonomyEvents,
    ).not.toContainEqual({ type: 'MISPLACED' });
  });
  it('does not accept a conflicting role or occurrence merely because text matches', async () => {
    const { w, run } = await example('D');
    const t = w.target.snapshot.nodes.find(
      (n) => n.semanticPath === 'address.streetName',
    )!;
    t.role = 'CREDITOR';
    expect(
      run().lineageEdges.some((e) =>
        e.taxonomyEvents.some((t) => t.type === 'COLLAPSED'),
      ),
    ).toBe(false);
    expect(run().unresolved.length).toBeGreaterThan(0);
  });
  it('leaves conflicting group declarations unresolved', async () => {
    const { w, run } = await example('D');
    w.context.bindings.push({
      ...w.context.bindings[0]!,
      bindingId: 'conflict',
    });
    expect(run().lineageEdges.some((e) => e.relationshipGroupId)).toBe(false);
  });
  it('does not turn incidental substring survival into preservation', async () => {
    const { w, run } = await example('D');
    w.context.bindings = [];
    const g = run();
    expect(g.lineageEdges.some((e) => e.relationshipGroupId)).toBe(false);
    expect(g.unresolved.some((u) => u.side === 'SOURCE')).toBe(true);
  });
  it('exposes the exact missing name suffix with value offsets', async () => {
    const { run } = await example('E');
    const e = run().lineageEdges.find((e) =>
      e.taxonomyEvents.some((t) => t.type === 'TRUNCATED'),
    )!;
    expect(e.missingPortion).toEqual({
      text: 'INGS LLC',
      start: 31,
      end: 39,
      coordinate: 'SOURCE_VALUE_UTF16',
    });
    expect(run().unresolved).toEqual([]);
  });
  it('does not label whitespace normalization as truncation', async () => {
    const { w, run } = await example('E');
    const s = w.source.snapshot.nodes.find(
      (n) => n.role === 'DEBTOR' && n.semanticPath === 'name',
    )!;
    const t = w.target.snapshot.nodes.find(
      (n) => n.role === 'DEBTOR' && n.semanticPath === 'name',
    )!;
    s.value = 'FABLE ';
    t.value = 'FABLE';
    expect(
      run().lineageEdges.some((e) =>
        e.taxonomyEvents.some((t) => t.type === 'TRUNCATED'),
      ),
    ).toBe(false);
    expect(run().unresolved).toHaveLength(2);
  });
  it('finds total loss only with complete target evidence', async () => {
    const { w, run } = await example('F');
    const e = run().lineageEdges.find((e) =>
      e.taxonomyEvents.some((t) => t.type === 'LOST'),
    )!;
    expect(e.targetElementIds).toEqual([]);
    expect(e.sourceElementIds).toHaveLength(1);
    expect(e.evidenceRefs).toContain(w.context.evidence[0]!.evidenceId);
    w.context.targetComplete = false;
    expect(
      run().lineageEdges.some((e) =>
        e.taxonomyEvents.some((t) => t.type === 'LOST'),
      ),
    ).toBe(false);
    expect(run().unresolved).toHaveLength(1);
  });
  it('does not report loss when text is recoverable in a supported weaker field', async () => {
    const { w, run } = await example('D');
    w.context.bindings = [];
    expect(
      run().lineageEdges.some((e) =>
        e.taxonomyEvents.some((t) => t.type === 'LOST'),
      ),
    ).toBe(false);
    expect(run().unresolved.length).toBeGreaterThan(0);
  });
});
