# Product principles

1. **Validation is not integrity.** A syntactically valid artifact can contain semantic degradation.
2. **Explain, don't merely score.** Every finding must be inspectable with values, locations, and evidence.
3. **Preserve provenance.** Every material target value requires an accountable origin; absent evidence stays visible.
4. **Never silently repair.** Normalization, inference, defaults, and enrichment must be explicit.
5. **Synthetic by default.** This project requires synthetic examples throughout; no real payment or employer data.
6. **Canonical does not mean authoritative.** The model enables comparison; it does not replace standards.
7. **Policy and fact remain separate.** Lineage says what happened. Selected rules say whether it is acceptable.
8. **Unknown must remain visible.** Unmapped or unsupported content cannot simply disappear.

> Nothing disappears. Nothing appears without explanation.

For source data, account for its fate. For target data, account for its origin. Coverage claims must state the supported domain and make exclusions visible.

> Never discard semantic information that the source already knows.

Characters surviving is insufficient when building number, street, and room become one street-name value. Record preservation, collapse, and misplacement together where supported. Do not claim that an unstructured source knew discrete concepts that were only inferred later.
