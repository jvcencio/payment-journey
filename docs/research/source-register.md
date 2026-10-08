# Source register

Last reviewed: 2026-10-07. “Verified” below means the linked public page was retrieved and inspected for the limited claim recorded here. It does not mean an entire standard, repository, license chain, or executable rule has been audited. Slice 3 separately reviewed the exact CPMI/PMPG sections below for six project-authored executable rules.

## Verified public source pages

| ID | Organization; document/page title; URL | Publication/update date | Accessed | Authority category / topic | How it informs Payment Journey | Redistribution considerations |
| --- | --- | --- | --- | --- | --- | --- |
| S-01 | BIS / CPMI; [Harmonised ISO 20022 data requirements for enhancing cross-border payments — updated report](https://www.bis.org/publications/harmonised-iso-20022-data-requirements-enhancing-cross-border-payments-updated-report) | 2026-02-26 | 2026-10-07 | CPMI harmonisation; consistency of implementation | Summary establishes non-regulatory guidance; S-10 below records the separate Requirement 11 review | Links and brief paraphrases; S-10 records report notice, no annex bundled |
| S-02 | ISO 20022 Registration Authority; [Catalogue of messages](https://www.iso20022.org/catalogue-messages) | Not stated on reviewed page | 2026-10-07 | ISO definition catalogue; versioned messages | Entry point for selecting exact message definitions, reports, and schemas; does not select an MVP version | No schema or definition copied; evaluate item-specific rights before bundling |
| S-03 | ISO 20022 Registration Authority; [Intellectual property rights](https://www.iso20022.org/intellectual-property-rights) | Not stated on reviewed page | 2026-10-07 | Repository IPR policy | Contributors retain IPR; published information is described as available under a non-exclusive royalty-free use license. Check relevant contributor terms rather than assuming universal redistribution rights | Rights review is artifact-specific; do not extrapolate to network guides or access-controlled content |
| S-04 | Prowide; [prowide-core repository README](https://github.com/prowide/prowide-core) | Mutable repository; reviewed revision not pinned | 2026-10-07 | Vendor specification / software capability | Documents Java MT models, parsing/building, and related conversion features. A candidate parser input to investigate, not evidence of lineage equivalence | Repository advertises Apache-2.0; inspect pinned dependency and notices before reuse; no code copied |
| S-05 | Prowide; [prowide-iso20022 repository](https://github.com/prowide/prowide-iso20022) | Mutable repository; reviewed revision not pinned | 2026-10-07 | Vendor specification / software capability | Documents an ISO 20022 business model/parser; adjacent tooling for the competitive scan and Java alternative | No code copied; package/version and transitive license review required before adoption |
| S-06 | TypeScript project; [The Basics — Erased Types](https://www.typescriptlang.org/docs/handbook/2/basic-types) | Not stated on reviewed page | 2026-10-07 | Software documentation; type-system behavior | Type annotations do not supply runtime validation, motivating explicit input-boundary checks in the stack proposal | Link and paraphrase; no source or documentation reproduction |
| S-07 | Vite project; [Deploying a Static Site](https://vite.dev/guide/static-deploy.html) | Not stated on reviewed page | 2026-10-07 | Software documentation; deployment | Supports static build output as a proposed UI deployment option; preview server is not a production server | Link and paraphrase only; hosting choice not adopted |

## Research backlog — NEEDS VERIFICATION

| Item | Status | Missing evidence / intended use |
| --- | --- | --- |
| Exact MT103 options and source semantics | NEEDS VERIFICATION | Select authoritative accessible sources; establish reuse boundaries; no fabricated URL |
| Selected pacs.008 edition and address definitions | NEEDS VERIFICATION | Inspect selected schema/definition sections from S-02; do not infer semantics from tag names alone |
| CPMI technical annex and broader clauses | PARTIAL | Requirement 11 reviewed in S-10; technical annex and other executable rules remain unreviewed |
| Fedwire and CBPR+ profiles | PENDING | S-12/S-13 establish Fedwire deferral; final guidelines and CBPR+ conformance are outside the pack. PMPG reviewed separately in S-11 |
| Broader open-source comparison | NEEDS VERIFICATION | Reproducible tool sample, pinned revisions, feature evidence, and coverage limits |
| Discovery interviews/experiments behind H1–H4 | NEEDS VERIFICATION | No underlying records supplied; inherited assessments remain labeled |

One attempted vendor website route could not be retrieved; S-04/S-05 use the official public repositories instead. No claim depends on the inaccessible route.

## Entry template

For every new source record: stable ID; organization; exact document/page title; URL (or explicitly unavailable); publication/update date if known; access date; authority category; topic; limited supported claim; how it informs the product; source section/edition when used for a rule; redistribution considerations; verification status and reviewer evidence.

Separate page retrieval from clause review, redistribution approval, and rule approval. Mutable sources must be pinned or otherwise version-identified before reproducible evaluations depend on them.

## First-slice implementation references — 2026-10-07

- S-08: lddubeau/saxes, [repository documentation](https://github.com/lddubeau/saxes), publication date not stated; accessed 2026-10-07. Category: software implementation documentation. Inspected together with installed saxes 6.0.0 source/types for namespace events and position semantics. Package declares ISC; no source is copied into project-authored code. Dependency redistribution review remains separate.
- S-09: ISO 20022 Registration Authority, [ISO message catalogue filtered to pacs.008](https://www.iso20022.org/iso-20022-message-definitions?business-domain%5B0%5D=1&search=pacs.008), update date not stated; accessed 2026-10-07. Category: ISO message catalogue. Confirms pacs.008.001.14 identifier; does not establish fixture conformance or an address rule. Link only, no schema bundled.

## Third-slice authority review — 2026-10-07

| ID | Source and exact edition | Section / status | Supported use / rights |
| --- | --- | --- | --- |
| S-10 | BIS / CPMI, [updated harmonised ISO 20022 report](https://www.bis.org/publications/harmonised-iso-20022-data-requirements-enhancing-cross-border-payments-updated-report.pdf), February 2026 edition; publication 2026-02-26 | Requirement 11, printed pp.17–18 / PDF pp.20–21; executive summary p.1. CURRENT; replaces October 2023 report; no known superseding edition at review | HARMONISATION_GUIDANCE, basis for CPMI-ADDR-001/002. Copyright page allows attributed limited extracts; this repository uses concise original paraphrases and links, no PDF |
| S-11 | PMPG / Swift, [Hybrid Postal Address](https://www.swift.com/swift-resource/252602/download), v1.14, document 2026-09-04; catalogue update 2026-09-15 | Slides 11 (incorrect-element risk), 12 (hybrid definition/rules), 13 (scope), 2 (notice), 3 (history). CURRENT; supersedes v1.13; no known superseding edition at review | MARKET_PRACTICE, basis for four PMPG rules. Source acknowledgement required by reproduction/redistribution notice; link and concise paraphrase only. PMPG-ADDR-001 is the project's recommendation-level operationalisation of a stated risk, not a verbatim network mandate |
| S-12 | FRFS, [release rescheduling notice](https://www.frbservices.org/news/communications/082726-fedwire-funds-services-release-rescheduled/), published 2026-08-27 | Notice and next steps. CURRENT scheduling evidence, supersedes prior November 2026 timing | Release moved to November 2027; reference only, no executable Fedwire rule |
| S-13 | FRFS, [November 2027 Release FAQ](https://www.frbservices.org/resources/financial-services/wires/fedwire-services-frequently-asked-questions/november-2026-release-frequently-asked-questions/), mutable page, publication date not stated | Questions 1–2; CURRENT scheduling evidence; rule-pack status PENDING_FINAL_PUBLIC_GUIDELINES | Final usage guidelines intended for November 2026 publication on MyStandards. Public availability and redistribution rights still require review before any implementation |
| S-14 | FRFS, [November 2026 preparedness checklist](https://www.frbservices.org/binaries/content/assets/crsocms/resources/financial-services/wires/nov-release-fedline-direct-primary-connection-checklist.pdf), revised March 2026 | Cutover timing, SUPERSEDED by S-12 for release timing | Historical freshness evidence only; not an active rule source |

All accessed 2026-10-07. Null effective dates in the public pack mean no universal mandatory effective date is asserted. Applicability is explicitly recorded per rule. Source status is pinned to this review, not a live claim of freshness forever. No runtime website access occurs.

Authoritative websites may contain pages updated on different schedules; rule provenance therefore requires version/effective-status metadata rather than URL-only citation. S-13 even retains “november-2026” in its URL while its title/body now describe 2027. S-14 still exposes older cutover timing. The newer release notice and current FAQ take precedence for the documented scheduling decision; the superseded checklist is not executable. Pack-level interpretations and tests are recorded in the [policy review](../policy/public-address-quality-v0.1.md).
