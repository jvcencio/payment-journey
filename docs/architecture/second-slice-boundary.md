# Slice 2 — fidelity degradation boundary

Status: authorized 2026-10-07; records implementation interpretation of the accepted second-slice request. Historical ADRs are unchanged.

Implement PRESERVED plus COLLAPSED, MISPLACED, TRUNCATED, LOST and UNSOURCED for explicit synthetic evidence. No policies, new payment adapters, roles, correlation, NLP, normalization rules, enrichment, defaults, import/export or backend.

## Evidence boundary

Fixture A continues through the existing MT/pacs adapters. C/D/E/F/J are bundled canonical-engine fixtures with directly supplied debtor/creditor semantic records and source locators. Their evidence artifacts are labeled CANONICAL_TEST, an internal test-evidence discriminator, not a supported payment message family or an upload adapter. Users can select only bundled fixture IDs; arbitrary canonical import is not exposed. A JSON-lines record is a fictional evidence statement, not a claim that MT contains discrete building/street/room fields.

Bundled context declares correspondence and the completeness of the fixture's source, target and origin evidence within the name/address scope. Correspondence records identify role, semantic concept and occurrence; they do not carry expected taxonomy events. The classifier validates the referenced nodes, role/occurrence consistency and value relation. Expected events live in separate test oracles that the application does not import.

A collapse binding identifies ordered components and a single target; the engine must verify an exact space-joined value and distinct source concepts before emitting component edges. An address line is a broader representation; a specific target address component is misplaced for source concepts other than itself. Related component edges share relationshipGroupId and one context evidence reference. Evidence-backed prefix correspondence can establish truncation only for the same role/concept/occurrence, a nonempty exact prefix and a missing suffix containing non-whitespace information. Unexplained similar strings do not prove correspondence or truncation.

Loss/unsourced conclusions require complete opposite-side semantic coverage and complete relevant transformation/origin context, with no unmapped content or warnings in that fixture. Before declaring absence, search supported same-role alternative representations; possible textual recovery or conflicting correspondence stays unresolved. A matching value in another role cannot supply provenance. A changed same-concept occurrence also stays unresolved unless explicit evidence establishes the supported relationship. Arbitrary MT/pacs input retains conservative non-match behavior because its unsupported content cannot establish complete absence.

## Accountability and output

Every material node must occur in an edge or an explicit unresolved record. Unknown is not a taxonomy event and does not masquerade as LOST/UNSOURCED. Grouped edges count distinct target nodes once for coverage. A complete factual accounting is not a favorable policy result: degradation may be fully accounted for.

Each edge includes explanation, evidence references and optional relationshipGroupId. TRUNCATED includes the omitted substring and offsets into the decoded source value (not raw-artifact offsets). LOST has no target node; UNSOURCED has no source node. The UI distinguishes those directions and displays all event labels from the engine. It never computes taxonomy events itself.
