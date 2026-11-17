-- ============================================================
-- Seed Data: Complete Exercise Library
-- FitPilot AI — Phase 3
-- ============================================================
-- Run AFTER migrations 001 and 002.
-- Contains all foundational and plan-specific exercises.

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
 'Allows greater range of motion than barbell. Excellent for balanced chest hypertrophy.',
 ARRAY['chest', 'triceps', 'anterior_deltoid'],
 ARRAY['dumbbells', 'bench'],
 'compound', 'beginner',
 ARRAY[
   'Sit on a flat bench with dumbbells resting on your thighs.',
   'Lie back and press dumbbells directly above your chest.',
   'Lower dumbbells with elbows angled at ~75° to mid-chest level.',
   'Press back up, squeezing your chest at the top.'
 ]),

('Incline Dumbbell Bench Press', 'incline-dumbbell-bench-press',
 'Targets the clavicular head (upper chest) and front deltoids.',
 ARRAY['upper_chest', 'anterior_deltoid', 'triceps'],
 ARRAY['dumbbells', 'incline_bench'],
 'compound', 'intermediate',
 ARRAY[
   'Set adjustable bench to 30–45 degrees.',
   'Sit down, kick dumbbells up, and lie back against the pad.',
   'Press the dumbbells up and slightly inward over upper chest.',
   'Lower under control until upper arms are parallel to floor.'
 ]),

('Machine Chest Press', 'machine-chest-press',
 'Guided horizontal press for safe hypertrophy and high-volume training.',
 ARRAY['chest', 'triceps', 'anterior_deltoid'],
 ARRAY['chest_press_machine'],
 'compound', 'beginner',
 ARRAY[
   'Adjust seat so handles align with mid-chest level.',
   'Press forward until arms are almost fully locked.',
   'Return slowly to the starting stretch without letting weights slam.'
 ]),

('Cable Fly', 'cable-fly',
 'Constant tension fly movement for isolated chest contraction.',
 ARRAY['chest'],
 ARRAY['cable_machine'],
 'isolation', 'beginner',
 ARRAY[
   'Set pulleys to chest or shoulder height with D-handles.',
   'Step forward with slight stagger, arms out with soft elbow bend.',
   'Bring hands together in front of chest in a hugging motion.',
   'Squeeze chest for a count, then slowly return.'
 ]),

('Cable Crossovers', 'cable-crossovers',
 'High-to-low or low-to-high cable fly emphasizing lower or upper chest fibers.',
 ARRAY['chest'],
 ARRAY['cable_machine'],
 'isolation', 'intermediate',
 ARRAY[
   'Set pulleys high, step forward into a staggered stance.',
   'Pull handles down and across your body toward your hips.',
   'Cross hands slightly at the bottom for maximal peak contraction.'
 ]),

('Dumbbell Flys', 'dumbbell-flys',
 'Free-weight chest isolation focusing on deep stretch and contraction.',
 ARRAY['chest', 'anterior_deltoid'],
 ARRAY['dumbbells', 'bench'],
 'isolation', 'intermediate',
 ARRAY[
   'Lie flat on bench holding dumbbells directly over chest with palms facing.',
   'Lower dumbbells in an arc out to sides, keeping slight bend in elbows.',
   'Stop when dumbbells reach chest level and return along the same arc.'
 ]),

('Dips', 'dips',
 'Compound bodyweight or weighted press for chest and tricep power.',
 ARRAY['lower_chest', 'triceps', 'anterior_deltoid'],
 ARRAY['dip_bars'],
 'compound', 'intermediate',
 ARRAY[
   'Grip parallel dip bars and support your body weight.',
   'Lean torso forward ~30 degrees to emphasize the chest.',
   'Lower until elbows reach 90 degrees.',
   'Press back up to top lockout.'
 ]),

('Hammer Strength Press', 'hammer-strength-press',
 'Plate-loaded converging press providing natural biomechanics with heavy loads.',
 ARRAY['chest', 'triceps', 'anterior_deltoid'],
 ARRAY['hammer_strength_machine'],
 'compound', 'intermediate',
 ARRAY[
   'Adjust seat height so handles align with lower/mid chest.',
   'Press handles forward aggressively.',
   'Lower under complete control.'
 ]),

('Push-Up', 'push-up',
 'Foundational bodyweight pushing exercise. Scalable for all levels.',
 ARRAY['chest', 'triceps', 'anterior_deltoid', 'core'],
 ARRAY[]::TEXT[],
 'bodyweight', 'beginner',
 ARRAY[
   'Start in plank position, hands slightly wider than shoulders.',
   'Lower your body until chest nearly touches the floor.',
   'Push back up to starting position maintaining straight spine.'
 ]),

-- ── Back ──────────────────────────────────────────────────────────────────────
('Lat Pulldown', 'lat-pulldown',
 'Primary vertical pulling movement for latissimus dorsi width.',
 ARRAY['lats', 'biceps', 'rhomboids', 'rear_deltoid'],
 ARRAY['lat_pulldown_machine'],
 'compound', 'beginner',
 ARRAY[
   'Sit facing machine, thighs secured under pads.',
   'Grip bar slightly wider than shoulder-width with overhand grip.',
   'Lean back slightly and pull bar down to upper chest.',
   'Slowly return bar to full overhead stretch.'
 ]),

('Close-Grip Pulldown', 'close-grip-pulldown',
 'Uses V-bar or neutral close grip to emphasize lower lats and bicep recruitment.',
 ARRAY['lats', 'biceps', 'rhomboids'],
 ARRAY['lat_pulldown_machine', 'v_bar'],
 'compound', 'beginner',
 ARRAY[
   'Attach V-bar to lat pulldown cable.',
   'Pull attachment down to upper chest, driving elbows down and back.',
   'Squeeze back musculature at the bottom and control upward return.'
 ]),

('Reverse-Grip Pulldown', 'reverse-grip-pulldown',
 'Underhand supinated pulldown for heavy lat contraction and bicep activation.',
 ARRAY['lats', 'biceps', 'lower_traps'],
 ARRAY['lat_pulldown_machine'],
 'compound', 'intermediate',
 ARRAY[
   'Grip bar with shoulder-width underhand (palms facing you) grip.',
   'Pull bar down smoothly to upper chest.',
   'Keep chest proud and elbows tucked.'
 ]),

('Straight Arm Lat Pulldown', 'straight-arm-lat-pulldown',
 'Pure isolation movement targeting lats without bicep fatigue.',
 ARRAY['lats', 'teres_major'],
 ARRAY['cable_machine', 'straight_bar'],
 'isolation', 'beginner',
 ARRAY[
   'Stand facing high pulley with straight bar or rope attachment.',
   'With elbows slightly bent but rigid, sweep bar down in an arc to thighs.',
   'Squeeze lats hard at bottom, then return slowly to eye level.'
 ]),

('Pull-Up', 'pull-up',
 'Best bodyweight exercise for lat development, grip, and upper back width.',
 ARRAY['lats', 'biceps', 'rear_deltoid', 'rhomboids'],
 ARRAY['pull_up_bar'],
 'bodyweight', 'intermediate',
 ARRAY[
   'Hang from the bar with an overhand wide grip.',
   'Drive elbows down toward your hips to pull chest to bar.',
   'Clear bar with chin, then lower under control to dead hang.'
 ]),

('Barbell Row', 'barbell-row',
 'Foundational horizontal pull building back thickness, rhomboids, and rear delts.',
 ARRAY['lats', 'rhomboids', 'rear_deltoid', 'biceps', 'lower_back'],
 ARRAY['barbell'],
 'compound', 'intermediate',
 ARRAY[
   'Hinge at hips to ~45 degrees with knees slightly bent.',
   'Pull barbell to lower ribcage/navel, keeping elbows tucked.',
   'Squeeze shoulder blades together, then lower smoothly.'
 ]),

('Pendlay Row', 'pendlay-row',
 'Explosive horizontal row starting from a dead stop on the floor each rep.',
 ARRAY['lats', 'upper_back', 'rhomboids', 'rear_deltoid', 'lower_back'],
 ARRAY['barbell'],
 'compound', 'advanced',
 ARRAY[
   'Set bar on floor, bend over so torso is completely parallel to ground.',
   'Explosively pull bar up to touch sternum without lifting torso.',
   'Lower bar completely back to the floor before next repetition.'
 ]),

('T-Bar Row', 't-bar-row',
 'Supported or landmine row targeting mid-back thickness and lats with heavy load.',
 ARRAY['lats', 'rhomboids', 'traps', 'biceps'],
 ARRAY['t_bar_machine'],
 'compound', 'intermediate',
 ARRAY[
   'Straddle bar, grip neutral handles, and brace flat back.',
   'Pull weight toward chest, driving elbows past torso.',
   'Lower under strict control without rounding spine.'
 ]),

('Barbell Shrug', 'barbell-shrug',
 'Direct upper trapezius hypertrophy exercise.',
 ARRAY['traps'],
 ARRAY['barbell'],
 'isolation', 'beginner',
 ARRAY[
   'Hold barbell at thigh level with shoulder-width overhand grip.',
   'Elevate shoulders straight up toward ears as high as possible.',
   'Hold squeeze for 1 second, then lower slowly.'
 ]),

('Rack Deadlift', 'rack-deadlift',
 'Partial range deadlift focused on back thickness, upper traps, and spinal erectors.',
 ARRAY['traps', 'lats', 'lower_back', 'glutes'],
 ARRAY['barbell', 'power_rack'],
 'compound', 'advanced',
 ARRAY[
   'Set rack pins just below knee height.',
   'Set flat back, brace core, and pull bar up locking out hips.',
   'Lower under control to rack pins and reset.'
 ]),

('Barbell Deadlift', 'barbell-deadlift',
 'The king of compound lifts targeting the entire posterior chain.',
 ARRAY['hamstrings', 'glutes', 'lower_back', 'traps', 'lats', 'forearms'],
 ARRAY['barbell'],
 'compound', 'intermediate',
 ARRAY[
   'Stand with feet hip-width apart, bar over mid-foot.',
   'Hinge at hips, grip bar, flatten back, and take slack out.',
   'Drive through heels and extend hips and knees simultaneously.'
 ]),

('Machine Reverse Fly', 'machine-reverse-fly',
 'Rear deltoid and rhomboid isolation for shoulder posture and 3D look.',
 ARRAY['rear_deltoid', 'rhomboids'],
 ARRAY['pec_deck_machine'],
 'isolation', 'beginner',
 ARRAY[
   'Sit facing machine pad with handles at shoulder level.',
   'Pull handles back in an arc using rear shoulders.',
   'Squeeze upper back blades, then return slowly.'
 ]),

-- ── Shoulders ─────────────────────────────────────────────────────────────────
('Overhead Press', 'overhead-press',
 'Primary vertical barbell press building full shoulder width and tricep power.',
 ARRAY['anterior_deltoid', 'lateral_deltoid', 'triceps', 'upper_chest', 'traps'],
 ARRAY['barbell'],
 'compound', 'intermediate',
 ARRAY[
   'Stand with feet shoulder-width, bar rested across collarbones.',
   'Press bar straight overhead, moving chin back as bar passes.',
   'Lock out overhead with bar centered over mid-foot.'
 ]),

('Seated Dumbbell Press', 'seated-dumbbell-press',
 'Overhead dumbbell press with back support allowing heavy isolated shoulder overload.',
 ARRAY['anterior_deltoid', 'lateral_deltoid', 'triceps'],
 ARRAY['dumbbells', 'bench'],
 'compound', 'beginner',
 ARRAY[
   'Sit on 90-degree upright bench holding dumbbells at ear level.',
   'Press weights smoothly overhead until arms are extended.',
   'Lower under control back to ear level.'
 ]),

('Dumbbell Lateral Raise', 'dumbbell-lateral-raise',
 'Primary isolation for lateral deltoids to create shoulder width.',
 ARRAY['lateral_deltoid'],
 ARRAY['dumbbells'],
 'isolation', 'beginner',
 ARRAY[
   'Stand with slight forward torso tilt, dumbbells at sides.',
   'Raise arms out to sides until elbows reach shoulder height.',
   'Lead with elbows, pause briefly, and lower slowly.'
 ]),

('One Arm Cable Lateral Raise', 'one-arm-cable-lateral-raise',
 'Cable lateral raise keeping constant tension throughout entire range of motion.',
 ARRAY['lateral_deltoid'],
 ARRAY['cable_machine'],
 'isolation', 'intermediate',
 ARRAY[
   'Set cable pulley to lowest position, hold handle with outside hand.',
   'Raise arm out to side to shoulder height.',
   'Resist weight on negative descent.'
 ]),

('Barbell Front Raise', 'barbell-front-raise',
 'Anterior deltoid isolation building rounded front shoulders.',
 ARRAY['anterior_deltoid'],
 ARRAY['barbell'],
 'isolation', 'beginner',
 ARRAY[
   'Hold barbell with overhand grip across thighs.',
   'Raise bar straight forward to shoulder level without swinging.',
   'Lower with control.'
 ]),

('Upright Row', 'upright-row',
 'Compound vertical pull for lateral deltoids and upper trapezius.',
 ARRAY['lateral_deltoid', 'traps', 'biceps'],
 ARRAY['barbell', 'ez_bar'],
 'compound', 'intermediate',
 ARRAY[
   'Hold bar with medium overhand grip at thighs.',
   'Pull bar upward along torso, leading with high elbows.',
   'Stop at chest height, then lower smoothly.'
 ]),

-- ── Legs ──────────────────────────────────────────────────────────────────────
('Barbell Back Squat', 'barbell-back-squat',
 'The foundational lower body compound builder for quads, glutes, and core.',
 ARRAY['quadriceps', 'glutes', 'hamstrings', 'lower_back', 'core'],
 ARRAY['barbell', 'squat_rack'],
 'compound', 'intermediate',
 ARRAY[
   'Rest barbell on upper traps, feet shoulder-width, toes turned out slightly.',
   'Break at hips and knees, sitting down to at least parallel.',
   'Drive up powerfully through mid-foot.'
 ]),

('Front Squat', 'front-squat',
 'Quad-dominant squat variation emphasizing upright posture and core stability.',
 ARRAY['quadriceps', 'glutes', 'core', 'upper_back'],
 ARRAY['barbell', 'squat_rack'],
 'compound', 'advanced',
 ARRAY[
   'Rack bar on front deltoids with clean grip or crossed arms.',
   'Keep elbows high and torso upright as you descend.',
   'Drive back to standing keeping chest proud.'
 ]),

('Leg Press', 'leg-press',
 '45-degree sled press for heavy quad and glute loading without spinal compression.',
 ARRAY['quadriceps', 'glutes', 'hamstrings'],
 ARRAY['leg_press_machine'],
 'compound', 'beginner',
 ARRAY[
   'Place feet shoulder-width on platform, release safety latches.',
   'Lower weight until knees reach 90-degree angle.',
   'Press sled back up without hyperextending knees.'
 ]),

('Leg Extension', 'leg-extension',
 'Direct quad isolation for sculpting the vastus medialis and rectus femoris.',
 ARRAY['quadriceps'],
 ARRAY['leg_extension_machine'],
 'isolation', 'beginner',
 ARRAY[
   'Sit with pad resting comfortably across lower shins.',
   'Extend legs forward until fully straight.',
   'Pause for a hard quad contraction, then lower under control.'
 ]),

('Hamstring Curl', 'hamstring-curl',
 'Seated or lying knee flexion isolation for hamstring development.',
 ARRAY['hamstrings'],
 ARRAY['leg_curl_machine'],
 'isolation', 'beginner',
 ARRAY[
   'Align knee joint with machine axis of rotation.',
   'Curl heels toward glutes smoothly.',
   'Control the eccentric return back to extension.'
 ]),

('Romanian Deadlift', 'romanian-deadlift',
 'Hip hinge exercise for deep hamstring stretch and glute hypertrophy.',
 ARRAY['hamstrings', 'glutes', 'lower_back'],
 ARRAY['barbell', 'dumbbells'],
 'compound', 'intermediate',
 ARRAY[
   'Hold bar at thighs with slight knee bend.',
   'Hinge hips backward while keeping spine strictly neutral.',
   'Lower until feeling hamstring stretch, then drive hips forward.'
 ]),

('Dumbbell Lunge', 'dumbbell-lunge',
 'Unilateral leg builder improving balance, quad drive, and glute activation.',
 ARRAY['quadriceps', 'glutes', 'hamstrings', 'calves'],
 ARRAY['dumbbells'],
 'compound', 'beginner',
 ARRAY[
   'Hold dumbbells at sides and take a deliberate step forward.',
   'Lower back knee until it hovers just above floor.',
   'Push off front heel to return to start and alternate.'
 ]),

('Standing Calf Raise', 'standing-calf-raise',
 'Heavy gastrocnemius calf isolation with straight legs.',
 ARRAY['calves'],
 ARRAY['calf_machine', 'dumbbells'],
 'isolation', 'beginner',
 ARRAY[
   'Place balls of feet on block, heels hanging off.',
   'Drop heels down for a full Achilles stretch.',
   'Rise onto tiptoes as high as possible, holding peak squeeze.'
 ]),

('Seated Calf Raise', 'seated-calf-raise',
 'Soleus calf muscle builder executed with bent knees.',
 ARRAY['calves'],
 ARRAY['seated_calf_machine'],
 'isolation', 'beginner',
 ARRAY[
   'Sit with knee pad secured over lower thighs.',
   'Lower heels down into full stretch.',
   'Press up through balls of feet and squeeze.'
 ]),

-- ── Biceps ────────────────────────────────────────────────────────────────────
('Barbell Curl', 'barbell-curl',
 'The classic heavy builder for overall bicep mass and forearm strength.',
 ARRAY['biceps', 'forearms'],
 ARRAY['barbell'],
 'isolation', 'beginner',
 ARRAY[
   'Stand upright holding barbell with shoulder-width underhand grip.',
   'Curl bar up by flexing biceps without swinging torso.',
   'Squeeze at the top, lower slowly under control.'
 ]),

('EZ Bar Curl', 'ez-bar-curl',
 'Angled bar bicep curl reducing wrist strain for comfortable loading.',
 ARRAY['biceps', 'brachialis'],
 ARRAY['ez_bar'],
 'isolation', 'beginner',
 ARRAY[
   'Hold EZ bar at inner angled grips.',
   'Curl upward keeping elbows pinned to sides.',
   'Lower smoothly to full extension.'
 ]),

('Hammer Curl', 'hammer-curl',
 'Neutral-grip dumbbell curl targeting the brachialis and brachioradialis for arm thickness.',
 ARRAY['biceps', 'brachialis', 'forearms'],
 ARRAY['dumbbells'],
 'isolation', 'beginner',
 ARRAY[
   'Hold dumbbells with palms facing each other (neutral grip).',
   'Curl weights toward shoulders without rotating wrists.',
   'Lower under control.'
 ]),

('Preacher Curl', 'preacher-curl',
 'Bicep curl on inclined bench pad preventing momentum for pure peak contraction.',
 ARRAY['biceps'],
 ARRAY['preacher_bench', 'ez_bar', 'dumbbells'],
 'isolation', 'intermediate',
 ARRAY[
   'Rest upper arms firmly against preacher bench pad.',
   'Curl weight up toward chin.',
   'Lower slowly until arms are near full extension.'
 ]),

('Incline Dumbbell Curl', 'incline-dumbbell-curl',
 'Executed on incline bench providing maximal stretch on the long head of the bicep.',
 ARRAY['biceps'],
 ARRAY['dumbbells', 'incline_bench'],
 'isolation', 'intermediate',
 ARRAY[
   'Sit back on 45–60 degree incline bench, letting arms hang straight down.',
   'Curl dumbbells up while keeping elbows behind your torso.',
   'Lower slowly to feel deep stretch at the bottom.'
 ]),

('Dumbbell Curl', 'dumbbell-curl',
 'Standard alternating or simultaneous dumbbell curl with wrist supination.',
 ARRAY['biceps', 'forearms'],
 ARRAY['dumbbells'],
 'isolation', 'beginner',
 ARRAY[
   'Hold dumbbells with palms neutral, curl up while rotating palms upward.',
   'Squeeze biceps at peak height and lower under control.'
 ]),

-- ── Triceps ───────────────────────────────────────────────────────────────────
('Triceps Rope Pushdown', 'triceps-rope-pushdown',
 'Cable tricep extension allowing outward spread at bottom for lateral head activation.',
 ARRAY['triceps'],
 ARRAY['cable_machine', 'rope_attachment'],
 'isolation', 'beginner',
 ARRAY[
   'Attach rope to high pulley, grasp ends with neutral grip.',
   'Keep elbows tucked at ribs, push rope down.',
   'Spread rope apart at bottom and lock out triceps.'
 ]),

('Overhead Bar Extension', 'overhead-bar-extension',
 'Overhead tricep extension targeting the long head in its fully lengthened state.',
 ARRAY['triceps'],
 ARRAY['cable_machine', 'straight_bar', 'ez_bar'],
 'isolation', 'intermediate',
 ARRAY[
   'Hold bar overhead with elbows pointing forward.',
   'Lower bar behind your head by bending elbows.',
   'Extend arms back overhead, locking out triceps.'
 ]),

('Skullcrusher', 'skullcrusher',
 'Lying tricep extension with EZ bar or dumbbells directly challenging the triceps long head.',
 ARRAY['triceps'],
 ARRAY['ez_bar', 'bench'],
 'isolation', 'intermediate',
 ARRAY[
   'Lie on flat bench holding bar with arms extended over chest.',
   'Bending only at elbows, lower bar toward forehead or crown of head.',
   'Extend elbows to return to starting position.'
 ]),

('One Arm Dumbbell Extension', 'one-arm-dumbbell-extension',
 'Unilateral overhead dumbbell extension for balanced tricep strength.',
 ARRAY['triceps'],
 ARRAY['dumbbells'],
 'isolation', 'beginner',
 ARRAY[
   'Sit or stand holding single dumbbell overhead.',
   'Lower dumbbell behind head with controlled elbow flexion.',
   'Press dumbbell back up overhead.'
 ]),

('Close Grip Bench Press', 'close-grip-bench-press',
 'Heavy compound press targeting triceps overload with chest assistance.',
 ARRAY['triceps', 'chest', 'anterior_deltoid'],
 ARRAY['barbell', 'bench'],
 'compound', 'intermediate',
 ARRAY[
   'Lie flat on bench, grip bar with hands shoulder-width apart.',
   'Lower bar to lower chest keeping elbows tucked tight to sides.',
   'Press up powerfully using triceps.'
 ]),

('Tricep Kickback', 'tricep-kickback',
 'Bent-over dumbbell extension achieving maximal shortened contraction of triceps.',
 ARRAY['triceps'],
 ARRAY['dumbbells'],
 'isolation', 'beginner',
 ARRAY[
   'Hinge torso forward, pin elbow to side at 90 degrees.',
   'Extend forearm backward until arm is completely straight.',
   'Squeeze tricep, then return to 90 degrees.'
 ]),

('Tricep Dip', 'tricep-dip',
 'Upright bodyweight or assisted dip prioritizing triceps lockouts.',
 ARRAY['triceps', 'anterior_deltoid'],
 ARRAY['dip_bars', 'bench'],
 'compound', 'beginner',
 ARRAY[
   'Support bodyweight on dip bars or edge of bench with upright torso.',
   'Lower body keeping elbows pointing straight back.',
   'Press back to straight arms.'
 ]),

-- ── Core ──────────────────────────────────────────────────────────────────────
('Plank', 'plank',
 'Isometric core stability builder engaging transverse abdominis and lower back.',
 ARRAY['core', 'lower_back', 'glutes'],
 ARRAY[]::TEXT[],
 'bodyweight', 'beginner',
 ARRAY[
   'Rest on forearms and toes, body forming rigid straight line.',
   'Brace core and squeeze glutes.',
   'Hold position for target duration without letting hips sag.'
 ]),

('Cable Crunch', 'cable-crunch',
 'Weighted abdominal flexion exercise for hypertrophy of the rectus abdominis.',
 ARRAY['rectus_abdominis'],
 ARRAY['cable_machine', 'rope_attachment'],
 'isolation', 'beginner',
 ARRAY[
   'Kneel holding rope attachment behind your neck.',
   'Crunch torso downward, curling spine and bringing elbows toward thighs.',
   'Squeeze abs hard at bottom, then return slowly.'
 ])

ON CONFLICT (slug) DO NOTHING;
