# Synthetic policy fixtures

All inputs are fictional. Existing D supplies the flagship collapse/misplacement evidence; C remains a pure-collapse companion. Five compact canonical witnesses P1–P5 reuse the existing reader and supply unchanged source/target facts. They add no payment adapter, participant role or lineage classifier.

`fixtures/policy/expected.json` is an independent policy oracle used only in tests. Source/target/context records are under `fixtures/canonical/P1` through `P5`. A separate versioned synthetic target-capability declaration covers C/D/P1–P5 and is bound to the evaluated target artifact. It is not an external standard or a conclusion drawn from available canonical fields.

| Fixture | Evidence / expected selected-policy behavior (debtor) |
| --- | --- |
| D | Existing three-to-one group; CPMI minimum ALIGNS, available structure PARTIALLY_ALIGNS with capability evidence, PMPG placement DOES_NOT_ALIGN, hybrid rules NOT_APPLICABLE |
| P1 | Properly structured address; minimum/structure/placement ALIGNS; hybrid rules NOT_APPLICABLE |
| P2 | Town, country and one address line; hybrid minimum/limits ALIGNS; repetition UNKNOWN (no detected repetition is not proof of no duplication) |
| P3 | Hybrid missing town; CPMI and hybrid minimum DOES_NOT_ALIGN |
| P4 | Three address lines; hybrid line limit DOES_NOT_ALIGN |
| P5 | Exact comma-delimited town repetition; PMPG-HYBRID-003 DOES_NOT_ALIGN |

Policy fixtures use an explicitly selected cross-border context and evaluation date 2026-10-07. Since Slice 4, the initial prepared showcase selects the public baseline and discloses cross-border example context. User-entered pairs default to cross-border applicability not established unless explicitly chosen. Profile and explicit applicability choices persist across scenarios. Judgments remain participant-specific: D's creditor has no town and its minimum does not align; the debtor example is not a payment-wide pass.

Additional tests cover country missing despite textual presence in AddressLine, 70/71 code-point boundaries including supplementary Unicode, fully unstructured non-applicability, unknown/incomplete evidence, exact versus substring repetition, different-participant identical values, missing/mismatched capability, source statuses and dates, invalid/duplicate versions, resolvable evidence and frozen-report immutability. Existing raw Fixture A and C/D/E/F/J tests remain unchanged in meaning.
