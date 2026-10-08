# Second-slice verification — fidelity degradation

Verified locally on 2026-10-07 using pinned Node 24.21.0 LTS, exact locked dependencies and Chromium through Playwright. All checks passed: **65 unit/integration tests across eight files and 12 production-browser tests**. The GitHub Actions workflow is committed; no remote CI run or deployment is claimed.

## Acceptance evidence

| Requirement | Verified behavior |
| --- | --- |
| Five new deterministic events | Independent C/D/E/F/J fixture expectations validate collapse, misplacement, truncation, loss and unsourced origin |
| Composable events | C components carry PRESERVED + COLLAPSED; D adds MISPLACED only to building and room |
| Grouped component attribution | Three D edges share one target and relationshipGroupId; street remains correctly placed; target coverage counts it once |
| Truncation evidence | E exposes omitted `INGS LLC` at decoded-source UTF-16 offsets 31–39; whitespace-only differences do not qualify |
| Loss versus origin | F source-only LOST and J target-only UNSOURCED have inspectable node and context evidence |
| No fabricated correspondence | Role/occurrence conflicts, overlapping bindings, unknown confidence and missing evidence remain unresolved |
| Recoverable content | Alternative supported representations and broad address lines prevent false definitive loss |
| Material accountability | Each supported material node participates in an edge or explicit unresolved record; coverage is visibly qualified |
| Evidence traceability | Canonical records and context retain raw text, hashes and locators; integration tests recover referenced evidence |
| Fixture A regression | Existing ten-preservation raw pair, parser diagnostics, hostile XML, unknown fields and evidence UI still pass |
| React-independent engine | Core tests execute in Node; ESLint enforces core/UI import boundaries; UI renders engine events |
| Browser behavior | A/C/D/E/F/J, grouped details, directional empty side, omitted text, keyboard/narrow layout and unresolved coverage pass |
| Payload privacy | Raw sentinel and all five canonical evaluations produce zero observed HTTP requests and page WebSocket connections after local assets load, with requests intercepted and blocked |

## Commands and visual review

```sh
npm exec --yes --package=node@24.21.0 -- npm run check
npm exec --yes --package=node@24.21.0 -- npm run test:browser
```

Type checking, lint, formatting, unit/integration tests and production build passed before browser verification. Fixture D was visually reviewed at desktop and 390px mobile widths; its three components, selective badges, single target and evidence panel were legible. Automated viewport checks found no horizontal overflow.

## Supported boundary and remaining limits

C/D/E/F/J are bundled canonical witnesses, not new payment message adapters or inferred MT fields. Only debtor/creditor name/address scope is involved. JSON-lines source/target records and strict context declarations supply explicit semantic evidence. Expected events remain independent test oracles and are never imported by the app. Arbitrary canonical import is not exposed.

Collapse currently verifies exact ordered space-joining of known distinct address concepts. Truncation verifies explicit prefix correspondence for names/address lines; it does not model arbitrary omissions. LOST and UNSOURCED are bounded to complete finite fixture evidence, including origin context. Raw MT/pacs non-matches retain conservative unresolved accounting. These are deliberately narrow deterministic rules, not a general reconstruction of undocumented transformations.

No policy evaluation, external rule pack, network-profile validation, enrichment, defaults, remediation, export/import, persistence or backend was added. Fully accounted-for degradation is not a favorable policy result. Production CSP blocks connections; local development permits localhost HMR. Privacy evidence covers the tested application flows, not extensions or future changes. First-slice verification remains a historical report. License selection and full-MVP release gates remain open.
