import { Router } from 'express';
import { getProfile, onboarding, patchProfile } from '../controllers/profile.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// GET  /profile         — fetch current user's profile
router.get('/', getProfile);

// PUT  /profile/onboarding — complete initial fitness setup
router.put('/onboarding', onboarding);

// PATCH /profile        — update individual profile fields
router.patch('/', patchProfile);

export { router as profileRouter };
