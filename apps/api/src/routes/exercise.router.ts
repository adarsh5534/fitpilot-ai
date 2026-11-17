import { Router } from 'express';
import { ExerciseController } from '../controllers/exercise.controller';
import { authenticate } from '../middleware/authenticate';

export const exerciseRouter = Router();

// Exercise library is readable by all authenticated users
exerciseRouter.get('/', authenticate, ExerciseController.listExercises);
exerciseRouter.get('/:id', authenticate, ExerciseController.getExerciseById);
