import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  BrowserEvaluator,
  EVALUATION_TIMEOUT_MS,
} from '../../src/application/browser-client';
import type {
  EvaluationWorker,
  WorkerMessage,
} from '../../src/application/browser-client';
class FakeWorker implements EvaluationWorker {
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();
  emit(data: WorkerMessage) {
    this.onmessage?.({ data } as MessageEvent<WorkerMessage>);
  }
}
afterEach(() => vi.useRealTimers());
describe('worker isolation lifecycle', () => {
  it('terminates stalled evaluation at the deadline and replaces its worker', async () => {
    vi.useFakeTimers();
    const workers: FakeWorker[] = [];
    const create = () => {
      const w = new FakeWorker();
      workers.push(w);
      return w;
    };
    const client = new BrowserEvaluator(vi.fn(), create);
    workers[0]!.emit({ type: 'ready' });
    const result = client
      .run({ source: 'fictional', target: 'fictional' })
      .catch((e) => e as Error);
    await vi.advanceTimersByTimeAsync(EVALUATION_TIMEOUT_MS);
    expect(workers[0]!.terminate).toHaveBeenCalledOnce();
    expect(workers).toHaveLength(2);
    expect(((await result) as Error).message).toContain('five-second');
    client.dispose();
  });
  it('cancels pending work and accepts results only from the current worker', async () => {
    const workers: FakeWorker[] = [];
    const client = new BrowserEvaluator(vi.fn(), () => {
      const w = new FakeWorker();
      workers.push(w);
      return w;
    });
    workers[0]!.emit({ type: 'ready' });
    const staleHandler = workers[0]!.onmessage!;
    const result = client.run({}).catch((e) => e as Error);
    client.cancel();
    expect(((await result) as Error).message).toBe('Evaluation cancelled.');
    expect(workers[0]!.terminate).toHaveBeenCalled();
    workers[1]!.emit({ type: 'ready' });
    let resolved = false;
    const next = client.run({}).then((r) => {
      resolved = true;
      return r;
    });
    staleHandler(
      new MessageEvent<WorkerMessage>('message', {
        data: { type: 'result', result: { ok: false, diagnostics: [] } },
      }),
    );
    await Promise.resolve();
    expect(resolved).toBe(false);
    workers[1]!.emit({
      type: 'result',
      result: { ok: false, diagnostics: [] },
    });
    expect(await next).toEqual({ ok: false, diagnostics: [] });
    client.dispose();
  });
});
