# Policy engine

The lineage engine answers what happened. The policy engine evaluates acceptability under selected rules. Adapters and lineage cannot assign severity, declare compliance, or repair data.

## Evaluation flow

Take canonical evidence, lineage observations, an explicit evaluation date/context, and a versioned selected profile. Resolve applicability, evaluate machine tests, and issue findings that retain rule identity/version, evidence references, outcome, severity, and remediation guidance. Show unevaluated coverage explicitly.

Profiles may eventually compose public semantic rules, a rail/network profile, market practice, institution policy, and a vendor baseline. The first selectable regime is public-address-quality@0.1.0, plus Lineage only. Intended future regimes include an ISO semantic baseline, CPMI harmonisation, Fedwire, CBPR+, user rule packs, and vendor behavior.

Keep outcomes separate: a vendor baseline can match while semantic alignment warns and institution policy fails. Do not flatten distinct authorities into a universal compliance score. Aggregation, precedence, and conflict resolution are **STATUS: OPEN (O-07)**.

## First baseline — historical proposal, now implemented narrowly

The bootstrap left external rule approval open. D-014 now authorizes six narrow CPMI/PMPG rules after section-level review; other candidates below remain future work. Candidate project-authored fidelity rules could flag evidenced loss, unsourced additions, and collapse. Such rules must be labeled as project policy, not attributed to ISO, CPMI, or a network without a verified supporting clause. Cite the relevant project principle for project rules and authoritative public sources for external requirements.

The [source register](../research/source-register.md) verifies source pages, not machine-test derivations. Before activating any externally attributed rule, record its exact source section, applicability, paraphrase, effective dates, and reviewed tests. Do not derive mandatory country/address requirements from a general publication summary.

## Reproducibility

Save artifact hashes and references, canonical schema and parser versions, lineage engine/taxonomy versions, selected profile and rule-pack versions/content identities, explicit parameters and defaults, evaluation date, and any external evidence used. Avoid “latest” rule resolution during replay. Storage format and version migration behavior remain open.

## Implemented Slice 3

`src/policy/evaluate.ts` consumes a deeply readonly LineageReport, exact pack selections and a PolicyContext; it returns separate findings. It imports neither parsers nor the classifier. The React profile selector evaluates the existing report without sending another worker parsing request. Empty selection returns no findings. Unknown versions are rejected; there is no latest fallback.

Outcomes are ALIGNS, DOES_NOT_ALIGN, PARTIALLY_ALIGNS, NOT_APPLICABLE and UNKNOWN. Findings retain participant, exact rule/pack identities, affected edges/elements, raw/context evidence references and capability-declaration references where used. Authority details resolve through the returned pack. Requirement strength is independent of severity (UNASSIGNED in this slice). No aggregate pass/fail is produced.

Cross-border scope is an explicit user assumption; the default is UNKNOWN. Evaluation date is captured at report display and retained with results. Source status, supersession and publication/effective dates gate execution. A pinned source review is not a live freshness guarantee. No sources are fetched during evaluation.

Complete absence judgments require verified complete canonical witness context and no unmapped content/warnings. Positive evidence can support a limited result despite incomplete wider coverage; missing evidence cannot be treated as absence. Hybrid applicability uses observed structured elements plus address lines, so a deficient hybrid is still evaluated. Repetition detection accepts only same-participant exact whole comma/semicolon segments and returns UNKNOWN when none is established. Capability comes from a separate explicit synthetic target declaration, not the canonical model. Raw-adapter policy assessments remain correspondingly conservative.

An architectural test freezes the complete report and compares no-pack, selected-pack, repeated and removed-pack runs. Original snapshots, nodes, edges and events remain identical. Persistent exports, user-defined pack editing, network profiles and cross-pack precedence remain deferred. See [pack interpretation](../policy/public-address-quality-v0.1.md).
