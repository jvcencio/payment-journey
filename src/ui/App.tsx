import { useEffect, useRef, useState } from 'react';
import { BrowserEvaluator } from '../application/browser-client';
import type { EvaluationResult } from '../application/evaluate';
import { Report } from './Report';
import { bundledWitnesses, FixtureInput } from '../fixtures/catalog';
import sourceFixture from '../../fixtures/raw-pairs/a-clean-preservation/source.mt103?raw';
import targetFixture from '../../fixtures/raw-pairs/a-clean-preservation/target.pacs008.xml?raw';
import './styles.css';

export function App() {
  const [source, setSource] = useState(sourceFixture),
    [target, setTarget] = useState(targetFixture);
  const [fixtureId, setFixtureId] = useState('A');
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
      const value = await client.current!.run(
        fixtureId === 'A' ? { source, target } : { fixtureId },
      );
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
  function chooseFixture(id: string) {
    setResult(undefined);
    setError('');
    if (id === 'A') {
      setFixtureId('A');
      setSource(sourceFixture);
      setTarget(targetFixture);
      return;
    }
    const selected = FixtureInput.parse({ fixtureId: id });
    setFixtureId(id);
    setSource(bundledWitnesses[selected.fixtureId].source);
    setTarget(bundledWitnesses[selected.fixtureId].target);
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
        <span className="version">EVIDENCE-BACKED POLICY / 0.3</span>
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
            See what survived, what degraded, and what cannot be explained.
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
              onClick={() => chooseFixture('A')}
            >
              Load fictional Fixture A
            </button>
          </div>
          <label className="fixture-picker">
            Demonstration
            <select
              aria-label="Demonstration"
              value={fixtureId}
              disabled={busy}
              onChange={(e) => chooseFixture(e.target.value)}
            >
              <option value="A">A — Preservation · MT103 → pacs.008</option>
              <option value="D">
                D — Collapse + misplacement · canonical evidence
              </option>
              <option value="C">C — Pure collapse · canonical evidence</option>
              <option value="E">E — Truncation · canonical evidence</option>
              <option value="F">F — Loss · canonical evidence</option>
              <option value="J">
                J — Unsourced value · canonical evidence
              </option>
              <option value="P1">
                P1 — Structured address · policy witness
              </option>
              <option value="P2">P2 — Valid hybrid · policy witness</option>
              <option value="P3">
                P3 — Hybrid missing town · policy witness
              </option>
              <option value="P4">
                P4 — Excess hybrid lines · policy witness
              </option>
              <option value="P5">P5 — Repeated town · policy witness</option>
            </select>
          </label>
          {fixtureId !== 'A' && (
            <p className="canonical-notice">
              Bundled fictional canonical evidence. These discrete source
              concepts are explicitly supplied test evidence, not extracted from
              MT103. No additional payment adapter or canonical import is
              supported.
            </p>
          )}
          <p id="input-help">
            Submitting this Source/Target pair establishes correspondence. No
            automatic matching. Use fictional data only; each input is limited
            to 256 KiB. Both are retained in browser memory only.
          </p>
          <div className="input-grid">
            <label>
              Source ·{' '}
              {fixtureId === 'A'
                ? 'MT103 Option-F subset'
                : 'Canonical witness (read-only)'}
              <textarea
                aria-label="Source artifact"
                aria-describedby="input-help"
                value={source}
                readOnly={fixtureId !== 'A'}
                disabled={busy}
                maxLength={262144}
                spellCheck={false}
                onChange={(e) => edit('source', e.target.value)}
              />
              <span className="small">
                {fixtureId === 'A'
                  ? 'Block-4-only input · 50F debtor / 59F creditor'
                  : 'Explicit concepts with occurrence locators'}
              </span>
            </label>
            <label>
              Target ·{' '}
              {fixtureId === 'A'
                ? 'pacs.008.001.14'
                : 'Canonical witness (read-only)'}
              <textarea
                aria-label="Target artifact"
                aria-describedby="input-help"
                value={target}
                readOnly={fixtureId !== 'A'}
                disabled={busy}
                maxLength={262144}
                spellCheck={false}
                onChange={(e) => edit('target', e.target.value)}
              />
              <span className="small">
                {fixtureId === 'A'
                  ? 'Exact namespace · one transaction'
                  : 'Complete declared synthetic evidence scope'}
              </span>
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
        advice. Public address-quality alignment only. No full XSD, MT, CBPR+ or
        Fedwire validation or certification. Export/import is not implemented.
      </footer>
    </>
  );
}
