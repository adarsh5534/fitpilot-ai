import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import { healthRouter } from './routes/health.router';
import { authRouter } from './routes/auth.router';
import { profileRouter } from './routes/profile.router';

// ─── Express Application Factory ──────────────────────────────────────────────
// We export a factory function (not the app directly) so we can create
// isolated app instances in tests without port conflicts.

export function createApp() {
  const app = express();

  // ── Security middleware ────────────────────────────────────────────────────
  // helmet sets secure HTTP headers (X-Frame-Options, CSP, etc.)
  app.use(helmet());

  // CORS: in development, allow the Expo dev server.
  // In production, replace with your actual domain.
  app.use(
    cors({
      origin:
        env.NODE_ENV === 'production'
          ? process.env.ALLOWED_ORIGIN ?? false
          : [
              'http://localhost:8081', // Expo web
              'http://localhost:19006', // Expo web (legacy)
              /^exp:\/\//,             // Expo Go app
            ],
      credentials: true,
    }),
  );

  // ── Rate limiting ──────────────────────────────────────────────────────────
  // 100 requests per 15 minutes per IP. Protects against brute-force.
  // The health endpoint is included — this is intentional.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait before retrying.',
        },
      },
    }),
  );

  // ── Body parsing ───────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── Request logging ────────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── Routes ────────────────────────────────────────────────────────────────
  app.use('/health', healthRouter);
  app.use('/auth', authRouter);
  app.use('/profile', profileRouter);

  // 404 handler — catches unmatched routes before error handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested endpoint does not exist.',
      },
    });
  });

  // ── Centralised error handler (must be last) ───────────────────────────────
  app.use(errorHandler);

  return app;
}
