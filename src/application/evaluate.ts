import { z } from 'zod';
import { capture, MAX_INPUT_CHARS } from '../artifacts/capture';
import { parseMt103 } from '../adapters/mt103';
import { parsePacs008 } from '../adapters/pacs008';
import { preservation } from '../lineage/preservation';
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
        graph: preservation(source.snapshot, target.snapshot, transformation),
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
