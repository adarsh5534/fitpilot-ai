import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';

// ─── Health Router ────────────────────────────────────────────────────────────
// Mounted at /health in app.ts
// No auth required — intentionally public

const router = Router();

router.get('/', healthCheck);

export { router as healthRouter };
