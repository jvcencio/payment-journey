# Synthetic fixtures

This directory is reserved for fictional, synthetic test assets. No raw MT103/pacs.008 fixtures have been implemented yet.

The [fixture specification](../docs/quality/synthetic-fixtures.md) defines mandatory A–J scenarios and additional normalization/negative cases. It distinguishes raw-pair integration tests from canonical-engine tests so structured canonical inputs are never presented as invented MT103 fields.

Every future fixture must state that it is fictional, use no real identifiers or payment data, identify supported message versions, and carry independently reviewed expected evidence and events. See the proposed manifest in the specification. Do not copy or anonymize production messages.
