# MVP v0.1 — frozen scope

STATUS: Full MVP defined in handoff; preservation and fidelity-degradation slices implemented under the [accepted gate](../architecture/implementation-gate.md) and [second-slice boundary](../architecture/second-slice-boundary.md). The [first public address-quality pack](../policy/public-address-quality-v0.1.md) is implemented; remaining taxonomy classifiers and broader policy profiles remain pending.

## User flow

1. Supply a supported synthetic MT103 and pacs.008 representing the same payment.
2. Preserve both artifacts and parse them into canonical snapshots with evidence.
3. Identify debtor and creditor and expose name, useful account reference, and postal-address information.
4. Build lineage in both directions: source fate and target origin.
5. Classify observed transformations with composable taxonomy events.
6. Apply a small, publicly supportable, versioned baseline ruleset separately.
7. Inspect side-by-side findings, source locators, confidence, rule citations, and visible unmapped or unexplained information.

## Deep coverage

Debtor and creditor postal addresses are the principal fidelity domain. Names and account references support the comparison. Other domains remain architectural accommodations, not implemented analysis. The role model remains extensible even though the initial UI exposes only these two roles.

## UX requirements

Show source and target with clear role labels. Each finding must answer: what happened; where the value came from; what was lost; what became less structured; what was inferred; and which rule informs the judgment. Expose facts and policy results separately. Do not hide warnings behind a summary score. Keyboard access, readable focus states, text event labels, and usable error messages belong in the MVP.

## Original coverage decisions and adopted refinements

The [accepted gate](../architecture/implementation-gate.md) resolves MT Option-F subset, pacs.008.001.14, explicit pairing, single-transaction rejection behavior, confidence and materiality. The [parser contract](../architecture/parser-contract.md) records concrete limits and evidence semantics. The first policy rule set remains open. Do not label all MT103 or all pacs.008 messages “supported.” Failed or incomplete parsing cannot produce an unqualified integrity result.

The structured-source collapse example is a canonical-engine requirement. Raw MT cannot be assumed to expose every canonical address component. The [fixture specification](../quality/synthetic-fixtures.md) separates raw-pair tests from canonical tests.

The MVP is complete only when the [acceptance criteria](../quality/acceptance-criteria.md) pass. See [non-goals](non-goals.md).
