# Documentation index

Payment Journey is at the documentation bootstrap stage. The MVP is defined but not implemented; the technical stack, license, and several support boundaries remain OPEN.

Start with the [project story](../README.md), [frozen MVP](product/mvp-definition.md), [acceptance criteria](quality/acceptance-criteria.md), and [open decisions](governance/open-questions.md). Use the [stack proposal](architecture/technical-stack-proposal.md) and [implementation plan](architecture/implementation-plan.md) to review the next slice.

Accepted decisions come from the bootstrap handoff. Discovery confidence inherited from that handoff is distinguished from independently verified public evidence. No schema, regulatory, or network conformance is claimed by this documentation.

## Product

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

## Quality

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
│   │   ├── implementation-plan.md
│   │   ├── overview.md
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
│   ├── quality/
│   │   ├── acceptance-criteria.md
│   │   ├── synthetic-fixtures.md
│   │   └── test-strategy.md
│   ├── research/
│   │   ├── competitive-landscape.md
│   │   ├── licensing-boundaries.md
│   │   ├── source-register.md
│   │   └── standards-landscape.md
│   └── index.md
├── fixtures/
│   └── README.md
├── src/
│   └── README.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── DISCLAIMER.md
├── LICENSE
├── README.md
└── SECURITY.md
```

`src/` contains only a documentation placeholder. The fixture scenarios are specifications, not executable payloads. No application dependencies or CI workflow are present yet.
