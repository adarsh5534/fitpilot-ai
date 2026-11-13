import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { ApiError } from '../types/response';

// ─── Centralised Error Handler ────────────────────────────────────────────────
// This is the LAST middleware registered in app.ts.
// Any error passed to next(err) lands here.
//
// Design decisions:
// - ZodError → 422 Unprocessable Entity (input validation failure)
// - Generic Error → 500 (unexpected)
// - In production, never leak internal error messages to the client

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // --- Known application errors ---
  if (err instanceof AppError) {
    const body: ApiError = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(env.NODE_ENV !== 'production' && err.details
          ? { details: err.details }
          : {}),
      },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  // --- Zod validation errors ---
  if (err instanceof ZodError) {
    const body: ApiError = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.flatten().fieldErrors,
      },
    };
    res.status(422).json(body);
    return;
  }

  // --- Unexpected errors ---
  const isKnownError = err instanceof Error;
  console.error('[Unhandled Error]', err);

  const body: ApiError = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        env.NODE_ENV !== 'production' && isKnownError
          ? err.message
          : 'An unexpected error occurred',
    },
  };
  res.status(500).json(body);
}
