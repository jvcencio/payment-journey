import { z } from 'zod';
import { capture, MAX_INPUT_CHARS } from '../artifacts/capture';
import { parseMt103 } from '../adapters/mt103';
import { parsePacs008 } from '../adapters/pacs008';
import { classify } from '../lineage/classify';
import { canonicalWitness } from '../fixtures/canonical';
import { bundledWitnesses, FixtureInput } from '../fixtures/catalog';
import type {
  Diagnostic,
  LineageReport,
  ParseResult,
  Transformation,
} from '../domain/model';
export const PairInput = z.strictObject({
  source: z.string().min(1).max(MAX_INPUT_CHARS),
  target: z.string().min(1).max(MAX_INPUT_CHARS),
});
export type EvaluationResult =
  | { ok: true; report: LineageReport }
  | {
      ok: false;
      diagnostics: Diagnostic[];
      source?: ParseResult;
      target?: ParseResult;
    };
export async function evaluate(input: unknown): Promise<EvaluationResult> {
  const fixture = FixtureInput.safeParse(input);
  if (fixture.success) {
    try {
      const witness = await canonicalWitness(
        bundledWitnesses[fixture.data.fixtureId],
      );
      const transformation: Transformation = {
        transformationId: `canonical-demo:${witness.fixtureId}`,
        sourceArtifactIds: [witness.source.artifact.artifactId],
        targetArtifactIds: [witness.target.artifact.artifactId],
        pairing: 'USER_SUPPLIED',
        context: witness.context,
      };
      return {
        ok: true,
        report: {
          source: witness.source,
          target: witness.target,
          transformation,
          graph: classify(
            witness.source.snapshot,
            witness.target.snapshot,
            transformation,
          ),
          demonstration: {
            fixtureId: witness.fixtureId,
            kind: 'CANONICAL_WITNESS',
            description:
              'Explicit synthetic canonical evidence. Not extracted from MT103; no new payment adapter or policy evaluation.',
          },
        },
      };
    } catch {
      return {
        ok: false,
        diagnostics: [
          {
            code: 'INVALID_CANONICAL_WITNESS',
            message: 'The bundled canonical witness could not be verified.',
          },
        ],
      };
    }
  }
  const parsed = PairInput.safeParse(input);
  if (!parsed.success)
    return {
      ok: false,
      diagnostics: [
        {
          code: 'INVALID_INPUT',
          message:
            'Supply two non-empty text artifacts, each no larger than 256 KiB. Extra configuration is not accepted.',
        },
      ],
    };
  try {
    const [sourceArtifact, targetArtifact] = await Promise.all([
      capture(parsed.data.source, 'source'),
      capture(parsed.data.target, 'target'),
    ]);
    const source = parseMt103(sourceArtifact),
      target = parsePacs008(targetArtifact);
    if (!source.ok || !target.ok)
      return {
        ok: false,
        source,
        target,
        diagnostics: [
          ...(!source.ok
            ? source.diagnostics.map((d) => ({
                ...d,
                message: `Source: ${d.message}`,
              }))
            : []),
          ...(!target.ok
            ? target.diagnostics.map((d) => ({
                ...d,
                message: `Target: ${d.message}`,
              }))
            : []),
        ],
      };
    const transformation: Transformation = {
      transformationId: 'user-paired-comparison:1',
      sourceArtifactIds: [sourceArtifact.artifactId],
      targetArtifactIds: [targetArtifact.artifactId],
      pairing: 'USER_SUPPLIED',
    };
    return {
      ok: true,
      report: {
        source,
        target,
        transformation,
        graph: classify(source.snapshot, target.snapshot, transformation),
      },
    };
  } catch {
    return {
      ok: false,
      diagnostics: [
        {
          code: 'CAPTURE_FAILED',
          message:
            'Could not retain the input safely. Check the 256 KiB UTF-8 limit and browser cryptography support.',
        },
      ],
    };
  }
}
