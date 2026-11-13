// ─── Shared Response Types (API-side) ────────────────────────────────────────
// These mirror the shared package types but are defined here too so the API
// does not depend on the shared package at runtime (avoids circular build issues).
// The mobile app imports from @fitpilot/shared; the API uses these.

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Helper to create a consistent success response
export function ok<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}
