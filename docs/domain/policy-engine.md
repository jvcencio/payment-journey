# Policy engine

The lineage engine answers what happened. The policy engine evaluates acceptability under selected rules. Adapters and lineage cannot assign severity, declare compliance, or repair data.

## Evaluation flow

Take canonical evidence, lineage observations, an explicit evaluation date/context, and a versioned selected profile. Resolve applicability, evaluate machine tests, and issue findings that retain rule identity/version, evidence references, outcome, severity, and remediation guidance. Show unevaluated coverage explicitly.

Profiles may eventually compose public semantic rules, a rail/network profile, market practice, institution policy, and a vendor baseline. Initial selectable regimes are not implemented. Intended future regimes include an ISO semantic baseline, CPMI harmonisation, Fedwire, CBPR+, user rule packs, and vendor behavior.

Keep outcomes separate: a vendor baseline can match while semantic alignment warns and institution policy fails. Do not flatten distinct authorities into a universal compliance score. Aggregation, precedence, and conflict resolution are **STATUS: OPEN (O-07)**.

## First baseline — STATUS: OPEN

The MVP requires a small publicly supportable baseline, but no executable standards rule is approved yet. Candidate project-authored fidelity rules could flag evidenced loss, unsourced additions, and collapse. Such rules must be labeled as project policy, not attributed to ISO, CPMI, or a network without a verified supporting clause. Cite the relevant project principle for project rules and authoritative public sources for external requirements.

The [source register](../research/source-register.md) verifies source pages, not machine-test derivations. Before activating any externally attributed rule, record its exact source section, applicability, paraphrase, effective dates, and reviewed tests. Do not derive mandatory country/address requirements from a general publication summary.

## Reproducibility

Save artifact hashes and references, canonical schema and parser versions, lineage engine/taxonomy versions, selected profile and rule-pack versions/content identities, explicit parameters and defaults, evaluation date, and any external evidence used. Avoid “latest” rule resolution during replay. Storage format and version migration behavior remain open.
