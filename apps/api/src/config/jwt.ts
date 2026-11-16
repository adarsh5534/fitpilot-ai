import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// ─── JWT Utilities ─────────────────────────────────────────────────────────────
// We issue our own JWTs on top of Supabase auth.
// Supabase returns a session but we layer our own tokens for two reasons:
// 1. We control expiry, payload shape, and rotation policy.
// 2. Future flexibility (e.g., adding device-scoped tokens, roles).

export type JwtPayload = {
  sub: string;    // user_id (UUID)
  email: string;
  type: 'access' | 'refresh';
};

export function signAccessToken(payload: Omit<JwtPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
  );
}

export function signRefreshToken(payload: Omit<JwtPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
  );
}

export function verifyToken(token: string): JwtPayload {
  // Throws JsonWebTokenError or TokenExpiredError if invalid
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
