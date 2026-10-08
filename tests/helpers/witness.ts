import { readFileSync } from 'node:fs';
export function witnessRaw(id: string) {
  const dir = `fixtures/canonical/${id}`;
  return {
    source: readFileSync(`${dir}/source.jsonl`, 'utf8'),
    target: readFileSync(`${dir}/target.jsonl`, 'utf8'),
    context: readFileSync(`${dir}/context.json`, 'utf8'),
  };
}
