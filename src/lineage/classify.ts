import type {
  CanonicalPaymentSnapshot,
  LineageEdge,
  ProvenanceGraph,
  SemanticNode,
  TaxonomyEvent,
  Transformation,
} from '../domain/model';

/** Classification is evidence-bound. No NLP, policy judgments or fixture event labels. */
export function classify(
  source: CanonicalPaymentSnapshot,
  target: CanonicalPaymentSnapshot,
  transformation: Transformation,
): ProvenanceGraph {
  const sources = source.nodes.filter((n) => n.material),
    targets = target.nodes.filter((n) => n.material);
  const graph: ProvenanceGraph = {
    semanticNodes: [...source.nodes, ...target.nodes],
    lineageEdges: [],
    unresolved: [],
  };
  const byId = new Map(graph.semanticNodes.map((n) => [n.elementId, n]));
  const usedSource = new Set<string>(),
    usedTarget = new Set<string>(),
    blocked = new Map<string, string>();
  const context = transformation.context;
  const participant = (snapshot: CanonicalPaymentSnapshot, n: SemanticNode) => {
    const tx = snapshot.transactions.find(
      (t) => t.transactionId === n.transactionId,
    );
    if (snapshot.transactions.length !== 1 || !tx) return undefined;
    const ordinal = tx.participants
      .filter((p) => p.role === n.role)
      .findIndex((p) => p.occurrenceId === n.participantOccurrenceId);
    return ordinal < 0 ? undefined : JSON.stringify([n.role, ordinal]);
  };
  const key = (snapshot: CanonicalPaymentSnapshot, n: SemanticNode) =>
    JSON.stringify([participant(snapshot, n), n.semanticPath, n.occurrence]);
  const sameParticipant = (s: SemanticNode, t: SemanticNode) =>
    participant(source, s) !== undefined &&
    participant(source, s) === participant(target, t);
  const add = (
    ss: SemanticNode[],
    tt: SemanticNode[],
    events: TaxonomyEvent[],
    explanation: string,
    extra: Partial<LineageEdge> = {},
  ) => {
    const edge: LineageEdge = {
      edgeId: `edge:${ss.map((s) => s.elementId).join('|')}:${tt.map((t) => t.elementId).join('|')}`,
      sourceElementIds: ss.map((s) => s.elementId),
      targetElementIds: tt.map((t) => t.elementId),
      transformationId: transformation.transformationId,
      taxonomyEvents: events,
      confidence:
        events.length === 1 && events[0]?.type === 'PRESERVED'
          ? 'EXPLICIT'
          : 'DETERMINISTIC',
      evidenceRefs: [...ss, ...tt].flatMap((n) => n.evidenceRefs),
      explanation,
      ...extra,
    };
    graph.lineageEdges.push(edge);
    ss.forEach((n) => usedSource.add(n.elementId));
    tt.forEach((n) => usedTarget.add(n.elementId));
  };
  const bindingUse = new Map<string, number>();
  for (const b of context?.bindings ?? [])
    for (const id of [...b.sourceElementIds, b.targetElementId])
      bindingUse.set(id, (bindingUse.get(id) ?? 0) + 1);
  const evidenceIds = new Set(context?.evidence.map((e) => e.evidenceId));
  for (const binding of context?.bindings ?? []) {
    const ss = binding.sourceElementIds
      .map((id) => byId.get(id))
      .filter((n): n is SemanticNode => !!n);
    const t = byId.get(binding.targetElementId),
      ids = [...binding.sourceElementIds, binding.targetElementId];
    const valid =
      ss.length === binding.sourceElementIds.length &&
      ss.length > 0 &&
      !!t &&
      sources.includes(ss[0]!) &&
      ss.every((n) => sources.includes(n) && sameParticipant(n, t)) &&
      targets.includes(t) &&
      binding.evidenceRefs.length > 0 &&
      binding.evidenceRefs.every((id) => evidenceIds.has(id)) &&
      ids.every((id) => bindingUse.get(id) === 1) &&
      ss.every(
        (n) =>
          n.semanticPath !== t.semanticPath || n.occurrence === t.occurrence,
      );
    let explained = false;
    if (
      valid &&
      t &&
      binding.kind === 'CONCATENATION' &&
      ss.length >= 2 &&
      new Set(ss.map((n) => n.semanticPath)).size === ss.length &&
      ss.every(
        (n) =>
          n.semanticPath.startsWith('address.') && n.value.trim().length > 0,
      ) &&
      t.semanticPath.startsWith('address.') &&
      ss.map((n) => n.value).join(' ') === t.value
    ) {
      for (const s of ss) {
        const misplaced =
          t.semanticPath !== 'address.addressLines' &&
          t.semanticPath !== s.semanticPath;
        const events: TaxonomyEvent[] = [
          { type: 'PRESERVED' },
          { type: 'COLLAPSED' },
          ...(misplaced ? [{ type: 'MISPLACED' } as const] : []),
        ];
        add(
          [s],
          [t],
          events,
          `Known ${s.semanticPath} survives inside ${t.semanticPath}; ${ss.length} explicit source concepts occupy one target element.${misplaced ? ' The target concept does not represent this source concept.' : ''}`,
          {
            relationshipGroupId: binding.bindingId,
            evidenceRefs: [
              ...s.evidenceRefs,
              ...t.evidenceRefs,
              ...binding.evidenceRefs,
            ],
          },
        );
      }
      explained = true;
    }
    if (valid && t && binding.kind === 'PREFIX' && ss.length === 1) {
      const original = ss[0]!;
      const omitted = original.value.slice(t.value.length);
      const supportedConcept =
        original.semanticPath === 'name' ||
        original.semanticPath === 'address.addressLines';
      if (
        supportedConcept &&
        original.semanticPath === t.semanticPath &&
        original.occurrence === t.occurrence &&
        t.value.trim().length > 0 &&
        original.value.startsWith(t.value) &&
        omitted.trim().length > 0 &&
        !/[\uD800-\uDBFF]$/.test(t.value)
      ) {
        add(
          [original],
          [t],
          [{ type: 'TRUNCATED' }],
          'The declared prefix operation retains only the initial part of this occurrence; the omitted substring is shown explicitly.',
          {
            evidenceRefs: [
              ...original.evidenceRefs,
              ...t.evidenceRefs,
              ...binding.evidenceRefs,
            ],
            missingPortion: {
              text: omitted,
              start: t.value.length,
              end: original.value.length,
              coordinate: 'SOURCE_VALUE_UTF16',
            },
          },
        );
        explained = true;
      }
    }
    if (!explained)
      for (const id of ids)
        blocked.set(
          id,
          'Declared correspondence is conflicting, ambiguous, or outside the verified transformations; no event was forced.',
        );
  }
  for (const s of sources) {
    if (
      usedSource.has(s.elementId) ||
      blocked.has(s.elementId) ||
      participant(source, s) === undefined
    )
      continue;
    const candidates = targets.filter((t) => key(source, s) === key(target, t));
    const peers = sources.filter((n) => key(source, n) === key(source, s));
    const t = candidates[0];
    if (
      peers.length === 1 &&
      candidates.length === 1 &&
      t &&
      !usedTarget.has(t.elementId) &&
      !blocked.has(t.elementId) &&
      sameParticipant(s, t) &&
      s.value === t.value
    )
      add(
        [s],
        [t],
        [{ type: 'PRESERVED' }],
        'Exact value at the corresponding role, semantic concept and occurrence.',
      );
  }
  // Closed-world judgments are limited to declared complete synthetic evidence.
  const verifiedContext =
    !!context &&
    context.evidence.length > 0 &&
    context.evidence.every((e) => {
      const artifact = context.artifacts.find(
        (a) => a.artifactId === e.artifactId,
      );
      return (
        !!artifact &&
        e.rawValue === artifact.rawPayload.slice(e.locator.start, e.locator.end)
      );
    });
  const possibleCounterparts = (n: SemanticNode, others: SemanticNode[]) =>
    others.filter(
      (other) =>
        other.role === n.role &&
        (other.semanticPath === n.semanticPath ||
          (n.value.length > 0 && other.value.includes(n.value)) ||
          (other.value.length > 0 && n.value.includes(other.value)) ||
          // Composite text may encode an unsupported normalization or interpretation.
          (n.semanticPath.startsWith('address.') &&
            other.semanticPath === 'address.addressLines')),
    );
  if (verifiedContext && context?.targetComplete && context.originComplete) {
    for (const s of sources)
      if (
        !usedSource.has(s.elementId) &&
        !blocked.has(s.elementId) &&
        participant(source, s) !== undefined &&
        possibleCounterparts(s, targets).length === 0
      ) {
        add(
          [s],
          [],
          [{ type: 'LOST' }],
          'No supported target representation was found in the complete declared fixture scope. No supported alternative correspondence or transformation explains survival.',
          {
            evidenceRefs: [
              ...s.evidenceRefs,
              ...context.evidence.map((e) => e.evidenceId),
            ],
          },
        );
      }
  }

  if (verifiedContext && context?.sourceComplete && context.originComplete) {
    for (const t of targets)
      if (
        !usedTarget.has(t.elementId) &&
        !blocked.has(t.elementId) &&
        participant(target, t) !== undefined &&
        possibleCounterparts(t, sources).length === 0
      ) {
        add(
          [],
          [t],
          [{ type: 'UNSOURCED' }],
          'No supported provenance was identified in the complete declared source/origin evidence. No source, supported transformation, configuration or normalization explains this target occurrence.',
          {
            evidenceRefs: [
              ...t.evidenceRefs,
              ...context.evidence.map((e) => e.evidenceId),
            ],
          },
        );
      }
  }
  for (const [side, values, used] of [
    ['SOURCE', sources, usedSource],
    ['TARGET', targets, usedTarget],
  ] as const)
    for (const n of values)
      if (!used.has(n.elementId))
        graph.unresolved.push({
          elementId: n.elementId,
          side,
          reason:
            blocked.get(n.elementId) ??
            'No verified relationship established. Similar text, partial coverage or unexplained changes cannot establish fidelity.',
          candidateElementIds: (side === 'SOURCE' ? targets : sources)
            .filter(
              (other) =>
                other.role === n.role &&
                (other.semanticPath === n.semanticPath ||
                  other.value.includes(n.value) ||
                  n.value.includes(other.value)),
            )
            .map((other) => other.elementId),
        });
  return graph;
}
