import { getSupabaseClient } from '../config/supabase';
import { AppError } from '../middleware/error-handler';
import type { OnboardingInput, UserProfile } from '@fitpilot/shared';

// ─── Profile Service ──────────────────────────────────────────────────────────

// ── Calorie & protein target calculator ───────────────────────────────────────
// Uses Mifflin-St Jeor equation for BMR, then applies TDEE multiplier.
// This is deterministic backend logic — never delegated to AI.

function computeTargets(input: OnboardingInput): {
  daily_calorie_target: number;
  daily_protein_target_g: number;
} {
  const today = new Date();
  const dob = new Date(input.date_of_birth);
  const age = today.getFullYear() - dob.getFullYear();

  // Mifflin-St Jeor BMR
  const baseBMR =
    10 * input.weight_kg + 6.25 * input.height_cm - 5 * age;

  const bmr =
    input.gender === 'male'
      ? baseBMR + 5
      : input.gender === 'female'
        ? baseBMR - 161
        : baseBMR - 78; // average for other/prefer not to say

  // Activity multiplier based on days per week
  const activityMultiplier =
    input.workout_days_per_week <= 1
      ? 1.2
      : input.workout_days_per_week <= 3
        ? 1.375
        : input.workout_days_per_week <= 5
          ? 1.55
          : 1.725;

  const tdee = Math.round(bmr * activityMultiplier);

  // Goal-based calorie adjustment
  const calorie_adjustment =
    input.primary_goal === 'fat_loss'
      ? -500
      : input.primary_goal === 'muscle_gain'
        ? 300
        : 0;

  const daily_calorie_target = tdee + calorie_adjustment;

  // Protein: 2g per kg body weight (standard for active individuals)
  const daily_protein_target_g = Math.round(input.weight_kg * 2);

  return { daily_calorie_target, daily_protein_target_g };
}

// ── Public functions ──────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new AppError(404, 'PROFILE_NOT_FOUND', 'User profile not found');
  }

  return data as UserProfile;
}

export async function completeOnboarding(
  userId: string,
  input: OnboardingInput,
): Promise<UserProfile> {
  const supabase = getSupabaseClient();

  const { daily_calorie_target, daily_protein_target_g } = computeTargets(input);

  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...input,
      daily_calorie_target,
      daily_protein_target_g,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error || !data) {
    throw new AppError(500, 'PROFILE_UPDATE_FAILED', 'Failed to update profile');
  }

  return data as UserProfile;
}

export async function updateProfile(
  userId: string,
  input: Partial<OnboardingInput>,
): Promise<UserProfile> {
  const supabase = getSupabaseClient();

  // If key body metrics changed, recompute targets
  const needsRecompute =
    'weight_kg' in input ||
    'height_cm' in input ||
    'primary_goal' in input ||
    'workout_days_per_week' in input;

  let extraFields: Partial<{ daily_calorie_target: number; daily_protein_target_g: number }> = {};

  if (needsRecompute) {
    // Load existing profile to fill in missing fields before recomputing
    const existing = await getUserProfile(userId);
    const merged = { ...existing, ...input } as OnboardingInput;
    if (merged.date_of_birth && merged.weight_kg && merged.height_cm) {
      extraFields = computeTargets(merged);
    }
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...input, ...extraFields, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error || !data) {
    throw new AppError(500, 'PROFILE_UPDATE_FAILED', 'Failed to update profile');
  }

  return data as UserProfile;
}
