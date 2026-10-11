import { ENV } from './env';

/**
 * Sentry integration placeholder.
 *
 * Provide EXPO_PUBLIC_SENTRY_DSN in your `.env` to enable crash/error
 * reporting. Without a DSN, Sentry stays disabled and errors are logged to the
 * console in development instead.
 */
export function initSentry(): void {
  if (!ENV.sentryDsn) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Sentry] disabled — no EXPO_PUBLIC_SENTRY_DSN configured.');
    }
  }
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn('[captureError]', error, context ?? '');
  }
}

export function setSentryUser(user: { id: string; email?: string } | null): void {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[SentryUser]', user);
  }
}
