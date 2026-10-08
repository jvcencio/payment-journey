import { z } from 'zod';
import { capture } from '../artifacts/capture';
import { locatorFactory, snapshotBuilder } from '../adapters/shared';
import type {
  Artifact,
  LineageContext,
  ParseResult,
  SemanticNode,
} from '../domain/model';

const concepts = [
  'name',
  'address.careOf',
  'address.department',
  'address.subDepartment',
  'address.streetName',
  'address.buildingNumber',
  'address.buildingName',
  'address.floor',
  'address.unitNumber',
  'address.postBox',
  'address.room',
  'address.postCode',
  'address.townName',
  'address.townLocationName',
  'address.districtName',
  'address.countrySubdivision',
  'address.country',
  'address.addressLines',
] as const;
const Reference = z.strictObject({
  role: z.enum(['DEBTOR', 'CREDITOR']),
  concept: z.enum(concepts),
  occurrence: z.number().int().min(0).max(200),
});
const RecordLine = Reference.extend({ value: z.string().min(1).max(4096) });
const Context = z.strictObject({
  fixtureId: z.enum(['C', 'D', 'E', 'F', 'J']),
  version: z.literal('0.2.0'),
  synthetic: z.literal(true),
  statement: z.string().min(1),
  sourceCoverage: z.enum(['COMPLETE', 'INCOMPLETE']),
  targetCoverage: z.enum(['COMPLETE', 'INCOMPLETE']),
  originEvidence: z.enum(['COMPLETE', 'INCOMPLETE']),
  bindings: z
    .array(
      z.strictObject({
        kind: z.enum(['CONCATENATION', 'PREFIX']),
        sources: z.array(Reference).min(1).max(20),
        target: Reference,
      }),
    )
    .max(100),
});
export interface CanonicalWitness {
  source: string;
  target: string;
  context: string;
}
/** Internal bundled test-evidence reader. Not an upload adapter or payment family. */
export async function canonicalWitness(raw: CanonicalWitness): Promise<{
  source: Extract<ParseResult, { ok: true }>;
  target: Extract<ParseResult, { ok: true }>;
  context: LineageContext;
  fixtureId: string;
}> {
  const declaration = Context.parse(JSON.parse(raw.context));
  async function read(text: string, side: 'source' | 'target') {
    const captured = await capture(text, side);
    const artifact: Artifact = {
      ...captured,
      formatFamily: 'CANONICAL_TEST',
      messageType: 'Synthetic canonical witness',
      messageVersion: '0.2.0',
      parserVersion: 'canonical-witness-0.2.0',
    };
    const b = snapshotBuilder(artifact),
      locate = locatorFactory(text);
    const parties = new Map<string, ReturnType<typeof b.participant>>();
    let offset = 0,
      recordCount = 0;
    for (const line of text.split('\n')) {
      if (!line.trim()) {
        offset += line.length + 1;
        continue;
      }
      if (++recordCount > 200) throw new Error('Witness exceeds record limit.');
      const record = RecordLine.parse(JSON.parse(line));
      let party = parties.get(record.role);
      if (!party) {
        party = b.participant(record.role);
        parties.set(record.role, party);
      }
      const node = b.add(
        party,
        record.concept,
        record.value,
        locate(
          `${side}/records[${recordCount}]/${record.role}/${record.concept}[${record.occurrence}]`,
          offset,
          offset + line.length,
        ),
      );
      if (node.occurrence !== record.occurrence)
        throw new Error(
          'Witness occurrences must be ordered, contiguous and unique per role/concept.',
        );
      offset += line.length + 1;
    }
    const result = b.finish();
    if (!result.ok) throw new Error('Witness compilation failed.');
    result.coverage.semanticScope =
      'Bundled canonical witness: explicitly known debtor/creditor names and address concepts. Not MT/pacs parsing or network validation.';
    return result;
  }
  const [source, target, capturedContext] = await Promise.all([
    read(raw.source, 'source'),
    read(raw.target, 'target'),
    capture(raw.context, 'source'),
  ]);
  const contextId = `context:${capturedContext.payloadHash}`;
  const contextArtifact: Artifact = {
    ...capturedContext,
    artifactId: contextId,
    rawPayloadReference: contextId,
    formatFamily: 'CANONICAL_TEST',
    messageType: 'Synthetic correspondence and coverage declaration',
    messageVersion: '0.2.0',
    parserVersion: 'canonical-witness-0.2.0',
  };
  const evidenceId = `${contextId}:evidence`;
  const find = (nodes: SemanticNode[], ref: z.infer<typeof Reference>) => {
    const matched = nodes.filter(
      (n) =>
        n.role === ref.role &&
        n.semanticPath === ref.concept &&
        n.occurrence === ref.occurrence,
    );
    if (matched.length !== 1)
      throw new Error(
        'Witness binding references an absent or ambiguous occurrence.',
      );
    return matched[0]!.elementId;
  };
  return {
    source,
    target,
    fixtureId: declaration.fixtureId,
    context: {
      sourceComplete: declaration.sourceCoverage === 'COMPLETE',
      targetComplete: declaration.targetCoverage === 'COMPLETE',
      originComplete: declaration.originEvidence === 'COMPLETE',
      bindings: declaration.bindings.map((b, i) => ({
        bindingId: `${contextId}:binding:${i}`,
        kind: b.kind,
        sourceElementIds: b.sources.map((ref) =>
          find(source.snapshot.nodes, ref),
        ),
        targetElementId: find(target.snapshot.nodes, b.target),
        evidenceRefs: [evidenceId],
      })),
      artifacts: [contextArtifact],
      evidence: [
        {
          evidenceId,
          artifactId: contextId,
          kind: 'TRANSFORMATION_CONTEXT',
          locator: locatorFactory(raw.context)(
            'context',
            0,
            raw.context.length,
          ),
          rawValue: raw.context,
        },
      ],
    },
  };
}
