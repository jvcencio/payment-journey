import { expect, it } from 'vitest';
import { canonicalWitness } from '../../src/fixtures/canonical';
import { classify } from '../../src/lineage/classify';
import { witnessRaw } from '../helpers/witness';
import { evaluatePolicy } from '../../src/policy/evaluate';
import type { LineageReport } from '../../src/domain/model';
export async function modifiedPolicyReport(
  id: string,
  mutate: (
    records: {
      role: string;
      concept: string;
      occurrence: number;
      value: string;
    }[],
  ) => void = () => {},
) {
  const raw = witnessRaw(id);
  const records = raw.target
    .trim()
    .split('\n')
    .map((l) => JSON.parse(l));
  mutate(records);
  raw.target = records.map((r) => JSON.stringify(r)).join('\n') + '\n';
  const w = await canonicalWitness(raw);
  const transformation = {
    transformationId: 'policy-test',
    sourceArtifactIds: [w.source.artifact.artifactId],
    targetArtifactIds: [w.target.artifact.artifactId],
    pairing: 'USER_SUPPLIED' as const,
    context: w.context,
  };
  return {
    source: w.source,
    target: w.target,
    transformation,
    graph: classify(w.source.snapshot, w.target.snapshot, transformation),
  } satisfies LineageReport;
}
function outcomes(r: LineageReport) {
  return evaluatePolicy(
    r,
    [{ packId: 'public-address-quality', version: '0.1.0' }],
    { crossBorder: true, evaluationDate: '2026-10-07' },
  ).findings;
}
it('applies to a hybrid missing town, not fully structured or unstructured', async () => {
  expect(
    outcomes(await modifiedPolicyReport('P3')).find(
      (f) => f.ruleId === 'PMPG-HYBRID-001',
    )!.outcome,
  ).toBe('DOES_NOT_ALIGN');
  for (const r of [
    await modifiedPolicyReport('P1'),
    await modifiedPolicyReport('P2', (records) => {
      for (let i = records.length - 1; i >= 0; i--)
        if (
          ['address.country', 'address.townName'].includes(records[i]!.concept)
        )
          records.splice(i, 1);
    }),
  ])
    expect(
      outcomes(r)
        .filter((f) => f.ruleId.startsWith('PMPG-HYBRID'))
        .every((f) => f.outcome === 'NOT_APPLICABLE'),
    ).toBe(true);
});
it('checks 70/71 code points, including supplementary Unicode', async () => {
  for (const [value, result] of [
    ['X'.repeat(70), 'ALIGNS'],
    ['X'.repeat(71), 'DOES_NOT_ALIGN'],
    ['😀'.repeat(70), 'ALIGNS'],
  ] as const) {
    const r = await modifiedPolicyReport('P2', (rs) => {
      rs.find((r) => r.concept === 'address.addressLines')!.value = value;
    });
    expect(
      outcomes(r).find((f) => f.ruleId === 'PMPG-HYBRID-002')!.outcome,
    ).toBe(result);
  }
});
it('limits occurrences and detects only same-participant whole-segment repetition', async () => {
  expect(
    outcomes(await modifiedPolicyReport('P4')).find(
      (f) => f.ruleId === 'PMPG-HYBRID-002',
    )!.outcome,
  ).toBe('DOES_NOT_ALIGN');
  for (const [line, result] of [
    ['1200 BRICKELL AVE, MIAMI', 'DOES_NOT_ALIGN'],
    ['MIAMI', 'DOES_NOT_ALIGN'],
    ['1200 MIAMI ROAD', 'UNKNOWN'],
    ['1200 BRICKELL AVE, MIAMI BEACH', 'UNKNOWN'],
  ] as const) {
    const r = await modifiedPolicyReport('P2', (rs) => {
      rs.find((r) => r.concept === 'address.addressLines')!.value = line;
    });
    expect(
      outcomes(r).find((f) => f.ruleId === 'PMPG-HYBRID-003')!.outcome,
    ).toBe(result);
  }
});
it('does not force alignment with incomplete line coverage or unknown interpretation', async () => {
  const r = await modifiedPolicyReport('P2');
  r.transformation.context!.targetComplete = false;
  expect(outcomes(r).find((f) => f.ruleId === 'PMPG-HYBRID-002')!.outcome).toBe(
    'UNKNOWN',
  );
  r.target.snapshot.nodes.find(
    (n) => n.semanticPath === 'address.addressLines',
  )!.interpretationConfidence = 'UNKNOWN';
  expect(outcomes(r).find((f) => f.ruleId === 'PMPG-HYBRID-001')!.outcome).toBe(
    'UNKNOWN',
  );
});
