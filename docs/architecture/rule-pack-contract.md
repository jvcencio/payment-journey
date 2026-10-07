# Rule-pack contract

Versioning is mandatory. The following is a conceptual contract, not a finalized JSON schema or executable pack.

| Group | Fields |
| --- | --- |
| Identity | ruleId, title, description, rulesetVersion |
| Authority | authority, authorityType |
| Applicability | jurisdiction, paymentRail, messageFamily, messageType, effectiveFrom, effectiveTo |
| Requirement | requirementLevel: MUST / MUST_NOT / SHOULD / SHOULD_NOT / MAY |
| Evaluation | evaluationType: syntax / profile / semantics / fidelity / market_practice / future_resilience; severity; machineTest |
| Evidence | source, sourceSection, citation |
| Action | remediationGuidance |

A pack also needs its own identity/version and a declared relationship to a selected profile. Save resolved rule versions and configuration with evaluations. Capture source edition and rule interpretation changes; a changed machine test cannot silently reuse an old version.

Public packs require publicly accessible authoritative citations for external requirements. User-supplied packs, profile connectors/configuration, and reference-only sources stay distinguishable from redistributable public content. See [licensing boundaries](../research/licensing-boundaries.md).

The evaluator must report non-applicability or missing evaluation context explicitly. A rule that could not run is not a pass. Findings must cite the rule version and evidence, not just an event name.

**STATUS: OPEN:** machine-test language, pack composition/precedence, severity vocabulary, outcome model, trusted execution boundary, packaging, and effective-date selection. Proposed safe starting point: project-owned typed predicates, without arbitrary uploaded executable code. This is a proposal, not an adopted product decision.
