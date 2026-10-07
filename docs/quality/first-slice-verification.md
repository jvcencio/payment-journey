# First-slice verification — Fixture A

Verified locally on 2026-10-07 using Node 24.21.0 LTS (Krypton), the committed exact dependency versions, and Chromium through Playwright. This is first-slice evidence, not a full-MVP release or security certification. The GitHub Actions workflow is committed; a remote CI run is not claimed.

## Acceptance evidence

| First-slice criterion | Evidence |
| --- | --- |
| Deterministic supported parsing | MT and pacs adapter tests; full Fixture A replay equality |
| React-independent canonical snapshots | Node-based unit/integration tests; restricted React/UI imports enforced by ESLint |
| Locatable debtor/creditor values | Raw UTF-16 span round-trips, line/column checks, CRLF/Unicode/entity/prefix cases |
| Source fate / target origin accountability | Ten source and ten target material nodes participate in exactly ten PRESERVED relationships |
| Visible preservation and selectable evidence | Production-browser test selects creditor country and verifies original source/target locators and values |
| Unknown content stays visible | Adapter tests and browser expansion of unmapped MT evidence; XML extras/attributes retained |
| Malformed/wrong-version diagnostics | Unit and production-browser tests; no complete report on parser failure |
| XML safety | DTD/entity rejection, no resolver, depth/size/node/value bounds, malformed namespaces and duplicate structures |
| Deterministic rerun | Deep equality of capture/snapshots/graph; UI can rerun the same pair |
| No payload transmission | Browser test waits for local assets/worker, intercepts and blocks all HTTP requests, evaluates unique fictional sentinel values, observes zero HTTP requests and zero page WebSocket connections |
| Tests without UI | 37 passing Node-based tests across domain, adapters, worker lifecycle and integration |
| Browser behavior | Five passing production-browser tests including inert HTML-like values and keyboard/mobile layout |

The network test checks the tested production flow, not arbitrary browser extensions or future changes. Production CSP disallows connections and form submission. Local Vite development allows localhost HMR traffic/style injection, which is not the production privacy boundary.

## Commands run

```sh
npm run check
npm run test:browser
npm audit --audit-level=high
```

Type checking, lint, formatting, 37 unit/integration tests, production build and five browser tests pass. npm audit reported zero known vulnerabilities at verification time. Desktop evidence presentation was visually inspected; browser tests checked a 390px viewport for horizontal overflow. No remote deployment was performed.

## Remaining limits

Only exact preservation is classified. Non-matches have explicit unresolved source/target accounting, not fabricated loss, alteration or origin events. Names, explicit country/town and ordered address lines form the deep slice; target structured components beyond this are retained as unmapped evidence. Accounts are retained outside material fidelity scope.

Policy evaluation, authoritative postal-address rules, other classifiers, full XSD/MT/network validation and export/import remain unimplemented. License and public-release operations remain open. The evidence does not close those full-MVP gates.
