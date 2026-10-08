# Provenance model

Use a graph-oriented model even if stored in ordinary in-memory structures. No graph database is required by this decision.

## Semantic node

A node captures `elementId`, `artifactId`, `transactionId`, `semanticPath`, `value`, `sourceLocator`, and `interpretationConfidence`. Adapter evidence also retains `rawValue`, `normalizedValue`, and `interpretationMethod`. Stable evidence identities must distinguish duplicate occurrences.

## Lineage edge

An edge captures `edgeId`, `sourceElementIds[]`, `targetElementIds[]`, `transformationId`, `taxonomyEvents[]`, `confidence`, and `evidenceRefs[]`. Cardinalities include one-to-one, one-to-many, many-to-one, one-to-none, none-to-one, and many-to-many.

A one-to-none edge can account for confirmed loss. A none-to-one edge can account for an evidenced default/enrichment or explicit UNSOURCED origin. Evidence may come from configuration or an external source, so lack of a payment-source node does not always mean lack of provenance.

## Invariants

- Each material in-scope source node has an accountable fate; each material in-scope target node has an accountable origin.
- Every referenced node, artifact, transformation, and evidence item resolves.
- Evidence identifies where and why a correspondence was asserted, not just that strings resemble each other.
- Derived values include provenance and confidence. Confidence is distinct from severity and never substitutes for evidence.
- Group transformations preserve component-level attribution. Many-to-one collapse must not mislabel every component as misplaced.
- Parse incompleteness and unresolved correspondence remain explicit; neither is silently converted to a definitive loss or policy pass.

## Proposed evidence shape — STATUS: OPEN

Use typed references for artifact locators, interpretation records, transformation declarations, versioned normalization maps, explicit default configuration, and external enrichment sources. For raw substrings, retain offsets or equivalent recoverable spans. JSON shape, confidence scale, stable IDs, and representation of unresolved candidate matches require decisions (O-08).

The engine infers observations from evidence; it cannot recover an undocumented vendor algorithm simply by comparing endpoints. Label explanatory hypotheses accordingly. Preserve source and target evidence so judgments can be reviewed later.

## Accepted first-slice serialization refinement

Confidence: EXPLICIT, DETERMINISTIC, INFERRED, UNKNOWN, as defined in the [implementation gate](../architecture/implementation-gate.md). Edges may share relationshipGroupId while preserving individually inspectable component events. Pairing is explicitly user-established; no automatic transaction correlation. Lineage observations describe facts; policy findings describe separately evaluated judgments.

## Implemented second-slice serialization

The in-memory model uses typed evidence references, stable element IDs, raw artifact hashes and recoverable UTF-16 locators. CANONICAL_TEST identifies bundled test evidence only. Source, target and transformation-context artifacts remain separately inspectable. The earlier open proposal is historical; the implemented subset is defined in `src/domain/model.ts` and the [second-slice boundary](../architecture/second-slice-boundary.md).

Each component has its own edge. The following abbreviated serialization illustrates D; symbolic IDs stand for the generated resolvable IDs, not an export format:

```json
[
  {
    "sourceElementIds": ["source-building"],
    "targetElementIds": ["target-street"],
    "relationshipGroupId": "collapse-binding",
    "taxonomyEvents": [{"type":"PRESERVED"}, {"type":"COLLAPSED"}, {"type":"MISPLACED"}],
    "evidenceRefs": ["building-evidence", "street-target-evidence", "context-evidence"]
  },
  {
    "sourceElementIds": ["source-street"],
    "targetElementIds": ["target-street"],
    "relationshipGroupId": "collapse-binding",
    "taxonomyEvents": [{"type":"PRESERVED"}, {"type":"COLLAPSED"}],
    "evidenceRefs": ["street-source-evidence", "street-target-evidence", "context-evidence"]
  },
  {
    "sourceElementIds": ["source-room"],
    "targetElementIds": ["target-street"],
    "relationshipGroupId": "collapse-binding",
    "taxonomyEvents": [{"type":"PRESERVED"}, {"type":"COLLAPSED"}, {"type":"MISPLACED"}],
    "evidenceRefs": ["room-evidence", "street-target-evidence", "context-evidence"]
  }
]
```

Full edges also include edgeId, transformationId, confidence and explanation. Coverage counts the shared target once. Context bindings assert correspondence, not events; the engine verifies the value relation, identities and evidence spans before classification. Overlapping or inconsistent bindings remain unresolved.

TRUNCATED carries `missingPortion: {"text":"INGS LLC","start":31,"end":39,"coordinate":"SOURCE_VALUE_UTF16"}` for E. These half-open offsets address the decoded source value; artifact locators independently identify the raw evidence. LOST uses an empty targetElementIds array. UNSOURCED uses an empty sourceElementIds array. Both include the relevant node and complete finite context evidence; neither direction implies a policy finding.

Unresolved records retain elementId, reason and candidateElementIds. Unknown confidence or evidence gaps cannot be repaired by inventing a definitive relationship. Export/import and persisted graph serialization remain deferred.
