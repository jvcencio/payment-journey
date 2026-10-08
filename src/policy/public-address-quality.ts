import {
  PackSchema,
  type Rule,
  type DeepReadonly,
  type RulePack,
} from './model';
const cpmi = {
  authorityOrganization: 'BIS / CPMI',
  authorityType: 'HARMONISATION_GUIDANCE' as const,
  sourceTitle:
    'Harmonised ISO 20022 data requirements for enhancing cross-border payments — updated report',
  sourceVersion: 'February 2026 updated report',
  publicationDate: '2026-02-26',
  effectiveDate: null,
  accessedDate: '2026-10-07',
  sourceUrl:
    'https://www.bis.org/publications/harmonised-iso-20022-data-requirements-enhancing-cross-border-payments-updated-report.pdf',
  sourceSection:
    'Requirement 11, printed pp.17–18 (PDF pp.20–21); executive summary p.1',
  sourceStatus: 'CURRENT' as const,
  supersedes: ['CPMI October 2023 report'],
  supersededBy: [],
};
const pmpg = {
  ...cpmi,
  authorityOrganization: 'Payments Market Practice Group / Swift',
  authorityType: 'MARKET_PRACTICE' as const,
  sourceTitle: 'Hybrid Postal Address',
  sourceVersion: '1.14',
  publicationDate: '2026-09-04',
  sourceUrl: 'https://www.swift.com/swift-resource/252602/download',
  sourceSection:
    'Slide 12: Background — Hybrid postal address; Definition & Rules',
  supersedes: ['PMPG Hybrid Postal Address v1.13'],
};
function rule(
  ruleId: string,
  title: string,
  authority: Rule['authority'],
  requirementStrength: Rule['requirementStrength'],
  applicability: string,
  rationale: string,
  remediation: string,
): Rule {
  return {
    ruleId,
    title,
    authority,
    requirementStrength,
    applicability,
    rationale,
    remediation,
    severity: 'UNASSIGNED',
  };
}
const pack = PackSchema.parse({
  packId: 'public-address-quality',
  version: '0.1.0',
  name: 'CPMI / PMPG Address Quality Baseline',
  rules: [
    rule(
      'CPMI-ADDR-001',
      'Minimum structured location',
      cpmi,
      'REQUIRED',
      'Selected cross-border postal-address baseline; voluntary harmonisation guidance, no regulatory effective date.',
      'Country and town provide the minimum structured location.',
      'Obtain missing location information from an evidenced source; do not invent it.',
    ),
    rule(
      'CPMI-ADDR-002',
      'Preserve available structure',
      cpmi,
      'RECOMMENDED',
      'Cross-border baseline; known source components and independently evidenced target capability.',
      'Retain additional address structure where feasible.',
      'Review mapping to supported corresponding elements only after target feasibility is established.',
    ),
    rule(
      'PMPG-ADDR-001',
      'Structured element semantic integrity',
      {
        ...pmpg,
        sourceSection:
          'Slide 11: Background — The challenge; data pollution / incorrect address elements',
      },
      'RECOMMENDED',
      'Known address lineage; project alignment test operationalising PMPG data-quality risk guidance, not a network mandate.',
      'Co-mingling known attributes in an incorrect structured element creates data-quality risk.',
      'Review component mappings and confirm target capabilities before separating values; no automatic repair.',
    ),
    rule(
      'PMPG-HYBRID-001',
      'Hybrid minimum elements',
      pmpg,
      'REQUIRED',
      'Target identified as a mixture of structured postal elements and AddressLine.',
      'Hybrid addresses need structured town and country.',
      'Source missing town/country from verified evidence.',
    ),
    rule(
      'PMPG-HYBRID-002',
      'Hybrid line limits',
      pmpg,
      'REQUIRED',
      'Hybrid target; project character counting uses Unicode code points, not network character-set validation.',
      'Hybrid allows at most two address lines of 70 characters each.',
      'Review address placement without truncating or losing information.',
    ),
    rule(
      'PMPG-HYBRID-003',
      'No structured-data repetition',
      pmpg,
      'PROHIBITED',
      'Hybrid target; exact same-participant whole comma/semicolon segment repetition only; other cases unknown.',
      'Structured postal information must not repeat in AddressLine.',
      'Confirm the repeated concept before removing redundant text; retain original evidence.',
    ),
  ],
});
function freeze<T extends object>(value: T): DeepReadonly<T> {
  for (const item of Object.values(value))
    if (item && typeof item === 'object') freeze(item);
  return Object.freeze(value) as DeepReadonly<T>;
}
export const publicAddressQuality = freeze(pack);
export function resolvePack(
  id: string,
  version: string,
): DeepReadonly<RulePack> {
  if (
    id !== publicAddressQuality.packId ||
    version !== publicAddressQuality.version
  )
    throw new Error('Unknown policy pack version. No latest-version fallback.');
  return publicAddressQuality;
}
