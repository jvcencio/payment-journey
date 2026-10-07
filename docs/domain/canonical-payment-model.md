# Canonical payment model v0.1

A payment is distinct from a message. No artifact family is the canonical truth. A snapshot is a versioned interpretation of preserved evidence, not a replacement for that evidence.

| Concept | Responsibility |
| --- | --- |
| PaymentJourney | Groups artifacts and transformations concerning a payment journey |
| Artifact | Original representation and capture/parser metadata |
| Transformation | Relates journey stages and records known transformation context |
| CanonicalPaymentSnapshot | Interpretation of one artifact; contains transaction and evidence references |
| PaymentTransaction | Transaction boundary; holds semantic domains and participant/account references |
| PaymentIdentifiers | Typed identifiers with source evidence; not assumed globally unique |
| Participants[] | Role, PARTY/AGENT kind, identity, identifiers, postalAddress, accountRefs |
| Accounts[] | Referenced accounts, preserving original values and evidence |
| Amounts, PaymentType, Dates, Settlement, Charges | Future domain accommodation |
| Purpose, RemittanceInformation, RegulatoryInformation, Extensions | Future domain accommodation and visible uninterpreted content |
| ProvenanceGraph | Semantic nodes and lineage edges |
| EvidenceReferences[] | Locatable references to artifacts, interpretation, configuration, or external evidence |

Only debtor/creditor names, useful account references, and postal addresses receive deep MVP treatment. A placeholder is not a support claim. Preserve unimplemented domains through original artifacts and visible unmapped elements rather than inventing typed meaning.

## Artifact metadata

Support `artifactId`, `formatFamily`, `messageType`, `messageVersion`, `profile`, `sourceSystem`, `direction`, `rawPayloadReference`, `payloadHash`, `capturedAt`, and `parserVersion`. Unknown metadata must remain unknown, not silently defaulted. Preserve raw payload bytes or an exact recoverable representation; record hash algorithm and encoding with the hash. Storage and hash algorithm selection are **STATUS: OPEN**.

## Snapshot requirements

Every interpreted semantic value links to an artifact and transaction, semantic path, original locator/value, interpretation method and confidence. Repeated values need distinct identities; array position alone must not imply correspondence between artifacts. Absence, empty content, parse failure, and unsupported content must be distinguishable.

Snapshot schema version, parser version, interpretation configuration, and artifact identity must be retained for reproducibility. Exact serialization and identifier construction are proposals to resolve before implementation. Matching two supplied artifacts to the same transaction remains **STATUS: OPEN (O-04)**; never infer pairing solely from similar party names.

See [participants](participant-model.md), [addresses](postal-address-model.md), and [provenance](provenance-model.md).
