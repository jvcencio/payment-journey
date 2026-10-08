import { useMemo, useState } from 'react';
import type { LineageReport } from '../domain/model';
import { evaluatePolicy } from '../policy/evaluate';
import { policyContext } from '../policy/context';
import {
  plainExplanation,
  fieldName,
  outcomeDefinitions,
} from './presentation';
import { publicAddressQuality } from '../policy/public-address-quality';
export function PolicyPanel({
  report,
  onInspect,
  profile,
  setProfile,
  scope,
  setScope,
  scopeNote,
  detailOnly = false,
}: {
  report: LineageReport;
  profile: string;
  setProfile: (value: string) => void;
  scope: string;
  setScope: (value: string) => void;
  scopeNote?: string | undefined;
  detailOnly?: boolean;
  onInspect: (id: string) => void;
}) {
  const [date] = useState(() => new Date().toISOString().slice(0, 10));
  const result = useMemo(
    () =>
      evaluatePolicy(
        report,
        profile === 'none'
          ? []
          : [
              {
                packId: publicAddressQuality.packId,
                version: publicAddressQuality.version,
              },
            ],
        policyContext(
          report,
          scope === 'UNKNOWN' ? 'UNKNOWN' : scope === 'true',
          date,
        ),
      ),
    [report, profile, scope, date],
  );
  const evidence = [
    ...report.source.snapshot.evidence,
    ...report.target.snapshot.evidence,
    ...(report.transformation.context?.evidence ?? []),
  ];
  return (
    <section
      className="policy-panel"
      id={detailOnly ? 'policy-details' : undefined}
      aria-label={
        detailOnly ? 'Authority and rule details' : 'Policy evaluation'
      }
    >
      {!detailOnly && (
        <>
          <p className="eyebrow">03 / GUIDANCE</p>
          <h2>What does the selected guidance say?</h2>
          <p>
            Lineage explains what changed. Guidance evaluation compares those
            facts with the selected rules; it does not change the messages or
            the observations.
          </p>
          <div className="policy-controls">
            <label>
              Evaluation Profile
              <select
                aria-label="Evaluation Profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
              >
                <option value="none">Lineage only</option>
                <option value="public-address-quality">
                  CPMI / PMPG Address Quality Baseline v0.1.0
                </option>
              </select>
            </label>
            {profile !== 'none' && (
              <label>
                Is this payment being evaluated as cross-border?
                <select
                  aria-label="Is this payment being evaluated as cross-border?"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                >
                  <option value="UNKNOWN">Don't assume</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            )}
          </div>
          <p className="small">
            Payment Journey will not infer cross-border applicability solely
            from country codes. {scopeNote}
          </p>
          <p className="small">
            Network conformance: NOT EVALUATED · Institution policy: NOT
            EVALUATED
          </p>
        </>
      )}
      {profile === 'none' ? (
        <p>
          No guidance profile selected. Field-level lineage remains available
          below.
        </p>
      ) : (
        <>
          {!detailOnly && (
            <>
              <p className="canonical-notice">
                Project-authored public baseline. CPMI encourages adoption; its
                harmonisation guidance is not itself a regulatory requirement.
                PMPG is market practice. Neither is certification. Results apply
                to individual rules, not an overall payment approval.
              </p>
              <p className="small">
                Pack public-address-quality@0.1.0 · Evaluation date {date} ·
                Source review 2026-10-07. Cross-border scope is a selected
                assumption, not inferred from the payment.
              </p>
              <div
                className="policy-comparison"
                aria-label="Minimum and quality comparison"
              >
                {report.target.snapshot.transactions
                  .flatMap((t) => t.participants)
                  .map((p) => (
                    <div key={p.occurrenceId}>
                      <h3>{p.role}</h3>
                      <dl>
                        {[
                          ['CPMI-ADDR-001', 'CPMI minimum location'],
                          ['PMPG-ADDR-001', 'PMPG semantic placement'],
                        ].map(([id, label]) => {
                          const outcome = result.findings.find(
                            (f) =>
                              f.participantOccurrenceId === p.occurrenceId &&
                              f.ruleId === id,
                          )?.outcome;
                          return (
                            <div key={id}>
                              <dt>{label}</dt>
                              <dd data-outcome={outcome}>
                                {outcome?.replaceAll('_', ' ')}
                              </dd>
                              <p className="small">
                                {outcome && outcomeDefinitions[outcome]}
                              </p>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  ))}
              </div>
              <details className="outcome-guide">
                <summary>What do the guidance outcomes mean?</summary>
                <dl>
                  {Object.entries(outcomeDefinitions).map(
                    ([outcome, definition]) => (
                      <div data-outcome={outcome} key={outcome}>
                        <dt>{outcome.replaceAll('_', ' ')}</dt>
                        <dd>{definition}</dd>
                      </div>
                    ),
                  )}
                </dl>
              </details>
              <p>
                <a href="#policy-details">
                  Inspect all rules and authority evidence ↓
                </a>
              </p>
            </>
          )}
          {detailOnly && (
            <details>
              <summary>Authority details and all rule findings</summary>
              <p>
                These judgments apply only to the evaluated Debtor/Creditor
                fields and selected context. They are not whole-payment
                approval.
              </p>
              {(['HARMONISATION_GUIDANCE', 'MARKET_PRACTICE'] as const).map(
                (type) => (
                  <section
                    key={type}
                    aria-label={
                      type === 'HARMONISATION_GUIDANCE'
                        ? 'Harmonisation alignment'
                        : 'Market-practice alignment'
                    }
                  >
                    <h3>
                      {type === 'HARMONISATION_GUIDANCE'
                        ? 'Harmonisation alignment · CPMI'
                        : 'Market-practice alignment · PMPG'}
                    </h3>
                    <div className="policy-findings">
                      {result.findings
                        .filter(
                          (f) =>
                            publicAddressQuality.rules.find(
                              (r) => r.ruleId === f.ruleId,
                            )!.authority.authorityType === type,
                        )
                        .map((f) => {
                          const rule = publicAddressQuality.rules.find(
                            (r) => r.ruleId === f.ruleId,
                          )!;
                          const a = rule.authority;
                          return (
                            <article
                              className="policy-finding"
                              key={f.findingId}
                              data-outcome={f.outcome}
                              aria-label={`${f.role} ${f.ruleId}`}
                            >
                              <div className="finding-heading">
                                <span>
                                  {f.role} · {rule.ruleId}
                                </span>
                                <strong className="outcome">
                                  {f.outcome.replaceAll('_', ' ')}
                                </strong>
                              </div>
                              <h4>{rule.title}</h4>
                              <p>{plainExplanation(f.explanation)}</p>
                              <p className="small">
                                {outcomeDefinitions[f.outcome]}
                              </p>
                              <details>
                                <summary>
                                  Inspect rule, authority and evidence
                                </summary>
                                <dl className="policy-metadata">
                                  <dt>Rule / pack version</dt>
                                  <dd>
                                    {rule.ruleId} · {f.packId}@{f.packVersion}
                                  </dd>
                                  <dt>Authority</dt>
                                  <dd>
                                    {a.authorityOrganization} ·{' '}
                                    {a.authorityType}
                                  </dd>
                                  <dt>Source</dt>
                                  <dd>
                                    <a
                                      href={a.sourceUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {a.sourceTitle}
                                    </a>{' '}
                                    · {a.sourceVersion}
                                  </dd>
                                  <dt>Publication / accessed</dt>
                                  <dd>
                                    {a.publicationDate} / {a.accessedDate}
                                  </dd>
                                  <dt>Effective date / applicability</dt>
                                  <dd>
                                    {a.effectiveDate ??
                                      'No universal mandatory effective date'}{' '}
                                    · {rule.applicability}
                                  </dd>
                                  <dt>Source section / status</dt>
                                  <dd>
                                    {a.sourceSection} · {a.sourceStatus}
                                  </dd>
                                  <dt>Supersedes / superseded by</dt>
                                  <dd>
                                    {a.supersedes.join(', ') || 'None recorded'}{' '}
                                    /{' '}
                                    {a.supersededBy.join(', ') ||
                                      'None recorded'}
                                  </dd>
                                  <dt>Source strength / product severity</dt>
                                  <dd>
                                    {rule.requirementStrength} / {rule.severity}
                                    . Strength is not automatically severity.
                                  </dd>
                                  <dt>Rationale</dt>
                                  <dd>{rule.rationale}</dd>
                                  <dt>Remediation guidance</dt>
                                  <dd>{rule.remediation}</dd>
                                </dl>
                                <h5>Linked field observations</h5>
                                {f.affectedEdgeIds.length === 0 ? (
                                  <p>
                                    No established lineage edge is required for
                                    this target-evidence result.
                                  </p>
                                ) : (
                                  f.affectedEdgeIds.map((id) => {
                                    const edge = report.graph.lineageEdges.find(
                                      (e) => e.edgeId === id,
                                    )!;
                                    const n = report.graph.semanticNodes.find(
                                      (n) =>
                                        n.elementId ===
                                        (edge.sourceElementIds[0] ??
                                          edge.targetElementIds[0]),
                                    )!;
                                    return (
                                      <button
                                        className="secondary policy-trace"
                                        type="button"
                                        key={id}
                                        onClick={() => onInspect(id)}
                                      >
                                        Inspect lineage: {n.role}{' '}
                                        {fieldName(n.semanticPath)} ·{' '}
                                        {edge.taxonomyEvents
                                          .map((t) => t.type)
                                          .join(' · ')}
                                      </button>
                                    );
                                  })
                                )}
                                <h5>Affected elements</h5>
                                {f.affectedElementIds.map((id) => {
                                  const n = report.graph.semanticNodes.find(
                                    (n) => n.elementId === id,
                                  )!;
                                  return (
                                    <details key={id}>
                                      <summary>
                                        {n.artifactId ===
                                        report.source.artifact.artifactId
                                          ? 'Source'
                                          : 'Target'}{' '}
                                        · {n.role} · {n.semanticPath} ·{' '}
                                        {n.value}
                                      </summary>
                                      <code>{n.sourceLocator.path}</code>
                                      <p>
                                        Offsets {n.sourceLocator.start}–
                                        {n.sourceLocator.end}
                                      </p>
                                      <pre>{n.rawValue}</pre>
                                    </details>
                                  );
                                })}
                                <details>
                                  <summary>
                                    Supporting artifact / completeness evidence
                                    ({f.evidenceRefs.length})
                                  </summary>
                                  {f.evidenceRefs.map((id) => {
                                    const e = evidence.find(
                                      (e) => e.evidenceId === id,
                                    );
                                    return (
                                      <div key={id}>
                                        <code>{e?.locator.path ?? id}</code>
                                        <pre>
                                          {e?.rawValue ??
                                            'Unresolved reference'}
                                        </pre>
                                      </div>
                                    );
                                  })}
                                </details>
                                {!!f.contextEvidenceIds.length && (
                                  <div>
                                    <h5>Target capability evidence</h5>
                                    <code>
                                      {f.contextEvidenceIds.join(', ')}
                                    </code>
                                    <p>
                                      {
                                        result.context.targetCapability
                                          ?.statement
                                      }
                                    </p>
                                    <p className="small">
                                      Applies to target artifact{' '}
                                      {
                                        result.context.targetCapability
                                          ?.targetArtifactId
                                      }
                                    </p>
                                  </div>
                                )}
                              </details>
                            </article>
                          );
                        })}
                    </div>
                  </section>
                ),
              )}
            </details>
          )}
        </>
      )}
    </section>
  );
}
