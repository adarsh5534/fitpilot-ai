import { NextFunction, Request, Response } from 'express';
import {
  OnboardingSchema,
  ProfileUpdateSchema,
} from '@fitpilot/shared';
import {
  getUserProfile,
  completeOnboarding,
  updateProfile,
} from '../services/profile.service';
import { ok } from '../types/response';

// ─── Profile Controllers ──────────────────────────────────────────────────────

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await getUserProfile(req.user!.id);
    res.status(200).json(ok(profile));
  } catch (err) {
    next(err);
  }
}

export async function onboarding(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = OnboardingSchema.parse(req.body);
    const profile = await completeOnboarding(req.user!.id, input);
    res.status(200).json(ok(profile));
  } catch (err) {
    next(err);
  }
}

export async function patchProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = ProfileUpdateSchema.parse(req.body);
    const profile = await updateProfile(req.user!.id, input);
    res.status(200).json(ok(profile));
  } catch (err) {
    next(err);
  }
}
