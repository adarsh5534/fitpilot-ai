// ─── Shared User Types ────────────────────────────────────────────────────────
// Used by both mobile and backend. Keep in sync with database schema.

export type AuthUser = {
  id: string;        // Supabase auth.users UUID
  email: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  display_name: string | null;
  date_of_birth: string | null;       // YYYY-MM-DD
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_level: 'beginner' | 'intermediate' | 'advanced' | null;
  primary_goal: 'fat_loss' | 'muscle_gain' | 'maintenance' | 'general_fitness' | null;
  workout_days_per_week: number | null;
  equipment_access: string[];
  dietary_preferences: string[];
  daily_calorie_target: number | null;
  daily_protein_target_g: number | null;
  created_at: string;
  updated_at: string;
};

// Computed flag — true when mandatory onboarding fields are filled
export function isProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.primary_goal &&
    profile.height_cm &&
    profile.weight_kg &&
    profile.fitness_level
  );
}

export type AuthSession = {
  user: AuthUser;
  profile: UserProfile;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  profile_complete: boolean;
};
