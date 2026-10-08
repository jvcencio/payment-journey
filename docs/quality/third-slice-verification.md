# Third-slice verification — evidence-backed address policy

Verified locally 2026-10-07 with pinned Node 24.21.0, locked dependencies and Chromium. **94 unit/integration tests across 13 files and 20 production-browser tests passed.** Type checking, lint, formatting and production build passed. No remote CI run, deployment, legal approval or network certification is claimed.

## Acceptance evidence

| Criterion | Result / evidence |
| --- | --- |
| Versioned public pack | public-address-quality@0.1.0 contains six rules; strict metadata validation and exact registry version resolution |
| Traceable authority | Each rule carries organization/type, edition, dates, section, URL, status and supersession metadata; findings resolve the selected pack and authority |
| Separate source classes | CPMI harmonisation and PMPG market practice have separate UI sections; source strength does not become severity |
| Flagship D | Debtor minimum ALIGNS while semantic placement DOES_NOT_ALIGN; two affected misplaced component edges, street not mislabeled |
| Feasibility boundary | CPMI available-structure recommendation uses a separate target capability declaration; removal or wrong artifact binding yields UNKNOWN |
| Fact/policy immutability | Deep-frozen report survives empty, selected, repeated and removed pack evaluations with identical canonical snapshots, semantic nodes, edges and events |
| Applicability and uncertainty | Explicit cross-border context, hybrid structural mixture, date/status gating; conservative UNKNOWN and NOT_APPLICABLE tested |
| Evidence navigation | Browser test opens rule/source metadata and navigates from D's policy finding to room lineage and original locators; source link resolves to reviewed edition URL |
| Profile changes | Instrumented browser worker observes one parsing request across repeated profile switches; visible lineage stays identical |
| Privacy | Existing raw sentinel and canonical privacy checks pass; policy selection/evaluation produces zero observed HTTP requests or page WebSockets after local assets load, with all requests intercepted/blocked |
| Regression | All 65 previous engine tests and 12 previous browser tests remain passing within the expanded suites |
| Presentation | Desktop and 390px mobile inspected; rule details readable; keyboard focus reaches selected lineage evidence; no horizontal overflow |

## Commands

```sh
npm exec --yes --package=node@24.21.0 -- npm run check
npm exec --yes --package=node@24.21.0 -- npm run test:browser
```

Independent policy expectations cover D and P1–P5. Negative and boundary tests cover missing country/town, line length/count, exact repetition versus unrelated substrings/participants, unknown interpretation, incomplete context, target capability, source status/effective dates and rejected pack versions. Markdown local links and fences were checked separately.

## Sources and limits

Source review: 2026-10-07. CPMI February 2026 updated report, published 2026-02-26, Requirement 11 and executive summary; PMPG Hybrid Postal Address v1.14, dated 2026-09-04, slides 11–13. The [source register](../research/source-register.md) records edition, section, status, source URLs, rights notices and the Fedwire freshness issue. Null mandatory effective dates are intentional; this is selected voluntary guidance/market-practice alignment. PMPG semantic-integrity evaluation is a project interpretation of documented risk, not a copied network rule.

The pack is a narrow address-quality baseline. It cannot establish overall payment correctness, actual postal validity, real-world identity, network acceptance or legal compliance. Findings are per participant and per rule; no global pass/fail is calculated. No fuzzy duplication detection or new lineage classifier was added. A no-match repetition result is UNKNOWN. Unicode code-point length is the project's documented convention, not validation of a network character repertoire.

Complete negative evidence and target capabilities are supplied by finite canonical witnesses. Raw MT/pacs coverage remains narrow; absent or uninterpreted evidence yields conservative results. No capability is inferred from canonical fields. Remediation is advisory text, never an automatic edit. Rule sources are pinned to review metadata and not refreshed during evaluation. Storage/export and user-defined packs remain out of scope.

Fedwire status: PENDING_FINAL_PUBLIC_GUIDELINES. Its release moved to November 2027; final guidelines are expected in November 2026. No superseded November 2026 release timing is executable. CBPR+, Fedwire, ISO certification and institutional evaluation are not implemented. Source access/redistribution for future final network guidelines needs separate review. Repository license selection remains open.
