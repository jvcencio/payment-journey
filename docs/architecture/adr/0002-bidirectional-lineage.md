# ADR-002 — Bidirectional lineage and provenance

Status: ACCEPTED IN BOOTSTRAP HANDOFF

Recorded: 2026-10-07. This records an existing decision, not a newly claimed design review.

## Context

Forward comparison can expose disappearance while missing unexplained additions.

## Decision

Analyze SOURCE → TARGET fate and TARGET → ORIGIN provenance.

## Alternative and rationale

Forward-only lineage.

It cannot account for target values without source matches.

## Consequences

Require source coverage and target-origin coverage, including explicit unsourced values.

## Related material

[Contract / domain detail](../../domain/provenance-model.md) · [Decision log](../../governance/decision-log.md)
