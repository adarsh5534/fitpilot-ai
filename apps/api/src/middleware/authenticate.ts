import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../config/jwt';

// ─── Extend Express Request ───────────────────────────────────────────────────
// Attach the authenticated user to every protected request.
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

// ─── Authentication Middleware ────────────────────────────────────────────────
// Usage: router.get('/protected', authenticate, controller)
//
// Reads Bearer token from Authorization header.
// Verifies it, then injects req.user = { id, email }.
// Rejects with 401 if token is missing, expired, or tampered.

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'MISSING_TOKEN',
        message: 'Authorization header with Bearer token is required',
      },
    });
    return;
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const payload = verifyToken(token);

    // Guard against refresh tokens being used as access tokens
    if (payload.type !== 'access') {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN_TYPE', message: 'Invalid token type' },
      });
      return;
    }

    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Access token has expired. Please refresh your session.',
        },
      });
      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or malformed token' },
      });
      return;
    }

    next(err); // unexpected error — pass to global error handler
  }
}
