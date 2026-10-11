/**
 * Typed access to public environment variables.
 * Expo inlines `EXPO_PUBLIC_*` values at build time.
 */
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://56.228.42.75:3000/api';
const cleanUrl = rawApiUrl.replace(/\/+$/, '');
const apiUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';
const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
export const ENV = {
  apiUrl,
  sentryDsn,
  googleMapsApiKey,
} as const;
