# Standards landscape

The canonical model is a comparison mechanism. Standards and profiles remain separately versioned authorities with specific scopes.

| Source family | Intended role | Current state |
| --- | --- | --- |
| ISO 20022 definitions/catalogue | Semantic definitions and message-version selection | Public catalogue page verified (S-02); exact pacs.008 coverage OPEN |
| MT103 specifications | Interpret selected source fields/options accurately | Authoritative source/edition and rights NEEDS VERIFICATION |
| CPMI harmonisation | Inform cited harmonisation rules | Requirement 11 reviewed (S-10); two rules implemented in public-address-quality@0.1.0 |
| Fedwire profile | Potential future rail-specific evaluation | PENDING_FINAL_PUBLIC_GUIDELINES; November 2027 release, final guidelines expected November 2026 (S-12/S-13); no executable rules |
| CBPR+ profile | Potential future network-specific evaluation | Not selected or implemented; distinguish public and restricted guidance |
| PMPG / industry guidance | Market-practice alignment | Hybrid Postal Address v1.14 reviewed (S-11); four narrow rules implemented |
| Institution policy | Future user-supplied requirements | No real institution content authorized |
| Vendor baseline | Describe expected behavior | Must not substitute for normative authority |

The [2026 CPMI publication summary](https://www.bis.org/publications/harmonised-iso-20022-data-requirements-enhancing-cross-border-payments-updated-report) identifies an updated report and separate technical annex. Record editions explicitly rather than treating earlier findings as timeless. The later S-10 clause review supports the implemented guidance baseline; it does not establish regulation.

Rule authors must verify relevant sections, effective dates, requirement strength, profile applicability, and interpretation. A requirement's presence in one regime does not establish applicability in another. See [authority model](../domain/authority-model.md) and [licensing boundaries](licensing-boundaries.md).

Fedwire source freshness is documented in the [source register](source-register.md): old checklist dates are superseded; no November 2026 cutover is encoded. The PMPG pack does not establish CBPR+ or Fedwire certification.
