import { getSupabaseClient } from '../config/supabase';
import { AppError } from '../middleware/error-handler';
import type {
  FinishSessionInput,
  LogSetInput,
  PlanDayExerciseWithDetails,
  StartSessionInput,
  WorkoutPlanDay,
  WorkoutSession,
  WorkoutSessionDetail,
  WorkoutSet,
} from '@fitpilot/shared';

export class WorkoutSessionService {
  /**
   * Start a new workout session (or return the current active one).
   */
  static async startSession(
    userId: string,
    input: StartSessionInput
  ): Promise<WorkoutSessionDetail> {
    const supabase = getSupabaseClient();

    // 1. Check for existing in-progress session
    const existing = await this.getActiveSession(userId);
    if (existing) {
      return existing;
    }

    // 2. Insert new session
    const { data: session, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: userId,
        plan_day_id: input.plan_day_id || null,
        name: input.name,
        notes: input.notes || null,
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !session) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to start session: ${error?.message}`);
    }

    return {
      ...(session as WorkoutSession),
      sets: [],
      total_volume_kg: 0,
      total_sets_completed: 0,
    };
  }

  /**
   * Get current active session for user, if any.
   */
  static async getActiveSession(userId: string): Promise<WorkoutSessionDetail | null> {
    const supabase = getSupabaseClient();

    const { data: session, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'in_progress')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !session) {
      return null;
    }

    return this.populateSessionDetails(session as WorkoutSession);
  }

  /**
   * Log a set for an active session.
   */
  static async logSet(
    userId: string,
    sessionId: string,
    input: LogSetInput
  ): Promise<WorkoutSet> {
    const supabase = getSupabaseClient();

    // Verify session is active and belongs to user
    const { data: session } = await supabase
      .from('workout_sessions')
      .select('id, status')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!session || session.status !== 'in_progress') {
      throw new AppError(400, 'BAD_REQUEST', 'Workout session is not currently active');
    }

    const { data: set, error } = await supabase
      .from('workout_sets')
      .insert({
        session_id: sessionId,
        user_id: userId,
        exercise_id: input.exercise_id,
        set_number: input.set_number,
        reps_completed: input.reps_completed ?? null,
        weight_kg: input.weight_kg ?? null,
        rpe: input.rpe ?? null,
        duration_seconds: input.duration_seconds ?? null,
        notes: input.notes ?? null,
        is_warmup: input.is_warmup ?? false,
        is_skipped: input.is_skipped ?? false,
        completed_at: new Date().toISOString(),
      })
      .select(`
        *,
        exercise:exercises (*)
      `)
      .single();

    if (error || !set) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to log set: ${error?.message}`);
    }

    return set as unknown as WorkoutSet;
  }

  /**
   * Finish an active workout session.
   */
  static async finishSession(
    userId: string,
    sessionId: string,
    input: FinishSessionInput
  ): Promise<WorkoutSessionDetail> {
    const supabase = getSupabaseClient();

    const { data: session } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!session) {
      throw new AppError(404, 'NOT_FOUND', 'Session not found');
    }

    if (session.status === 'completed') {
      return this.populateSessionDetails(session as WorkoutSession);
    }

    const finishedAt = new Date();
    const startedAt = new Date(session.started_at);
    const computedDuration = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);
    const durationSeconds = input.duration_seconds ?? computedDuration;

    const { data: updated, error } = await supabase
      .from('workout_sessions')
      .update({
        status: 'completed',
        finished_at: finishedAt.toISOString(),
        duration_seconds: durationSeconds,
        notes: input.notes || session.notes,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error || !updated) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to finish session: ${error?.message}`);
    }

    return this.populateSessionDetails(updated as WorkoutSession);
  }

  /**
   * Get user's workout history.
   */
  static async getSessionHistory(
    userId: string,
    limit = 20,
    offset = 0
  ): Promise<WorkoutSessionDetail[]> {
    const supabase = getSupabaseClient();

    const { data: sessions, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('finished_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to fetch workout history: ${error.message}`);
    }

    const results: WorkoutSessionDetail[] = [];
    for (const s of (sessions as WorkoutSession[]) || []) {
      results.push(await this.populateSessionDetails(s));
    }

    return results;
  }

  /**
   * Get single session by ID.
   */
  static async getSessionById(userId: string, sessionId: string): Promise<WorkoutSessionDetail> {
    const supabase = getSupabaseClient();

    const { data: session, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (error || !session) {
      throw new AppError(404, 'NOT_FOUND', 'Workout session not found');
    }

    return this.populateSessionDetails(session as WorkoutSession);
  }

  /**
   * Cancel / discard an in-progress workout session.
   */
  static async cancelSession(userId: string, sessionId: string): Promise<void> {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to cancel session: ${error.message}`);
    }
  }

  private static async populateSessionDetails(
    session: WorkoutSession
  ): Promise<WorkoutSessionDetail> {
    const supabase = getSupabaseClient();

    const { data: sets, error } = await supabase
      .from('workout_sets')
      .select(`
        *,
        exercise:exercises (*)
      `)
      .eq('session_id', session.id)
      .order('completed_at', { ascending: true });

    if (error) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to load session sets: ${error.message}`);
    }

    const typedSets = (sets as unknown as WorkoutSet[]) || [];

    let totalVolume = 0;
    let completedSetsCount = 0;

    for (const s of typedSets) {
      if (!s.is_skipped && s.reps_completed && s.weight_kg) {
        totalVolume += s.reps_completed * s.weight_kg;
        completedSetsCount += 1;
      }
    }

    let planDay: WorkoutPlanDay | undefined = undefined;
    if (session.plan_day_id) {
      const { data: dayData } = await supabase
        .from('workout_plan_days')
        .select('*')
        .eq('id', session.plan_day_id)
        .maybeSingle();

      if (dayData) {
        const { data: pExercises } = await supabase
          .from('plan_day_exercises')
          .select(`
            *,
            exercise:exercises (*)
          `)
          .eq('plan_day_id', session.plan_day_id)
          .order('display_order', { ascending: true });

        planDay = {
          ...(dayData as WorkoutPlanDay),
          exercises: (pExercises as unknown as PlanDayExerciseWithDetails[]) || [],
        };
      }
    }

    return {
      ...session,
      sets: typedSets,
      total_volume_kg: Math.round(totalVolume),
      total_sets_completed: completedSetsCount,
      plan_day: planDay,
    };
  }
}
