-- ============================================================
-- Migration 003: Workout Templates Update
-- FitPilot AI — Phase 3
-- ============================================================
-- Run this against your Supabase project via SQL Editor.
-- Safely modifies existing tables to support system workout templates.

-- 1. Add difficulty and is_template columns to workout_plans
ALTER TABLE public.workout_plans
  ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  ADD COLUMN IF NOT EXISTS is_template BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Allow user_id to be NULL for system templates (user_id IS NULL means global template)
ALTER TABLE public.workout_plans
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.workout_plan_days
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.plan_day_exercises
  ALTER COLUMN user_id DROP NOT NULL;

-- 3. Update RLS policies to allow authenticated users to view system templates
DROP POLICY IF EXISTS "Users can CRUD their own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can view templates or their own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can modify their own workout plans" ON public.workout_plans;

CREATE POLICY "Users can view templates or their own workout plans"
  ON public.workout_plans FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can modify their own workout plans"
  ON public.workout_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- workout_plan_days
DROP POLICY IF EXISTS "Users can CRUD their own plan days" ON public.workout_plan_days;
DROP POLICY IF EXISTS "Users can view templates or their own plan days" ON public.workout_plan_days;
DROP POLICY IF EXISTS "Users can modify their own plan days" ON public.workout_plan_days;

CREATE POLICY "Users can view templates or their own plan days"
  ON public.workout_plan_days FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can modify their own plan days"
  ON public.workout_plan_days FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- plan_day_exercises
DROP POLICY IF EXISTS "Users can CRUD their own plan exercises" ON public.plan_day_exercises;
DROP POLICY IF EXISTS "Users can view templates or their own plan exercises" ON public.plan_day_exercises;
DROP POLICY IF EXISTS "Users can modify their own plan exercises" ON public.plan_day_exercises;

CREATE POLICY "Users can view templates or their own plan exercises"
  ON public.plan_day_exercises FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can modify their own plan exercises"
  ON public.plan_day_exercises FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
