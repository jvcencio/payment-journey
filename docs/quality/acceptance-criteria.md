# MVP acceptance criteria

STATUS: First-slice acceptance verified in [implementation verification](first-slice-verification.md). The full-MVP gates below remain incomplete, especially non-preservation classifiers and authoritative policy.

| ID | Given / when | Required outcome | Evidence |
| --- | --- | --- | --- |
| AC-01 | Supported synthetic MT103/pacs.008 pair is supplied | Both artifacts retained; format/version boundaries explicit | Raw-pair integration fixture and capture/hash inspection |
| AC-02 | Each supported artifact is parsed | Canonical snapshots, parse evidence, debtor/creditor names, useful account refs, and addresses inspectable | Adapter tests and UI walkthrough |
| AC-03 | Pair is compared | Every material in-scope source element has an accountable fate | Source graph coverage plus correct per-element oracle |
| AC-04 | Target is inspected | Every material in-scope target element has an accountable origin, including UNSOURCED | Target graph coverage and I/J fixtures |
| AC-05 | A–F and K examples run | Preservation, normalization, structuring, derivation, collapse, misplacement, truncation, and loss correctly identified | Reviewed event combinations and forbidden-event assertions |
| AC-06 | G–J run | Duplication, conflict, evidenced defaults, and unexplained additions distinguished | Canonical tests and applicable raw-pair equivalents |
| AC-07 | Unsupported or unknown content occurs | Visible raw locator/content and qualified coverage; no silent discard | Unknown-content and unsupported-version fixtures |
| AC-08 | Inputs/configuration/versions repeat | Same substantive output; stable locators and graph references | Deterministic replay test; timestamps do not alter judgments |
| AC-09 | Same facts use different policy rules | Lineage unchanged; findings cite applicable versioned rules and authority | Separation test plus small public baseline pack |
| AC-10 | User inspects a finding | Can trace what, where, source/target values, inference/confidence, and rule basis | Keyboard-accessible evidence walkthrough |
| AC-11 | Invalid/hostile input is supplied | Bounded safe failure, useful diagnostics, no false completeness or policy pass | Security/parser negative tests |
| AC-12 | Full demo is run | Only synthetic data; no keys, external enrichment dependency, payment initiation, or confidential content | Fixture review and dependency/config review |
| AC-13 | Saved evaluation is reproduced | Original evidence and exact parser/model/lineage/policy versions and parameters resolve | Reproducibility manifest test |

“Material” boundaries, unsupported-result terminology, and transaction matching must be resolved before these gates can pass. Coverage is within declared support; unsupported domains remain visible, never implicitly certified.

Engineering release prerequisites: typed domain models, unit/fixture tests, linting, formatting, CI, dependency review, documented setup commands, accessible UI checks, license selection, and an operational security contact. No numerical performance target is invented here; establish one before performance acceptance.

## First-slice gate refinement

The [accepted gate](../architecture/implementation-gate.md) authorizes lineage-only Fixture A. AC-09 external policy remains a full-MVP release requirement. AC-13 persistence/export requires a separate later decision; in-memory reproducibility is required now. Neither is a claim that the full MVP is complete when the first slice passes.
