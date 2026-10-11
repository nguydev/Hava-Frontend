import { ENV } from '@/lib/env';
import { storage, STORAGE_KEYS } from '@/lib/storage';

/** Normalized API error thrown by both the HTTP client and the mock server. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  query?: Record<string, unknown>;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const base = `${ENV.apiUrl}${path}`;
  if (!query) return base;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
  });
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Thin fetch wrapper: injects the auth token, serializes JSON, and normalizes
 * errors to `ApiError`. This is the real-backend transport used when the app is
 * not running against the built-in mock server.
 */
export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, query } = options;
  const token = storage.getString(STORAGE_KEYS.authToken);

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? err.message : 'Network request failed',
      0,
    );
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : null) ?? `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

/**
 * Generator-based API transport for progressive UX.
 *
 * Usage in a component:
 * ```ts
 * const gen = httpStream<User[]>(ENDPOINTS.users);
 * for await (const event of gen) {
 *   if (event.status === 'loading') showSkeleton();
 *   if (event.status === 'success') render(event.data);
 *   if (event.status === 'error') showError(event.error);
 * }
 * ```
 *
 * This lets the UI react to the three phases without any extra useState calls.
 */
export async function* httpStream<T>(
  path: string,
  options: RequestOptions = {},
): AsyncGenerator<
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: ApiError }
> {
  yield { status: 'loading' };
  try {
    const data = await http<T>(path, options);
    yield { status: 'success', data };
  } catch (err) {
    const apiErr = err instanceof ApiError ? err : new ApiError(String(err));
    yield { status: 'error', error: apiErr };
  }
}
