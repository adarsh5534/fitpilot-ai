-- ============================================================
-- Seed Data: System Workout Plan Templates
-- FitPilot AI — Phase 3
-- ============================================================
-- Run AFTER 001_initial_schema.sql, 002_rls_policies.sql, and 001_exercises.sql.
-- Inserts 3 complete, professionally designed programs:
-- 1. Beginner Full Body Routine (3 Days)
-- 2. Intermediate 4-Day Hypertrophy Split (4 Days)
-- 3. Advanced 6-Day Power & Hypertrophy Split (7 Days)

DO $$
DECLARE
  v_plan_beginner_id UUID;
  v_plan_inter_id    UUID;
  v_plan_adv_id      UUID;
  
  v_day_id UUID;
BEGIN

  -- ═════════════════════════════════════════════════════════════════════════════
  -- 1. BEGINNER FULL BODY ROUTINE (3 Days / Week)
  -- ═════════════════════════════════════════════════════════════════════════════
  
  DELETE FROM public.workout_plans WHERE name = 'Beginner Full Body Routine' AND is_template = TRUE;
  
  INSERT INTO public.workout_plans (
    name, description, difficulty, goal, days_per_week, is_template, is_active, is_ai_generated
  ) VALUES (
    'Beginner Full Body Routine',
    'Foundational 3-day full body training program hitting every major muscle group each session for rapid adaptation, form mastery, and progressive strength.',
    'beginner',
    'general_fitness',
    3,
    TRUE,
    FALSE,
    FALSE
  ) RETURNING id INTO v_plan_beginner_id;

  -- Day 1: Chest, Back, Shoulders, Legs, Biceps, Triceps
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_beginner_id, 1, 'Day 1: Full Body A', 'Focus on establishing baseline weights with strict form.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 4, 8, 8, 90, 'Focus on controlled eccentric descent' FROM public.exercises WHERE slug = 'barbell-bench-press' UNION ALL
  SELECT v_day_id, id, 2, 4, 10, 10, 75, 'Pull to upper chest' FROM public.exercises WHERE slug = 'lat-pulldown' UNION ALL
  SELECT v_day_id, id, 3, 4, 10, 10, 75, 'Press overhead without arching back' FROM public.exercises WHERE slug = 'seated-dumbbell-press' UNION ALL
  SELECT v_day_id, id, 4, 4, 10, 10, 75, 'Pause at top contraction' FROM public.exercises WHERE slug = 'leg-extension' UNION ALL
  SELECT v_day_id, id, 5, 3, 10, 10, 60, 'Strict curl, no hip swing' FROM public.exercises WHERE slug = 'barbell-curl' UNION ALL
  SELECT v_day_id, id, 6, 3, 15, 15, 60, 'Spread rope at the bottom lockout' FROM public.exercises WHERE slug = 'triceps-rope-pushdown';

  -- Day 2: Legs, Triceps, Biceps, Chest, Back, Shoulder
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_beginner_id, 2, 'Day 2: Full Body B', 'Leg drive emphasis paired with high-volume arm and chest machine work.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 4, 8, 8, 90, 'Full 90-degree knee bend, do not lock knees' FROM public.exercises WHERE slug = 'leg-press' UNION ALL
  SELECT v_day_id, id, 2, 3, 20, 20, 60, 'High rep pump' FROM public.exercises WHERE slug = 'overhead-bar-extension' UNION ALL
  SELECT v_day_id, id, 3, 4, 10, 10, 60, 'Keep elbows tucked' FROM public.exercises WHERE slug = 'ez-bar-curl' UNION ALL
  SELECT v_day_id, id, 4, 4, 10, 10, 75, 'Squeeze chest at peak press' FROM public.exercises WHERE slug = 'machine-chest-press' UNION ALL
  SELECT v_day_id, id, 5, 4, 10, 10, 75, 'Drive elbows behind back' FROM public.exercises WHERE slug = 't-bar-row' UNION ALL
  SELECT v_day_id, id, 6, 3, 20, 20, 60, 'Lead with elbows' FROM public.exercises WHERE slug = 'dumbbell-lateral-raise';

  -- Day 3: Shoulders, Back, Chest, Legs, Triceps, Biceps
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_beginner_id, 3, 'Day 3: Full Body C', 'Unilateral leg work and cable isolations for complete muscular balance.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 3, 15, 15, 60, 'Pull up to mid-chest with elbows high' FROM public.exercises WHERE slug = 'upright-row' UNION ALL
  SELECT v_day_id, id, 2, 4, 12, 12, 75, 'V-bar or close neutral grip' FROM public.exercises WHERE slug = 'close-grip-pulldown' UNION ALL
  SELECT v_day_id, id, 3, 4, 10, 10, 60, 'Deep stretch, hug hands together' FROM public.exercises WHERE slug = 'cable-fly' UNION ALL
  SELECT v_day_id, id, 4, 3, 10, 10, 75, '10 reps per leg, knees 90 degrees' FROM public.exercises WHERE slug = 'dumbbell-lunge' UNION ALL
  SELECT v_day_id, id, 5, 3, 15, 15, 60, 'Keep upper arms fixed perpendicular to torso' FROM public.exercises WHERE slug = 'skullcrusher' UNION ALL
  SELECT v_day_id, id, 6, 3, 12, 12, 60, 'Palms neutral throughout movement' FROM public.exercises WHERE slug = 'hammer-curl';


  -- ═════════════════════════════════════════════════════════════════════════════
  -- 2. INTERMEDIATE WORKOUT ROUTINE (4 Days / Week)
  -- ═════════════════════════════════════════════════════════════════════════════

  DELETE FROM public.workout_plans WHERE name = 'Intermediate 4-Day Hypertrophy Split' AND is_template = TRUE;

  INSERT INTO public.workout_plans (
    name, description, difficulty, goal, days_per_week, is_template, is_active, is_ai_generated
  ) VALUES (
    'Intermediate 4-Day Hypertrophy Split',
    'Upper/Lower & Push/Pull hybrid program designed for athletes ready to accelerate volume and progressive overload across 4 weekly sessions.',
    'intermediate',
    'muscle_gain',
    4,
    TRUE,
    FALSE,
    FALSE
  ) RETURNING id INTO v_plan_inter_id;

  -- Day 1: Chest, Shoulders and Triceps
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_inter_id, 1, 'Day 1: Chest, Shoulders & Triceps', 'Pyramiding dumbbell push work with deep tricep isolation.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 3, 8, 10, 90, '10, 10, 8 reps (adding weight each set)' FROM public.exercises WHERE slug = 'dumbbell-bench-press' UNION ALL
  SELECT v_day_id, id, 2, 3, 10, 10, 75, 'Target upper chest shelf' FROM public.exercises WHERE slug = 'incline-dumbbell-bench-press' UNION ALL
  SELECT v_day_id, id, 3, 3, 10, 15, 90, 'Bodyweight or weighted, max clean reps' FROM public.exercises WHERE slug = 'dips' UNION ALL
  SELECT v_day_id, id, 4, 3, 8, 10, 75, 'Lower bar to crown of head' FROM public.exercises WHERE slug = 'skullcrusher' UNION ALL
  SELECT v_day_id, id, 5, 3, 10, 10, 60, 'Single arm overhead stretch' FROM public.exercises WHERE slug = 'one-arm-dumbbell-extension' UNION ALL
  SELECT v_day_id, id, 6, 3, 10, 10, 60, 'Strict extension locking out long head' FROM public.exercises WHERE slug = 'overhead-bar-extension' UNION ALL
  SELECT v_day_id, id, 7, 4, 12, 12, 60, 'Slow controlled negative' FROM public.exercises WHERE slug = 'barbell-front-raise' UNION ALL
  SELECT v_day_id, id, 8, 4, 8, 15, 60, '15, 12, 8, 8 reps (adding weight)' FROM public.exercises WHERE slug = 'dumbbell-lateral-raise';

  -- Day 2: Back and Biceps
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_inter_id, 2, 'Day 2: Back & Biceps', 'Vertical and horizontal back pulling combined with varied bicep curl angles.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 3, 6, 12, 90, 'Wide overhand grip to max reps' FROM public.exercises WHERE slug = 'pull-up' UNION ALL
  SELECT v_day_id, id, 2, 3, 10, 10, 75, 'Full range stretch at top' FROM public.exercises WHERE slug = 'lat-pulldown' UNION ALL
  SELECT v_day_id, id, 3, 3, 10, 10, 60, 'Keep arms straight, isolate outer lats' FROM public.exercises WHERE slug = 'straight-arm-lat-pulldown' UNION ALL
  SELECT v_day_id, id, 4, 3, 10, 10, 60, 'Rear deltoid squeeze' FROM public.exercises WHERE slug = 'machine-reverse-fly' UNION ALL
  SELECT v_day_id, id, 5, 3, 8, 10, 75, 'High elbows to clavicle' FROM public.exercises WHERE slug = 'upright-row' UNION ALL
  SELECT v_day_id, id, 6, 3, 8, 10, 75, 'Heavy bicep mass builder' FROM public.exercises WHERE slug = 'barbell-curl' UNION ALL
  SELECT v_day_id, id, 7, 3, 10, 10, 60, 'Eliminate all momentum' FROM public.exercises WHERE slug = 'preacher-curl' UNION ALL
  SELECT v_day_id, id, 8, 3, 10, 10, 60, 'Deep long head stretch' FROM public.exercises WHERE slug = 'incline-dumbbell-curl';

  -- Day 3: Legs & Calves
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_inter_id, 3, 'Day 3: Legs & Calves', 'Heavy squats and unilateral volume followed by heavy/light calf periodization.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 4, 8, 10, 120, '10, 10, 8, 8 reps' FROM public.exercises WHERE slug = 'barbell-back-squat' UNION ALL
  SELECT v_day_id, id, 2, 3, 8, 8, 75, '8 reps on each leg' FROM public.exercises WHERE slug = 'dumbbell-lunge' UNION ALL
  SELECT v_day_id, id, 3, 3, 12, 12, 90, '45-degree angle sled press' FROM public.exercises WHERE slug = 'leg-press' UNION ALL
  SELECT v_day_id, id, 4, 3, 15, 15, 60, 'Full knee flexion' FROM public.exercises WHERE slug = 'hamstring-curl' UNION ALL
  SELECT v_day_id, id, 5, 3, 15, 15, 60, 'Peak quad contraction hold' FROM public.exercises WHERE slug = 'leg-extension' UNION ALL
  SELECT v_day_id, id, 6, 5, 6, 10, 75, '10, 8, 8, 8, 6 (heavy)' FROM public.exercises WHERE slug = 'standing-calf-raise' UNION ALL
  SELECT v_day_id, id, 7, 5, 15, 15, 45, 'Light pump reps, full Achilles stretch' FROM public.exercises WHERE slug = 'seated-calf-raise';

  -- Day 4: Shoulders, Chest, and Triceps
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_inter_id, 4, 'Day 4: Shoulders, Chest & Triceps', 'Secondary push workout emphasizing barbell strength and cable detail work.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 3, 8, 10, 90, '10, 10, 8 reps' FROM public.exercises WHERE slug = 'barbell-bench-press' UNION ALL
  SELECT v_day_id, id, 2, 3, 10, 10, 60, 'Controlled deep stretch' FROM public.exercises WHERE slug = 'dumbbell-flys' UNION ALL
  SELECT v_day_id, id, 3, 3, 10, 10, 60, 'Cross hands at bottom for peak pinch' FROM public.exercises WHERE slug = 'cable-crossovers' UNION ALL
  SELECT v_day_id, id, 4, 4, 6, 10, 90, '10, 10, 8, 6 reps' FROM public.exercises WHERE slug = 'close-grip-bench-press' UNION ALL
  SELECT v_day_id, id, 5, 3, 10, 10, 60, 'Lying dumbbell tricep extension' FROM public.exercises WHERE slug = 'skullcrusher' UNION ALL
  SELECT v_day_id, id, 6, 3, 10, 10, 45, 'Strict lockout at horizontal' FROM public.exercises WHERE slug = 'tricep-kickback' UNION ALL
  SELECT v_day_id, id, 7, 4, 8, 10, 90, '10, 10, 8, 8 reps' FROM public.exercises WHERE slug = 'seated-dumbbell-press' UNION ALL
  SELECT v_day_id, id, 8, 3, 12, 12, 60, 'Smooth cable tension' FROM public.exercises WHERE slug = 'one-arm-cable-lateral-raise';


  -- ═════════════════════════════════════════════════════════════════════════════
  -- 3. ADVANCED WORKOUT ROUTINE (6 Days + 1 Rest Day)
  -- ═════════════════════════════════════════════════════════════════════════════

  DELETE FROM public.workout_plans WHERE name = 'Advanced 6-Day Power & Hypertrophy Split' AND is_template = TRUE;

  INSERT INTO public.workout_plans (
    name, description, difficulty, goal, days_per_week, is_template, is_active, is_ai_generated
  ) VALUES (
    'Advanced 6-Day Power & Hypertrophy Split',
    'Elite 6-day split combining compound 5-rep max ramp-up protocols with high-volume antagonist pyramiding and active recovery on Day 4.',
    'advanced',
    'muscle_gain',
    6,
    TRUE,
    FALSE,
    FALSE
  ) RETURNING id INTO v_plan_adv_id;

  -- Day 1: Chest & Back
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_adv_id, 1, 'Day 1: Chest & Back', 'Work up to a 5-rep max for the day on Barbell Bench Press.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 6, 5, 5, 120, 'Ramp up to 5RM: Set 1 50%, Set 2 60%, Set 3 70%, Set 4 80%, Set 5 90%, Set 6 100%' FROM public.exercises WHERE slug = 'barbell-bench-press' UNION ALL
  SELECT v_day_id, id, 2, 3, 6, 8, 90, 'Heavy incline dumbbell pressing' FROM public.exercises WHERE slug = 'incline-dumbbell-bench-press' UNION ALL
  SELECT v_day_id, id, 3, 3, 6, 10, 90, 'Weighted or strict bodyweight dips' FROM public.exercises WHERE slug = 'dips' UNION ALL
  SELECT v_day_id, id, 4, 3, 5, 8, 90, 'Weighted pullups if possible' FROM public.exercises WHERE slug = 'pull-up' UNION ALL
  SELECT v_day_id, id, 5, 3, 6, 10, 90, 'Dead stop from floor each rep' FROM public.exercises WHERE slug = 'pendlay-row' UNION ALL
  SELECT v_day_id, id, 6, 3, 6, 10, 75, 'Strict lat pulldowns' FROM public.exercises WHERE slug = 'lat-pulldown';

  -- Day 2: Legs
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_adv_id, 2, 'Day 2: Legs', 'Work up to a 5-rep max on Squats, followed by heavy hinge and hamstring volume.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 6, 5, 5, 150, 'Ramp up to 5RM: Set 1 50%, Set 2 60%, Set 3 70%, Set 4 80%, Set 5 90%, Set 6 100%' FROM public.exercises WHERE slug = 'barbell-back-squat' UNION ALL
  SELECT v_day_id, id, 2, 3, 6, 10, 90, 'Deep heavy sled press' FROM public.exercises WHERE slug = 'leg-press' UNION ALL
  SELECT v_day_id, id, 3, 5, 5, 5, 90, 'Stiff-legged deadlift for posterior chain' FROM public.exercises WHERE slug = 'romanian-deadlift' UNION ALL
  SELECT v_day_id, id, 4, 3, 6, 8, 60, 'Heavy hamstring knee curls' FROM public.exercises WHERE slug = 'hamstring-curl' UNION ALL
  SELECT v_day_id, id, 5, 5, 10, 10, 60, 'Strict standing calf raises' FROM public.exercises WHERE slug = 'standing-calf-raise';

  -- Day 3: Shoulders & Arms
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_adv_id, 3, 'Day 3: Shoulders & Arms', 'Overhead strength overload and high-volume bicep curling.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 3, 6, 8, 120, 'Military press or heavy dumbbell press' FROM public.exercises WHERE slug = 'overhead-press' UNION ALL
  SELECT v_day_id, id, 2, 5, 10, 10, 60, 'High volume shoulder width builder' FROM public.exercises WHERE slug = 'dumbbell-lateral-raise' UNION ALL
  SELECT v_day_id, id, 3, 5, 6, 10, 75, 'Heavy strict barbell curls' FROM public.exercises WHERE slug = 'barbell-curl' UNION ALL
  SELECT v_day_id, id, 4, 3, 6, 10, 60, 'Alternating dumbbell curls' FROM public.exercises WHERE slug = 'dumbbell-curl';

  -- Day 4: Rest Day
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_adv_id, 4, 'Day 4: Rest & Recovery', 'Scheduled muscle recovery day. Hydrate, hit protein targets, and rest.');

  -- Day 5: Chest, Shoulders, & Triceps
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_adv_id, 5, 'Day 5: Chest, Shoulders & Triceps', 'Pyramiding hypertrophy protocol for upper body push muscles.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 5, 6, 20, 90, 'Pyramiding sets 20 down to 6 reps with increasing weight' FROM public.exercises WHERE slug = 'dumbbell-bench-press' UNION ALL
  SELECT v_day_id, id, 2, 3, 6, 10, 75, 'Incline dumbbell press' FROM public.exercises WHERE slug = 'incline-dumbbell-bench-press' UNION ALL
  SELECT v_day_id, id, 3, 3, 10, 10, 75, 'Machine overload' FROM public.exercises WHERE slug = 'hammer-strength-press' UNION ALL
  SELECT v_day_id, id, 4, 3, 12, 15, 60, 'Continuous cable tension' FROM public.exercises WHERE slug = 'cable-fly' UNION ALL
  SELECT v_day_id, id, 5, 5, 15, 20, 45, 'High repetition shoulder burn' FROM public.exercises WHERE slug = 'dumbbell-lateral-raise' UNION ALL
  SELECT v_day_id, id, 6, 5, 15, 20, 60, 'Reverse grip pulldowns for lower lats' FROM public.exercises WHERE slug = 'reverse-grip-pulldown';

  -- Day 6: Back & Biceps
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_adv_id, 6, 'Day 6: Back & Biceps', 'Pyramiding rows, heavy rack deadlifts, and back thickness.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 5, 8, 20, 90, 'Pyramiding 20 down to 8 reps' FROM public.exercises WHERE slug = 'barbell-row' UNION ALL
  SELECT v_day_id, id, 2, 3, 15, 20, 60, 'Upper trapezius peak squeeze' FROM public.exercises WHERE slug = 'barbell-shrug' UNION ALL
  SELECT v_day_id, id, 3, 3, 10, 12, 90, 'Below knee rack pull' FROM public.exercises WHERE slug = 'rack-deadlift' UNION ALL
  SELECT v_day_id, id, 4, 3, 6, 10, 75, 'Wide grip pullups' FROM public.exercises WHERE slug = 'pull-up' UNION ALL
  SELECT v_day_id, id, 5, 3, 6, 10, 75, 'Overhand lat pulldowns' FROM public.exercises WHERE slug = 'lat-pulldown';

  -- Day 7: Legs
  INSERT INTO public.workout_plan_days (plan_id, day_number, name, notes)
  VALUES (v_plan_adv_id, 7, 'Day 7: Legs', 'Front squats, leg extensions, and double calf protocol.')
  RETURNING id INTO v_day_id;

  INSERT INTO public.plan_day_exercises (plan_day_id, exercise_id, display_order, target_sets, target_reps_min, target_reps_max, rest_seconds, notes)
  SELECT v_day_id, id, 1, 5, 8, 20, 120, 'Pyramiding 20 down to 8 reps' FROM public.exercises WHERE slug = 'front-squat' UNION ALL
  SELECT v_day_id, id, 2, 5, 10, 10, 60, 'Quad burn' FROM public.exercises WHERE slug = 'leg-extension' UNION ALL
  SELECT v_day_id, id, 3, 5, 6, 10, 60, 'Hamstring curls' FROM public.exercises WHERE slug = 'hamstring-curl' UNION ALL
  SELECT v_day_id, id, 4, 5, 6, 10, 45, 'Seated soleus work' FROM public.exercises WHERE slug = 'seated-calf-raise' UNION ALL
  SELECT v_day_id, id, 5, 3, 8, 12, 60, 'Standing gastrocnemius work' FROM public.exercises WHERE slug = 'standing-calf-raise';

END $$;
