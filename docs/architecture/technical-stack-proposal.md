# Technical stack proposal

**STATUS: OPEN — recommendation for review, not an adopted stack.** No dependencies are installed and no application scaffold exists.

## Recommendation

Use a strict TypeScript domain/analysis library with a React + Vite browser UI, initially processing synthetic inputs locally. Use ordinary immutable data structures for the provenance graph. Avoid a database or separately deployed service until persistence or parser needs justify it.

TypeScript provides static checks, not runtime input validation; its types are erased ([official documentation](https://www.typescriptlang.org/docs/handbook/2/basic-types), S-06). Validate artifacts, serialized snapshots, configuration, and rule metadata at boundaries. The runtime validation library remains undecided.

Vite supports static build output ([deployment documentation](https://vite.dev/guide/static-deploy.html), S-07). A static UI is a candidate deployment shape, not an approved host or privacy guarantee. Browser memory, worker limits, and parser capability need a spike before this recommendation is accepted.

| Area | Proposed choice | Benefit | Cost / decision gate |
| --- | --- | --- | --- |
| Domain and engines | Strict TypeScript; pure deterministic functions | One model shared with UI; inspectable types | Runtime checks still required; exact schema and serialization open |
| UI | React + Vite, semantic HTML and modest CSS | Component-based evidence inspection; static distribution candidate | UI dependency/tooling footprint; validate keyboard and screen-reader behavior |
| XML parsing | Namespace-aware library selected by security spike | Explicit support boundaries and locators | No library approved; DTD/entity/resource limits and raw fidelity must be tested |
| MT parsing | Narrow, documented supported subset or reviewed library adapter | Controls MVP scope | Handwritten parsing risks omissions; ecosystem reuse may require another runtime |
| Graph | Typed node/edge collections | All required cardinalities without infrastructure | Need stable IDs and referential-integrity checks |
| Tests | Vitest unit/fixture tests; Playwright browser tests | Pure-engine checks and actual interaction coverage | Pin compatible versions after selection; no current test suite |
| Hygiene | ESLint, Prettier, lockfile, dependency/security review | Repeatable development checks | Configuration and dependency maintenance |
| CI | GitHub Actions if hosted on GitHub | One repeatable review gate | Host not configured; review action permissions and pinned revisions |
| Persistence | None initially; preserved artifact references during an evaluation | Reduces service/storage scope | Saved evaluations still need reproducible evidence packaging; export/retention design open |

Tool names beyond S-06/S-07 are proposed choices, not verified claims about current versions. Select supported runtime and package versions together, review licenses/advisories, and commit the resulting lockfile. No “latest” runtime is prescribed.

## Alternatives

**Java core with a TypeScript UI.** Worth a spike if reuse of established MT/ISO parsing becomes decisive. Prowide's public projects document MT and ISO message models/parsers (S-04/S-05). Such reuse still needs adapter evidence, unknown-content preservation, security review, and license review. A JVM service would add deployment and cross-language schema work; parser models alone do not establish semantic lineage.

**Python core with a web UI.** A reasonable alternative for fixture-oriented analysis and rapid domain experiments. It would require a separate interface/schema discipline between engine and UI and an explicit runtime/deployment choice. No benchmark or library comparison has yet established superiority.

**Full-stack service and database from the start.** Could support persistence and controlled parser resources, but adds operating and retention responsibilities before the pairwise thesis is proven. This remains an option if browser constraints fail the spike, not a rejected future architecture.

## Proposed source boundaries

```text
src/
  domain/               # canonical concepts, evidence, taxonomy
  artifacts/            # raw evidence capture and metadata
  adapters/
    mt103/              # supported fields → semantics + evidence
    pacs008/            # supported namespace/version → semantics + evidence
  lineage/              # correspondence, source fate, target origin
  policy/               # applicability and evaluation; no lineage mutation
  rule-packs/public/    # reviewed project/public rules only
  reporting/            # report model and reproducibility manifest
  ui/                   # pair input, role comparison, finding/evidence views
  application/          # orchestration and error/coverage handling
```

Domain has no UI, parser, or policy dependency. Adapters and lineage depend on domain; policy consumes factual output. Application orchestrates them; UI consumes the report. Exact package boundaries remain open—do not split into services merely to match this diagram.

## Acceptance gate for the proposal

Demonstrate literal evidence recovery, safe bounded parsing, deterministic fixture output, meaningful unknown coverage, and inspectable browser performance using the chosen subset. If the spike cannot meet these needs, revisit the runtime before implementing the UI. See [implementation plan](implementation-plan.md) and O-02/O-03/O-05/O-06/O-08 in the [open register](../governance/open-questions.md).
