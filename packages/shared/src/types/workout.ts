// Workout domain types for FitPilot AI

export type MuscleGroup =
  | 'chest'
  | 'upper_chest'
  | 'lower_chest'
  | 'lats'
  | 'rhomboids'
  | 'lower_traps'
  | 'traps'
  | 'upper_back'
  | 'lower_back'
  | 'anterior_deltoid'
  | 'lateral_deltoid'
  | 'rear_deltoid'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'biceps'
  | 'brachialis'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'rectus_abdominis';

export type MovementType = 'compound' | 'isolation' | 'cardio' | 'bodyweight';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  muscle_groups: string[];
  equipment: string[];
  movement_type: MovementType;
  difficulty: ExerciseDifficulty;
  instructions: string[];
  video_url: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  difficulty: ExerciseDifficulty;
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance' | 'general_fitness';
  days_per_week: number;
  is_template: boolean;
  is_active: boolean;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
  days?: WorkoutPlanDay[];
}

export interface WorkoutPlanDay {
  id: string;
  plan_id: string;
  user_id: string | null;
  day_number: number;
  name: string;
  notes: string | null;
  created_at: string;
  exercises?: PlanDayExerciseWithDetails[];
}

export interface PlanDayExercise {
  id: string;
  plan_day_id: string;
  user_id: string | null;
  exercise_id: string;
  display_order: number;
  target_sets: number;
  target_reps_min: number;
  target_reps_max: number;
  target_weight_kg: number | null;
  rest_seconds: number;
  notes: string | null;
  created_at: string;
}

export interface PlanDayExerciseWithDetails extends PlanDayExercise {
  exercise: Exercise;
}

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

export interface WorkoutSession {
  id: string;
  user_id: string;
  plan_day_id: string | null;
  name: string;
  notes: string | null;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number | null;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  user_id: string;
  exercise_id: string;
  set_number: number;
  reps_completed: number | null;
  weight_kg: number | null;
  rpe: number | null;
  duration_seconds: number | null;
  notes: string | null;
  is_warmup: boolean;
  is_skipped: boolean;
  completed_at: string;
  created_at: string;
  exercise?: Exercise;
}

export interface WorkoutSessionDetail extends WorkoutSession {
  sets: WorkoutSet[];
  total_volume_kg?: number;
  total_sets_completed?: number;
  plan_day?: WorkoutPlanDay;
}

export interface WorkoutSuggestion {
  plan_id: string;
  plan_name: string;
  day_id: string;
  day_name: string;
  day_number: number;
  target_muscle_groups: string[];
  exercises: Array<{
    exercise: Exercise;
    target_sets: number;
    target_reps_min: number;
    target_reps_max: number;
    target_weight_kg: number | null;
    suggested_weight_kg: number | null;
    previous_weight_kg: number | null;
    previous_reps: number | null;
    rest_seconds: number;
    notes: string | null;
  }>;
  recovery_status: {
    recovered_groups: string[];
    fatigued_groups: string[];
    last_workout_date: string | null;
    readiness_score: number; // 0 - 100
  };
}
