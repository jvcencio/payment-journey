# Decision log

Recorded date for all bootstrap entries: 2026-10-07. Accepted entries record the supplied handoff, not a newly conducted review. Recommendations remain OPEN.

## D-001 — Composable taxonomy

- Date: 2026-10-07
- Decision: Composable taxonomy
- Status: ACCEPTED IN HANDOFF
- Context: A transformation can preserve characters and degrade meaning/structure simultaneously.
- Rationale: Keep independent observations together.
- Alternatives considered / rejection: One status; rejected because it suppresses composition.
- Implications: Arrays of events with component attribution.
- Related artifact: [record](../architecture/adr/0001-composable-taxonomy.md)

## D-002 — Bidirectional accountability

- Date: 2026-10-07
- Decision: Bidirectional accountability
- Status: ACCEPTED IN HANDOFF
- Context: Disappearance and unexplained appearance both matter.
- Rationale: Account for source fate and target origin.
- Alternatives considered / rejection: Forward-only matching; misses added target values.
- Implications: Source and target coverage tests.
- Related artifact: [record](../architecture/adr/0002-bidirectional-lineage.md)

## D-003 — Canonical semantic model

- Date: 2026-10-07
- Decision: Canonical semantic model
- Status: ACCEPTED IN HANDOFF
- Context: Multiple artifact families need a shared comparison basis.
- Rationale: Avoid pairwise comparison proliferation.
- Alternatives considered / rejection: Pairwise format logic; grows with format combinations.
- Implications: Versioned interpretation with original evidence retained.
- Related artifact: [record](../architecture/adr/0003-canonical-model.md)

## D-004 — Provenance graph

- Date: 2026-10-07
- Decision: Provenance graph
- Status: ACCEPTED IN HANDOFF
- Context: Mappings have multiple source/target cardinalities.
- Rationale: Graph relationships express the required lineage.
- Alternatives considered / rejection: Single sourceField; cannot express grouped transformations.
- Implications: Node/edge references and graph invariants; no database mandated.
- Related artifact: [record](../architecture/adr/0004-provenance-graph.md)

## D-005 — Identity separate from role

- Date: 2026-10-07
- Decision: Identity separate from role
- Status: ACCEPTED IN HANDOFF
- Context: Roles must expand without redesign.
- Rationale: Represent identity and role independently.
- Alternatives considered / rejection: Fixed role objects; comparison documented, prior alternatives review not supplied.
- Implications: Extensible roles, two-role MVP UI.
- Related artifact: [record](../architecture/adr/0005-participant-role-model.md)

## D-006 — Adapters interpret; policy judges

- Date: 2026-10-07
- Decision: Adapters interpret; policy judges
- Status: ACCEPTED IN HANDOFF
- Context: Acceptability depends on selected regime.
- Rationale: Keep factual interpretation stable across policies.
- Alternatives considered / rejection: Embedded policy; would conflate facts and judgment.
- Implications: No adapter severity or compliance output.
- Related artifact: [record](../architecture/adr/0006-adapter-responsibility.md)

## D-007 — Address MVP and synthetic-only scope

- Date: 2026-10-07
- Decision: Address MVP and synthetic-only scope
- Status: ACCEPTED IN HANDOFF
- Context: Prove the thesis without broad payment operations.
- Rationale: Focus on debtor/creditor and postal fidelity.
- Alternatives considered / rejection: Broader feature set expressly excluded by handoff.
- Implications: No additional adapters/roles merely because model permits them.
- Related artifact: [record](../product/mvp-definition.md)

## D-008 — Documentation before implementation

- Date: 2026-10-07
- Decision: Documentation before implementation
- Status: ACCEPTED IN HANDOFF
- Context: Product and architecture decisions need a public reviewable foundation.
- Rationale: Create and commit documents before substantive application work.
- Alternatives considered / rejection: Application-first approach expressly excluded.
- Implications: Bootstrap ends with documentation, proposal, and plan.
- Related artifact: [record](../architecture/implementation-plan.md)

## D-009 — TypeScript/browser stack proposal

- Date: 2026-10-07
- Decision: TypeScript/browser stack proposal
- Status: OPEN
- Context: One runtime might serve engine and evidence UI.
- Rationale: Recommend only after safe parser/evidence spike.
- Alternatives considered / rejection: Java core plus UI and Python core remain candidates; not rejected.
- Implications: No dependency, runtime, deployment, or storage adoption yet.
- Related artifact: [record](../architecture/technical-stack-proposal.md)

## D-010 — Project license selection

- Date: 2026-10-07
- Decision: Project license selection
- Status: OPEN
- Context: Handoff requests an open-source project but supplies no license.
- Rationale: Avoid silently choosing redistribution terms.
- Alternatives considered / rejection: No alternatives evaluated; owner decision required.
- Implications: LICENSE is an explicit pending notice, not a grant.
- Related artifact: [record](open-questions.md)

## Updating the log

Record date, decision, status, context, rationale, alternatives and why rejected, implications, and related artifacts. Do not overwrite history when revising a decision; link a superseding record. Remaining choices are tracked in the [open register](open-questions.md).

## D-011 — First implementation gate accepted

- Date: 2026-10-07
- Status: ACCEPTED BY PROJECT OWNER
- Decision: Adopt the exact first-slice stack, browser-only execution, MT Option-F/pacs.008.001.14 pair, explicit pairing, confidence enum, materiality and component grouping.
- Context: Architecture review accepted with explicit build authorization.
- Rationale: Prove clean preservation without network conformance or expanded scope.
- Alternatives: Backend, database, fuzzy correlation, inferred MT components and graph/component frameworks excluded from this slice by owner.
- Implications: D-009 stack proposal is superseded for the first slice; policy and export/import deferred. External-authority baseline remains a full-MVP release gate.
- Related artifact: [adopted gate](../architecture/implementation-gate.md).

## D-012 — First-slice implementation boundaries and verification

- Date: 2026-10-07
- Status: IMPLEMENTED under D-011; no expansion of product scope.
- Decision: Use the documented block-4-only fixture envelope, exact-value correspondence, UTF-16 locators into unchanged raw artifacts, SHA-256 UTF-8 capture hashes, and bounded worker-isolated parsing.
- Context: Convert the accepted narrow semantic subset into executable Fixture A.
- Rationale: Preserve observable evidence without claiming complete FIN/XSD/network validation.
- Alternatives: Full transport envelope validation and broader address inference are outside this slice; no replacement parser was needed.
- Implications: Other input envelopes/components remain unsupported or visible as uninterpreted data; non-matches remain unresolved. No policy findings or persistent exports are produced.
- Related artifacts: [parser contract](../architecture/parser-contract.md), [verification](../quality/first-slice-verification.md), [dependency review](../architecture/dependency-review.md).

## D-013 — Authorized fidelity-degradation slice

- Date: 2026-10-07
- Status: AUTHORIZED; implementation boundary recorded for review.
- Decision: Implement five degradation/origin events using explicit canonical evidence, preserving Fixture A and all accepted engine/UI boundaries.
- Context: Structured collapse cannot be honestly obtained by inventing structure in the first-slice MT adapter. The authorization permits sufficient explicit canonical evidence.
- Rationale: Use bundled canonical witness records and reviewed correspondence/completeness context; derive events from verified relationships rather than importing expected events.
- Alternatives: Inferring MT structure, guessing correspondence from text, and assuming unmapped data is absent are excluded by accepted principles.
- Implications: CANONICAL_TEST is an internal evidence label only. Raw MT/pacs non-matches remain conservative. Absence judgments are bounded to complete fixture scope; no general standards or policy support is implied.
- Related artifact: [second-slice boundary](../architecture/second-slice-boundary.md).

### D-013 implementation evidence

Completed 2026-10-07 within the authorized boundary. Prefix truncation is limited to names/address lines; completeness is asserted only for finite canonical witnesses. Missing evidence, unknown interpretation, role/occurrence conflicts and recoverable alternatives remain unresolved. No historical ADR rationale was changed. [Second-slice verification](../quality/second-slice-verification.md) records 65 unit/integration and 12 browser tests passing.

## D-014 — Evidence-backed address policy authorized

- Date: 2026-10-07
- Status: AUTHORIZED BY PROJECT OWNER; sources retrieved and relevant sections reviewed.
- Decision: Add public-address-quality@0.1.0 using CPMI Requirement 11 (2026 updated report) and PMPG Hybrid Postal Address v1.14, retaining separate authority classes and five alignment outcomes.
- Rationale: Demonstrate independent policy judgments without changing factual lineage. Target feasibility needs independent capability evidence; canonical vocabulary alone is insufficient.
- Interpretation: Cross-border scope is explicitly selected. Hybrid denotes an observed mixture, even if a mandatory component is missing. Exact delimited repetition is the narrow duplication test; no match remains UNKNOWN. Code-point length is a documented project convention. Source strength does not determine severity.
- Alternatives excluded: universal pass/fail, inferred feasibility, fuzzy matching, external runtime lookups, and new lineage classifiers.
- Fedwire: PENDING_FINAL_PUBLIC_GUIDELINES following the November 2027 release deferral. Different update schedules on authoritative pages require version/status provenance, not URL-only authority.
- Related artifact: [pack review](../policy/public-address-quality-v0.1.md). Historical ADRs remain unchanged.
