# Payment Journey

Validate how postal-address data changes as wire payments move between legacy and ISO 20022 representations.

Payment Journey traces what was preserved, merged, misplaced, truncated, lost, or added — then evaluates selected findings against versioned public CPMI/PMPG address-quality guidance.

**Public alpha / portfolio project.** Built for payments product, QA, implementation, business analysis, architecture and technology teams working on wire modernization. This is engineering support, not a production compliance platform.

## Live demo

[Open Payment Journey](https://jvcencio.github.io/payment-journey/) — public alpha / portfolio project. All bundled examples are synthetic; do not enter real payment data.

## See the distinction

The default prepared example, **Building number and suite placed in Street Name**, starts with explicitly known synthetic fields:

```text
Source system knows              Target message contains
Building number  1200            StreetName  1200 BRICKELL AVE STE 900
Street name      BRICKELL AVE
Suite / room     STE 900
```

The data survives textually, but building number and suite lose their correct placement. The result is generated from engine observations, not the scenario name.

| Debtor assessment | Result |
| --- | --- |
| Information | Preserved, with collapse and selective misplacement |
| CPMI minimum structured location | ALIGNS |
| PMPG semantic address quality | DOES NOT ALIGN |
| Network conformance / institution policy | NOT EVALUATED |

These findings are per rule and participant, not a whole-payment pass. The same example's creditor lacks town and does not align with the minimum. Selecting a different profile never changes the underlying lineage. Open a finding to inspect its original records, source locators, rule, authority edition and section.

## Implemented

- Narrow MT103 Option-F subset → pacs.008.001.14 comparison, one explicitly paired transaction.
- Debtor/Creditor postal-address analysis, with party-name evidence retained.
- Semantic lineage and provenance, including grouped field relationships.
- Composable PRESERVED, COLLAPSED, MISPLACED, TRUNCATED, LOST and UNSOURCED events.
- Public-address-quality v0.1.0: six CPMI/PMPG rules with versioned authority evidence.
- Answer-first UI, plain-language scenarios, persistent guidance context and inspectable technical detail.
- Browser-local, memory-only processing; no payload uploads, analytics or backend.

Prepared examples supply explicit known fields; they do not pretend MT103 contains every discrete address concept. Raw parser coverage is intentionally narrow. UNKNOWN means evidence is insufficient; NOT APPLICABLE means the rule does not apply. Neither is hidden or converted to a favorable conclusion.

**Current alpha scope: Debtor and Creditor postal addresses.** Other parties and agents may carry address requirements depending on the message/profile; they are not assessed here.

## Not yet implemented

Other address-bearing parties/agents; Fedwire or CBPR+ profiles/certification; FAIM; pain.001; multi-hop journeys; ABA/routing-directory enrichment; user/institution rule-pack authoring; export/import or persistence. No Swift, ISO, Fedwire or CBPR+ certification is claimed.

Fedwire remains **PENDING_FINAL_PUBLIC_GUIDELINES** for the November 2027 release. The [source register](docs/research/source-register.md) records the changed timetable and superseded source material. The public guidance pack is not law or regulatory approval.

## Run locally

Use **Node 24.21.0 LTS**, pinned in `.nvmrc`:

```sh
npm ci
npm run build
npm run preview
```

Open the printed local URL. Choose an **Example scenario**, then **Compare these messages**. The default prepared example includes visibly declared cross-border context and the CPMI/PMPG profile. For an entered MT103/pacs.008 pair, applicability defaults to **Don't assume** unless you explicitly choose otherwise. All bundled parties, accounts and transactions are fictional; use only synthetic input.

```sh
npm run check
npx playwright install chromium
npm run test:browser
npm audit --audit-level=high
```

`npm run dev` supports editing. Production CSP blocks connections; local development allows localhost HMR. Privacy tests run against the production build.

## Architecture and evidence

```text
Messages / prepared records
         ↓
Canonical evidence → factual lineage → what changed?
                            ↓
                    selected public guidance
                            ↓
                  independent policy findings
```

The semantic engine is independent of React. Adapters interpret; lineage records facts; the policy layer evaluates a selected authority. All three preserve evidence and uncertainty. [Parser boundary](docs/architecture/parser-contract.md) · [Policy interpretation](docs/policy/public-address-quality-v0.1.md) · [Documentation index](docs/index.md).

The UX changes respond to [heuristic / independent product review](docs/product/product-validation-ux.md), not customer research or market validation. A cold-use review with an uninvolved payments practitioner is still needed. [Fourth-slice verification](docs/quality/fourth-slice-verification.md).

## Roadmap

Broader fidelity classifiers, participant roles and message families require separate authorization and evidence. Further public/network rule packs require source/version/rights review. ABA enrichment remains a research item; it is separate from rule applicability and would require authoritative data access and provenance. [Roadmap](docs/product/roadmap.md).

## License and contributions

Original Payment Journey source code and project-authored documentation are licensed under [Apache License 2.0](LICENSE). External standards, source publications and third-party software remain owned/licensed by their respective rights holders. Citations and paraphrases do not transfer ownership; the project license does not authorize redistribution of controlled standards content.

Read [CONTRIBUTING](CONTRIBUTING.md), [standards-source boundaries](docs/research/licensing-boundaries.md) and [SECURITY](SECURITY.md). Do not contribute real payment/customer data, credentials, employer-confidential material or restricted guides.

Payment Journey does not initiate or authorize payments and is not legal or regulatory advice. [Disclaimer](DISCLAIMER.md).
