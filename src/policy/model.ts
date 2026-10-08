import { z } from 'zod';
export type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
const text = z.string().min(1);
const date = z.iso.date();
export const AuthoritySchema = z.strictObject({
  authorityOrganization: text,
  authorityType: z.enum(['HARMONISATION_GUIDANCE', 'MARKET_PRACTICE']),
  sourceTitle: text,
  sourceVersion: text,
  publicationDate: date,
  effectiveDate: date.nullable(),
  accessedDate: date,
  sourceUrl: z.url(),
  sourceSection: text,
  sourceStatus: z.enum([
    'CURRENT',
    'SUPERSEDED',
    'PENDING',
    'WITHDRAWN',
    'UNKNOWN',
  ]),
  supersedes: z.array(text),
  supersededBy: z.array(text),
});
export const RuleSchema = z.strictObject({
  ruleId: text,
  title: text,
  authority: AuthoritySchema,
  requirementStrength: z.enum([
    'REQUIRED',
    'RECOMMENDED',
    'PREFERRED',
    'PERMITTED',
    'PROHIBITED',
  ]),
  applicability: text,
  rationale: text,
  remediation: text,
  severity: z.literal('UNASSIGNED'),
});
export const PackSchema = z
  .strictObject({
    packId: text,
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    name: text,
    rules: z.array(RuleSchema).min(1),
  })
  .refine(
    (p) => new Set(p.rules.map((r) => r.ruleId)).size === p.rules.length,
    'Duplicate rule ID',
  );
export type RulePack = z.infer<typeof PackSchema>;
export type Rule = z.infer<typeof RuleSchema>;
export type PolicyOutcome =
  | 'ALIGNS'
  | 'DOES_NOT_ALIGN'
  | 'PARTIALLY_ALIGNS'
  | 'NOT_APPLICABLE'
  | 'UNKNOWN';
export interface PolicyContext {
  evaluationDate: string;
  crossBorder: boolean | 'UNKNOWN';
  // Explicit selected scenario, never inferred from the canonical vocabulary.
  targetCapability?: {
    declarationId: string;
    version: string;
    targetArtifactId: string;
    concepts: readonly string[];
    statement: string;
  };
}
export interface PolicyFinding {
  findingId: string;
  packId: string;
  packVersion: string;
  ruleId: string;
  participantOccurrenceId: string;
  role: string;
  outcome: PolicyOutcome;
  explanation: string;
  affectedElementIds: string[];
  affectedEdgeIds: string[];
  evidenceRefs: string[];
  contextEvidenceIds: string[];
}
export interface PolicyEvaluation {
  engineVersion: '0.1.0';
  context: PolicyContext;
  packs: RulePack[];
  findings: PolicyFinding[];
}
