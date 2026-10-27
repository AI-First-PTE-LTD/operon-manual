import { defineMiddleware } from 'astro:middleware';

/**
 * Cloudflare Workers send no User-Agent header on outgoing fetch requests, and the GitHub REST API rejects such
 * requests with 403 (design R2). Keystatic's server routes call GitHub on sign-out (DELETE
 * api.github.com/applications/{client_id}/token, which revokes the editor's token) and ignore the response, so without
 * this header a sign-out leaves the token valid and nobody notices. This wrapper adds a User-Agent to requests for
 * github.com hosts that have none, and logs the result of every token revocation.
 */
const USER_AGENT = 'operon-manual-keystatic';
const GITHUB_HOSTS = new Set(['github.com', 'api.github.com']);

const originalFetch = globalThis.fetch;

globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const request = new Request(input, init);
  const url = new URL(request.url);
  if (!GITHUB_HOSTS.has(url.hostname)) return originalFetch(request);
  if (!request.headers.has('user-agent')) request.headers.set('user-agent', USER_AGENT);
  const response = await originalFetch(request);
  if (url.hostname === 'api.github.com' && url.pathname.endsWith('/token') && request.method === 'DELETE') {
    if (response.ok) console.log(`GitHub token revoked (${response.status})`);
    else console.error(`GitHub token revocation failed with status ${response.status}`);
  }
  return response;
};

export const onRequest = defineMiddleware((_context, next) => next());
