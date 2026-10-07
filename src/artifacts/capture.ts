import type { Artifact } from '../domain/model';
export const MAX_INPUT_BYTES = 262_144;
export const MAX_INPUT_CHARS = MAX_INPUT_BYTES;
export function withinSize(raw: string): boolean {
  return (
    raw.length <= MAX_INPUT_CHARS &&
    new TextEncoder().encode(raw).length <= MAX_INPUT_BYTES
  );
}
export async function capture(
  rawPayload: string,
  side: 'source' | 'target',
): Promise<Artifact> {
  if (!withinSize(rawPayload)) throw new Error('INPUT_TOO_LARGE');
  const bytes = new TextEncoder().encode(rawPayload);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const payloadHash = Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
  const artifactId = `${side}:${payloadHash}`;
  return {
    artifactId,
    formatFamily: side === 'source' ? 'MT' : 'pacs',
    messageType: side === 'source' ? 'MT103' : 'pacs.008',
    messageVersion:
      side === 'source' ? 'project-option-f-subset-v1' : 'pacs.008.001.14',
    parserVersion: '0.1.0',
    rawPayloadReference: artifactId,
    rawPayload,
    payloadHash,
    hashAlgorithm: 'SHA-256',
    encoding: 'UTF-8',
  };
}
