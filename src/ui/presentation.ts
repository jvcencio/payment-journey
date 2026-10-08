import type { EventName, LineageReport } from '../domain/model';
export const fieldNames: Record<string, string> = {
  name: 'Party name',
  'address.buildingNumber': 'Building number',
  'address.streetName': 'Street name',
  'address.room': 'Suite / room',
  'address.townName': 'Town',
  'address.country': 'Country',
  'address.addressLines': 'Address line',
  'address.postCode': 'Post code',
};
export const fieldName = (path: string) =>
  fieldNames[path] ?? path.replace('address.', '').replace(/([A-Z])/g, ' $1');
export const eventLabels: Partial<Record<EventName, string>> = {
  PRESERVED: 'Meaning retained',
  COLLAPSED: 'Several known fields merged into a broader field',
  MISPLACED: 'Information placed in a field with a different meaning',
  TRUNCATED: 'Value cut short',
  LOST: 'Known source information disappeared',
  UNSOURCED: 'No source identified for this target value',
};
export const outcomeDefinitions: Record<string, string> = {
  ALIGNS: 'The evaluated evidence meets this rule.',
  DOES_NOT_ALIGN: 'The evaluated evidence conflicts with this rule.',
  PARTIALLY_ALIGNS: 'Some but not all relevant conditions align.',
  NOT_APPLICABLE: 'This rule does not apply to the evaluated context.',
  UNKNOWN:
    'The available evidence is not sufficient to make the determination. This is a deliberate refusal to guess, not an application failure.',
};
export function plainExplanation(text: string) {
  let out = text;
  for (const [path, label] of Object.entries(fieldNames))
    out = out.replaceAll(path, label);
  return out
    .replaceAll(
      'Incomplete or unresolved lineage',
      'Fields outside current analysis scope or unresolved relationships',
    )
    .replaceAll('canonical vocabulary', 'list of supported field names')
    .replaceAll('Canonical vocabulary', 'The list of supported field names')
    .replaceAll('canonical witness', 'prepared example')
    .replaceAll('target witness evidence', 'target record evidence')
    .replaceAll('source component', 'source field')
    .replaceAll(
      'Target evidence is incomplete',
      'Fields outside current analysis scope remain',
    );
}
/** Presentation only: consumes actual observations, never a scenario ID or expected oracle. */
export function resultSummary(report: LineageReport) {
  const edges = report.graph.lineageEdges;
  const has = (type: EventName) =>
    edges.some((e) => e.taxonomyEvents.some((t) => t.type === type));
  const degraded = edges.filter((e) =>
    e.taxonomyEvents.some((t) => t.type !== 'PRESERVED'),
  );
  const title =
    has('MISPLACED') && !has('LOST') && !has('TRUNCATED')
      ? 'Address data survived, but some of its meaning was degraded.'
      : has('LOST')
        ? 'Some known source information did not survive.'
        : has('TRUNCATED')
          ? 'A source value was cut short during conversion.'
          : has('UNSOURCED')
            ? 'The target contains information with no identified source.'
            : has('COLLAPSED')
              ? 'Information survived, but separate fields were merged.'
              : report.graph.unresolved.length
                ? 'Some relationships could not be established.'
                : edges.length
                  ? 'The evaluated information retained its meaning.'
                  : 'There is not enough interpreted information for a conclusion.';
  const changes = degraded.map((e) => {
    const s = report.graph.semanticNodes.find(
      (n) => n.elementId === e.sourceElementIds[0],
    );
    const t = report.graph.semanticNodes.find(
      (n) => n.elementId === e.targetElementIds[0],
    );
    const node = s ?? t!;
    const who = `${node.role === 'DEBTOR' ? 'Debtor' : 'Creditor'} ${fieldName(node.semanticPath).toLowerCase()}`;
    const types = e.taxonomyEvents.map((t) => t.type);
    if (types.includes('MISPLACED'))
      return `${who} is still present, but was merged into ${t ? fieldName(t.semanticPath) : 'a different field'}.`;
    if (types.includes('TRUNCATED'))
      return `${who} was shortened; the missing portion is “${e.missingPortion?.text ?? 'not established'}”.`;
    if (types.includes('LOST'))
      return `${who} has no supported target representation.`;
    if (types.includes('UNSOURCED'))
      return `${who} has no identified source in the evaluated evidence.`;
    return `${who} survives within a shared ${t ? fieldName(t.semanticPath) : 'target field'}.`;
  });
  return { title, changes: [...new Set(changes)] };
}
