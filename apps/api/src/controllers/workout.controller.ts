import { Request, Response, NextFunction } from 'express';
import { WorkoutPlanService } from '../services/workout-plan.service';
import { WorkoutSessionService } from '../services/workout-session.service';
import { RecommendationService } from '../services/recommendation.service';
import {
  CreateCustomPlanSchema,
  FinishSessionSchema,
  LogSetSchema,
  StartSessionSchema,
} from '@fitpilot/shared';

export class WorkoutController {
  // ── Plan Endpoints ──────────────────────────────────────────────────────────

  static async getActivePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plan = await WorkoutPlanService.getActivePlan(req.user!.id);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  static async listPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await WorkoutPlanService.listPlans(req.user!.id);
      res.json({ success: true, data: plans });
    } catch (err) {
      next(err);
    }
  }

  static async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = CreateCustomPlanSchema.parse(req.body);
      const plan = await WorkoutPlanService.createPlan(req.user!.id, input);
      res.status(201).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  static async activatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const plan = await WorkoutPlanService.activatePlan(req.user!.id, String(id));
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  // ── Session Endpoints ───────────────────────────────────────────────────────

  static async startSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = StartSessionSchema.parse(req.body);
      const session = await WorkoutSessionService.startSession(req.user!.id, input);
      res.status(201).json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  static async getActiveSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await WorkoutSessionService.getActiveSession(req.user!.id);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  static async logSet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const input = LogSetSchema.parse(req.body);
      const set = await WorkoutSessionService.logSet(req.user!.id, String(sessionId), input);
      res.status(201).json({ success: true, data: set });
    } catch (err) {
      next(err);
    }
  }

  static async finishSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const input = FinishSessionSchema.parse(req.body);
      const session = await WorkoutSessionService.finishSession(req.user!.id, String(sessionId), input);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  static async cancelSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await WorkoutSessionService.cancelSession(req.user!.id, String(sessionId));
      res.json({ success: true, data: { message: 'Workout session canceled' } });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      const history = await WorkoutSessionService.getSessionHistory(req.user!.id, limit, offset);
      res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }

  static async getSessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const session = await WorkoutSessionService.getSessionById(req.user!.id, String(sessionId));
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  // ── Smart Recommendation Endpoint ──────────────────────────────────────────

  static async getTodaySuggestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const suggestion = await RecommendationService.getTodaySuggestion(req.user!.id);
      res.json({ success: true, data: suggestion });
    } catch (err) {
      next(err);
    }
  }
}
