# Evaluation taxonomy v0.2

Taxonomy events describe observed facts and may compose on one lineage relationship. They are not a mutually exclusive `status`, policy severity, or regulatory conclusion.

| Dimension | Event | Meaning / required distinction |
| --- | --- | --- |
| Data fate | PRESERVED | Material source meaning survives in the target |
| Data fate | ALTERED | Corresponding value materially differs without an evidenced normalization, derivation, truncation, or other supported explanation |
| Data fate | TRUNCATED | Only part of the source value survives |
| Data fate | LOST | Source information has no recoverable target representation within supported evaluated coverage |
| Behavior | NORMALIZED | Representation changes while meaning remains equivalent; record the equivalence basis |
| Behavior | STRUCTURED | Composite information is separated into explicit semantic components |
| Behavior | DERIVED | Value is inferred or computed from source/context rather than supplied as a discrete source value; provenance and confidence required |
| Behavior | COLLAPSED | Two or more known semantic source concepts become fewer target concepts |
| Behavior | DUPLICATED | Equivalent semantic information appears in multiple target locations |
| Placement | MISPLACED | Information survives in an element whose semantic meaning does not correspond to the source concept |
| Capability | UNSUPPORTED | Target format, profile, system, or implementation cannot represent the concept as intended; scope required |
| Origin | DEFAULTED | Configured fallback inserted because explicit source information was unavailable |
| Origin | ENRICHED | External information source supplied an added value |
| Origin | UNSOURCED | No identified source, transformation, default, enrichment, or derivation explains a target value |
| Consistency | CONFLICTING | Representations expected to be compatible materially disagree |

UNSUPPORTED scope is one of `FORMAT`, `NETWORK_PROFILE`, `VENDOR_IMPLEMENTATION`, `SYSTEM_CONFIGURATION`, or `UNKNOWN`. Do not attribute a format limitation from one observed vendor output.

## Composition

In the fictional canonical example `buildingNumber=1200`, `streetName=BRICKELL AVE`, `room=STE 900` become `streetName="1200 BRICKELL AVE STE 900"`. The component relationships are:

| Source concept | Events |
| --- | --- |
| buildingNumber | PRESERVED, COLLAPSED, MISPLACED |
| streetName | PRESERVED, COLLAPSED |
| room | PRESERVED, COLLAPSED, MISPLACED |

Represent component-level evidence as well as the many-to-one group; a group label must not imply that the street-name component itself is misplaced. Preserving a substring is not sufficient evidence for semantic equivalence.

A composite address split into discrete elements can carry DERIVED + STRUCTURED; copied characters do not mean the source explicitly knew those concepts. A source country phrase becoming its agreed code may carry PRESERVED + NORMALIZED with a versioned mapping reference.

## Limits and unresolved details

Known defaults require configuration evidence. An unexplained country is UNSOURCED, not automatically DEFAULTED. A target-only addition must never vanish because there is no source match. Ambiguous matches need visible uncertainty; absence of a successful match alone is insufficient proof of LOST.

The brief mentions generated origins, but does not define a GENERATED event in v0.2. **STATUS: OPEN (O-09):** decide how generated values are represented without silently extending this taxonomy. Exact matching thresholds, confidence scale, conflict compatibility rules, and treatment of partial preservation are also open. See [provenance](provenance-model.md).
