import { useEffect, useRef, useState } from 'react';
import { BrowserEvaluator } from '../application/browser-client';
import type { EvaluationResult } from '../application/evaluate';
import { Report } from './Report';
import { PreparedRecords } from './PreparedRecords';
import { scenarios } from './scenarios';
import { bundledWitnesses, FixtureInput } from '../fixtures/catalog';
import sourceFixture from '../../fixtures/raw-pairs/a-clean-preservation/source.mt103?raw';
import targetFixture from '../../fixtures/raw-pairs/a-clean-preservation/target.pacs008.xml?raw';
import './styles.css';

export function App() {
  const [source, setSource] = useState(bundledWitnesses.D.source),
    [target, setTarget] = useState(bundledWitnesses.D.target);
  const [fixtureId, setFixtureId] = useState('D');
  const [profile, setProfile] = useState('public-address-quality');
  const [scope, setScope] = useState(
    scenarios[0].crossBorder ? 'true' : 'UNKNOWN',
  );
  const [scopeChosen, setScopeChosen] = useState(false);
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
      if (!scopeChosen) setScope('UNKNOWN');
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
        <span className="small">Public alpha</span>
      </header>
      <main id="main">
        <section className="hero">
          <p className="eyebrow">PAYMENT DATA INTEGRITY</p>
          <h1>
            Validate wire-address transformations during ISO 20022 migration.
          </h1>
          <p className="intro">
            Compare what a source message or system provides with what the
            target produces. See which address data was preserved, merged,
            misplaced, lost, or added — then compare that behavior with selected
            public guidance.
          </p>
          <p>
            Built for payments product, QA, implementation, business analysis,
            architecture, and technology teams working on wire modernization.
          </p>
          <p className="small">
            Current alpha scope: Debtor and Creditor postal addresses.
          </p>
          <div className="hero-notes">
            <span>Browser-local analysis</span>
            <span>Synthetic examples</span>
            <span>No network certification claims</span>
          </div>
        </section>
        <section className="input-section" aria-labelledby="pair-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">01 / PAIR</p>
              <h2 id="pair-title">Choose a situation to compare.</h2>
            </div>
          </div>
          <label className="fixture-picker">
            Example scenario
            <select
              aria-label="Example scenario"
              value={fixtureId}
              disabled={busy}
              onChange={(e) => chooseFixture(e.target.value)}
            >
              {[...new Set(scenarios.map((s) => s.group))].map((group) => (
                <optgroup label={group} key={group}>
                  {scenarios
                    .filter((s) => s.group === group)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          {fixtureId !== 'A' ? (
            <>
              <p>
                This prepared example starts with explicitly known address
                fields so Payment Journey can demonstrate what happens when a
                transformation changes their meaning or structure. MT103 cannot
                represent every discrete address field shown here.
              </p>
              {fixtureId === 'E' && (
                <p className="small">
                  Synthetic constraint: this example target allocates a
                  31-character display column to the party name. The ASCII name
                  is cut at that column boundary. This is a fictional system
                  limit, not an MT, ISO or network-standard limit.
                </p>
              )}
              <PreparedRecords source={source} target={target} />
            </>
          ) : (
            <>
              <p id="input-help">
                Narrow parser coverage: MT103 block 4, 50F/59F, and one
                pacs.008.001.14 transaction. Other fields remain outside current
                analysis scope, so some guidance outcomes may be UNKNOWN.
                Compare one explicitly paired payment; use fictional data only.
                Each message is limited to 256 KiB and stays in browser memory.
              </p>
              <div className="input-grid">
                <label>
                  Source · MT103 Option-F subset
                  <textarea
                    aria-label="Source message"
                    aria-describedby="input-help"
                    value={source}
                    disabled={busy}
                    maxLength={262144}
                    spellCheck={false}
                    onChange={(e) => edit('source', e.target.value)}
                  />
                </label>
                <label>
                  Target · pacs.008.001.14
                  <textarea
                    aria-label="Target message"
                    aria-describedby="input-help"
                    value={target}
                    disabled={busy}
                    maxLength={262144}
                    spellCheck={false}
                    onChange={(e) => edit('target', e.target.value)}
                  />
                </label>
              </div>
            </>
          )}
          <div className="actions">
            <button
              className="primary"
              type="button"
              disabled={!ready || busy || !source || !target}
              onClick={() => void analyze()}
            >
              {busy ? 'Evaluating…' : 'Compare these messages'}{' '}
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
                ? 'Comparing locally…'
                : ready
                  ? 'Ready. Messages stay in this browser.'
                  : 'Preparing local comparison…'}
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
            <Report
              key={run}
              report={result.report}
              profile={profile}
              setProfile={setProfile}
              scope={scope}
              setScope={(value) => {
                setScope(value);
                setScopeChosen(true);
              }}
              scopeNote={
                !scopeChosen && scope === 'true'
                  ? 'Prepared example context: cross-border. This is supplied example metadata, not inferred from country codes.'
                  : undefined
              }
            />
          </div>
        )}
      </main>
      <p className="why-it-matters">
        Address transformations can remain technically processable while losing
        structure or meaning. That can create downstream data-quality,
        screening, repair, and future-remediation risk.
      </p>
      <footer>
        Standards-analysis and engineering support. Not legal or regulatory
        advice. Public address-quality alignment only. No full XSD, MT, CBPR+ or
        Fedwire validation or certification. Export/import is not implemented.{' '}
        <a href={`${import.meta.env.BASE_URL}LICENSE.txt`}>Apache-2.0</a> ·{' '}
        <a href={`${import.meta.env.BASE_URL}third-party-notices.txt`}>
          Third-party notices
        </a>
      </footer>
    </>
  );
}
