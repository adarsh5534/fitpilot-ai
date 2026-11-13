import { NextFunction, Request, Response } from 'express';

// ─── Request Logger ───────────────────────────────────────────────────────────
// Logs: method, path, status code, response time.
// Intentionally simple — no external logging library in Phase 1.
// In production we'd use pino or winston with structured JSON output.
//
// Security: We log the path but NOT query params or request bodies,
// which could contain sensitive user data.

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();
  const { method, path } = req;

  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const color =
      status >= 500
        ? '\x1b[31m' // red
        : status >= 400
          ? '\x1b[33m' // yellow
          : '\x1b[32m'; // green
    const reset = '\x1b[0m';

    console.log(`${color}${method} ${path} ${status} ${ms}ms${reset}`);
  });

  next();
}
