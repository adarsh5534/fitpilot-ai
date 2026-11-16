import { API_CONFIG } from './api-config';
import type { ApiResponse } from '@fitpilot/shared';

// ─── Production-Grade API Client ─────────────────────────────────────────────
// - Automatically injects Bearer JWT authentication header
// - Centralizes error handling and network detection
// - Type-safe with shared ApiResponse<T>

class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // strip trailing slash
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${path}`;

    const headers: Record<string, string> = {
      ...API_CONFIG.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      const json = await response.json();
      return json as ApiResponse<T>;
    } catch (error) {
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

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body);
  }

  async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body);
  }

  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, body);
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }
}

export const apiClient = new ApiClient(API_CONFIG.baseURL);
