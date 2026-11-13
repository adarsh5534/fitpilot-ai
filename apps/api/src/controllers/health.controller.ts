import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../config/supabase';
import { env } from '../config/env';
import { ok } from '../types/response';

// ─── Health Controller ────────────────────────────────────────────────────────
// GET /health
//
// Returns the operational status of the API and its dependencies.
// Used by:
// - Mobile app startup (verify backend is reachable)
// - Monitoring/uptime checks in production
// - Developer smoke test after deployment
//
// Important: this endpoint does NOT require authentication.
// It should not leak sensitive information (no env vars, no stack traces).

export async function healthCheck(req: Request, res: Response): Promise<void> {
  const dbConnected = await checkDatabaseConnection();

  const data = {
    status: dbConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
    },
  } as const;

  // If the database is down, return 503 so load balancers can route away
  const statusCode = dbConnected ? 200 : 503;

  res.status(statusCode).json(ok(data));
}
