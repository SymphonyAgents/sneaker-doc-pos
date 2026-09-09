import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiTimeoutError, fetchWithTimeout } from './api-request';

test('aborts a request and returns a typed error when its deadline expires', async () => {
  const originalFetch = globalThis.fetch;
  let observedSignal: AbortSignal | undefined;

  globalThis.fetch = ((_input: RequestInfo | URL, init?: RequestInit) => {
    observedSignal = init?.signal ?? undefined;

    return new Promise<Response>((_resolve, reject) => {
      observedSignal?.addEventListener(
        'abort',
        () => reject(new DOMException('Aborted', 'AbortError')),
        { once: true },
      );
    });
  }) as typeof fetch;

  try {
    await assert.rejects(fetchWithTimeout('https://example.test', {}, 5), ApiTimeoutError);
    assert.equal(observedSignal?.aborted, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('preserves an external abort without converting it to a timeout', async () => {
  const originalFetch = globalThis.fetch;
  const externalController = new AbortController();

  globalThis.fetch = ((_input: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener(
        'abort',
        () => reject(new DOMException('Aborted', 'AbortError')),
        { once: true },
      );
    })) as typeof fetch;

  try {
    const request = fetchWithTimeout(
      'https://example.test',
      { signal: externalController.signal },
      1_000,
    );
    externalController.abort();

    await assert.rejects(request, (error: unknown) => {
      assert.equal(error instanceof ApiTimeoutError, false);
      assert.equal((error as Error).name, 'AbortError');
      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
