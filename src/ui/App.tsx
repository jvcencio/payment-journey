import { useEffect, useRef, useState } from 'react';
import { BrowserEvaluator } from '../application/browser-client';
import type { EvaluationResult } from '../application/evaluate';
import type {
  LineageEdge,
  LineageReport,
  ParseResult,
  SemanticNode,
} from '../domain/model';
import sourceFixture from '../../fixtures/raw-pairs/a-clean-preservation/source.mt103?raw';
import targetFixture from '../../fixtures/raw-pairs/a-clean-preservation/target.pacs008.xml?raw';
import './styles.css';

function nodeLabel(n: SemanticNode): string {
  return `${n.role} ${n.semanticPath} ${n.occurrence + 1}`;
}
function displayLabel(n: SemanticNode): string {
  const labels: Record<string, string> = {
    name: 'Name',
    'address.addressLines': 'Address line',
    'address.country': 'Country',
    'address.townName': 'Town',
  };
  return `${labels[n.semanticPath] ?? n.semanticPath}${n.semanticPath === 'address.addressLines' ? ` ${n.occurrence + 1}` : ''}`;
}
function displayOrder(nodes: SemanticNode[]): SemanticNode[] {
  const order = [
    'name',
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
          <dt>Subset parsing</dt>
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
function Report({ report }: { report: LineageReport }) {
  const [selected, setSelected] = useState<LineageEdge | undefined>(
    report.graph.lineageEdges[0],
  );
  const nodes = new Map(
    report.graph.semanticNodes.map((n) => [n.elementId, n]),
  );
  const source = selected
    ? nodes.get(selected.sourceElementIds[0]!)
    : undefined;
  const target = selected
    ? nodes.get(selected.targetElementIds[0]!)
    : undefined;
  const sourceMaterial = report.source.snapshot.nodes.filter((n) => n.material);
  const targetMaterial = report.target.snapshot.nodes.filter((n) => n.material);
  return (
    <div className="report">
      <section className="report-heading" aria-labelledby="report-title">
        <div>
          <p className="eyebrow">02 / OBSERVE</p>
          <h2 id="report-title">The payment, side by side.</h2>
          <p>
            Lineage observations describe what the comparison establishes.
            Policy is not evaluated.
          </p>
        </div>
        <div className="counts">
          <strong>{report.graph.lineageEdges.length}</strong>
          <span>preserved relationships</span>
          <strong>{report.graph.unresolved.length}</strong>
          <span>unresolved elements</span>
        </div>
      </section>
      <p className="scope-note">
        {sourceMaterial.length} source / {targetMaterial.length} target material
        elements • Explicit user pairing • Exact preservation only
      </p>
      <div className="report-grid">
        <section aria-label="Canonical comparison">
          {(['DEBTOR', 'CREDITOR'] as const).map((role) => {
            const sourceNodes = displayOrder(
              sourceMaterial.filter((n) => n.role === role),
            );
            const targetNodes = displayOrder(
              targetMaterial.filter((n) => n.role === role),
            );
            return (
              <section className="party" key={role}>
                <h3>{role === 'DEBTOR' ? 'Debtor' : 'Creditor'}</h3>
                <div className="canonical-pair">
                  {[
                    ['Source', sourceNodes],
                    ['Target', targetNodes],
                  ].map(([title, items]) => (
                    <div key={title as string}>
                      <h4>{title as string}</h4>
                      <dl>
                        {(items as SemanticNode[]).map((n) => (
                          <div className="canonical-value" key={n.elementId}>
                            <dt>{displayLabel(n)}</dt>
                            <dd>{n.value}</dd>
                          </div>
                        ))}
                      </dl>
                      {!(items as SemanticNode[]).length && (
                        <p>No material elements interpreted.</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="observations">
                  {report.graph.lineageEdges
                    .filter(
                      (e) => nodes.get(e.sourceElementIds[0]!)?.role === role,
                    )
                    .map((edge) => {
                      const node = nodes.get(edge.sourceElementIds[0]!)!;
                      return (
                        <button
                          className="observation"
                          type="button"
                          key={edge.edgeId}
                          aria-label={`Inspect ${nodeLabel(node)}`}
                          aria-pressed={selected?.edgeId === edge.edgeId}
                          onClick={() => setSelected(edge)}
                        >
                          <span>{displayLabel(node)}</span>
                          <span className="event">PRESERVED</span>
                          <span aria-hidden="true">↗</span>
                        </button>
                      );
                    })}
                </div>
              </section>
            );
          })}
        </section>
        <aside className="evidence" aria-label="Selected observation evidence">
          <p className="eyebrow">03 / TRACE</p>
          <h2>Follow the evidence</h2>
          {selected && source && target ? (
            <>
              <p className="event">PRESERVED</p>
              <p>
                {source.role} · {source.semanticPath} · occurrence{' '}
                {source.occurrence + 1}
              </p>
              <p>
                Confidence: <strong>{selected.confidence}</strong>
              </p>
              {[
                ['Source', source],
                ['Target', target],
              ].map(([label, item]) => {
                const node = item as SemanticNode;
                return (
                  <section key={label as string}>
                    <h3>{label as string} evidence</h3>
                    <dl>
                      <dt>Value</dt>
                      <dd>{node.value}</dd>
                      <dt>Locator</dt>
                      <dd>
                        <code>{node.sourceLocator.path}</code>
                      </dd>
                      <dt>Location</dt>
                      <dd>
                        Line {node.sourceLocator.line}, column{' '}
                        {node.sourceLocator.column} · offsets{' '}
                        {node.sourceLocator.start}–{node.sourceLocator.end}
                      </dd>
                      <dt>Original representation</dt>
                      <dd>
                        <pre>{node.rawValue}</pre>
                      </dd>
                    </dl>
                  </section>
                );
              })}
              <p className="small">
                Locators use UTF-16 offsets into the unchanged artifact. XML
                values are decoded; the original representation preserves entity
                spelling.
              </p>
            </>
          ) : (
            <p>
              No exact preservation relationship established. Review unresolved
              elements below.
            </p>
          )}
        </aside>
      </div>
      {report.graph.unresolved.length > 0 && (
        <section className="unresolved" aria-label="Unresolved accounting">
          <h2>Unresolved accounting</h2>
          <p>
            This is an incomplete fidelity assessment. A non-match is not proof
            of loss.
          </p>
          <ul>
            {report.graph.unresolved.map((u) => {
              const node = nodes.get(u.elementId)!;
              return (
                <li key={u.elementId}>
                  <strong>
                    {u.side} · {nodeLabel(node)}
                  </strong>
                  <p>{node.value}</p>
                  <code>{node.sourceLocator.path}</code>
                  <p>{u.reason}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      <section aria-labelledby="coverage-title">
        <p className="eyebrow">04 / UNDERSTAND THE LIMITS</p>
        <h2 id="coverage-title">Coverage stays visible.</h2>
        <div className="coverage-grid">
          <CoveragePanel label="Source" parsed={report.source} />
          <CoveragePanel label="Target" parsed={report.target} />
        </div>
      </section>
    </div>
  );
}
export function App() {
  const [source, setSource] = useState(sourceFixture),
    [target, setTarget] = useState(targetFixture);
  const [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false);
  const [result, setResult] = useState<EvaluationResult | undefined>();
  const [error, setError] = useState('');
  const [run, setRun] = useState(0);
  const client = useRef<BrowserEvaluator | null>(null);
  useEffect(() => {
    const evaluator = new BrowserEvaluator(setReady, undefined, setError);
    client.current = evaluator;
    return () => evaluator.dispose();
  }, []);
  async function analyze() {
    setBusy(true);
    setResult(undefined);
    setError('');
    try {
      const value = await client.current!.run({ source, target });
      setResult(value);
      setRun((n) => n + 1);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Evaluation could not complete.',
      );
    } finally {
      setBusy(false);
    }
  }
  function edit(side: 'source' | 'target', value: string) {
    if (side === 'source') setSource(value);
    else setTarget(value);
    setResult(undefined);
    setError('');
  }
  return (
    <>
      <header className="site-header">
        <a href="#main" className="brand">
          <span className="brand-mark" aria-hidden="true">
            ↗
          </span>
          Payment Journey
        </a>
        <span className="version">FIRST SLICE / 0.1</span>
      </header>
      <main id="main">
        <section className="hero">
          <p className="eyebrow">PAYMENT DATA INTEGRITY</p>
          <h1>
            Did the meaning
            <br />
            survive the journey?
          </h1>
          <p className="intro">
            Trace payment information across two representations.
            <br />
            See what survived—and inspect the evidence behind it.
          </p>
          <div className="hero-notes">
            <span>Browser-only analysis</span>
            <span>Synthetic data only</span>
            <span>No network compliance claims</span>
          </div>
        </section>
        <section className="input-section" aria-labelledby="pair-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">01 / PAIR</p>
              <h2 id="pair-title">One payment. Two artifacts.</h2>
            </div>
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => {
                setSource(sourceFixture);
                setTarget(targetFixture);
                setResult(undefined);
                setError('');
              }}
            >
              Load fictional Fixture A
            </button>
          </div>
          <p id="input-help">
            Submitting this Source/Target pair establishes correspondence. No
            automatic matching. Use fictional data only; each input is limited
            to 256 KiB. Both are retained in browser memory only.
          </p>
          <div className="input-grid">
            <label>
              Source · MT103 Option-F subset
              <textarea
                aria-label="Source artifact"
                aria-describedby="input-help"
                value={source}
                disabled={busy}
                maxLength={262144}
                spellCheck={false}
                onChange={(e) => edit('source', e.target.value)}
              />
              <span className="small">
                Block-4-only input · 50F debtor / 59F creditor
              </span>
            </label>
            <label>
              Target · pacs.008.001.14
              <textarea
                aria-label="Target artifact"
                aria-describedby="input-help"
                value={target}
                disabled={busy}
                maxLength={262144}
                spellCheck={false}
                onChange={(e) => edit('target', e.target.value)}
              />
              <span className="small">Exact namespace · one transaction</span>
            </label>
          </div>
          <div className="actions">
            <button
              className="primary"
              type="button"
              disabled={!ready || busy || !source || !target}
              onClick={() => void analyze()}
            >
              {busy ? 'Evaluating…' : 'Evaluate explicit pair'}{' '}
              <span aria-hidden="true">→</span>
            </button>
            {busy && (
              <button
                type="button"
                className="secondary"
                onClick={() => client.current?.cancel()}
              >
                Cancel evaluation
              </button>
            )}
            <span className="small" role="status">
              {busy
                ? 'Analysis isolated in a browser worker.'
                : ready
                  ? 'Local evaluator ready. No payload uploads.'
                  : 'Starting local evaluator…'}
            </span>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {result && !result.ok && (
            <div className="error" role="alert">
              <h3>Evaluation needs attention</h3>
              {result.diagnostics.map((d, i) => (
                <p key={i}>
                  <strong>{d.code}</strong> — {d.message}
                  {d.locator
                    ? ` (line ${d.locator.line}, column ${d.locator.column})`
                    : ''}
                </p>
              ))}
              <p>
                No complete lineage report was produced. The original inputs
                remain above.
              </p>
            </div>
          )}
        </section>
        {result?.ok && (
          <div aria-live="polite">
            <Report key={run} report={result.report} />
          </div>
        )}
      </main>
      <footer>
        Standards-analysis and engineering support. Not legal or regulatory
        advice. No full XSD, MT, CBPR+ or Fedwire validation. Policy evaluation
        and export/import are not implemented.
      </footer>
    </>
  );
}
