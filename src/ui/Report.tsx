import { useState } from 'react';
import { PolicyPanel } from './PolicyPanel';
import type {
  LineageEdge,
  LineageReport,
  ParseResult,
  SemanticNode,
} from '../domain/model';
function nodeLabel(n: SemanticNode) {
  return `${n.role} ${n.semanticPath} ${n.occurrence + 1}`;
}
function label(n: SemanticNode) {
  const names: Record<string, string> = {
    name: 'Name',
    'address.addressLines': 'Address line',
    'address.country': 'Country',
    'address.townName': 'Town',
    'address.buildingNumber': 'Building number',
    'address.streetName': 'Street name',
    'address.room': 'Room',
  };
  return `${names[n.semanticPath] ?? n.semanticPath}${n.semanticPath === 'address.addressLines' ? ` ${n.occurrence + 1}` : ''}`;
}
function ordered(nodes: SemanticNode[]) {
  const order = [
    'name',
    'address.buildingNumber',
    'address.streetName',
    'address.room',
    'address.addressLines',
    'address.townName',
    'address.country',
  ];
  return [...nodes].sort(
    (a, b) =>
      order.indexOf(a.semanticPath) - order.indexOf(b.semanticPath) ||
      a.occurrence - b.occurrence,
  );
}
function Events({ edge }: { edge: LineageEdge }) {
  return (
    <span className="events">
      {edge.taxonomyEvents.map((event, i) => (
        <span key={i} className="event" data-event={event.type}>
          {event.type}
        </span>
      ))}
    </span>
  );
}
function CoveragePanel({
  label,
  parsed,
}: {
  label: string;
  parsed: Extract<ParseResult, { ok: true }>;
}) {
  return (
    <section className="coverage-card" aria-label={`${label} coverage`}>
      <h3>{label} coverage</h3>
      <dl className="facts">
        <div>
          <dt>
            {parsed.artifact.formatFamily === 'CANONICAL_TEST'
              ? 'Canonical witness'
              : 'Subset parsing'}
          </dt>
          <dd>Processed</dd>
        </div>
        <div>
          <dt>Material elements</dt>
          <dd>{parsed.coverage.materialElements}</dd>
        </div>
        <div>
          <dt>Uninterpreted evidence</dt>
          <dd>{parsed.unmapped.length} items</dd>
        </div>
        <div>
          <dt>XSD / network validation</dt>
          <dd>Not performed</dd>
        </div>
      </dl>
      <p>{parsed.coverage.semanticScope}</p>
      {parsed.warnings.map((warning, i) => (
        <p className="notice" key={i}>
          {warning.code}: {warning.message}
        </p>
      ))}
      <details>
        <summary>
          {label} unmapped evidence ({parsed.unmapped.length})
        </summary>
        <ul className="unmapped">
          {parsed.unmapped.map((item, i) => (
            <li key={i}>
              <code>{item.locator.path}</code>
              <p>{item.reason}</p>
              <pre>{item.rawValue}</pre>
            </li>
          ))}
        </ul>
      </details>
      <details>
        <summary>{label} original artifact</summary>
        <p className="hash">SHA-256: {parsed.artifact.payloadHash}</p>
        <pre>{parsed.artifact.rawPayload}</pre>
      </details>
    </section>
  );
}
export function Report({ report }: { report: LineageReport }) {
  const [selected, setSelected] = useState<LineageEdge | undefined>(
    report.graph.lineageEdges.find((e) =>
      e.taxonomyEvents.some((t) => t.type !== 'PRESERVED'),
    ) ?? report.graph.lineageEdges[0],
  );
  const nodes = new Map(
    report.graph.semanticNodes.map((n) => [n.elementId, n]),
  );
  const source = report.source.snapshot.nodes.filter((n) => n.material),
    target = report.target.snapshot.nodes.filter((n) => n.material);
  const context = report.transformation.context;
  const evidence = [
    ...report.source.snapshot.evidence,
    ...report.target.snapshot.evidence,
    ...(context?.evidence ?? []),
  ];
  const groupIds = [
    ...new Set(
      report.graph.lineageEdges.flatMap((e) =>
        e.relationshipGroupId ? [e.relationshipGroupId] : [],
      ),
    ),
  ];
  const anchor = (edge: LineageEdge) =>
    nodes.get(edge.sourceElementIds[0] ?? edge.targetElementIds[0]!)!;
  return (
    <div className="report">
      <section className="report-heading" aria-labelledby="report-title">
        <div>
          <p className="eyebrow">02 / OBSERVE</p>
          <h2 id="report-title">The payment, side by side.</h2>
          <p>
            Lineage observations explain what happened. The separate policy
            evaluation below assesses selected guidance without changing these
            facts.
          </p>
        </div>
        <div className="counts">
          <strong>{report.graph.lineageEdges.length}</strong>
          <span>lineage observations</span>
          <strong>{report.graph.unresolved.length}</strong>
          <span>unresolved elements</span>
        </div>
      </section>
      {report.demonstration && (
        <p className="canonical-notice">
          Fixture {report.demonstration.fixtureId} ·{' '}
          {report.demonstration.description}
        </p>
      )}
      <div
        className={report.graph.unresolved.length ? 'unresolved' : 'scope-note'}
        aria-label="Material accounting"
      >
        <strong>
          {report.graph.unresolved.length
            ? 'Incomplete material accounting'
            : source.length + target.length === 0
              ? 'No material data interpreted'
              : 'All interpreted material elements accounted for'}
        </strong>
        <p>
          {source.length} source / {target.length} target material elements.
          Accounted for does not mean faithfully preserved or accepted by a
          policy.
        </p>
      </div>
      {groupIds.map((groupId) => {
        const edges = report.graph.lineageEdges.filter(
          (e) => e.relationshipGroupId === groupId,
        );
        const t = nodes.get(edges[0]!.targetElementIds[0]!)!;
        return (
          <section
            className="group-demo"
            aria-label="Grouped relationship"
            key={groupId}
          >
            <p className="eyebrow">INFORMATION SURVIVED. STRUCTURE CHANGED.</p>
            <h2>Three known concepts. One target value.</h2>
            <div className="group-columns">
              <div>
                {edges.map((edge) => {
                  const s = anchor(edge);
                  return (
                    <button
                      type="button"
                      className="group-component"
                      key={edge.edgeId}
                      aria-label={`Inspect grouped ${nodeLabel(s)}`}
                      aria-pressed={selected?.edgeId === edge.edgeId}
                      onClick={() => setSelected(edge)}
                    >
                      <span className="small">{label(s)}</span>
                      <strong>{s.value}</strong>
                      <Events edge={edge} />
                    </button>
                  );
                })}
              </div>
              <div className="group-target">
                <span aria-hidden="true">→</span>
                <h3>{label(t)}</h3>
                <p>{t.value}</p>
                <p className="small">
                  One target occurrence, shared by {edges.length} individually
                  inspectable relationships. Event labels apply to each source
                  concept.
                </p>
              </div>
            </div>
          </section>
        );
      })}
      <div className="report-grid">
        <section aria-label="Canonical comparison">
          {(['DEBTOR', 'CREDITOR'] as const).map((role) => (
            <section className="party" key={role}>
              <h3>{role === 'DEBTOR' ? 'Debtor' : 'Creditor'}</h3>
              <div className="canonical-pair">
                {(
                  [
                    ['Source', source],
                    ['Target', target],
                  ] as const
                ).map(([title, items]) => (
                  <div key={title}>
                    <h4>{title}</h4>
                    <dl>
                      {ordered(items.filter((n) => n.role === role)).map(
                        (n) => (
                          <div className="canonical-value" key={n.elementId}>
                            <dt>{label(n)}</dt>
                            <dd>{n.value}</dd>
                          </div>
                        ),
                      )}
                    </dl>
                    {!items.some((n) => n.role === role) && (
                      <p>No material elements interpreted.</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="observations">
                {report.graph.lineageEdges
                  .filter((e) => anchor(e).role === role)
                  .map((edge) => (
                    <button
                      type="button"
                      className="observation"
                      key={edge.edgeId}
                      aria-label={`Inspect ${nodeLabel(anchor(edge))}`}
                      aria-pressed={selected?.edgeId === edge.edgeId}
                      onClick={() => setSelected(edge)}
                    >
                      <span>{label(anchor(edge))}</span>
                      <Events edge={edge} />
                      <span aria-hidden="true">↗</span>
                    </button>
                  ))}
              </div>
            </section>
          ))}
        </section>
        <aside
          id="selected-evidence"
          tabIndex={-1}
          className="evidence"
          aria-label="Selected observation evidence"
        >
          <p className="eyebrow">03 / TRACE</p>
          <h2>Follow the evidence</h2>
          {selected ? (
            <>
              <p className="small">
                Lineage observation · not a policy finding
              </p>
              <Events edge={selected} />
              <p>
                {anchor(selected).role} · {anchor(selected).semanticPath} ·
                occurrence {anchor(selected).occurrence + 1}
              </p>
              <p>{selected.explanation}</p>
              <p>
                Confidence: <strong>{selected.confidence}</strong>
              </p>
              {selected.relationshipGroupId && (
                <details open>
                  <summary>
                    Relationship group ·{' '}
                    {
                      report.graph.lineageEdges.filter(
                        (e) =>
                          e.relationshipGroupId ===
                          selected.relationshipGroupId,
                      ).length
                    }{' '}
                    component edges
                  </summary>
                  <code>{selected.relationshipGroupId}</code>
                  <p className="small">
                    Each component keeps its own events; the shared target is
                    counted once in material coverage.
                  </p>
                </details>
              )}
              {(
                [
                  ['Source', selected.sourceElementIds],
                  ['Target', selected.targetElementIds],
                ] as const
              ).map(([side, ids]) => (
                <section key={side}>
                  <h3>{side} evidence</h3>
                  {ids.length === 0 ? (
                    <p className="absent">
                      {side === 'Target'
                        ? 'No supported target representation was found.'
                        : 'No supported provenance was identified.'}
                    </p>
                  ) : (
                    ids.map((id) => {
                      const n = nodes.get(id)!;
                      return (
                        <dl key={id}>
                          <dt>Semantic concept</dt>
                          <dd>{label(n)}</dd>
                          <dt>Value</dt>
                          <dd>{n.value}</dd>
                          <dt>Locator</dt>
                          <dd>
                            <code>{n.sourceLocator.path}</code>
                          </dd>
                          <dt>Location</dt>
                          <dd>
                            Line {n.sourceLocator.line}, column{' '}
                            {n.sourceLocator.column} · offsets{' '}
                            {n.sourceLocator.start}–{n.sourceLocator.end}
                          </dd>
                          <dt>Original representation</dt>
                          <dd>
                            <pre>{n.rawValue}</pre>
                          </dd>
                        </dl>
                      );
                    })
                  )}
                </section>
              ))}
              {selected.missingPortion && (
                <section aria-label="Missing source portion">
                  <h3>Portion that did not survive</h3>
                  <pre>
                    <mark>{selected.missingPortion.text}</mark>
                  </pre>
                  <p>
                    Decoded source value offsets {selected.missingPortion.start}
                    –{selected.missingPortion.end} (UTF-16, end-exclusive).
                  </p>
                </section>
              )}
              <details>
                <summary>
                  All observation evidence ({selected.evidenceRefs.length})
                </summary>
                {selected.evidenceRefs.map((id) => {
                  const e = evidence.find((e) => e.evidenceId === id);
                  return (
                    <div key={id}>
                      <p className="small">
                        {e?.kind ?? 'UNRESOLVED EVIDENCE REFERENCE'}
                      </p>
                      <code>{e?.locator.path ?? id}</code>
                      <pre>
                        {e?.rawValue ??
                          'Evidence reference could not be resolved.'}
                      </pre>
                    </div>
                  );
                })}
              </details>
              <p className="small">
                Locators refer to unchanged evidence artifacts. Canonical
                witnesses and their context are fictional test evidence, not a
                claim about network validity.
              </p>
            </>
          ) : (
            <p>No verified lineage observation. Review unresolved elements.</p>
          )}
        </aside>
      </div>
      {report.graph.unresolved.length > 0 && (
        <section className="unresolved" aria-label="Unresolved accounting">
          <h2>Unresolved accounting</h2>
          <p>
            This is an incomplete fidelity assessment. Unknown evidence is not
            forced into a taxonomy event.
          </p>
          <ul>
            {report.graph.unresolved.map((u) => {
              const n = nodes.get(u.elementId)!;
              return (
                <li key={u.elementId}>
                  <strong>
                    {u.side} · {nodeLabel(n)}
                  </strong>
                  <p>{n.value}</p>
                  <code>{n.sourceLocator.path}</code>
                  <p>{u.reason}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      <PolicyPanel
        report={report}
        onInspect={(id) => {
          setSelected(report.graph.lineageEdges.find((e) => e.edgeId === id));
          document.getElementById('selected-evidence')?.focus();
        }}
      />
      <section aria-labelledby="coverage-title">
        <p className="eyebrow">04 / UNDERSTAND THE LIMITS</p>
        <h2 id="coverage-title">Coverage stays visible.</h2>
        <div className="coverage-grid">
          <CoveragePanel label="Source" parsed={report.source} />
          <CoveragePanel label="Target" parsed={report.target} />
        </div>
        {context && (
          <details>
            <summary>Declared fixture coverage and origin context</summary>
            <p>
              Source: {context.sourceComplete ? 'complete' : 'incomplete'} ·
              Target: {context.targetComplete ? 'complete' : 'incomplete'} ·
              Origin evidence:{' '}
              {context.originComplete ? 'complete' : 'incomplete'}. These
              statements apply only to the bundled canonical witness scope.
            </p>
            {context.artifacts.map((a) => (
              <pre key={a.artifactId}>{a.rawPayload}</pre>
            ))}
          </details>
        )}
      </section>
    </div>
  );
}
