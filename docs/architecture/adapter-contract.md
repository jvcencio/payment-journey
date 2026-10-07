# Adapter contract

```text
parse(artifact)
  → CanonicalSnapshot
    ParseEvidence
    UnmappedElements[]
    ParseWarnings[]
```

The artifact remains preserved with its metadata and raw payload reference. Every parsed element carries `artifactId`, `sourceLocator`, `rawValue`, `semanticPath`, `normalizedValue`, `interpretationMethod`, and `interpretationConfidence`.

Unknown content must remain locatable and visible, including nested XML elements and unsupported MT field options. Do not drop data simply because no canonical field exists. Parse warnings distinguish ambiguous interpretation from malformed input and unsupported coverage.

## Responsibilities

Interpret supported syntax into semantics, retain ordered repeated values, preserve literal evidence, and disclose normalization or inference. Return useful diagnostic codes and locations. Namespace and version handling must be explicit. Never rely on an unqualified local XML tag name across unsupported namespaces.

Adapters must not determine policy severity, regulatory compliance, or translation output. They must not silently normalize ambiguity, infer missing values, discard unknown fields, or equate schema validity with semantic integrity.

## Error and coverage contract — details OPEN

Reject unsafe or malformed payloads with locatable diagnostics. Explicitly distinguish full supported parsing, partial interpretation, unsupported version/profile, and failed parsing. Do not report EMPTY address when parsing actually failed. Validation coverage must identify whether any schema/profile test ran; extraction alone is not schema validation.

Exact MT options, pacs.008 versions, XML library, limits, and result serialization require resolution before the first adapter. See [open questions](../governance/open-questions.md) and [security requirements](../../SECURITY.md).
