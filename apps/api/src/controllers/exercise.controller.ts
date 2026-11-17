import { Request, Response, NextFunction } from 'express';
import { ExerciseService } from '../services/exercise.service';
import { ExerciseFilterSchema } from '@fitpilot/shared';

export class ExerciseController {
  static async listExercises(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedFilters = ExerciseFilterSchema.parse(req.query);
      const result = await ExerciseService.listExercises(parsedFilters);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getExerciseById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const exercise = await ExerciseService.getExerciseById(String(id));
      res.json({ success: true, data: exercise });
    } catch (err) {
      next(err);
    }
  }
}
