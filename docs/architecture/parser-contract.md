# First-slice parser and evidence contract

Implementation details under the accepted gate, version 0.1.0. These limits are project resource limits, not ISO/MT/network requirements.

## Inputs and limits

Each input is at most 262,144 UTF-8 bytes (also prechecked for string length). XML is limited to 64 nested elements, 10,000 elements, 10,000 attributes, and 65,536 decoded characters per element/attribute value. MT fields and continuation lines are bounded at 1,000 each; total bytes are still bounded. Browser evaluation runs in a dedicated worker with cancellation and a five-second termination deadline. No parser performs network I/O.

The MT input is deliberately block-4-only `{4:` followed by field lines and a `-}` terminator. No FIN header/trailer validation is claimed. LF/CRLF are accepted. 50F/59F identify debtor/creditor; first-line `/account`, `1/name`, ordered `2/address`, and one `3/CC[/town]` are interpreted. Other lines/fields stay visible. Repeated country/town continuations or repeated role fields are explicitly unsupported. Country-code membership is not validated. No component inference, case conversion, trimming, fuzzy matching, or address normalization is performed.

The XML root must be Document in exactly `urn:iso:std:iso:20022:tech:xsd:pacs.008.001.14`; namespace prefixes are arbitrary. One direct FIToFICstmrCdtTrf and exactly one direct CdtTrfTxInf are supported. Direct Dbtr/Cdtr Nm, PstlAdr Ctry/TwnNm/AdrLine, and account Id/IBAN or Id/Othr/Id are interpreted. Other address components remain visible as unmapped content in this preservation-only slice. Empty values are retained as uninterpreted evidence, not fabricated semantic values. Duplicate scalar/party elements and complex values in scalar locations are diagnosed. Foreign-namespace lookalikes are not interpreted.

## Evidence

Raw strings remain unchanged; SHA-256 hashes use their UTF-8 encoding. Capture IDs include side and payload hash. Node IDs also include transaction, role occurrence, concept and occurrence index. XML locators identify whole elements; MT locators identify exact value spans. Start/end are zero-based UTF-16 string offsets, end-exclusive; lines/columns are one-based, with columns measured in UTF-16 code units. Raw XML entity spelling remains in rawValue; decoded value is the explicit XML value. XML whitespace is not silently trimmed. XML comments, processing instructions and uninterpreted attributes are visible; namespace bindings remain in the original artifact and define parsing context.

Country-only content counts as STRUCTURED representation metadata; this is not a profile judgment. Ordered address lines plus country/town are HYBRID. Parser success means only the documented syntactic/semantic subset was processed. Full XSD/MT/network validation is never claimed.

## saxes safety spike

saxes 6.0.0 is namespace-aware and exposes UTF-16 stream positions. Verified source spans include CRLF, prefixes, Unicode, entities, and self-closing elements. DOCTYPE is rejected before parsing, with a parser-event rejection as defense in depth. The precheck conservatively rejects the literal DOCTYPE marker even inside comments. Custom entities are never registered; external resources and schema locations are never resolved. Undefined entities, malformed tags and undeclared prefixes fail explicitly. Browser isolation/timeout and inert rendering are tested separately from pure-parser limits.

`tests/adapters/pacs008.test.ts` exercises valid evidence, wrong namespaces/versions, multiple transactions, duplicates, malformed XML, DTD/entity attacks, oversized/deep/high-count input and prohibited network resolution. These results justify retaining saxes; no parser replacement or canonical-model amendment is needed.
