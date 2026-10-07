# Synthetic-fixture specification v0.1

**All examples below are fictional semantic test vectors.** No parties, accounts, identifiers, institutions, or transactions are copied from real data. Geographic labels do not identify a real transaction. Fixture A now has executable raw inputs and a manifest under fixtures/raw-pairs/a-clean-preservation; other scenarios remain specifications. No comprehensive raw-message validity claim is made.

## Test layers

**Raw-pair integration tests** will use supported MT103/pacs.008 artifacts after versions/options are selected. They verify parsing, evidence recovery, unknown visibility, lineage, and policy separation together.

**Canonical-engine tests** exercise semantics independently of source-format capabilities. C/D require known discrete source components; do not invent MT fields or silently derive those components just to claim raw coverage. Any later adapter derivation needs its own evidence and confidence.

## Required cases

Each case below fixes only the changed semantic fragment. The eventual fixture must include complete surrounding synthetic context, stable element IDs, and all expected unaffected mappings. Run debtor and creditor variants where the supported adapters permit them.

| ID | Scenario and fictional input → target | Required factual expectation | Negative assertion / evidence requirement |
| --- | --- | --- | --- |
| A | Name `FABLE SUPPLY TEST`, address line `12 FICTION LANE` → same values | PRESERVED for each element | No loss/derivation solely from identical data; preserve separate locators |
| B | addressLine `KUNGSGATAN 10 FLOOR 4` → streetName `KUNGSGATAN`, buildingNumber `10`, floor `4` | DERIVED + STRUCTURED, source information accounted for | Explicit deterministic segmentation method, spans, and confidence; do not claim source had discrete fields |
| C | buildingNumber `1200`, streetName `BRICKELL AVE`, room `STE 900` → streetName `1200 BRICKELL AVE STE 900` | PRESERVED + COLLAPSED for all three; MISPLACED on building/room relationships | Canonical input; many-to-one group with correct per-component attribution |
| D | buildingNumber `42`, streetName `FICTION LANE`, room `ROOM 7` → streetName `42 FICTION LANE ROOM 7` | MISPLACED on building/room, PRESERVED + COLLAPSED on group | StreetName's own concept is not automatically MISPLACED; complements C's placement checks |
| E | name `FABLE SYNTHETIC EXPORT COMPANY` → `FABLE SYNTHETIC EXPORT` | TRUNCATED with surviving and lost span evidence | Do not call complete preservation or complete loss |
| F | room `ROOM 7` → no target representation; other components preserved | LOST for room, one-to-none edge | Establish full supported target search coverage; a parse failure is not proof of loss |
| G | country `US` → country `US` and country-bearing address line `US` | DUPLICATED + PRESERVED with both target origins | Compatibility of the two representations is explicit; not CONFLICTING |
| H | country `US` → country `US` plus address line `COUNTRY: CA` | CONFLICTING on country representations | The preserved structured occurrence remains sourced; account separately for contradictory target content without inventing origin |
| I | source has no country; explicit fallback config `country=US` → country `US` | DEFAULTED, configuration evidence reference | No DEFAULTED claim without provided config evidence; remove config in companion test and expect UNSOURCED |
| J | source has no room; target room `ROOM 99`, no explanatory context | UNSOURCED, none-to-one relationship | Do not guess DERIVED, ENRICHED, or DEFAULTED |

## Additional required coverage

- **K — Normalization:** fictional source country phrase `United States of America` → `US`, with an explicit reviewed/versioned equivalence mapping; expect PRESERVED + NORMALIZED. Ambiguous abbreviations must not be silently normalized.
- **L — Alteration:** known source buildingNumber `12` → `98` with established correspondence and no explanatory transformation; expect ALTERED.
- **M — Ambiguity:** repeated `12` tokens across different concepts; do not infer correspondence from substring equality alone. Expected uncertainty representation is OPEN (O-08).
- **N — Unknown content:** an unsupported MT option or XML extension remains visible with raw evidence; parsing coverage is qualified.
- **O — Invalid/hostile input:** malformed artifacts, wrong namespace/version, DTD/entity inputs, oversized/deep input, and unexpected transaction multiplicity receive explicit diagnostics without unsafe processing or a false pass.

ENRICHED and scoped UNSUPPORTED are part of the taxonomy, but adding an enrichment service or new target adapter is outside the MVP. Canonical contract tests may exercise evidence references without implementing those services. GENERATED remains unresolved (O-09).

## Future fixture manifest — proposed, STATUS: OPEN

Record fixture ID/version, `synthetic: true`, fictional-data statement, test layer, description, artifact references/hashes, format versions, participant/transaction identities, expected nodes/edges/events, raw locators/spans, explicit transformation/default context, expected unknowns/warnings, selected rule versions, separate policy expectations, and forbidden events.

Golden expectations must be reviewed independently of generated engine output. Every meaningful source and target element needs an expected accounting, not just the headline failure. Policy findings are asserted separately so changing severity does not rewrite the lineage oracle.
