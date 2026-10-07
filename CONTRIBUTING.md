# Contributing

The first preservation slice is implemented. Contributions must stay within the accepted first-slice scope. Read the [documentation index](docs/index.md), [MVP](docs/product/mvp-definition.md), and [decision log](docs/governance/decision-log.md) before proposing changes.

## Documentation workflow

1. Work in a branch and make a focused change.
2. Link claims to public primary sources in the source register; mark unverified claims explicitly.
3. Keep accepted decisions, proposals, hypotheses, and open questions distinct. Update related documents together.
4. Check relative links, Markdown fences, fixture labels, and `git diff --check`.
5. Explain the problem, resulting change, evidence, and remaining uncertainty in the review description.

Use Node 24.21.0 LTS, then `npm ci`. Run `npm run check`; install Chromium with `npx playwright install chromium`, then run `npm run test:browser`. `npm run dev` supports local editing; `npm run build && npm run preview` runs the production privacy boundary. The CI workflow runs the same checks. Keep engine code independent of React; ESLint enforces the import boundary.

## Contribution boundaries

Use fictional examples created from scratch. Do not submit production payloads, pseudonymized customer data, employer documents, real account identifiers, secrets, or restricted standards text. Follow [standards-source boundaries](docs/research/licensing-boundaries.md) and [conduct expectations](CODE_OF_CONDUCT.md).

Application changes require typed models, tests appropriate to behavior, deterministic fixtures, clear parsing errors, and the checks in the [test strategy](docs/quality/test-strategy.md). Adapters must never determine policy severity. Do not add a new message family or UI role merely because the model permits it.

License selection and contribution licensing terms remain **STATUS: OPEN** (O-01). Review suggestions are welcome; a release must resolve licensing before representing the project as licensed open source.
