import { z } from 'zod';

// ─── Generic API Response Envelope ───────────────────────────────────────────
// Every API response from FitPilot backend follows this shape.
// Using a consistent envelope makes mobile-side error handling uniform.

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;       // machine-readable, e.g. "VALIDATION_ERROR"
    message: string;    // human-readable
    details?: unknown;  // Zod issues, etc.
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Pagination ───────────────────────────────────────────────────────────────
export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// ─── Health Check ─────────────────────────────────────────────────────────────
export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded', 'down']),
  timestamp: z.string().datetime(),
  version: z.string(),
  services: z.object({
    database: z.enum(['connected', 'disconnected', 'unknown']),
  }),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
