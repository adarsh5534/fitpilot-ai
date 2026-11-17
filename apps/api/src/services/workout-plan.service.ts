import { getSupabaseClient } from '../config/supabase';
import { AppError } from '../middleware/error-handler';
import type {
  CreateCustomPlanInput,
  PlanDayExerciseWithDetails,
  WorkoutPlan,
  WorkoutPlanDay,
} from '@fitpilot/shared';

export class WorkoutPlanService {
  /**
   * Fetch user's currently active workout plan, complete with days and exercises.
   * If user has no active plan, auto-assigns the best matching template from their profile.
   */
  static async getActivePlan(userId: string): Promise<WorkoutPlan> {
    const supabase = getSupabaseClient();

    // 1. Look for user's active plan
    const { data: userPlan, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to query active plan: ${error.message}`);
    }

    if (userPlan) {
      return this.populatePlanDetails(userPlan as WorkoutPlan);
    }

    // 2. User has no active plan yet -> auto-assign from templates based on profile
    return this.autoAssignTemplate(userId);
  }

  /**
   * Auto-assign a system template to a user based on their profile metrics.
   */
  static async autoAssignTemplate(userId: string): Promise<WorkoutPlan> {
    const supabase = getSupabaseClient();

    // Fetch user profile for fitness_level and primary_goal
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('fitness_level, primary_goal, workout_days_per_week')
      .eq('user_id', userId)
      .maybeSingle();

    const level = profile?.fitness_level || 'beginner';
    const goal = profile?.primary_goal || 'general_fitness';

    // Find best matching template
    let { data: template } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('is_template', true)
      .eq('difficulty', level)
      .limit(1)
      .maybeSingle();

    if (!template) {
      // Fallback to beginner template
      const { data: fallback } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('is_template', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      template = fallback;
    }

    if (!template) {
      throw new AppError(
        404,
        'NOT_FOUND',
        'No system workout templates found. Please run the template seed migration.'
      );
    }

    // Clone template as active plan for user
    const { data: newPlan, error: planError } = await supabase
      .from('workout_plans')
      .insert({
        user_id: userId,
        name: template.name,
        description: template.description,
        difficulty: template.difficulty,
        goal: goal,
        days_per_week: template.days_per_week,
        is_template: false,
        is_active: true,
        is_ai_generated: false,
      })
      .select()
      .single();

    if (planError || !newPlan) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to assign workout plan: ${planError?.message}`);
    }

    // Clone template days
    const { data: templateDays } = await supabase
      .from('workout_plan_days')
      .select('*')
      .eq('plan_id', template.id)
      .order('day_number', { ascending: true });

    if (templateDays && templateDays.length > 0) {
      for (const tDay of templateDays) {
        const { data: newDay } = await supabase
          .from('workout_plan_days')
          .insert({
            plan_id: newPlan.id,
            user_id: userId,
            day_number: tDay.day_number,
            name: tDay.name,
            notes: tDay.notes,
          })
          .select()
          .single();

        if (newDay) {
          // Clone planned exercises for this day
          const { data: tExercises } = await supabase
            .from('plan_day_exercises')
            .select('*')
            .eq('plan_day_id', tDay.id);

          if (tExercises && tExercises.length > 0) {
            const exerciseInserts = tExercises.map((e) => ({
              plan_day_id: newDay.id,
              user_id: userId,
              exercise_id: e.exercise_id,
              display_order: e.display_order,
              target_sets: e.target_sets,
              target_reps_min: e.target_reps_min,
              target_reps_max: e.target_reps_max,
              target_weight_kg: e.target_weight_kg,
              rest_seconds: e.rest_seconds,
              notes: e.notes,
            }));

            await supabase.from('plan_day_exercises').insert(exerciseInserts);
          }
        }
      }
    }

    return this.populatePlanDetails(newPlan as WorkoutPlan);
  }

  /**
   * Helper to load days and exercises for a given plan.
   */
  private static async populatePlanDetails(plan: WorkoutPlan): Promise<WorkoutPlan> {
    const supabase = getSupabaseClient();

    const { data: days, error: daysError } = await supabase
      .from('workout_plan_days')
      .select('*')
      .eq('plan_id', plan.id)
      .order('day_number', { ascending: true });

    if (daysError) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to load plan days: ${daysError.message}`);
    }

    const populatedDays: WorkoutPlanDay[] = [];

    for (const day of (days as WorkoutPlanDay[]) || []) {
      const { data: pExercises, error: exError } = await supabase
        .from('plan_day_exercises')
        .select(`
          *,
          exercise:exercises (*)
        `)
        .eq('plan_day_id', day.id)
        .order('display_order', { ascending: true });

      if (exError) {
        throw new AppError(500, 'DATABASE_ERROR', `Failed to load day exercises: ${exError.message}`);
      }

      populatedDays.push({
        ...day,
        exercises: (pExercises as unknown as PlanDayExerciseWithDetails[]) || [],
      });
    }

    return {
      ...plan,
      days: populatedDays,
    };
  }

  /**
   * List all plans available for a user (templates + personal plans).
   */
  static async listPlans(userId: string): Promise<WorkoutPlan[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .or(`user_id.eq.${userId},is_template.eq.true`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to fetch plans: ${error.message}`);
    }

    return (data as WorkoutPlan[]) || [];
  }

  /**
   * Create a custom plan for a user.
   */
  static async createPlan(userId: string, input: CreateCustomPlanInput): Promise<WorkoutPlan> {
    const supabase = getSupabaseClient();

    const { data: plan, error: planError } = await supabase
      .from('workout_plans')
      .insert({
        user_id: userId,
        name: input.name,
        description: input.description,
        difficulty: input.difficulty,
        goal: input.goal,
        days_per_week: input.days_per_week,
        is_template: false,
        is_active: false,
        is_ai_generated: false,
      })
      .select()
      .single();

    if (planError || !plan) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to create plan: ${planError?.message}`);
    }

    for (const d of input.days) {
      const { data: day, error: dayError } = await supabase
        .from('workout_plan_days')
        .insert({
          plan_id: plan.id,
          user_id: userId,
          day_number: d.day_number,
          name: d.name,
          notes: d.notes,
        })
        .select()
        .single();

      if (dayError || !day) continue;

      if (d.exercises && d.exercises.length > 0) {
        const inserts = d.exercises.map((e) => ({
          plan_day_id: day.id,
          user_id: userId,
          exercise_id: e.exercise_id,
          display_order: e.display_order,
          target_sets: e.target_sets,
          target_reps_min: e.target_reps_min,
          target_reps_max: e.target_reps_max,
          target_weight_kg: e.target_weight_kg,
          rest_seconds: e.rest_seconds,
          notes: e.notes,
        }));

        await supabase.from('plan_day_exercises').insert(inserts);
      }
    }

    return this.populatePlanDetails(plan as WorkoutPlan);
  }

  /**
   * Set a plan as active (and deactivates any other plan for this user).
   */
  static async activatePlan(userId: string, planId: string): Promise<WorkoutPlan> {
    const supabase = getSupabaseClient();

    // Verify ownership
    const { data: plan, error: checkError } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('id', planId)
      .eq('user_id', userId)
      .single();

    if (checkError || !plan) {
      throw new AppError(404, 'NOT_FOUND', 'Workout plan not found or not owned by user');
    }

    // Deactivate previous active plans
    await supabase
      .from('workout_plans')
      .update({ is_active: false })
      .eq('user_id', userId);

    // Activate selected plan
    const { data: updated, error: updateError } = await supabase
      .from('workout_plans')
      .update({ is_active: true })
      .eq('id', planId)
      .select()
      .single();

    if (updateError || !updated) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to activate plan: ${updateError?.message}`);
    }

    return this.populatePlanDetails(updated as WorkoutPlan);
  }
}
