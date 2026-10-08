import type { LineageReport } from '../domain/model';
import type { DeepReadonly, PolicyContext } from './model';
import declaration from '../../fixtures/policy/target-capability.json';
/** Explicit bundled scenario capabilities. Raw artifacts have no implied capability. */
export function policyContext(
  report: DeepReadonly<LineageReport>,
  crossBorder: boolean | 'UNKNOWN',
  evaluationDate: string,
): PolicyContext {
  return {
    evaluationDate,
    crossBorder,
    ...(report.demonstration &&
    declaration.fixtureIds.includes(report.demonstration.fixtureId)
      ? {
          targetCapability: {
            declarationId: declaration.declarationId,
            version: declaration.version,
            targetArtifactId: report.target.artifact.artifactId,
            concepts: [...declaration.concepts],
            statement: declaration.statement,
          },
        }
      : {}),
  };
}
