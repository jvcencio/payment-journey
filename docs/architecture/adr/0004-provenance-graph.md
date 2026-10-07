# ADR-004 — Provenance graph

Status: ACCEPTED IN BOOTSTRAP HANDOFF

Recorded: 2026-10-07. This records an existing decision, not a newly claimed design review.

## Context

Transformations can be one-to-many, many-to-one, many-to-many, disappearance, or addition.

## Decision

Use graph-oriented lineage relationships with arrays of source and target references.

## Alternative and rationale

One sourceField property per target element.

It cannot faithfully represent the required cardinalities.

## Consequences

Retain node/edge identities and evidence references; no graph database is mandated.

## Related material

[Contract / domain detail](../../domain/provenance-model.md) · [Decision log](../../governance/decision-log.md)
