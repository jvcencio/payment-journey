# First-slice dependency review

Recorded 2026-10-07. Exact versions are pinned in package.json and package-lock.json. Node 24.21.0 LTS is pinned in .nvmrc. `npm audit --audit-level=high` reported zero known vulnerabilities during verification; this is a point-in-time advisory check, not proof of security.

| Runtime dependency | Version | Declared package license | Purpose |
| --- | --- | --- | --- |
| react / react-dom | 19.3.0 | MIT | Browser rendering only; excluded from semantic engine |
| saxes | 6.0.0 | ISC | Bounded namespace-aware XML parser |
| xmlchars (transitive) | 2.2.0 | MIT | XML character definitions used by saxes |
| zod | 4.6.5 | MIT | Untrusted pair-input boundary |

Development dependencies include TypeScript 6.0.3 (Apache-2.0), Vite 8.3.3 (MIT), Vitest 5.0.3 (MIT), Playwright 1.64.0 (Apache-2.0), ESLint 10.12.0 (MIT), and Prettier 3.9.9 (MIT). Additional type packages and ESLint plugins are exact-pinned in the lockfile. These are package declarations, not a completed redistribution/legal review; retain relevant notices when preparing a release. Project-license selection remains open.

No dependency requires payment upload. Browser tests exercise evaluation with network requests blocked. saxes has no configured resource resolver. No external font, component framework, graph renderer, server parser or database was added.

Primary implementation references: [saxes repository](https://github.com/lddubeau/saxes) and its installed version 6.0.0 source/type declarations; [ISO catalogue search](https://www.iso20022.org/iso-20022-message-definitions?business-domain%5B0%5D=1&search=pacs.008), which identifies pacs.008.001.14. No third-party schema or controlled standards content is bundled. The catalogue confirms the version, not fixture conformance or an authoritative executable rule.
