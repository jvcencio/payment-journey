import type { EvaluationResult } from './evaluate';
export type WorkerMessage =
  { type: 'ready' } | { type: 'result'; result: EvaluationResult };
export interface EvaluationWorker {
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  postMessage(value: unknown): void;
  terminate(): void;
}
export const EVALUATION_TIMEOUT_MS = 5000;
/** Worker messages stay in the browser. Timeout/cancellation terminate parsing. */
export class BrowserEvaluator {
  private worker!: EvaluationWorker;
  private pending:
    | { resolve: (r: EvaluationResult) => void; reject: (e: Error) => void }
    | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private ready = false;
  private disposed = false;
  constructor(
    private readonly onReady: (ready: boolean) => void,
    private readonly create: () => EvaluationWorker = () =>
      new Worker(new URL('./evaluation.worker.ts', import.meta.url), {
        type: 'module',
      }),
    private readonly onFailure: (message: string) => void = () => {},
  ) {
    this.start();
  }
  private start() {
    this.worker = this.create();
    const worker = this.worker;
    this.worker.onmessage = (event) => {
      if (worker !== this.worker || this.disposed) return;
      if (event.data.type === 'ready') {
        this.ready = true;
        this.onReady(true);
        return;
      }
      clearTimeout(this.timer);
      const pending = this.pending;
      this.pending = undefined;
      pending?.resolve(event.data.result);
    };
    this.worker.onerror = () => {
      const message = 'Worker failed. Reload the page if this persists.';
      this.reset(message, false);
      this.onFailure(message);
    };
  }
  run(input: unknown): Promise<EvaluationResult> {
    if (!this.ready || this.disposed || this.pending)
      return Promise.reject(new Error('Evaluator is not ready.'));
    return new Promise((resolve, reject) => {
      this.pending = { resolve, reject };
      this.timer = setTimeout(
        () =>
          this.reset(
            'Evaluation exceeded the five-second limit; worker terminated.',
          ),
        EVALUATION_TIMEOUT_MS,
      );
      this.worker.postMessage(input);
    });
  }
  private reset(message: string, restart = true) {
    clearTimeout(this.timer);
    this.worker.onmessage = null;
    this.worker.onerror = null;
    this.worker.terminate();
    this.ready = false;
    this.onReady(false);
    const pending = this.pending;
    this.pending = undefined;
    pending?.reject(new Error(message));
    if (!this.disposed && restart) this.start();
  }
  cancel() {
    this.reset('Evaluation cancelled.');
  }
  dispose() {
    this.disposed = true;
    clearTimeout(this.timer);
    this.worker.terminate();
    this.pending?.reject(new Error('Evaluator closed.'));
    this.pending = undefined;
  }
}
