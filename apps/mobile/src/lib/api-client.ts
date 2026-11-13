import { API_CONFIG } from './api-config';

// ─── Lightweight Fetch-Based API Client ───────────────────────────────────────
// Phase 1: simple wrapper around fetch. We'll add axios + interceptors in Phase 2
// once we have auth tokens to inject.
//
// All API calls return ApiResponse<T> — always check `response.success` before use.

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = {
  success: false;
  error: { code: string; message: string; details?: unknown };
};
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // strip trailing slash
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${path}`;

    try {
      const response = await fetch(url, {
        method,
        headers: API_CONFIG.headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      const json = await response.json();
      return json as ApiResponse<T>;
    } catch (error) {
      // Network error — no response received
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Could not reach the server. Check your connection.',
        },
      };
    }
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path);
  }

  async post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body);
  }

  async put<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body);
  }

  async patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, body);
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }
}

export const apiClient = new ApiClient(API_CONFIG.baseURL);
