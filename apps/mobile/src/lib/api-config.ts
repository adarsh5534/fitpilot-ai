import Constants from 'expo-constants';

// ─── API Client Configuration ─────────────────────────────────────────────────
// The base URL is set via EXPO_PUBLIC_API_URL environment variable.
// In development this is http://localhost:3000.
// In production it will be your deployed API URL.
//
// Why axios over fetch?
// - Interceptors for auth token injection (Phase 2)
// - Automatic JSON parsing
// - Better error objects with status codes
// - Request/response transformation
//
// We keep this file simple in Phase 1 — it will grow in Phase 2 with
// auth token interceptors and automatic token refresh.

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  Constants.expoConfig?.extra?.apiUrl ??
  'http://localhost:3000';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10_000, // 10 seconds — fail fast, don't hang
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

export { API_BASE_URL };
