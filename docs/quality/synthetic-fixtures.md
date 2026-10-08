# Synthetic-fixture specification v0.2

**All examples below are fictional semantic test vectors.** No parties, accounts, identifiers, institutions, or transactions are copied from real data. Geographic labels do not identify a real transaction. Fixture A now has executable raw inputs and a manifest under fixtures/raw-pairs/a-clean-preservation; C/D/E/F/J now have executable bundled canonical witnesses under fixtures/canonical; B/G/H/I/K/L remain roadmap specifications. No comprehensive raw-message validity claim is made.

## Test layers

**Raw-pair integration tests** use the supported MT103/pacs.008.001.14 artifacts in Fixture A. They verify parsing, evidence recovery, unknown visibility, lineage, and policy separation together.

**Canonical-engine tests** exercise semantics independently of source-format capabilities. C/D require known discrete source components; do not invent MT fields or silently derive those components just to claim raw coverage. Any later adapter derivation needs its own evidence and confidence.

## Required cases

Each case below fixes only the changed semantic fragment. The eventual fixture must include complete surrounding synthetic context, stable element IDs, and all expected unaffected mappings. Run debtor and creditor variants where the supported adapters permit them.

| ID | Scenario and fictional input → target | Required factual expectation | Negative assertion / evidence requirement |
| --- | --- | --- | --- |
| A | Name `FABLE SUPPLY TEST`, address line `12 FICTION LANE` → same values | PRESERVED for each element | No loss/derivation solely from identical data; preserve separate locators |
| B | addressLine `KUNGSGATAN 10 FLOOR 4` → streetName `KUNGSGATAN`, buildingNumber `10`, floor `4` | DERIVED + STRUCTURED, source information accounted for | Explicit deterministic segmentation method, spans, and confidence; do not claim source had discrete fields |
| C | buildingNumber `1200`, streetName `BRICKELL AVE`, room `STE 900` → addressLine `1200 BRICKELL AVE STE 900` | PRESERVED + COLLAPSED for all three | Executable canonical witness; no MISPLACED for the broader address line |
| D | same known components as C → streetName `1200 BRICKELL AVE STE 900` | PRESERVED + COLLAPSED on all three; MISPLACED only on building/room | Executable canonical witness; three component edges share relationshipGroupId and one target |
| E | name `ACME INTERNATIONAL TRADING HOLDINGS LLC` → `ACME INTERNATIONAL TRADING HOLD` | TRUNCATED; missing `INGS LLC`, decoded UTF-16 offsets 31–39 | Executable prefix witness; no full PRESERVED or LOST; whitespace-only suffix is not truncation |
| F | room `STE 900` → no target representation; other concepts preserved | LOST, source-only edge | Executable complete-evidence witness; recoverable content blocks loss |
| G | country `US` → country `US` and country-bearing address line `US` | DUPLICATED + PRESERVED with both target origins | Compatibility of the two representations is explicit; not CONFLICTING |
| H | country `US` → country `US` plus address line `COUNTRY: CA` | CONFLICTING on country representations | The preserved structured occurrence remains sourced; account separately for contradictory target content without inventing origin |
| I | source has no country; explicit fallback config `country=US` → country `US` | DEFAULTED, configuration evidence reference | No DEFAULTED claim without provided config evidence; remove config in companion test and expect UNSOURCED |
| J | source country absent → target country `CA`, no explaining origin | UNSOURCED, target-only edge | Executable complete source/origin evidence; no invented source, default or enrichment |

## Additional required coverage

- **K — Normalization:** fictional source country phrase `United States of America` → `US`, with an explicit reviewed/versioned equivalence mapping; expect PRESERVED + NORMALIZED. Ambiguous abbreviations must not be silently normalized.
- **L — Alteration:** known source buildingNumber `12` → `98` with established correspondence and no explanatory transformation; expect ALTERED.
- **M — Ambiguity:** repeated `12` tokens across different concepts; do not infer correspondence from substring equality alone. Implemented as explicit unresolved records with reasons and candidate IDs; no forced event.
- **N — Unknown content:** an unsupported MT option or XML extension remains visible with raw evidence; parsing coverage is qualified.
- **O — Invalid/hostile input:** malformed artifacts, wrong namespace/version, DTD/entity inputs, oversized/deep input, and unexpected transaction multiplicity receive explicit diagnostics without unsafe processing or a false pass.

ENRICHED and scoped UNSUPPORTED are part of the taxonomy, but adding an enrichment service or new target adapter is outside the MVP. Canonical contract tests may exercise evidence references without implementing those services. GENERATED remains unresolved (O-09).

## Future fixture manifest — proposed, STATUS: OPEN

Record fixture ID/version, `synthetic: true`, fictional-data statement, test layer, description, artifact references/hashes, format versions, participant/transaction identities, expected nodes/edges/events, raw locators/spans, explicit transformation/default context, expected unknowns/warnings, selected rule versions, separate policy expectations, and forbidden events.

Golden expectations must be reviewed independently of generated engine output. Every meaningful source and target element needs an expected accounting, not just the headline failure. Policy findings are asserted separately so changing severity does not rewrite the lineage oracle.

## Executable second-slice accounting

| Fixture | Source material nodes | Target material nodes | Edges | Headline observation |
| --- | --- | --- | --- | --- |
| C | 8 | 6 | 8 | Three collapse components, one shared target |
| D | 8 | 6 | 8 | Same group, two selectively misplaced components |
| E | 5 | 5 | 5 | One truncated name |
| F | 6 | 5 | 6 | One lost room |
| J | 4 | 5 | 5 | One unsourced country |

All unaffected mappings are PRESERVED and all material nodes are accounted for in these fixtures. Context declares correspondence and completeness, never expected events. Independent expected.json files are used only by tests; the application imports source, target and context. Negative tests remove completeness, conflict roles/occurrences, overlap bindings or leave values recoverable to require unresolved accounting. Fixture A remains the raw-adapter regression. See [verification](second-slice-verification.md) and [evidence boundary](../architecture/second-slice-boundary.md).

## E constraint clarification (Slice 4)

E models a fictional 31-character party-name display column in a target system. Its ASCII source exceeds that explicit local constraint; the existing 31-character target and omitted suffix are unchanged. The limit is synthetic, not an MT field-line, ISO element or network-standard rule. The declaration is retained in context evidence.
