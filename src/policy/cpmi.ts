import type { PolicyContext } from './model';
import { minimum, type AddressFacts, type Decision } from './facts';
export function evaluateCpmi(
  ruleId: string,
  f: AddressFacts,
  context: PolicyContext,
): Decision {
  if (context.crossBorder !== true)
    return {
      outcome: context.crossBorder === false ? 'NOT_APPLICABLE' : 'UNKNOWN',
      explanation:
        'CPMI cross-border applicability was not established by the selected context.',
    };
  if (ruleId === 'CPMI-ADDR-001') return minimum(f);
  if (!f.paired)
    return {
      outcome: 'UNKNOWN',
      explanation:
        'A unique source/target participant correspondence is not established.',
    };
  const additional = f.source.filter(
    (n) =>
      !['address.country', 'address.townName', 'address.addressLines'].includes(
        n.semanticPath,
      ) && f.usable(n),
  );
  if (!additional.length)
    return {
      outcome: f.sourceComplete ? 'NOT_APPLICABLE' : 'UNKNOWN',
      explanation:
        'No known additional structured source component is established in evaluated scope.',
    };
  const degraded = additional.filter(
    (n) =>
      !f.edges.some(
        (e) =>
          f.validEdge(e) &&
          e.sourceElementIds.includes(n.elementId) &&
          e.taxonomyEvents.some((t) => t.type === 'PRESERVED') &&
          !e.taxonomyEvents.some((t) =>
            ['COLLAPSED', 'MISPLACED', 'TRUNCATED', 'LOST'].includes(t.type),
          ) &&
          e.targetElementIds.some((id) =>
            f.target.some(
              (t) => t.elementId === id && t.semanticPath === n.semanticPath,
            ),
          ),
      ),
  );
  if (!degraded.length && f.sourceComplete)
    return {
      outcome: 'ALIGNS',
      explanation:
        'Known additional source components retain their separate corresponding structure.',
      nodes: additional,
    };
  const feasible = degraded.filter(
    (n) =>
      f.supports(n.semanticPath) &&
      f.edges.some(
        (e) =>
          f.validEdge(e) &&
          e.sourceElementIds.includes(n.elementId) &&
          e.taxonomyEvents.some((t) =>
            ['COLLAPSED', 'MISPLACED', 'TRUNCATED', 'LOST'].includes(t.type),
          ),
      ),
  );
  if (feasible.length)
    return {
      outcome: 'PARTIALLY_ALIGNS',
      explanation:
        'Known structure degraded despite explicit capability for the affected concepts. Review mapping; this is a recommendation, not a regulatory failure. Other concepts may remain uncertain.',
      nodes: feasible,
      capabilityUsed: true,
    };
  return {
    outcome: 'UNKNOWN',
    explanation:
      'Structure retention or target feasibility is unproven. Canonical vocabulary is not target-capability evidence.',
    nodes: additional,
  };
}
