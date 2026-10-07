# Problem discovery

A transformation may produce a syntactically acceptable artifact while losing meaning, structure, or the origin of information. Payment Journey investigates that gap for teams changing payment flows. This is the motivating product thesis, not a measured claim about every implementation.

## Discovery record

The following statuses reproduce the bootstrap handoff's assessments. Underlying interviews, experiments, and research notes were not supplied. They must not be represented as independently verified customer research.

| ID | Hypothesis | Handoff assessment | Public evidence / next validation |
| --- | --- | --- | --- |
| H1 | Modernization teams struggle with semantic integrity across transformations | Strong supporting evidence | S-01 supports a general harmonisation need; obtain direct practitioner evidence of this specific workflow |
| H2 | Open-source tools disproportionately focus on parsing, validation, and translation over lineage | Initial supporting evidence | S-04/S-05 document two adjacent tools; a broader reproducible survey remains needed |
| H3 | Postal-address transformation is a useful initial wedge | Strong supporting evidence | Validate representative address failure cases and user priority; no quantified address-specific evidence supplied |
| H4 | A canonical model bridges materially different formats | Validated at conceptual-model level using MT103 and pacs.008 | No runnable validation supplied; demonstrate supported raw pairs before claiming implementation validation |
| H5 | Human-readable, evidence-backed findings help more than validation errors alone | Still requires user validation | Observe users tracing origin and loss without author assistance |
| H6 | Multi-hop lineage adds value | Plausible; outside MVP | Defer until pairwise workflow is useful |
| H7 | QA teams can use lineage as regression evidence | Plausible; test after MVP | Later assess stable reports in an existing QA workflow |

See [source register](../research/source-register.md) and [assumptions](../governance/assumptions.md). There are no invented interviews, satisfaction scores, or market-size estimates.

## Proposed discovery method — STATUS: OPEN

Recruit modernization leads and adjacent QA/integration practitioners without collecting employer data. Use the synthetic A–J scenarios to ask what changed, what evidence is missing, and which findings change a testing decision. Record consent, role, task outcome, ambiguity, and proposed changes. Recruitment count, success thresholds, and evidence storage need owner decisions.
