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
