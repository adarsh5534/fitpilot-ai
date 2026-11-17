import { Router } from 'express';
import { WorkoutController } from '../controllers/workout.controller';
import { authenticate } from '../middleware/authenticate';

export const workoutRouter = Router();

// All workout endpoints require authenticated user
workoutRouter.use(authenticate);

// ── Smart Recommendation ───────────────────────────────────────────────────────
workoutRouter.get('/suggested-today', WorkoutController.getTodaySuggestion);

// ── Workout Plans ─────────────────────────────────────────────────────────────
workoutRouter.get('/plans/active', WorkoutController.getActivePlan);
workoutRouter.get('/plans', WorkoutController.listPlans);
workoutRouter.post('/plans', WorkoutController.createPlan);
workoutRouter.put('/plans/:id/activate', WorkoutController.activatePlan);

// ── Workout Sessions ──────────────────────────────────────────────────────────
workoutRouter.post('/sessions/start', WorkoutController.startSession);
workoutRouter.get('/sessions/active', WorkoutController.getActiveSession);
workoutRouter.get('/sessions/history', WorkoutController.getHistory);
workoutRouter.get('/sessions/:id', WorkoutController.getSessionById);
workoutRouter.post('/sessions/:id/sets', WorkoutController.logSet);
workoutRouter.patch('/sessions/:id/finish', WorkoutController.finishSession);
workoutRouter.delete('/sessions/:id', WorkoutController.cancelSession);
