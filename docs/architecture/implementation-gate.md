# First implementation gate — accepted

Recorded 2026-10-07. Supersedes the open first-slice choices in the initial proposal; records explicit project-owner authorization. Gate: APPROVED FOR FIRST IMPLEMENTATION SLICE.

## Adopted stack and runtime

TypeScript 6 strict, React 19, Vite 8, Vitest 5, Playwright, Zod 4, npm with exact dependencies and committed lockfile, Node.js 24 for development/CI, ESLint, Prettier, and GitHub Actions. Semantic HTML and modest CSS; no component framework or visualization dependency. Exact compatible package versions are recorded in package.json at scaffold time.

Analysis is fully client-side: no backend, database, server parser, enrichment, payload telemetry/logging, or payment-directed network resolution. Evidence lives in memory. Export/import is deferred; AC-13 belongs to a later separately accepted persistence decision. A browser test must detect payload transmission during evaluation.

## Supported artifacts and pairing

Exactly one explicitly user-paired source MT103 Option-F subset and target pacs.008.001.14, namespace `urn:iso:std:iso:20022:tech:xsd:pacs.008.001.14`. Exactly one CdtTrfTxInf; multiple produce UNSUPPORTED_MULTIPLE_TRANSACTIONS. No automatic correlation or fuzzy matching. Match within paired transaction by role, concept, and occurrence; identical strings have distinct locators/identities.

Recognize MT fields 20, 23B, 32A, 50F, 57A, 59F, 70, 71A. Deep interpretation: 50F debtor, 59F creditor, names, useful accounts, explicit country/town, ordered address lines. Other content remains unmapped evidence. No inference of building/street/room/postcode from composite text. A project-owned deterministic parser implements the documented fixture contract.

Distinguish well-formed input, supported version, semantic interpretation, and unmapped content. Neither adapter constitutes full message/XSD validation or CBPR+/Fedwire/other network conformance.

## Evidence and confidence

Confidence is EXPLICIT (directly represented), DETERMINISTIC (unambiguous project-defined transformation), INFERRED (interpretation beyond encoded information), or UNKNOWN (insufficient evidence). No numeric percentages.

All successfully interpreted debtor/creditor names and address elements are material. Account references and other content are retained but outside first-slice fidelity analysis. Unknown/unsupported content is visible and does not automatically become a fidelity failure.

Individual semantic edges may share relationshipGroupId. Component-specific events remain on individual edges; a collapse group never makes a street concept MISPLACED merely because building/room concepts are misplaced.

## Safety and validation

Use namespace-aware saxes subject to safety tests: useful raw location evidence, reject DOCTYPE/DTD, no external entities/resources/schema fetching, bounded bytes/depth/node/value counts, isolated/cancellable processing, explicit errors, inert text rendering. If saxes cannot satisfy the contract, stop and amend the ADR before replacing it. Use Zod at untrusted/serialized boundaries, not for every internal interface.

## Scope and stop conditions

First implement Fixture A with original artifacts, canonical debtor/creditor data, inspectable PRESERVED observations, source/target locators and values, and visible coverage/unmapped content. Every material node needs accounting. Deterministic unit/integration tests must run without React; adversarial XML and browser privacy tests must pass.

Policy does not block this slice. Project-policy tests remain separate from external authority. Before full MVP release, review public authoritative address clauses and publish a small cited versioned pack. No claim of externally authoritative rules yet.

Stop if safe evidence preservation fails, pacs.008.001.14 forces a material model change, the MT fixture contract cannot be parsed deterministically, a dependency requires payload upload, or implementation contradicts an accepted ADR.
