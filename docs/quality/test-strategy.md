# Test strategy

The bootstrap is documentation only. No unit tests or application CI are claimed to exist. The following strategy governs implementation.

## Layers

| Layer | What to verify |
| --- | --- |
| Domain unit tests | Event composition; all edge cardinalities; identity/role separation; address representation boundaries once decided |
| Adapter tests | Exact raw recovery/locators; namespace/version/field support; unknown visibility; warnings and failure states |
| Lineage fixtures | Bidirectional accounting and correspondence correctness; component-level collapse/misplacement; duplicates, conflicts, missing origins |
| Policy tests | Applicability, effective dates, version replay, authority labels; rule changes cannot mutate lineage |
| Integration | Supported raw pair → preserved artifacts → snapshots → lineage → policy → inspectable report |
| UI | Keyboard flow, focus, text event labels, contrast review, error recovery, evidence drill-down; screen-reader smoke test |
| Security | Entity/DTD handling, malformed/oversized/deep input, namespace confusion, unsafe rendering, untrusted configuration |

Use reviewed expected results, including forbidden events. Add ambiguous and repeated-token cases to prevent overconfident matches. A graph with 100% accounted nodes can still contain wrong correspondences; verify evidence and meaning.

## Determinism and reproducibility

Inject evaluation context; never let current time, random IDs, network lookups, locale, or iteration order silently change findings. Preserve parser/model/engine/taxonomy/rule versions and explicit defaults. Record external evidence if any is ever used. Compare substantive output separately from capture/display timestamps.

## CI plan

With the first implementation, run type checks, lint/format checks, unit/fixture tests, relevant UI tests, and production build on review. Review new dependencies for licensing, vulnerabilities, and need. Pin runtime/dependencies and CI actions appropriately. Document exact commands when the selected stack exists; do not publish fictitious setup steps now.

During bootstrap, check Markdown links/fences, required file coverage, open-decision consistency, and `git diff --check`. External source reachability is checked during research; it is not a substitute for reviewing redistribution rights or executable rule applicability.
