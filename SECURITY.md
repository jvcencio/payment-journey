# Security

No runnable application or supported release exists at this bootstrap stage. Security support versions, a private disclosure route, and response commitments are **STATUS: OPEN** (O-10). No response SLA is promised. A public repository URL and private reporting configuration have not been established.

Do not post sensitive payloads, secrets, or exploit details in public issues. Once a verified private route is published here, use it with a minimal synthetic reproduction, affected version, expected behavior, and observed impact.

## Implementation requirements

- Treat every payload and imported rule pack as untrusted input.
- Reject external entity resolution and external resource fetching in XML; test DTD/entity expansion, excessive depth, oversized values, malformed namespaces, and resource exhaustion.
- Establish explicit size, depth, and execution limits before accepting uploads.
- Render payload text safely; never interpret message content as HTML or executable code.
- Keep raw payment content and identifiers out of logs. Use diagnostic codes and opaque references.
- Review dependency licenses and vulnerabilities, pin selected versions, and commit a lockfile.
- Never commit credentials or use real bank data, even for tests.

These are requirements, not claims about controls already implemented. Hosting, retention, telemetry, and parser selection remain open; see [technical proposal](docs/architecture/technical-stack-proposal.md).
