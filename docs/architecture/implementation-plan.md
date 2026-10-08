# MVP implementation plan

STATUS: First lineage slice authorized by the [implementation gate](implementation-gate.md). Subsequent authorized slices implemented degradation and the first public address-quality policy pack (D-013/D-014). Original full-MVP sequencing below remains a roadmap; persistence is deferred.

| Step | Deliverable | Exit evidence / dependencies |
| --- | --- | --- |
| 0 | Commit documentation foundation | Required pages, ADRs, link checks, honest current status |
| 1 | Resolve implementation-critical choices | Select stack/runtime, MT options, pacs.008 version, transaction boundaries, parser limits, evidence/confidence contract; record decisions |
| 2 | Typed model and evidence skeleton | Stable source/target identities, raw artifact retention, node/edge cardinality tests; no policy imports into adapters/lineage |
| 3 | Narrow adapters | Raw synthetic pair produces snapshots, locators, unknown elements, and explicit failures; unsupported variants do not masquerade as supported |
| 4 | Deterministic lineage | Canonical A–J expectations plus normalization and negative cases; source and target accountability; reproducible output |
| 5 | Small baseline policy pack | Reviewed public citations/applicability and project-policy labeling; version replay; changing policy leaves lineage unchanged |
| 6 | Accessible comparison UI | Pair input, debtor/creditor views, factual events, confidence, raw evidence, separate policy findings, clear coverage/errors |
| 7 | Release candidate | All acceptance criteria and security/CI checks; clean synthetic demo; resolved release licensing and reporting channels |

The proposed TypeScript structure is in the [stack proposal](technical-stack-proposal.md). Raw fixtures are authored only after format/version decisions; canonical semantic test vectors can be specified without pretending they are valid network messages.

## Engineering gates

Before merging substantive implementation, add type checking, linting/formatting, fixture and unit tests, a build check, and dependency review in CI. Keep logs structured when useful but exclude raw payment values. Use meaningful behavior tests, not snapshots that merely bless implementation output. Browser tests must cover keyboard use and evidence inspection.

The project baseline must not be described as network conformance. A cited external rule needs a verified section and executable acceptance tests before activation. Fixture A alone is not evidence of general MT103/pacs.008 support.

## Stop boundary

No FAIM/pain adapters, additional UI roles, multi-hop views, payment operations, LLM parsing, or other non-goals enter this plan. Later roadmap work requires a separate scope decision. See [acceptance criteria](../quality/acceptance-criteria.md) for the release gate.
