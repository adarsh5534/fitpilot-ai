import { z } from 'zod';

// ─── Profile Schemas ──────────────────────────────────────────────────────────

// Step 1 of onboarding — basic body + goal
export const OnboardingSchema = z.object({
  display_name: z.string().min(2).max(50).trim(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  height_cm: z.number().min(50).max(300),
  weight_kg: z.number().min(20).max(500),
  fitness_level: z.enum(['beginner', 'intermediate', 'advanced']),
  primary_goal: z.enum(['fat_loss', 'muscle_gain', 'maintenance', 'general_fitness']),
  workout_days_per_week: z.number().int().min(1).max(7),
  equipment_access: z
    .array(z.string())
    .default([]),
  dietary_preferences: z
    .array(z.string())
    .default([]),
});

// Partial profile updates (Phase 2+)
export const ProfileUpdateSchema = OnboardingSchema.partial();

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
