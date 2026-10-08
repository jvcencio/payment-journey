# Open questions

This historical register is refined by the accepted [implementation gate](../architecture/implementation-gate.md). O-02 is RESOLVED for the first slice; O-03/O-04/O-05/O-06/O-08 are RESOLVED for the explicitly adopted subset and contracts, with broader items still OPEN. O-07 is resolved for the first public address-quality pack under D-014; multi-pack precedence and export/import remain deferred. No default acceptance is implied for remaining questions. “Project owner” is a responsibility label; no unprovided person or organization has been assigned.

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

## First-slice resolutions

- O-02: adopted toolchain; exact packages at scaffold.
- O-03: pacs.008.001.14 and MT103 Option-F subset; no XSD/network conformance.
- O-04: explicit one-to-one user pairing, no automatic correlation.
- O-05: saxes safety spike and project-owned MT parser; numerical resource limits are documented implementation limits.
- O-06: browser-only, memory-only, no payload egress; host remains open, export/import deferred.
- O-08: named confidence enum, material name/address scope, role/concept/occurrence correspondence, optional relationshipGroupId. Ambiguous comparisons remain explicit.
- At the first slice O-01/O-09/O-10/O-11/O-12 remained open as applicable. O-07 external-authority source review is still required before full MVP release.

## Third-slice resolution

O-07 now has six reviewed public CPMI/PMPG predicates, exact version/source metadata, explicit applicability, alignment outcomes and separately unassigned severity. [D-014](decision-log.md) and the [pack review](../policy/public-address-quality-v0.1.md) supersede the first-slice deferral only for this scope. Broader profiles, conflicts, aggregation and persistent replay remain open.

## Fourth-slice resolutions

O-01: Apache-2.0 adopted for original code/documentation, with third-party rights preserved; contributions follow its submission terms. O-12: public target jvcencio/payment-journey authorized; publication requires audit and quality gates. O-11 practitioner validation remains open. See D-015.
