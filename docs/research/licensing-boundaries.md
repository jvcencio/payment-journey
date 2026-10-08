# Standards-source and redistribution boundaries

This page defines project contribution boundaries, not a legal opinion. Public accessibility is not by itself permission to redistribute an entire document, schema, guide, or derived pack.

| Category | Repository treatment |
| --- | --- |
| PUBLIC RULE PACKS | Project-authored tests/paraphrases with public authoritative citations for external requirements; review rights and applicability before including source-derived material |
| USER-SUPPLIED RULE PACKS | Separately supplied user content; do not commit licensed or confidential content to this public project |
| PROFILE CONNECTORS / CONFIGURATION | References and configuration boundaries for permitted access; no embedded credentials or assumption of rights to redistribute fetched content |
| REFERENCE-ONLY SOURCES | Bibliographic links and limited descriptions; no bundled source content where rights are unclear |

## Review workflow

1. Identify the exact artifact, author, edition, and access conditions.
2. Record the public source and applicable rights in the source register.
3. Separate linking, paraphrasing, quoting, schema inclusion, and code reuse; they are distinct uses.
4. Include material only when the relevant redistribution basis is established. Otherwise retain a reference-only entry.
5. Record any required notices and review new versions before updating distributed assets.

Do not embed copyrighted, proprietary, licensed, or access-controlled standards material without established rights. This includes potentially restricted usage guidelines, network specifications, and MyStandards content. Never upload employer or customer materials as substitutes for accessible sources.

The [ISO 20022 IPR page](https://www.iso20022.org/intellectual-property-rights) describes retained contributor rights and a license to use published repository information (S-03). That does not settle every proposed redistribution or grant rights to separate network documentation. Item-specific review remains OPEN.

The bootstrap includes links and original summaries only; no standards PDFs, schemas, restricted guides, or third-party code are bundled. Original project code and documentation are now licensed under [Apache-2.0](../../LICENSE) by D-015. Do not label a future pack “public” merely because its machine tests are short or its inputs can be viewed online.

## Third-slice public pack review

The [BIS report](https://www.bis.org/publications/harmonised-iso-20022-data-requirements-enhancing-cross-border-payments-updated-report.pdf) copyright page permits limited extracts with source acknowledgement. The [PMPG v1.14 document](https://www.swift.com/swift-resource/252602/download), slide 2, and its [document centre notice](https://www.swift.com/standards/market-practice/payments-market-practice-group-2024/document-centre) permit reproduction/redistribution with source acknowledgement. Reviewed 2026-10-07; these are the notices for the reviewed material, not a grant for unrelated network documentation.

The public pack contains original narrow predicates, short paraphrases and full citations; no third-party PDF, diagram, schema, example or restricted guide is bundled. Author names, edition and sections appear in rule metadata and UI. Pack approval does not license the whole repository: original project work is Apache-2.0. Fedwire final guidelines, including any MyStandards access/redistribution conditions, need their own review.

## Project license decision

D-015 adopts Apache License 2.0 for original Payment Journey code and documentation. External standards, source publications, trademarks and third-party dependencies remain owned/licensed by their respective rights holders. Citations and paraphrased requirements do not transfer ownership. The project license never authorizes redistribution of controlled/licensed standards material. The official license text is preserved in LICENSE.

The published static bundle includes `LICENSE.txt` for original project work and `third-party-notices.txt` for React, React DOM, Scheduler, saxes, xmlchars and Zod, copied from installed package notices (saxes from its official v6.0.0 repository). These are software license notices, not reproduced standards. Public third-party copyright attributions are intentional.
