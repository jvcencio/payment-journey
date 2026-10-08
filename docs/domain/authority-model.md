# Authority model

Authority type establishes the kind of claim a source can support; it is not an automatic precedence algorithm.

| Category | Interpretation boundary |
| --- | --- |
| Law / regulation | Applicable legal instrument; no automated legal advice |
| Payment system / network requirement | Applies only within the identified rail/profile/version |
| ISO semantic definition | Meaning and structure in the relevant definition/version |
| CPMI harmonisation requirement | Harmonisation guidance; do not relabel it as regulation |
| PMPG / industry market practice | Industry guidance with its own applicability |
| Institution policy | User-selected organization requirement, not universal authority |
| Vendor specification | Describes implementation behavior; not necessarily desired behavior |
| Regression baseline | Describes expected prior behavior; does not establish correctness |

Future reports may independently show vendor expected behavior MATCH, network profile PASS, semantic alignment WARNING, and institution policy FAIL. These are illustrative outcomes, not today's capabilities.

S-01 explicitly describes CPMI harmonisation as non-regulatory guidance. See the [source register](../research/source-register.md). A publicly visible source is not automatically redistributable, and a source's authority is not proof of a particular rule interpretation.

**STATUS: OPEN:** cross-pack precedence and aggregate report terminology. Until resolved, preserve individual judgments and their authority/context rather than silently choosing a winner.

## Implemented authority provenance

Every executable rule includes authorityOrganization, authorityType, sourceTitle, sourceVersion, publicationDate, effectiveDate (nullable), accessedDate, sourceUrl, sourceSection, sourceStatus, supersedes and supersededBy. The runtime-validated metadata rejects URL-only provenance. sourceStatus supports CURRENT, SUPERSEDED, PENDING, WITHDRAWN and UNKNOWN. Non-current or superseded sources do not produce definitive alignment results. Unknown effective dates are not invented.

The public pack distinguishes HARMONISATION_GUIDANCE (CPMI) from MARKET_PRACTICE (PMPG). Its REQUIRED/RECOMMENDED/PREFERRED/PERMITTED/PROHIBITED strength vocabulary describes the source within its stated scope; engine severity is separately UNASSIGNED. PMPG-ADDR-001 specifically records the project's recommendation-level interpretation of a described risk. Reports show ALIGNS/DOES_NOT_ALIGN/PARTIALLY_ALIGNS/NOT_APPLICABLE/UNKNOWN for individual rules, not legal or network pass/fail. Source details and both authority and artifact evidence are inspectable from each finding.

Fedwire remains PENDING_FINAL_PUBLIC_GUIDELINES. Edition, section, dates and source status are necessary because an authoritative site's URL and older pages may survive a changed release schedule. See S-10–S-14 in the [source register](../research/source-register.md).
