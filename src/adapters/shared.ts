import type {
  Artifact,
  CanonicalPaymentSnapshot,
  Diagnostic,
  Locator,
  ParseResult,
  ParticipantOccurrence,
  SemanticNode,
  UnmappedElement,
} from '../domain/model';
export class ParseFailure extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly offset = 0,
  ) {
    super(message);
  }
}
export function locatorFactory(raw: string) {
  const starts = [0];
  for (const match of raw.matchAll(/\r\n|\r|\n/g))
    starts.push(match.index + match[0].length);
  return (path: string, start: number, end: number): Locator => {
    let low = 0,
      high = starts.length;
    while (low + 1 < high) {
      const mid = (low + high) >>> 1;
      if (starts[mid]! <= start) low = mid;
      else high = mid;
    }
    return {
      path,
      start,
      end,
      line: low + 1,
      column: start - starts[low]! + 1,
    };
  };
}
export function snapshotBuilder(artifact: Artifact) {
  const snapshot: CanonicalPaymentSnapshot = {
    snapshotId: `${artifact.artifactId}:snapshot`,
    artifactId: artifact.artifactId,
    schemaVersion: '0.1.0',
    parserVersion: artifact.parserVersion,
    transactions: [
      { transactionId: `${artifact.artifactId}:tx:1`, participants: [] },
    ],
    nodes: [],
    evidence: [],
  };
  const tx = snapshot.transactions[0]!;
  const unmapped: UnmappedElement[] = [];
  const warnings: Diagnostic[] = [];
  function participant(role: 'DEBTOR' | 'CREDITOR'): ParticipantOccurrence {
    const p: ParticipantOccurrence = {
      occurrenceId: `${tx.transactionId}:${role}:1`,
      role,
      kind: 'PARTY',
      identity: { nameRefs: [], identifierRefs: [] },
      postalAddress: {
        components: {},
        addressLines: [],
        representation: 'EMPTY',
      },
      accountRefs: [],
    };
    tx.participants.push(p);
    return p;
  }
  function add(
    p: ParticipantOccurrence,
    concept: string,
    value: string,
    locator: Locator,
  ): SemanticNode {
    const occurrence = snapshot.nodes.filter(
      (n) =>
        n.participantOccurrenceId === p.occurrenceId &&
        n.semanticPath === concept,
    ).length;
    const elementId = `${p.occurrenceId}:${concept}:${occurrence}`;
    const evidenceId = `${elementId}:evidence`;
    const rawValue = artifact.rawPayload.slice(locator.start, locator.end);
    const node: SemanticNode = {
      elementId,
      artifactId: artifact.artifactId,
      transactionId: tx.transactionId,
      participantOccurrenceId: p.occurrenceId,
      role: p.role,
      semanticPath: concept,
      occurrence,
      value,
      rawValue,
      sourceLocator: locator,
      interpretationMethod: 'direct-encoding',
      interpretationConfidence: 'EXPLICIT',
      material: concept !== 'account',
      evidenceRefs: [evidenceId],
    };
    snapshot.nodes.push(node);
    snapshot.evidence.push({
      evidenceId,
      artifactId: artifact.artifactId,
      locator,
      rawValue,
      kind: 'ARTIFACT',
    });
    if (concept === 'name') p.identity.nameRefs.push(elementId);
    else if (concept === 'account') p.accountRefs.push(elementId);
    else if (concept === 'address.addressLines')
      p.postalAddress.addressLines.push(elementId);
    else if (concept.startsWith('address.')) {
      const key = concept.slice(8) as keyof typeof p.postalAddress.components;
      p.postalAddress.components[key] = elementId;
    }
    return node;
  }
  function unknown(locator: Locator, reason: string) {
    unmapped.push({
      artifactId: artifact.artifactId,
      locator,
      rawValue: artifact.rawPayload.slice(locator.start, locator.end),
      reason,
    });
  }
  function finish(): ParseResult {
    for (const p of tx.participants) {
      const structured = Object.keys(p.postalAddress.components).length > 0;
      const lines = p.postalAddress.addressLines.length > 0;
      p.postalAddress.representation = structured
        ? lines
          ? 'HYBRID'
          : 'STRUCTURED'
        : lines
          ? 'UNSTRUCTURED'
          : 'EMPTY';
    }
    return {
      ok: true,
      artifact,
      snapshot,
      unmapped,
      warnings,
      coverage: {
        wellFormed: true,
        supportedMessage: true,
        semanticScope:
          'Debtor/creditor names and explicitly encoded postal address elements only. Accounts retained, not evaluated for fidelity.',
        materialElements: snapshot.nodes.filter((n) => n.material).length,
        uninterpretedItems: unmapped.length,
        fullSchemaValidation: false,
        networkProfileValidation: false,
      },
    };
  }
  return { snapshot, participant, add, unknown, warnings, finish };
}
export function failure(artifact: Artifact, error: unknown): ParseResult {
  const e =
    error instanceof ParseFailure
      ? error
      : new ParseFailure(
          'PARSE_ERROR',
          'Input could not be interpreted safely.',
        );
  return {
    ok: false,
    artifact,
    diagnostics: [
      {
        code: e.code,
        message: e.message,
        locator: locatorFactory(artifact.rawPayload)(
          'input',
          e.offset,
          e.offset,
        ),
      },
    ],
  };
}
