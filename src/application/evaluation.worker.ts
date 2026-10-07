import { evaluate } from './evaluate';
self.onmessage = async (event: MessageEvent<unknown>) => {
  try {
    self.postMessage({ type: 'result', result: await evaluate(event.data) });
  } catch {
    self.postMessage({
      type: 'result',
      result: {
        ok: false,
        diagnostics: [
          {
            code: 'EVALUATION_FAILED',
            message: 'Evaluation could not complete safely.',
          },
        ],
      },
    });
  }
};
self.postMessage({ type: 'ready' });
