import { getSupabaseClient } from '../config/supabase';
import { AppError } from '../middleware/error-handler';
import { WorkoutPlanService } from './workout-plan.service';
import type {
  Exercise,
  WorkoutPlanDay,
  WorkoutSession,
  WorkoutSet,
  WorkoutSuggestion,
} from '@fitpilot/shared';

export class RecommendationService {
  /**
   * Intelligently computes today's suggested workout:
   * - Analyzes muscle recovery states (fatigue window: 48 hours)
   * - Determines the next day in the athlete's active plan
   * - Populates exercises, target sets, and progressive overload weights
   */
  static async getTodaySuggestion(userId: string): Promise<WorkoutSuggestion> {
    const supabase = getSupabaseClient();

    // 1. Get active plan
    const plan = await WorkoutPlanService.getActivePlan(userId);
    if (!plan || !plan.days || plan.days.length === 0) {
      throw new AppError(404, 'NOT_FOUND', 'No active workout plan or routines found.');
    }

    // 2. Fetch completed sessions from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentSessions } = await supabase
      .from('workout_sessions')
      .select('id, plan_day_id, finished_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('finished_at', sevenDaysAgo)
      .order('finished_at', { ascending: false });

    // 3. Muscle recovery analysis
    const fatiguedGroups = new Set<string>();
    const recoveredGroups = new Set<string>([
      'chest',
      'upper_chest',
      'lats',
      'quadriceps',
      'hamstrings',
      'glutes',
      'shoulders',
      'biceps',
      'triceps',
      'core',
    ]);

    let lastCompletedSession: { id: string; plan_day_id: string | null; finished_at: string } | null = null;

    if (recentSessions && recentSessions.length > 0) {
      lastCompletedSession = recentSessions[0];
      const now = Date.now();

      // Look at sets from sessions in last 48 hours
      const fortyEightHoursAgo = new Date(now - 48 * 60 * 60 * 1000).toISOString();
      const recentSessionIds = recentSessions
        .filter((s) => s.finished_at && s.finished_at >= fortyEightHoursAgo)
        .map((s) => s.id);

      if (recentSessionIds.length > 0) {
        const { data: recentSets } = await supabase
          .from('workout_sets')
          .select('exercise:exercises (muscle_groups)')
          .in('session_id', recentSessionIds);

        if (recentSets) {
          for (const s of recentSets) {
            const ex = (s as unknown as { exercise?: { muscle_groups?: string[] } }).exercise;
            if (ex?.muscle_groups) {
              for (const mg of ex.muscle_groups) {
                fatiguedGroups.add(mg);
                recoveredGroups.delete(mg);
              }
            }
          }
        }
      }
    }

    // 4. Determine next Day in the plan
    const sortedDays = [...plan.days].sort((a, b) => a.day_number - b.day_number);
    let targetDay: WorkoutPlanDay = sortedDays[0];

    if (lastCompletedSession?.plan_day_id) {
      const lastIndex = sortedDays.findIndex((d) => d.id === lastCompletedSession!.plan_day_id);
      if (lastIndex !== -1) {
        // Move to the next day in cyclic sequence
        const nextIndex = (lastIndex + 1) % sortedDays.length;
        targetDay = sortedDays[nextIndex];
      }
    }

    // 5. Extract target muscle groups for target day
    const dayMuscleGroups = new Set<string>();
    for (const pe of targetDay.exercises || []) {
      for (const mg of pe.exercise?.muscle_groups || []) {
        dayMuscleGroups.add(mg);
      }
    }

    // 6. Compute readiness score (0–100%)
    let readinessScore = 100;
    if (dayMuscleGroups.size > 0) {
      let fatiguedCount = 0;
      for (const mg of dayMuscleGroups) {
        if (fatiguedGroups.has(mg)) fatiguedCount++;
      }
      readinessScore = Math.max(30, Math.round(100 - (fatiguedCount / dayMuscleGroups.size) * 50));
    }

    // 7. Assemble exercises with smart progressive overload recommendations
    const suggestedExercises = [];

    for (const pe of targetDay.exercises || []) {
      const exercise = pe.exercise as Exercise;

      // Look up user's last completed set for this specific exercise
      const { data: prevSets } = await supabase
        .from('workout_sets')
        .select('weight_kg, reps_completed, completed_at')
        .eq('user_id', userId)
        .eq('exercise_id', exercise.id)
        .order('completed_at', { ascending: false })
        .limit(1);

      let prevWeight: number | null = null;
      let prevReps: number | null = null;
      let suggestedWeight: number | null = pe.target_weight_kg ?? null;

      if (prevSets && prevSets.length > 0 && prevSets[0].weight_kg) {
        prevWeight = prevSets[0].weight_kg;
        prevReps = prevSets[0].reps_completed ?? null;

        // Progressive Overload Logic:
        // If athlete achieved max target reps in previous session -> bump weight by 2.5 kg!
        if (prevWeight !== null && prevReps && prevReps >= pe.target_reps_max) {
          suggestedWeight = Number((prevWeight + 2.5).toFixed(1));
        } else if (prevWeight !== null) {
          suggestedWeight = prevWeight;
        }
      }

      suggestedExercises.push({
        exercise,
        target_sets: pe.target_sets,
        target_reps_min: pe.target_reps_min,
        target_reps_max: pe.target_reps_max,
        target_weight_kg: pe.target_weight_kg,
        suggested_weight_kg: suggestedWeight,
        previous_weight_kg: prevWeight,
        previous_reps: prevReps,
        rest_seconds: pe.rest_seconds,
        notes: pe.notes,
      });
    }

    return {
      plan_id: plan.id,
      plan_name: plan.name,
      day_id: targetDay.id,
      day_name: targetDay.name,
      day_number: targetDay.day_number,
      target_muscle_groups: Array.from(dayMuscleGroups),
      exercises: suggestedExercises,
      recovery_status: {
        recovered_groups: Array.from(recoveredGroups),
        fatigued_groups: Array.from(fatiguedGroups),
        last_workout_date: lastCompletedSession?.finished_at || null,
        readiness_score: readinessScore,
      },
    };
  }
}
