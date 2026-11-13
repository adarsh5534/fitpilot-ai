-- ============================================================
-- Seed Data: Exercise Library
-- FitPilot AI — Phase 1
-- ============================================================
-- Run AFTER migrations 001 and 002.
-- These are the initial exercises available to all users.
-- Add more exercises in Phase 3.

INSERT INTO public.exercises (name, slug, description, muscle_groups, equipment, movement_type, difficulty, instructions) VALUES

-- ── Chest ─────────────────────────────────────────────────────────────────────
('Barbell Bench Press', 'barbell-bench-press',
 'The fundamental horizontal pushing movement for chest development.',
 ARRAY['chest', 'triceps', 'anterior_deltoid'],
 ARRAY['barbell', 'bench'],
 'compound', 'intermediate',
 ARRAY[
   'Lie flat on a bench, feet on the floor.',
   'Grip the barbell slightly wider than shoulder-width.',
   'Unrack the bar and hold it directly over your chest.',
   'Lower the bar to your mid-chest, keeping elbows at ~45°.',
   'Press the bar back up to the starting position.',
   'Control the descent — do not bounce off your chest.'
 ]),

('Dumbbell Bench Press', 'dumbbell-bench-press',
 'Allows greater range of motion than barbell. Excellent for chest development.',
 ARRAY['chest', 'triceps', 'anterior_deltoid'],
 ARRAY['dumbbells', 'bench'],
 'compound', 'beginner',
 ARRAY[
   'Sit on a bench with dumbbells on your thighs.',
   'Kick them up and lie back, pressing them above your chest.',
   'Lower dumbbells to chest level with elbows at ~75°.',
   'Press back up, bringing dumbbells close together at top.'
 ]),

('Push-Up', 'push-up',
 'Foundational bodyweight pushing exercise. Scalable for all levels.',
 ARRAY['chest', 'triceps', 'anterior_deltoid', 'core'],
 ARRAY[]::TEXT[],
 'bodyweight', 'beginner',
 ARRAY[
   'Start in plank position, hands slightly wider than shoulders.',
   'Lower your body until chest nearly touches the floor.',
   'Push back up to starting position.',
   'Keep your body in a straight line throughout.'
 ]),

-- ── Back ──────────────────────────────────────────────────────────────────────
('Barbell Deadlift', 'barbell-deadlift',
 'The king of compound lifts. Targets the entire posterior chain.',
 ARRAY['hamstrings', 'glutes', 'lower_back', 'traps', 'lats', 'forearms'],
 ARRAY['barbell'],
 'compound', 'intermediate',
 ARRAY[
   'Stand with feet hip-width apart, bar over mid-foot.',
   'Hinge at hips and grip the bar just outside your legs.',
   'Take a big breath, brace your core, flatten your back.',
   'Drive through your heels to stand up with the bar.',
   'Lock out hips at the top — do not hyperextend.',
   'Lower the bar under control by pushing hips back first.'
 ]),

('Pull-Up', 'pull-up',
 'Best bodyweight exercise for lat development and overall back width.',
 ARRAY['lats', 'biceps', 'rear_deltoid', 'rhomboids'],
 ARRAY['pull_up_bar'],
 'bodyweight', 'intermediate',
 ARRAY[
   'Hang from the bar with an overhand grip, hands shoulder-width.',
   'Pull your chest toward the bar by driving elbows down.',
   'Go until chin clears the bar.',
   'Lower yourself under control to full hang.'
 ]),

('Barbell Row', 'barbell-row',
 'Horizontal pulling movement. Builds back thickness.',
 ARRAY['lats', 'rhomboids', 'rear_deltoid', 'biceps', 'lower_back'],
 ARRAY['barbell'],
 'compound', 'intermediate',
 ARRAY[
   'Stand with feet hip-width, hinge forward ~45°.',
   'Grip bar slightly wider than shoulder-width.',
   'Pull the bar to your lower chest/upper abdomen.',
   'Squeeze shoulder blades at the top.',
   'Lower the bar under control.'
 ]),

-- ── Shoulders ─────────────────────────────────────────────────────────────────
('Overhead Press', 'overhead-press',
 'Primary shoulder builder. Also works triceps and upper chest.',
 ARRAY['anterior_deltoid', 'lateral_deltoid', 'triceps', 'upper_chest', 'traps'],
 ARRAY['barbell'],
 'compound', 'intermediate',
 ARRAY[
   'Stand with feet shoulder-width, bar in front rack position.',
   'Press the bar straight up, moving head slightly back as it passes.',
   'Lock out arms at top with bar over your head.',
   'Lower under control back to front rack.'
 ]),

('Dumbbell Lateral Raise', 'dumbbell-lateral-raise',
 'Isolation for the lateral deltoid — builds shoulder width.',
 ARRAY['lateral_deltoid'],
 ARRAY['dumbbells'],
 'isolation', 'beginner',
 ARRAY[
   'Stand holding dumbbells at your sides.',
   'Raise both arms to shoulder height with slight elbow bend.',
   'Lead with elbows, not wrists.',
   'Lower slowly — the negative is as important as the lift.'
 ]),

-- ── Legs ──────────────────────────────────────────────────────────────────────
('Barbell Back Squat', 'barbell-back-squat',
 'The foundational lower body compound movement.',
 ARRAY['quadriceps', 'glutes', 'hamstrings', 'lower_back', 'core'],
 ARRAY['barbell', 'squat_rack'],
 'compound', 'intermediate',
 ARRAY[
   'Position bar on your upper traps, feet shoulder-width.',
   'Take a big breath and brace your core.',
   'Descend by pushing knees out and sitting back and down.',
   'Go to at least parallel (thighs parallel to floor).',
   'Drive through your heels to stand back up.',
   'Keep chest up and back neutral throughout.'
 ]),

('Romanian Deadlift', 'romanian-deadlift',
 'Hip hinge movement targeting hamstrings and glutes.',
 ARRAY['hamstrings', 'glutes', 'lower_back'],
 ARRAY['barbell'],
 'compound', 'intermediate',
 ARRAY[
   'Hold the bar at hip level with an overhand grip.',
   'Push hips back while lowering the bar along your legs.',
   'Lower until you feel a stretch in your hamstrings.',
   'Drive hips forward to return to standing.',
   'Keep back flat — do not round.'
 ]),

('Leg Press', 'leg-press',
 'Machine-based quad/glute exercise. Useful for volume work.',
 ARRAY['quadriceps', 'glutes', 'hamstrings'],
 ARRAY['leg_press_machine'],
 'compound', 'beginner',
 ARRAY[
   'Sit in machine, feet shoulder-width on platform.',
   'Lower the sled by bending knees to ~90°.',
   'Press back up without locking out knees completely.',
   'Do not let lower back peel off the seat.'
 ]),

-- ── Arms ──────────────────────────────────────────────────────────────────────
('Barbell Curl', 'barbell-curl',
 'Primary bicep isolation exercise.',
 ARRAY['biceps', 'forearms'],
 ARRAY['barbell'],
 'isolation', 'beginner',
 ARRAY[
   'Stand with an underhand grip, hands shoulder-width.',
   'Curl the bar up by contracting biceps.',
   'Squeeze at the top — do not swing your body.',
   'Lower slowly under control.'
 ]),

('Tricep Dip', 'tricep-dip',
 'Bodyweight tricep exercise. Can be weighted for progression.',
 ARRAY['triceps', 'anterior_deltoid', 'lower_chest'],
 ARRAY['dip_bars'],
 'bodyweight', 'intermediate',
 ARRAY[
   'Support yourself on parallel bars with arms extended.',
   'Lower yourself by bending elbows, leaning slightly forward.',
   'Go until upper arms are parallel to the floor.',
   'Press back up to starting position.'
 ]),

-- ── Core ──────────────────────────────────────────────────────────────────────
('Plank', 'plank',
 'Isometric core stability exercise.',
 ARRAY['core', 'lower_back', 'glutes'],
 ARRAY[]::TEXT[],
 'bodyweight', 'beginner',
 ARRAY[
   'Get into push-up position but rest on forearms.',
   'Keep body in a straight line from head to heels.',
   'Squeeze core and glutes throughout.',
   'Hold for target duration.'
 ]),

('Cable Crunch', 'cable-crunch',
 'Weighted ab exercise for core development.',
 ARRAY['rectus_abdominis'],
 ARRAY['cable_machine'],
 'isolation', 'beginner',
 ARRAY[
   'Kneel in front of cable machine with rope attachment at top.',
   'Hold rope behind your head.',
   'Crunch down by contracting abs, not pulling with arms.',
   'Return slowly to starting position.'
 ])

ON CONFLICT (slug) DO NOTHING;
