import type {
  LineageReport,
  ParticipantOccurrence,
  SemanticNode,
  LineageEdge,
} from '../domain/model';
import type { DeepReadonly, PolicyContext, PolicyOutcome } from './model';
export type Node = DeepReadonly<SemanticNode>;
export type Edge = DeepReadonly<LineageEdge>;
export interface Decision {
  outcome: PolicyOutcome;
  explanation: string;
  nodes?: readonly Node[];
  edges?: readonly Edge[];
  capabilityUsed?: boolean;
}
export function addressFacts(
  report: DeepReadonly<LineageReport>,
  party: DeepReadonly<ParticipantOccurrence>,
  context: PolicyContext,
) {
  const evidence = [
    ...report.source.snapshot.evidence,
    ...report.target.snapshot.evidence,
    ...(report.transformation.context?.evidence ?? []),
  ];
  const artifacts = [
    report.source.artifact,
    report.target.artifact,
    ...(report.transformation.context?.artifacts ?? []),
  ];
  const validEvidence = (id: string) => {
    const e = evidence.find((e) => e.evidenceId === id);
    const a = artifacts.find((a) => a.artifactId === e?.artifactId);
    return (
      !!e &&
      !!a &&
      e.locator.start >= 0 &&
      e.locator.end > e.locator.start &&
      a.rawPayload.slice(e.locator.start, e.locator.end) === e.rawValue
    );
  };
  const usable = (n: Node) =>
    ['EXPLICIT', 'DETERMINISTIC'].includes(n.interpretationConfidence) &&
    n.value.trim().length > 0 &&
    n.evidenceRefs.length > 0 &&
    n.evidenceRefs.every(validEvidence);
  const target = report.target.snapshot.nodes.filter(
    (n) =>
      n.participantOccurrenceId === party.occurrenceId &&
      n.semanticPath.startsWith('address.'),
  );
  const sourceParties = report.source.snapshot.transactions
    .flatMap((t) => t.participants)
    .filter((p) => p.role === party.role);
  const targetParties = report.target.snapshot.transactions
    .flatMap((t) => t.participants)
    .filter((p) => p.role === party.role);
  const paired = sourceParties.length === 1 && targetParties.length === 1;
  const source = paired
    ? report.source.snapshot.nodes.filter(
        (n) =>
          n.participantOccurrenceId === sourceParties[0]!.occurrenceId &&
          n.semanticPath.startsWith('address.'),
      )
    : [];
  const lineageContext = report.transformation.context;
  const contextVerified =
    !!lineageContext &&
    lineageContext.evidence.length > 0 &&
    lineageContext.evidence.every((e) => validEvidence(e.evidenceId));
  const targetComplete =
    contextVerified &&
    lineageContext!.targetComplete &&
    report.target.unmapped.length === 0 &&
    report.target.warnings.length === 0 &&
    target.every(usable);
  const sourceComplete =
    paired &&
    contextVerified &&
    lineageContext!.sourceComplete &&
    report.source.unmapped.length === 0 &&
    report.source.warnings.length === 0 &&
    source.every(usable);
  const lines = target.filter(
    (n) => n.semanticPath === 'address.addressLines' && usable(n),
  );
  const structured = target.filter(
    (n) => n.semanticPath !== 'address.addressLines' && usable(n),
  );
  const hybrid: boolean | 'UNKNOWN' =
    lines.length > 0 && structured.length > 0
      ? true
      : targetComplete
        ? false
        : 'UNKNOWN';
  const edges = report.graph.lineageEdges.filter((e) =>
    [...source, ...target].some(
      (n) =>
        e.sourceElementIds.includes(n.elementId) ||
        e.targetElementIds.includes(n.elementId),
    ),
  );
  const unresolved = report.graph.unresolved.some((u) =>
    [...source, ...target].some((n) => n.elementId === u.elementId),
  );
  const validEdge = (e: Edge) =>
    e.evidenceRefs.length > 0 &&
    e.evidenceRefs.every(validEvidence) &&
    [...e.sourceElementIds, ...e.targetElementIds].every((id) => {
      const n = report.graph.semanticNodes.find((n) => n.elementId === id);
      return n && usable(n);
    });
  const capability = context.targetCapability;
  const supports = (concept: string) =>
    !!capability &&
    capability.targetArtifactId === report.target.artifact.artifactId &&
    !!capability.declarationId &&
    !!capability.version &&
    !!capability.statement.trim() &&
    capability.concepts.includes(concept);
  return {
    source,
    target,
    sourceComplete,
    targetComplete,
    structured,
    lines,
    hybrid,
    edges,
    unresolved,
    usable,
    validEdge,
    supports,
    paired,
  };
}
export type AddressFacts = ReturnType<typeof addressFacts>;
export function minimum(f: AddressFacts): Decision {
  const missing = ['address.country', 'address.townName'].filter(
    (c) => !f.structured.some((n) => n.semanticPath === c),
  );
  return missing.length === 0
    ? {
        outcome: 'ALIGNS',
        explanation:
          'Structured country and town are present. This says nothing about other address-quality rules.',
        nodes: f.structured.filter((n) =>
          ['address.country', 'address.townName'].includes(n.semanticPath),
        ),
      }
    : {
        outcome: f.targetComplete ? 'DOES_NOT_ALIGN' : 'UNKNOWN',
        explanation: `${missing.join(', ')} not established.${f.targetComplete ? ' Complete target witness evidence supports absence.' : ' Target evidence is incomplete; absence is not established.'}`,
      };
}
