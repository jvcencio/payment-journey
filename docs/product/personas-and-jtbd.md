# Personas and job to be done

## Primary persona

**Payments implementation / modernization lead**: responsible for understanding changes in a payment flow and communicating transformation issues across delivery teams. This persona is selected by the handoff; its needs have not been externally validated in this repository.

> When I am changing or testing a payment flow, I want to compare payment data before and after a transformation so I can identify exactly what was preserved, changed, normalized, truncated, misplaced, inferred, or lost before the payment reaches production.

## Adjacent personas — unvalidated

| Persona | Proposed use to investigate |
| --- | --- |
| Payments Product Manager | Explain scope and acceptance tradeoffs |
| Payments Business Analyst | Inspect semantic mapping assumptions |
| QA / SQA Engineer | Reproduce transformation regressions |
| Integration Developer | Locate and repair a mapping defect |
| Solution Architect | Assess boundaries between representations |
| Payment Operations | Understand downstream effects of missing information |
| Risk / Compliance | Inspect selected policy evidence, without treating output as advice |

The MVP does not create separate workflows for all these roles. Research must establish which tasks warrant dedicated support.

## Future discovery — ABA / routing-number enrichment

When only an ABA routing number or other financial-institution identifier is available, help the user determine which institution/address information can be authoritatively sourced, what remains missing, and what the selected payment regime requires.

Identification/enrichment is distinct from rule applicability. Routing-directory usage, licensing and redistribution may be restricted; any automated lookup requires source-authority and usage-rights review first. Derived/enriched values must retain provenance. This is a discovery item only, not implemented or authorized in Slice 4.
