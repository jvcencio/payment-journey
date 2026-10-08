# CPMI / PMPG Address Quality Baseline v0.1.0

Authorized 2026-10-07. Pack identity: `public-address-quality@0.1.0`. This is a project-authored implementation of selected public guidance, not an authority-issued pack, law, certification or complete network profile.

## Reviewed authorities

- BIS / CPMI, *Harmonised ISO 20022 data requirements for enhancing cross-border payments — updated report*, published 2026-02-26. [Report](https://www.bis.org/publications/harmonised-iso-20022-data-requirements-enhancing-cross-border-payments-updated-report.pdf), Requirement 11, printed pp.17–18 (PDF pp.20–21); executive summary p.1. HARMONISATION_GUIDANCE. Country and town form the structured minimum; retain additional structure where feasible. AddressLine can carry further details where necessary. This supports interoperability and screening automation. Adoption is encouraged, not a regulatory obligation.
- PMPG / Swift, *Hybrid Postal Address*, v1.14, document dated 2026-09-04; [document](https://www.swift.com/swift-resource/252602/download), slides 11–13. MARKET_PRACTICE. Slide 11 describes incorrect-element co-mingling risk; slide 12 gives hybrid minimum, 2×70 limits and non-repetition rules. The website listing date (September 15) differs from the edition date. Hybrid is a supported model; full structure remains preferred.

Accessed 2026-10-07. Both editions are CURRENT for this reviewed pack. No universal mandatory effective date is invented: effectiveDate is null and applicability context states the selected voluntary baseline. CPMI replaces the October 2023 report; PMPG v1.14 replaces v1.13 for this review. Future source changes require a new pack version and review; evaluation never fetches “latest.”

## Implementation boundary

Six rules consume existing canonical evidence and lineage. Profile changes never parse or modify artifacts, snapshots or graph. Cross-border applicability is explicitly selected, not inferred from party countries. Outcomes are ALIGNS, DOES_NOT_ALIGN, PARTIALLY_ALIGNS, NOT_APPLICABLE and UNKNOWN. Requirement strength is separate from product severity; this slice assigns no severity automatically.

| Rule | Strength | Deterministic test |
| --- | --- | --- |
| CPMI-ADDR-001 | REQUIRED within the guidance baseline | Structured country and town present; absence conclusions require complete target address evidence |
| CPMI-ADDR-002 | RECOMMENDED | Known additional components retain structure; adverse recommendation requires separately evidenced target capability |
| PMPG-ADDR-001 | RECOMMENDED project interpretation of identified risk | Existing MISPLACED address edges support non-alignment; no new classifier |
| PMPG-HYBRID-001 | REQUIRED | Hybrid only: structured town/country |
| PMPG-HYBRID-002 | REQUIRED | Hybrid only: at most two lines, each at most 70 Unicode code points |
| PMPG-HYBRID-003 | PROHIBITED | Hybrid only: exact structured value repeated as a whole comma/semicolon-delimited line segment in the same participant; otherwise UNKNOWN |

Representation is the canonical structural mixture, not a declaration that a hybrid is valid. Thus a mixed address missing town remains eligible for hybrid-minimum evaluation. Incomplete interpretation prevents an unsupported applicability conclusion. Empty/unstructured/structured addresses are not assessed as hybrid. The character-count convention is a project implementation choice, not network character-set validation.

Capability evidence is an explicit finite synthetic target declaration for bundled demonstrations, never inferred from the canonical vocabulary. Unknown capability yields UNKNOWN for lost structure, with no assertion that remediation is feasible. No automatic repair is performed.

## Deferred authority

Fedwire: `PENDING_FINAL_PUBLIC_GUIDELINES`. The [August 27, 2026 notice](https://www.frbservices.org/news/communications/082726-fedwire-funds-services-release-rescheduled/) moves the release to November 2027. Final public guidance must be reviewed before a separate pack is implemented. No superseded November 2026 release date is executable.

The current [Fedwire release FAQ, questions 1–2](https://www.frbservices.org/resources/financial-services/wires/fedwire-services-frequently-asked-questions/november-2026-release-frequently-asked-questions/) expects final usage guidelines in November 2026 for the November 2027 release. Its URL still contains the former year; URL text is not version evidence.
