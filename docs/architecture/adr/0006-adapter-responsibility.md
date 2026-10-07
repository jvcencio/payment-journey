# ADR-006 — Adapters interpret; they do not judge

Status: ACCEPTED IN BOOTSTRAP HANDOFF

Recorded: 2026-10-07. This records an existing decision, not a newly claimed design review.

## Context

Parsing facts and policy judgments have different responsibilities and versioning needs.

## Decision

Adapters produce canonical semantics and parsing evidence; evaluate policy later.

## Alternative and rationale

Policy judgments embedded in adapters (comparison documented here; no prior alternatives study supplied).

It would conflate interpretation with acceptability under a selected regime.

## Consequences

Adapters expose ambiguity and unmapped elements without policy severity or compliance claims.

## Related material

[Contract / domain detail](../adapter-contract.md) · [Decision log](../../governance/decision-log.md)
