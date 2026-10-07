# Participant model

Participant identity and role are separate concepts. A participant association carries `role`, `kind: PARTY | AGENT`, `identity`, `identifiers`, `postalAddress`, and `accountRefs`. The same identity can occur in multiple roles; shared names alone do not prove shared identity.

Initial vocabulary accommodates INITIATING_PARTY, ULTIMATE_DEBTOR, DEBTOR, DEBTOR_AGENT, CREDITOR_AGENT, CREDITOR, and ULTIMATE_CREDITOR. This is not a closed list.

Future roles may include INSTRUCTING_AGENT, INSTRUCTED_AGENT, INTERMEDIARY_AGENT_1/2/3, PREVIOUS_INSTRUCTING_AGENT_1/2/3, REIMBURSEMENT_AGENT, and CHARGES_AGENT. Adding a role should not require a new hard-coded object throughout the engine.

MVP UI and deep analysis cover **DEBTOR and CREDITOR only**. Account references are distinct from identity and retain their evidence. Preserve unresolved associations explicitly instead of merging participants by a guessed identity.

**STATUS: OPEN:** role-extension naming, identifier schemes, matching constraints, and unknown-role handling in serialized snapshots. The accepted principle is in [ADR-005](../architecture/adr/0005-participant-role-model.md).
