import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  RegisterSchema,
  LoginSchema,
  RefreshSchema,
} from '@fitpilot/shared';
import {
  registerUser,
  loginUser,
  refreshUserTokens,
} from '../services/auth.service';
import { verifyToken } from '../config/jwt';
import { ok } from '../types/response';

// ─── Auth Controllers ─────────────────────────────────────────────────────────

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = RegisterSchema.parse(req.body);
    const session = await registerUser(input);
    res.status(201).json(ok(session));
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = LoginSchema.parse(req.body);
    const session = await loginUser(input);
    res.status(200).json(ok(session));
  } catch (err) {
    next(err);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { refresh_token } = RefreshSchema.parse(req.body);

    // Verify the refresh token
    const payload = verifyToken(refresh_token);
    if (payload.type !== 'refresh') {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN_TYPE', message: 'Expected a refresh token' },
      });
      return;
    }

    const tokens = await refreshUserTokens(payload.sub, payload.email);
    res.status(200).json(ok(tokens));
  } catch (err) {
    next(err);
  }
}

export async function logout(
  _req: Request,
  res: Response,
): Promise<void> {
  // With stateless JWTs, logout is handled on the client by deleting tokens.
  // Server-side: return 200 to confirm. In Phase 5+ we can maintain a blocklist.
  res.status(200).json(ok({ message: 'Logged out successfully' }));
}
