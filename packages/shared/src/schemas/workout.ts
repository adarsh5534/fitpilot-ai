import { z } from 'zod';

export const ExerciseFilterSchema = z.object({
  muscle_group: z.string().optional(),
  equipment: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type ExerciseFilterInput = z.infer<typeof ExerciseFilterSchema>;

export const StartSessionSchema = z.object({
  plan_day_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1, 'Session name is required').default('Workout Session'),
  notes: z.string().nullable().optional(),
});

export type StartSessionInput = z.infer<typeof StartSessionSchema>;

export const LogSetSchema = z.object({
  exercise_id: z.string().uuid('Valid exercise ID is required'),
  set_number: z.number().int().positive(),
  reps_completed: z.number().int().nonnegative().optional(),
  weight_kg: z.number().nonnegative().optional(),
  rpe: z.number().min(1).max(10).optional(),
  duration_seconds: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
  is_warmup: z.boolean().optional().default(false),
  is_skipped: z.boolean().optional().default(false),
});

export type LogSetInput = z.infer<typeof LogSetSchema>;

export const FinishSessionSchema = z.object({
  notes: z.string().optional(),
  duration_seconds: z.number().int().nonnegative().optional(),
});

export type FinishSessionInput = z.infer<typeof FinishSessionSchema>;

export const CreateCustomPlanSchema = z.object({
  name: z.string().min(2, 'Plan name must be at least 2 characters'),
  description: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  goal: z.enum(['fat_loss', 'muscle_gain', 'maintenance', 'general_fitness']).default('muscle_gain'),
  days_per_week: z.number().int().min(1).max(7),
  days: z.array(
    z.object({
      day_number: z.number().int().min(1).max(7),
      name: z.string().min(1, 'Day name is required'),
      notes: z.string().optional(),
      exercises: z.array(
        z.object({
          exercise_id: z.string().uuid(),
          display_order: z.number().int().nonnegative(),
          target_sets: z.number().int().positive().default(3),
          target_reps_min: z.number().int().positive().default(8),
          target_reps_max: z.number().int().positive().default(12),
          target_weight_kg: z.number().nonnegative().optional(),
          rest_seconds: z.number().int().nonnegative().default(90),
          notes: z.string().optional(),
        })
      ).default([]),
    })
  ).min(1, 'At least one training day is required'),
});

export type CreateCustomPlanInput = z.infer<typeof CreateCustomPlanSchema>;
