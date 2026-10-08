import { minimum, type AddressFacts, type Decision } from './facts';
export function evaluateHybrid(ruleId: string, f: AddressFacts): Decision {
  if (f.hybrid !== true)
    return {
      outcome: f.hybrid === false ? 'NOT_APPLICABLE' : 'UNKNOWN',
      explanation:
        f.hybrid === false
          ? 'The target has no hybrid mixture; this rule does not apply.'
          : 'Incomplete evidence prevents identification of the target address model.',
    };
  if (ruleId === 'PMPG-HYBRID-001') return minimum(f);
  if (ruleId === 'PMPG-HYBRID-002') {
    const exceeded =
      f.lines.length > 2 || f.lines.some((n) => [...n.value].length > 70);
    return {
      outcome: exceeded
        ? 'DOES_NOT_ALIGN'
        : f.targetComplete
          ? 'ALIGNS'
          : 'UNKNOWN',
      explanation: exceeded
        ? 'Observed hybrid exceeds two lines or 70 Unicode code points per line.'
        : f.targetComplete
          ? 'Hybrid has at most two lines, each within 70 Unicode code points.'
          : 'Observed lines fit, but complete address-line coverage is not established.',
      nodes: f.lines,
    };
  }
  const repeated = f.structured.flatMap((n) =>
    f.lines
      .filter((line) =>
        line.value.split(/[,;]/u).some((segment) => segment.trim() === n.value),
      )
      .map((line) => ({ n, line })),
  );
  if (repeated.length)
    return {
      outcome: 'DOES_NOT_ALIGN',
      explanation:
        'A whole comma/semicolon-delimited address-line segment exactly repeats a structured value for this participant. No fuzzy or substring matching is used.',
      nodes: repeated.flatMap(({ n, line }) => [n, line]),
    };
  return {
    outcome: 'UNKNOWN',
    explanation:
      'No exact delimited repetition established. This narrow test cannot prove absence of semantic duplication.',
    nodes: [...f.structured, ...f.lines],
  };
}

export function evaluateSemanticIntegrity(f: AddressFacts): Decision {
  const misplaced = f.edges.filter(
    (e) =>
      f.validEdge(e) && e.taxonomyEvents.some((t) => t.type === 'MISPLACED'),
  );
  if (misplaced.length)
    return {
      outcome: 'DOES_NOT_ALIGN',
      explanation:
        'Known distinct address attributes were co-mingled into a structured element representing another semantic concept. The original lineage events remain unchanged.',
      edges: misplaced,
      nodes: [],
    };
  return f.sourceComplete &&
    f.targetComplete &&
    !f.unresolved &&
    f.edges.every(f.validEdge)
    ? {
        outcome: 'ALIGNS',
        explanation:
          'No incorrect structured-element placement is evidenced within the complete evaluated lineage scope. This is not an overall address-quality assessment.',
      }
    : {
        outcome: 'UNKNOWN',
        explanation:
          'Incomplete or unresolved lineage cannot establish semantic placement alignment.',
      };
}
