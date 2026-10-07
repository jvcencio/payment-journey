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
