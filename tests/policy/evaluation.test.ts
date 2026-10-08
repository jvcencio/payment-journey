import { describe, expect, it } from 'vitest';
import expected from '../../fixtures/policy/expected.json';
import { evaluate } from '../../src/application/evaluate';
import { evaluatePolicy, authorityActive } from '../../src/policy/evaluate';
import { policyContext } from '../../src/policy/context';
import { publicAddressQuality } from '../../src/policy/public-address-quality';
import type { LineageReport } from '../../src/domain/model';
const packs = [{ packId: 'public-address-quality', version: '0.1.0' }];
async function report(id: string) {
  const r = await evaluate({ fixtureId: id });
  if (!r.ok) throw new Error('fixture failed');
  return r.report;
}
function freeze(value: object) {
  for (const child of Object.values(value))
    if (child && typeof child === 'object') freeze(child);
  Object.freeze(value);
}
describe('independent policy evaluation', () => {
  for (const [id, oracle] of Object.entries(expected))
    it(`${id} matches independent debtor policy oracle`, async () => {
      const r = await report(id);
      const evaluation = evaluatePolicy(
        r,
        packs,
        policyContext(r, true, '2026-10-07'),
      );
      expect(
        Object.fromEntries(
          evaluation.findings
            .filter((f) => f.role === 'DEBTOR')
            .map((f) => [f.ruleId, f.outcome]),
        ),
      ).toEqual(oracle);
    });
  it('does not mutate snapshots, nodes, edges or events when selecting/removing/repeating policy', async () => {
    const r = await report('D'),
      before = structuredClone(r);
    freeze(r);
    const c = policyContext(r, true, '2026-10-07');
    expect(evaluatePolicy(r, [], c).findings).toEqual([]);
    const withPolicy = evaluatePolicy(r, packs, c);
    expect(withPolicy).toEqual(evaluatePolicy(r, packs, c));
    expect(evaluatePolicy(r, [], c).findings).toEqual([]);
    expect(r).toEqual(before);
    expect(
      withPolicy.findings.some((f) => f.outcome === 'DOES_NOT_ALIGN'),
    ).toBe(true);
  });
  it('findings resolve both rule authority and original lineage evidence', async () => {
    const r = await report('D'),
      result = evaluatePolicy(r, packs, policyContext(r, true, '2026-10-07'));
    const evidence = [
      ...r.source.snapshot.evidence,
      ...r.target.snapshot.evidence,
      ...r.transformation.context!.evidence,
    ];
    for (const f of result.findings) {
      expect(
        result.packs
          .find((p) => p.packId === f.packId && p.version === f.packVersion)
          ?.rules.find((rule) => rule.ruleId === f.ruleId)?.authority.sourceUrl,
      ).toMatch(/^https:/);
      for (const id of f.affectedElementIds)
        expect(r.graph.semanticNodes.some((n) => n.elementId === id)).toBe(
          true,
        );
      for (const id of f.affectedEdgeIds)
        expect(r.graph.lineageEdges.some((e) => e.edgeId === id)).toBe(true);
      for (const id of f.evidenceRefs)
        expect(evidence.some((e) => e.evidenceId === id)).toBe(true);
    }
    const d = result.findings.find(
      (f) => f.role === 'DEBTOR' && f.ruleId === 'PMPG-ADDR-001',
    )!;
    expect(d.affectedEdgeIds).toHaveLength(2);
    expect(
      d.affectedEdgeIds.every((id) =>
        r.graph.lineageEdges
          .find((e) => e.edgeId === id)!
          .taxonomyEvents.some((t) => t.type === 'MISPLACED'),
      ),
    ).toBe(true);
  });
  it('retains uncertainty for missing context/evidence and mismatched capability artifact', async () => {
    const r = await report('D'),
      c = policyContext(r, true, '2026-10-07');
    c.targetCapability!.targetArtifactId = 'unrelated';
    expect(
      evaluatePolicy(r, packs, c).findings.find(
        (f) => f.role === 'DEBTOR' && f.ruleId === 'CPMI-ADDR-002',
      )!.outcome,
    ).toBe('UNKNOWN');
    const modified: LineageReport = structuredClone(r);
    modified.transformation.context!.evidence = [];
    expect(
      evaluatePolicy(modified, packs, c).findings.find(
        (f) => f.role === 'DEBTOR' && f.ruleId === 'PMPG-ADDR-001',
      )!.outcome,
    ).toBe('UNKNOWN');
  });
  it('respects source status, supersession, publication and effective date', () => {
    const rule = structuredClone(publicAddressQuality.rules[0]!);
    for (const sourceStatus of [
      'SUPERSEDED',
      'PENDING',
      'WITHDRAWN',
      'UNKNOWN',
    ] as const)
      expect(
        authorityActive(
          { ...rule, authority: { ...rule.authority, sourceStatus } },
          '2026-10-07',
        ),
      ).toBe(false);
    expect(
      authorityActive(
        {
          ...rule,
          authority: { ...rule.authority, supersededBy: ['new edition'] },
        },
        '2026-10-07',
      ),
    ).toBe(false);
    expect(authorityActive(rule, '2025-01-01')).toBe(false);
    expect(
      authorityActive(
        {
          ...rule,
          authority: { ...rule.authority, effectiveDate: '2027-01-01' },
        },
        '2026-10-07',
      ),
    ).toBe(false);
  });
  it('rejects unknown versions, duplicate packs and invalid dates', async () => {
    const r = await report('D'),
      c = policyContext(r, true, '2026-10-07');
    expect(() =>
      evaluatePolicy(
        r,
        [{ packId: 'public-address-quality', version: '0.2.0' }],
        c,
      ),
    ).toThrow();
    expect(() => evaluatePolicy(r, [...packs, ...packs], c)).toThrow();
    expect(() =>
      evaluatePolicy(r, packs, { ...c, evaluationDate: 'yesterday' }),
    ).toThrow();
    expect(
      evaluatePolicy(r, packs, {
        ...c,
        evaluationDate: '2025-01-01',
      }).findings.every((f) => f.outcome === 'UNKNOWN'),
    ).toBe(true);
  });
});
