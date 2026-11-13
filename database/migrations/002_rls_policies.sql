-- ============================================================
-- Migration 002: Row Level Security Policies
-- FitPilot AI — Phase 1
-- ============================================================
-- RLS ensures that even if the mobile app somehow bypassed our API
-- and hit Supabase directly, users could ONLY see their own data.
--
-- Our API uses the SERVICE ROLE KEY which bypasses RLS.
-- These policies are a defence-in-depth measure.

-- ── Enable RLS on all user-data tables ───────────────────────────────────────
ALTER TABLE public.user_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plan_days     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_day_exercises    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics          ENABLE ROW LEVEL SECURITY;

-- exercises and food_items are shared — read-only for authenticated users
ALTER TABLE public.exercises             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items            ENABLE ROW LEVEL SECURITY;

-- ── user_profiles ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── exercises (shared read-only) ──────────────────────────────────────────────
CREATE POLICY "Anyone authenticated can view exercises"
  ON public.exercises FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only service role (our API) can insert/update exercises
-- (No INSERT/UPDATE policy = blocked for authenticated users)

-- ── food_items (shared, users can add unverified entries) ─────────────────────
CREATE POLICY "Anyone authenticated can view food items"
  ON public.food_items FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can add food items"
  ON public.food_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

-- ── workout_plans ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can CRUD their own workout plans"
  ON public.workout_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── workout_plan_days ─────────────────────────────────────────────────────────
CREATE POLICY "Users can CRUD their own plan days"
  ON public.workout_plan_days FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── plan_day_exercises ────────────────────────────────────────────────────────
CREATE POLICY "Users can CRUD their own plan exercises"
  ON public.plan_day_exercises FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── workout_sessions ──────────────────────────────────────────────────────────
CREATE POLICY "Users can CRUD their own workout sessions"
  ON public.workout_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── workout_sets ──────────────────────────────────────────────────────────────
CREATE POLICY "Users can CRUD their own workout sets"
  ON public.workout_sets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── nutrition_logs ────────────────────────────────────────────────────────────
CREATE POLICY "Users can CRUD their own nutrition logs"
  ON public.nutrition_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── body_metrics ──────────────────────────────────────────────────────────────
CREATE POLICY "Users can CRUD their own body metrics"
  ON public.body_metrics FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
