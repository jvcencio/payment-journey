import { expect, it } from 'vitest';
import { evaluate } from '../../src/application/evaluate';
import { policyContext } from '../../src/policy/context';
import { evaluatePolicy } from '../../src/policy/evaluate';
const packs = [{ packId: 'public-address-quality', version: '0.1.0' }];
async function setup(id: string) {
  const r = await evaluate({ fixtureId: id });
  if (!r.ok) throw new Error('fixture failed');
  return r.report;
}
it('D minimum aligns while structure only partially aligns with declared capability', async () => {
  const r = await setup('D');
  const findings = evaluatePolicy(
    r,
    packs,
    policyContext(r, true, '2026-10-07'),
  ).findings.filter((f) => f.role === 'DEBTOR');
  expect(findings.find((f) => f.ruleId === 'CPMI-ADDR-001')!.outcome).toBe(
    'ALIGNS',
  );
  expect(findings.find((f) => f.ruleId === 'CPMI-ADDR-002')!.outcome).toBe(
    'PARTIALLY_ALIGNS',
  );
});
it('never infers capability from known canonical concepts', async () => {
  const r = await setup('D');
  const c = policyContext(r, true, '2026-10-07');
  delete c.targetCapability;
  expect(
    evaluatePolicy(r, packs, c).findings.find(
      (f) => f.ruleId === 'CPMI-ADDR-002' && f.role === 'DEBTOR',
    )!.outcome,
  ).toBe('UNKNOWN');
});
it('missing structured minimum requires complete evidence', async () => {
  const r = await setup('P3');
  const c = policyContext(r, true, '2026-10-07');
  expect(evaluatePolicy(r, packs, c).findings[0]!.outcome).toBe(
    'DOES_NOT_ALIGN',
  );
  r.transformation.context!.targetComplete = false;
  expect(evaluatePolicy(r, packs, c).findings[0]!.outcome).toBe('UNKNOWN');
});
it('requires explicit cross-border applicability', async () => {
  const r = await setup('P1');
  for (const [scope, outcome] of [
    [false, 'NOT_APPLICABLE'],
    ['UNKNOWN', 'UNKNOWN'],
  ] as const)
    expect(
      evaluatePolicy(r, packs, policyContext(r, scope, '2026-10-07'))
        .findings[0]!.outcome,
    ).toBe(outcome);
});
