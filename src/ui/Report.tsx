import { useState } from 'react';
import {
  resultSummary,
  eventLabels,
  fieldName,
  plainExplanation,
} from './presentation';
import { PolicyPanel } from './PolicyPanel';
import type {
  LineageEdge,
  LineageReport,
  ParseResult,
  SemanticNode,
} from '../domain/model';
function nodeLabel(n: SemanticNode) {
  return `${n.role} ${fieldName(n.semanticPath)} ${n.occurrence + 1}`;
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
          <span>{eventLabels[event.type] ?? event.type}</span>
          <small>{event.type}</small>
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
              ? 'Prepared example'
              : 'Subset parsing'}
          </dt>
          <dd>Processed</dd>
        </div>
        <div>
          <dt>Interpreted fields</dt>
          <dd>{parsed.coverage.materialElements}</dd>
        </div>
        <div>
          <dt>Fields outside current analysis scope</dt>
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
          {label} fields outside current analysis scope (
          {parsed.unmapped.length})
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
        <summary>{label} original message / record</summary>
        <p className="hash">SHA-256: {parsed.artifact.payloadHash}</p>
        <pre>{parsed.artifact.rawPayload}</pre>
      </details>
    </section>
  );
}
export function Report({
  report,
  profile,
  setProfile,
  scope,
  setScope,
  scopeNote,
}: {
  report: LineageReport;
  profile: string;
  setProfile: (value: string) => void;
  scope: string;
  setScope: (value: string) => void;
  scopeNote?: string | undefined;
}) {
  const summary = resultSummary(report);
  const policyProps = {
    report,
    profile,
    setProfile,
    scope,
    setScope,
    scopeNote,
  };
  function inspect(id: string) {
    setSelected(report.graph.lineageEdges.find((e) => e.edgeId === id));
    const details = document.getElementById(
      'field-lineage',
    ) as HTMLDetailsElement | null;
    if (details) details.open = true;
    document.getElementById('selected-evidence')?.focus();
  }
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
      <section className="result-answer" aria-label="Comparison result">
        <p className="eyebrow">02 / ANSWER</p>
        <h2>{summary.title}</h2>
        {summary.changes.length > 0 && (
          <ul>
            {summary.changes.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        )}
        {!summary.changes.length && (
          <p>
            This conclusion covers interpreted fields only. Review coverage and
            selected guidance before drawing broader conclusions.
          </p>
        )}
      </section>
      <section className="scope-note" aria-label="Scope and coverage">
        <strong>
          Current alpha scope: Debtor and Creditor postal addresses.
        </strong>
        <p>
          Depending on the message and payment profile, address requirements may
          also apply to other parties and agents in the payment chain. Ultimate
          parties, initiating parties, and agent/intermediary addresses are not
          yet evaluated here.
        </p>
        <div aria-label="Coverage" className="coverage-summary">
          <span>
            <strong>{source.length + target.length}</strong> interpreted fields
            ({source.length} source / {target.length} target)
          </span>
          <span>
            <strong>
              {report.source.unmapped.length + report.target.unmapped.length}
            </strong>{' '}
            fields outside current analysis scope
          </span>
          <span>
            <strong>{report.graph.unresolved.length}</strong> unresolved
            relationships
          </span>
        </div>
        <p className="small">
          Interpreted fields are understood by this analysis; fields outside
          current analysis scope are retained but not evaluated. Unresolved
          relationships count interpreted fields whose source/target connection
          remains uncertain. Zero unresolved relationships does not mean every
          message field or party was evaluated.
        </p>
        <p aria-label="Material accounting">
          {report.graph.unresolved.length
            ? 'Incomplete material accounting: some relationships remain unresolved.'
            : 'All interpreted material elements accounted for.'}{' '}
          Accounted for does not mean faithfully preserved or accepted by
          guidance.
        </p>
      </section>
      <PolicyPanel {...policyProps} onInspect={inspect} />
      <section aria-label="What changed">
        <p className="eyebrow">04 / WHAT CHANGED</p>
        <h2>Follow the fields through the conversion.</h2>
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
              <p className="eyebrow">
                INFORMATION SURVIVED. STRUCTURE CHANGED.
              </p>
              <h3>
                {new Set(edges.flatMap((e) => e.sourceElementIds)).size} known
                fields share one target value.
              </h3>
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
                        onClick={() => inspect(edge.edgeId)}
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
      </section>
      <details id="field-lineage">
        <summary>
          Field-level lineage — compare values and inspect changes
        </summary>
        <div className="report-grid">
          <section aria-label="Field comparison">
            {(['DEBTOR', 'CREDITOR'] as const).map((role) => (
              <section className="party" key={role}>
                <h3>{role === 'DEBTOR' ? 'Debtor' : 'Creditor'}</h3>
                {![...source, ...target].some((n) => n.role === role) && (
                  <p>
                    {role === 'DEBTOR' ? 'Debtor' : 'Creditor'}{' '}
                    {report.demonstration
                      ? 'not included in this example'
                      : 'not identified within current parser scope; presence is not established'}
                  </p>
                )}
                {[...source, ...target].some((n) => n.role === role) && (
                  <>
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
                                <div
                                  className="canonical-value"
                                  key={n.elementId}
                                >
                                  <dt>{label(n)}</dt>
                                  <dd>{n.value}</dd>
                                </div>
                              ),
                            )}
                          </dl>
                          {items.some((n) => n.role === role) &&
                            !items.some(
                              (n) =>
                                n.role === role &&
                                n.semanticPath.startsWith('address.'),
                            ) && (
                              <p>
                                Party present, but no address was interpreted.
                                This is distinct from confirmed loss.
                              </p>
                            )}
                          {!items.some((n) => n.role === role) && (
                            <p>
                              No interpreted fields on this side. This alone
                              does not establish information loss; inspect the
                              lineage result.
                            </p>
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
                            onClick={() => inspect(edge.edgeId)}
                          >
                            <span>{label(anchor(edge))}</span>
                            <Events edge={edge} />
                            <span aria-hidden="true">↗</span>
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </section>
            ))}
          </section>
          <aside
            id="selected-evidence"
            tabIndex={-1}
            className="evidence"
            aria-label="Selected observation evidence"
          >
            <p className="eyebrow">FIELD EVIDENCE</p>
            <h2>Follow the evidence</h2>
            {selected ? (
              <>
                <p className="small">
                  Lineage observation · not a policy finding
                </p>
                <Events edge={selected} />
                <p>
                  {anchor(selected).role} ·{' '}
                  {fieldName(anchor(selected).semanticPath)} · occurrence{' '}
                  {anchor(selected).occurrence + 1}
                </p>
                <p>{plainExplanation(selected.explanation ?? '')}</p>
                <p>
                  Confidence: <strong>{selected.confidence}</strong>
                </p>
                <details className="technical-evidence">
                  <summary>Show technical evidence and locators</summary>
                  {selected.relationshipGroupId && (
                    <details>
                      <summary>
                        Relationship group ·{' '}
                        {
                          report.graph.lineageEdges.filter(
                            (e) =>
                              e.relationshipGroupId ===
                              selected.relationshipGroupId,
                          ).length
                        }{' '}
                        linked fields
                      </summary>
                      <code>{selected.relationshipGroupId}</code>
                      <p className="small">
                        Each component keeps its own events; the shared target
                        is counted once in material coverage.
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
                        Decoded source value offsets{' '}
                        {selected.missingPortion.start}–
                        {selected.missingPortion.end} (UTF-16, end-exclusive).
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
                </details>
                <p className="small">
                  Locators refer to unchanged evidence artifacts. Canonical
                  witnesses and their context are fictional test evidence, not a
                  claim about network validity.
                </p>
              </>
            ) : (
              <p>
                No verified lineage observation. Review unresolved elements.
              </p>
            )}
          </aside>
        </div>
        {report.graph.unresolved.length > 0 && (
          <section className="unresolved" aria-label="Unresolved relationships">
            <h2>Unresolved relationships</h2>
            <p>
              These interpreted fields need a supported source/target
              connection. They are distinct from fields outside current analysis
              scope.
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
                    <details>
                      <summary>Technical uncertainty evidence</summary>
                      <code>{n.sourceLocator.path}</code>
                      <p>{u.reason}</p>
                    </details>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </details>
      <PolicyPanel {...policyProps} detailOnly onInspect={inspect} />
      <details>
        <summary>
          Technical proof — parser coverage and original evidence
        </summary>
        <section aria-labelledby="coverage-title">
          <p className="eyebrow">TECHNICAL PROOF</p>
          <h2 id="coverage-title">Inspect parsing coverage.</h2>
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
      </details>
    </div>
  );
}
