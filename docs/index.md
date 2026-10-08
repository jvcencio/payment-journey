# Documentation index

Payment Journey has a working lineage and first public address-quality policy pack. The full MVP remains in development; further policies, remaining classifiers and public-release decisions remain open. The [accepted gate](architecture/implementation-gate.md) records the adopted stack and scope.

Start with the [project story](../README.md), [frozen MVP](product/mvp-definition.md), [acceptance criteria](quality/acceptance-criteria.md), and [open decisions](governance/open-questions.md). Use the [stack proposal](architecture/technical-stack-proposal.md) and [implementation plan](architecture/implementation-plan.md) to review the next slice.

Accepted decisions come from the bootstrap handoff. Discovery confidence inherited from that handoff is distinguished from independently verified public evidence. No schema, regulatory, or network conformance is claimed by this documentation.

## Product

- [Product comprehension review (heuristic)](product/product-validation-ux.md)

- [Problem discovery](product/problem-discovery.md)
- [Product thesis](product/product-thesis.md)
- [Personas and jtbd](product/personas-and-jtbd.md)
- [Product principles](product/product-principles.md)
- [Mvp definition](product/mvp-definition.md)
- [Non goals](product/non-goals.md)
- [Roadmap](product/roadmap.md)
- [Success metrics](product/success-metrics.md)

## Domain

- [Evaluation taxonomy](domain/evaluation-taxonomy.md)
- [Canonical payment model](domain/canonical-payment-model.md)
- [Provenance model](domain/provenance-model.md)
- [Participant model](domain/participant-model.md)
- [Postal address model](domain/postal-address-model.md)
- [Policy engine](domain/policy-engine.md)
- [Authority model](domain/authority-model.md)

## Architecture

- [Second-slice boundary](architecture/second-slice-boundary.md)
- [Parser and evidence contract](architecture/parser-contract.md)
- [Dependency review](architecture/dependency-review.md)

- [Accepted implementation gate](architecture/implementation-gate.md)

- [Overview](architecture/overview.md)
- [Adapter contract](architecture/adapter-contract.md)
- [Rule pack contract](architecture/rule-pack-contract.md)
- [Technical stack proposal](architecture/technical-stack-proposal.md)
- [Implementation plan](architecture/implementation-plan.md)

## Research

- [Source register](research/source-register.md)
- [Competitive landscape](research/competitive-landscape.md)
- [Standards landscape](research/standards-landscape.md)
- [Licensing boundaries](research/licensing-boundaries.md)

## Policy

- [CPMI / PMPG Address Quality Baseline v0.1.0](policy/public-address-quality-v0.1.md)

## Quality

- [Fourth-slice verification](quality/fourth-slice-verification.md)

- [Third-slice verification](quality/third-slice-verification.md)
- [Policy fixtures](quality/policy-fixtures.md)
- [Second-slice verification](quality/second-slice-verification.md)
- [First-slice verification](quality/first-slice-verification.md)

- [Test strategy](quality/test-strategy.md)
- [Synthetic fixtures](quality/synthetic-fixtures.md)
- [Acceptance criteria](quality/acceptance-criteria.md)

## Governance

- [Decision log](governance/decision-log.md)
- [Assumptions](governance/assumptions.md)
- [Open questions](governance/open-questions.md)

## Accepted ADRs

- [ADR-001 — Composable taxonomy](architecture/adr/0001-composable-taxonomy.md)
- [ADR-002 — Bidirectional lineage and provenance](architecture/adr/0002-bidirectional-lineage.md)
- [ADR-003 — Canonical semantic model](architecture/adr/0003-canonical-model.md)
- [ADR-004 — Provenance graph](architecture/adr/0004-provenance-graph.md)
- [ADR-005 — Identity separate from role](architecture/adr/0005-participant-role-model.md)
- [ADR-006 — Adapters interpret; they do not judge](architecture/adr/0006-adapter-responsibility.md)

## Repository policies and evidence

[Contributing](../CONTRIBUTING.md) · [Conduct](../CODE_OF_CONDUCT.md) · [Security](../SECURITY.md) · [Disclaimer](../DISCLAIMER.md) · [License status](../LICENSE) · [Fixtures](../fixtures/README.md)

## Resulting repository tree

```text
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── architecture/
│   │   ├── adr/
│   │   │   ├── 0001-composable-taxonomy.md
│   │   │   ├── 0002-bidirectional-lineage.md
│   │   │   ├── 0003-canonical-model.md
│   │   │   ├── 0004-provenance-graph.md
│   │   │   ├── 0005-participant-role-model.md
│   │   │   └── 0006-adapter-responsibility.md
│   │   ├── adapter-contract.md
│   │   ├── dependency-review.md
│   │   ├── implementation-gate.md
│   │   ├── implementation-plan.md
│   │   ├── overview.md
│   │   ├── parser-contract.md
│   │   ├── second-slice-boundary.md
│   │   ├── rule-pack-contract.md
│   │   └── technical-stack-proposal.md
│   ├── domain/
│   │   ├── authority-model.md
│   │   ├── canonical-payment-model.md
│   │   ├── evaluation-taxonomy.md
│   │   ├── participant-model.md
│   │   ├── policy-engine.md
│   │   ├── postal-address-model.md
│   │   └── provenance-model.md
│   ├── governance/
│   │   ├── assumptions.md
│   │   ├── decision-log.md
│   │   └── open-questions.md
│   ├── product/
│   │   ├── mvp-definition.md
│   │   ├── non-goals.md
│   │   ├── personas-and-jtbd.md
│   │   ├── problem-discovery.md
│   │   ├── product-principles.md
│   │   ├── product-thesis.md
│   │   ├── roadmap.md
│   │   └── success-metrics.md
│   ├── policy/
│   │   └── public-address-quality-v0.1.md
│   ├── quality/
│   │   ├── acceptance-criteria.md
│   │   ├── first-slice-verification.md
│   │   ├── fourth-slice-verification.md
│   │   ├── third-slice-verification.md
│   │   ├── policy-fixtures.md
│   │   ├── second-slice-verification.md
│   │   ├── synthetic-fixtures.md
│   │   └── test-strategy.md
│   ├── research/
│   │   ├── competitive-landscape.md
│   │   ├── licensing-boundaries.md
│   │   ├── source-register.md
│   │   └── standards-landscape.md
│   └── index.md
├── fixtures/
│   ├── canonical/ (C, D, E, F, J, P1–P5)
│   ├── policy/ (independent expectations and capability declaration)
│   ├── raw-pairs/
│   │   └── a-clean-preservation/
│   │       ├── README.md
│   │       ├── manifest.json
│   │       ├── source.mt103
│   │       └── target.pacs008.xml
│   └── README.md
├── src/
│   ├── adapters/
│   │   ├── mt103/
│   │   │   └── index.ts
│   │   ├── pacs008/
│   │   │   └── index.ts
│   │   └── shared.ts
│   ├── application/
│   │   ├── browser-client.ts
│   │   ├── evaluate.ts
│   │   └── evaluation.worker.ts
│   ├── artifacts/
│   │   └── capture.ts
│   ├── domain/
│   │   └── model.ts
│   ├── fixtures/ (canonical compiler and catalog)
│   ├── lineage/
│   │   └── classify.ts
│   ├── policy/ (versioned public pack and independent evaluation)
│   ├── ui/
│   │   ├── PolicyPanel.tsx
│   │   ├── Report.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   └── README.md
├── tests/
│   ├── adapters/
│   │   ├── mt103.test.ts
│   │   └── pacs008.test.ts
│   ├── application/
│   │   └── worker.test.ts
│   ├── domain/
│   │   └── evidence.test.ts
│   ├── integration/
│   │   └── fixture-a.test.ts
│   ├── lineage/
│   ├── ui/
│   │   └── journey.spec.ts
│   └── README.md
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierrc.json
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── DISCLAIMER.md
├── LICENSE
├── README.md
├── SECURITY.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

Fixture A and canonical C/D/E/F/J/P1–P5 are executable. Other headline fixture scenarios remain specifications. The public address-quality policy pack is implemented; network conformance is not. Generated build, dependency and browser-test output directories are omitted above.
