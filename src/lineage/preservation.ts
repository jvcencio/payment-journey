import type {
  CanonicalPaymentSnapshot,
  ProvenanceGraph,
  SemanticNode,
  Transformation,
} from '../domain/model';
/** First-slice rule: direct role/concept/ordered occurrence equality only. */
export function preservation(
  source: CanonicalPaymentSnapshot,
  target: CanonicalPaymentSnapshot,
  transformation: Transformation,
): ProvenanceGraph {
  const graph: ProvenanceGraph = {
    semanticNodes: [...source.nodes, ...target.nodes],
    lineageEdges: [],
    unresolved: [],
  };
  const key = (n: SemanticNode) =>
    JSON.stringify([n.role, n.semanticPath, n.occurrence]);
  const targetByKey = new Map(
    target.nodes.filter((n) => n.material).map((n) => [key(n), n]),
  );
  const used = new Set<string>();
  for (const s of source.nodes.filter((n) => n.material)) {
    const t = targetByKey.get(key(s));
    if (t && s.value === t.value) {
      graph.lineageEdges.push({
        edgeId: `edge:${s.elementId}:${t.elementId}`,
        sourceElementIds: [s.elementId],
        targetElementIds: [t.elementId],
        transformationId: transformation.transformationId,
        taxonomyEvents: [{ type: 'PRESERVED' }],
        confidence: 'EXPLICIT',
        evidenceRefs: [...s.evidenceRefs, ...t.evidenceRefs],
      });
      used.add(t.elementId);
    } else {
      graph.unresolved.push({
        elementId: s.elementId,
        side: 'SOURCE',
        reason:
          'No exact role/concept/occurrence preservation established. This slice does not infer loss or alteration from a non-match.',
        candidateElementIds: t ? [t.elementId] : [],
      });
    }
  }
  for (const t of target.nodes.filter(
    (n) => n.material && !used.has(n.elementId),
  )) {
    graph.unresolved.push({
      elementId: t.elementId,
      side: 'TARGET',
      reason:
        'Origin not established by exact preservation. Other transformations and unsupported source content require review.',
      candidateElementIds: source.nodes
        .filter((s) => s.material && key(s) === key(t))
        .map((s) => s.elementId),
    });
  }
  return graph;
}
