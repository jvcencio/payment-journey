# Source register

Last reviewed: 2026-10-07. “Verified” below means the linked public page was retrieved and inspected for the limited claim recorded here. It does not mean an entire standard, repository, license chain, or executable rule has been audited. No standards clause has yet been approved for the baseline pack.

## Verified public source pages

| ID | Organization; document/page title; URL | Publication/update date | Accessed | Authority category / topic | How it informs Payment Journey | Redistribution considerations |
| --- | --- | --- | --- | --- | --- | --- |
| S-01 | BIS / CPMI; [Harmonised ISO 20022 data requirements for enhancing cross-border payments — updated report](https://www.bis.org/publications/harmonised-iso-20022-data-requirements-enhancing-cross-border-payments-updated-report) | 2026-02-26 | 2026-10-07 | CPMI harmonisation; consistency of implementation | Public summary supports the need for harmonisation and identifies updated report/technical annex. Describes guidance as non-regulatory. Not enough to derive an address rule | Link and brief paraphrase only; report/annex redistribution rights not reviewed |
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
| CPMI address-related clauses and technical annex | NEEDS VERIFICATION | Inspect exact version, section, applicability, and supporting tests before any rule implementation |
| Fedwire, CBPR+, and PMPG requirements | NEEDS VERIFICATION | Identify exact public versus restricted sources and applicable editions; future profiles only |
| Broader open-source comparison | NEEDS VERIFICATION | Reproducible tool sample, pinned revisions, feature evidence, and coverage limits |
| Discovery interviews/experiments behind H1–H4 | NEEDS VERIFICATION | No underlying records supplied; inherited assessments remain labeled |

One attempted vendor website route could not be retrieved; S-04/S-05 use the official public repositories instead. No claim depends on the inaccessible route.

## Entry template

For every new source record: stable ID; organization; exact document/page title; URL (or explicitly unavailable); publication/update date if known; access date; authority category; topic; limited supported claim; how it informs the product; source section/edition when used for a rule; redistribution considerations; verification status and reviewer evidence.

Separate page retrieval from clause review, redistribution approval, and rule approval. Mutable sources must be pinned or otherwise version-identified before reproducible evaluations depend on them.
