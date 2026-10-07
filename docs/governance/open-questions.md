# Open questions

Every item below has **STATUS: OPEN**. No default acceptance is implied by a recommendation. “Project owner” is a responsibility label; no unprovided person or organization has been assigned.

| ID | Decision | Why it matters / recommendation where available | Resolve before |
| --- | --- | --- | --- |
| O-01 | License, copyright holder, contribution terms | Open-source intent is insufficient to choose terms; owner selects and replaces LICENSE notice | Open-source release and contribution licensing claims |
| O-02 | Stack, runtime/package versions, tooling | TypeScript + React/Vite recommended; compare Java reuse if parser spike fails | Application scaffold |
| O-03 | MT options, pacs.008 edition/namespace/profile, syntax validation coverage | Publish a precise supported subset; do not imply all variants are handled | Raw fixtures and adapters |
| O-04 | Payment/transaction matching and multiplicity | Decide how a user-supplied pair is confirmed and unmatched/multiple transactions handled | End-to-end comparison |
| O-05 | Parser dependencies and resource limits | Prove unknown preservation, literal evidence, namespace handling, safe XML and bounded operation | Input ingestion |
| O-06 | Execution, hosting, retention, raw storage/hash, export and telemetry | Local browser processing proposed; saved evaluations still require recoverable evidence and versions | Persistence or deployment |
| O-07 | Baseline rules, authority sections, pack composition, outcomes/severity, effective-date context | Keep project rules distinct from external requirements; choose exact reviewed tests | Policy implementation |
| O-08 | Materiality, correspondence, confidence, normalization, representation modes, IDs and serialization | Define ambiguity and partial coverage; decide country-only/empty address classification and component-level graph attribution | Core model and lineage contracts |
| O-09 | Generated origins absent from taxonomy v0.2 | Brief mentions generated values without defining GENERATED; resolve representation without silent taxonomy extension | Any generated-origin support |
| O-10 | Security/conduct contacts, reporting and appeals, ownership and support commitments | No fabricated contacts or SLA; project owner establishes actual channels | Community/public release operations |
| O-11 | Discovery evidence and usability/performance thresholds | Validate persona/H5 and attach evidence behind H1–H4; no invented research outcomes | Product validation and performance acceptance |
| O-12 | Name and repository publication destination | Payment Journey is a working name; remote/public URL not established by this bootstrap | Publication |

Resolve only what the next implementation slice needs; do not force future multi-hop or additional-profile decisions into MVP. Adopted resolutions belong in the [decision log](decision-log.md), with an ADR where structural consequences justify one.
