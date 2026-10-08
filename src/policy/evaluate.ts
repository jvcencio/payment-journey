import { z } from 'zod';
import type { LineageReport } from '../domain/model';
import type {
  DeepReadonly,
  PolicyContext,
  PolicyEvaluation,
  Rule,
} from './model';
import { addressFacts, type Decision } from './facts';
import { evaluateCpmi } from './cpmi';
import { evaluateHybrid } from './pmpg';
import { resolvePack } from './public-address-quality';
export function authorityActive(rule: DeepReadonly<Rule>, date: string) {
  return (
    rule.authority.sourceStatus === 'CURRENT' &&
    rule.authority.supersededBy.length === 0 &&
    date >= rule.authority.publicationDate &&
    (!rule.authority.effectiveDate || date >= rule.authority.effectiveDate)
  );
}
/** Pure post-lineage evaluation. No parser, classifier, network, or mutation. */
export function evaluatePolicy(
  report: DeepReadonly<LineageReport>,
  selections: readonly { packId: string; version: string }[],
  context: PolicyContext,
): PolicyEvaluation {
  z.iso.date().parse(context.evaluationDate);
  const packs = selections.map((s) => resolvePack(s.packId, s.version));
  if (new Set(packs.map((p) => p.packId)).size !== packs.length)
    throw new Error('Select each pack once.');
  const findings: PolicyEvaluation['findings'] = [];
  for (const pack of packs)
    for (const party of report.target.snapshot.transactions.flatMap(
      (t) => t.participants,
    )) {
      const f = addressFacts(report, party, context);
      for (const rule of pack.rules) {
        let d: Decision = {
          outcome: 'UNKNOWN',
          explanation: 'Rule implementation pending.',
        };
        if (!authorityActive(rule, context.evaluationDate))
          d = {
            outcome: 'UNKNOWN',
            explanation:
              'Source status or evaluation date does not support execution of this edition.',
          };
        else if (rule.ruleId.startsWith('CPMI-'))
          d = evaluateCpmi(rule.ruleId, f, context);
        else if (rule.ruleId.startsWith('PMPG-HYBRID-'))
          d = evaluateHybrid(rule.ruleId, f);
        const nodes = d.nodes ?? f.target;
        const edges =
          d.edges ??
          f.edges.filter((e) =>
            nodes.some(
              (n) =>
                e.sourceElementIds.includes(n.elementId) ||
                e.targetElementIds.includes(n.elementId),
            ),
          );
        findings.push({
          findingId: `${pack.packId}@${pack.version}:${party.occurrenceId}:${rule.ruleId}`,
          packId: pack.packId,
          packVersion: pack.version,
          ruleId: rule.ruleId,
          participantOccurrenceId: party.occurrenceId,
          role: party.role,
          outcome: d.outcome,
          explanation: d.explanation,
          affectedElementIds: [
            ...new Set([
              ...nodes.map((n) => n.elementId),
              ...edges.flatMap((e) => [
                ...e.sourceElementIds,
                ...e.targetElementIds,
              ]),
            ]),
          ],
          affectedEdgeIds: edges.map((e) => e.edgeId),
          evidenceRefs: [
            ...new Set([
              ...nodes.flatMap((n) => n.evidenceRefs),
              ...edges.flatMap((e) => e.evidenceRefs),
              ...(report.transformation.context?.evidence.map(
                (e) => e.evidenceId,
              ) ?? []),
            ]),
          ],
          contextEvidenceIds:
            d.capabilityUsed && context.targetCapability
              ? [
                  `${context.targetCapability.declarationId}@${context.targetCapability.version}`,
                ]
              : [],
        });
      }
    }
  return {
    engineVersion: '0.1.0',
    context: structuredClone(context),
    packs: packs.map(
      (p) => structuredClone(p) as PolicyEvaluation['packs'][number],
    ),
    findings,
  };
}
