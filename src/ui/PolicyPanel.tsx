import { useMemo, useState } from 'react';
import type { LineageReport } from '../domain/model';
import { evaluatePolicy } from '../policy/evaluate';
import { policyContext } from '../policy/context';
import { publicAddressQuality } from '../policy/public-address-quality';
export function PolicyPanel({
  report,
  onInspect,
}: {
  report: LineageReport;
  onInspect: (id: string) => void;
}) {
  const [profile, setProfile] = useState('none');
  const [scope, setScope] = useState('UNKNOWN');
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
    <section className="policy-panel" aria-label="Policy evaluation">
      <p className="eyebrow">05 / EVALUATE A SELECTED AUTHORITY</p>
      <h2>What does the selected guidance say?</h2>
      <p>
        Policy findings assess the existing lineage. Changing this profile does
        not parse the artifacts again or change what happened.
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
            Cross-border applicability
            <select
              aria-label="Cross-border applicability"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="UNKNOWN">Not established</option>
              <option value="true">Evaluate as cross-border</option>
              <option value="false">Domestic / outside CPMI scope</option>
            </select>
          </label>
        )}
      </div>
      <p className="small">
        Network conformance: NOT EVALUATED · Institution policy: NOT EVALUATED
      </p>
      {profile === 'none' ? (
        <p>
          No policy packs selected. Lineage observations remain available above.
        </p>
      ) : (
        <>
          <p className="canonical-notice">
            Project-authored public baseline. CPMI encourages adoption; its
            harmonisation guidance is not itself a regulatory requirement. PMPG
            is market practice. Neither is certification. Results apply to
            individual rules, not an overall payment approval.
          </p>
          <p className="small">
            Pack public-address-quality@0.1.0 · Evaluation date {date} · Source
            review 2026-10-07. Cross-border scope is a selected assumption, not
            inferred from the payment.
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
                    ].map(([id, label]) => (
                      <div key={id}>
                        <dt>{label}</dt>
                        <dd>
                          {result.findings
                            .find(
                              (f) =>
                                f.participantOccurrenceId === p.occurrenceId &&
                                f.ruleId === id,
                            )
                            ?.outcome.replaceAll('_', ' ')}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
          </div>
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
                          <p>{f.explanation}</p>
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
                                {a.authorityOrganization} · {a.authorityType}
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
                                {a.supersedes.join(', ') || 'None recorded'} /{' '}
                                {a.supersededBy.join(', ') || 'None recorded'}
                              </dd>
                              <dt>Source strength / product severity</dt>
                              <dd>
                                {rule.requirementStrength} / {rule.severity}.
                                Strength is not automatically severity.
                              </dd>
                              <dt>Rationale</dt>
                              <dd>{rule.rationale}</dd>
                              <dt>Remediation guidance</dt>
                              <dd>{rule.remediation}</dd>
                            </dl>
                            <h5>Affected lineage observations</h5>
                            {f.affectedEdgeIds.length === 0 ? (
                              <p>
                                No established lineage edge is required for this
                                target-evidence result.
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
                                    Inspect lineage: {n.role} {n.semanticPath} ·{' '}
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
                                    · {n.role} · {n.semanticPath} · {n.value}
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
                                Supporting artifact / completeness evidence (
                                {f.evidenceRefs.length})
                              </summary>
                              {f.evidenceRefs.map((id) => {
                                const e = evidence.find(
                                  (e) => e.evidenceId === id,
                                );
                                return (
                                  <div key={id}>
                                    <code>{e?.locator.path ?? id}</code>
                                    <pre>
                                      {e?.rawValue ?? 'Unresolved reference'}
                                    </pre>
                                  </div>
                                );
                              })}
                            </details>
                            {!!f.contextEvidenceIds.length && (
                              <div>
                                <h5>Target capability evidence</h5>
                                <code>{f.contextEvidenceIds.join(', ')}</code>
                                <p>
                                  {result.context.targetCapability?.statement}
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
        </>
      )}
    </section>
  );
}
