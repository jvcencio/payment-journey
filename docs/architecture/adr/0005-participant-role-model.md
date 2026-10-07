# ADR-005 — Identity separate from role

Status: ACCEPTED IN BOOTSTRAP HANDOFF

Recorded: 2026-10-07. This records an existing decision, not a newly claimed design review.

## Context

The domain must accommodate different party and agent roles without seven hard-coded objects.

## Decision

Separate participant identity from participant role and support future roles.

## Alternative and rationale

A model limited to fixed role-specific objects (comparison documented here; no prior alternatives study supplied).

It would couple identity and role and force redesign for additional participants.

## Consequences

Deep MVP support remains debtor and creditor; role extensibility does not expand the UI scope.

## Related material

[Contract / domain detail](../../domain/participant-model.md) · [Decision log](../../governance/decision-log.md)
