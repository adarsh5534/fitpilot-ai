import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Ring } from '@/components/ui/ring';
import { Header } from '@/components/ui/header';
import { SectionTitle } from '@/components/ui/section-title';
import { useWorkoutStore } from '@/stores/workout.store';
import type { Exercise, WorkoutSessionDetail } from '@fitpilot/shared';

const C = Colors.dark;

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

interface WeekDayItem {
  dayName: string;
  dateNumber: number;
  isToday: boolean;
  dayIndex: number;
}

function getWeekDates(): WeekDayItem[] {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);

  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const days: WeekDayItem[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      dayName: dayNames[i],
      dateNumber: d.getDate(),
      isToday: d.toDateString() === now.toDateString(),
      dayIndex: i,
    });
  }

  return days;
}

export default function WorkoutScreen() {
  const router = useRouter();

  const {
    todaySuggestion,
    activeSession,
    history,
    exerciseLibrary,
    isLoading,
    elapsedSeconds,
    restTimer,
    restTimerDuration,
    fetchTodaySuggestion,
    fetchActiveSession,
    startSession,
    cancelSession,
    logSet,
    finishSession,
    fetchHistory,
    fetchExerciseLibrary,
    cancelRestTimer,
    addRestSeconds,
    tick,
  } = useWorkoutStore();

  const weekDates = React.useMemo(() => getWeekDates(), []);
  const todayIndex = weekDates.findIndex((d) => d.isToday);
  const [selectedDay, setSelectedDay] = useState(todayIndex !== -1 ? todayIndex : 1);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [lastFinishedSession, setLastFinishedSession] = useState<WorkoutSessionDetail | null>(null);

  // Local set inputs state: { [exerciseId_setNumber]: { weight: string; reps: string } }
  const [setInputs, setSetInputs] = useState<Record<string, { weight: string; reps: string }>>({});

  // 1. Initial Data Fetch
  useEffect(() => {
    fetchTodaySuggestion();
    fetchActiveSession();
    fetchHistory();
    fetchExerciseLibrary();
  }, [fetchTodaySuggestion, fetchActiveSession, fetchHistory, fetchExerciseLibrary]);

  // 2. Timer Loop for stopwatch and rest countdown
  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, [tick]);

  // 3. Category/Search changes
  useEffect(() => {
    fetchExerciseLibrary(filterCategory, searchQuery);
  }, [filterCategory, searchQuery, fetchExerciseLibrary]);

  const handleStartWorkout = async () => {
    try {
      let session: WorkoutSessionDetail | null = null;
      if (todaySuggestion?.day_id) {
        session = await startSession(todaySuggestion.day_id, todaySuggestion.day_name);
      } else {
        session = await startSession(undefined, 'Freestyle Workout');
      }

      if (!session) {
        const err = useWorkoutStore.getState().error;
        Alert.alert(
          'Workout',
          err || 'Unable to start workout session. Please verify your connection.'
        );
      }
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to start workout');
    }
  };

  const handleDiscardWorkout = () => {
    Alert.alert(
      'Discard Workout?',
      'Are you sure you want to discard this workout session? Sets and progress will not be recorded.',
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: async () => {
            const ok = await cancelSession();
            if (!ok) {
              const err = useWorkoutStore.getState().error;
              Alert.alert('Error', err || 'Failed to cancel session');
            }
          },
        },
      ]
    );
  };

  const handleFinishWorkout = () => {
    Alert.alert(
      'Finish Workout',
      'Are you ready to complete and log this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          style: 'default',
          onPress: async () => {
            const res = await finishSession('Workout completed successfully');
            if (res) {
              setLastFinishedSession(res);
              setShowSummaryModal(true);
            } else {
              const err = useWorkoutStore.getState().error;
              Alert.alert('Error', err || 'Failed to finish workout');
            }
          },
        },
      ]
    );
  };

  const handleLogSet = async (
    exerciseId: string,
    setNumber: number,
    defaultWeight: number | null,
    defaultReps: number
  ) => {
    const key = `${exerciseId}_${setNumber}`;
    const input = setInputs[key];
    const weight = input?.weight ? parseFloat(input.weight) : defaultWeight ?? 0;
    const reps = input?.reps ? parseInt(input.reps, 10) : defaultReps;

    await logSet({
      exercise_id: exerciseId,
      set_number: setNumber,
      weight_kg: isNaN(weight) ? undefined : weight,
      reps_completed: isNaN(reps) ? undefined : reps,
      is_warmup: false,
      is_skipped: false,
    });
  };

  const isSetCompleted = (exerciseId: string, setNumber: number) => {
    return activeSession?.sets?.some(
      (s) => s.exercise_id === exerciseId && s.set_number === setNumber && !s.is_skipped
    );
  };

  // ── ACTIVE IN-WORKOUT VIEW ────────────────────────────────────────────────
  if (activeSession) {
    const exercisesToRender = (() => {
      if (activeSession.plan_day?.exercises && activeSession.plan_day.exercises.length > 0) {
        return activeSession.plan_day.exercises.map((pe) => {
          const match = todaySuggestion?.exercises?.find((te) => te.exercise.id === pe.exercise.id);
          return {
            exercise: pe.exercise,
            target_sets: pe.target_sets,
            target_reps_min: pe.target_reps_min,
            target_reps_max: pe.target_reps_max,
            target_weight_kg: pe.target_weight_kg ?? null,
            suggested_weight_kg: match?.suggested_weight_kg ?? pe.target_weight_kg,
            previous_weight_kg: match?.previous_weight_kg ?? null,
            previous_reps: match?.previous_reps ?? null,
          };
        });
      }
      if (todaySuggestion?.exercises && todaySuggestion.exercises.length > 0) {
        return todaySuggestion.exercises;
      }
      return [];
    })();

    const totalTargetSets = exercisesToRender.reduce((acc, e) => acc + e.target_sets, 0);

    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safe} edges={['top']}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.activeContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.activeWorkoutHeader}>
              <TouchableOpacity
                style={styles.discardBtn}
                onPress={handleDiscardWorkout}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <Icon name="x" size={18} color="#FF6B6B" />
              </TouchableOpacity>
              <View style={styles.activeWorkoutCenter}>
                <Text style={styles.activeWorkoutKicker}>LIVE WORKOUT</Text>
                <Text style={styles.activeWorkoutTitle}>{activeSession.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.finishBtn}
                onPress={handleFinishWorkout}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#101211" />
                ) : (
                  <Text style={styles.finishBtnText}>Finish</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Time / Volume / Sets Stats Row */}
            <View style={styles.workoutTimeBar}>
              <View style={styles.workoutTimeItem}>
                <Text style={styles.workoutTimeLabel}>Duration</Text>
                <Text style={styles.workoutTimeValue}>{formatTime(elapsedSeconds)}</Text>
              </View>
              <View style={styles.workoutTimeItem}>
                <Text style={styles.workoutTimeLabel}>Volume</Text>
                <Text style={styles.workoutTimeValue}>
                  {(activeSession.total_volume_kg || 0).toLocaleString()} kg
                </Text>
              </View>
              <View style={[styles.workoutTimeItem, { borderRightWidth: 0 }]}>
                <Text style={styles.workoutTimeLabel}>Sets Completed</Text>
                <Text style={styles.workoutTimeValue}>
                  {activeSession.sets?.length || 0}
                  {totalTargetSets > 0 ? ` / ${totalTargetSets}` : ''}
                </Text>
              </View>
            </View>

            {/* Exercises List */}
            {exercisesToRender.length > 0 ? (
              exercisesToRender.map((item) => {
                const ex = item.exercise;
                const initials = getInitials(ex.name);

                return (
                  <View key={ex.id} style={styles.activeExerciseCard}>
                    <View style={styles.exerciseHeading}>
                      <View style={styles.exerciseArt}>
                        <Text style={styles.exerciseArtText}>{initials}</Text>
                      </View>
                      <View style={styles.exerciseHeadingInfo}>
                        <Text style={styles.exerciseName}>{ex.name}</Text>
                        <Text style={styles.exerciseMeta}>
                          {item.target_sets} sets · {item.target_reps_min}–{item.target_reps_max} reps
                          {item.suggested_weight_kg ? ` · Suggested ${item.suggested_weight_kg} kg` : ''}
                        </Text>
                      </View>
                    </View>

                    {/* Set Headers */}
                    <View style={styles.setLabels}>
                      <Text style={[styles.setLabelText, { width: 32 }]}>SET</Text>
                      <Text style={[styles.setLabelText, { flex: 1.2 }]}>TARGET / PREV</Text>
                      <Text style={[styles.setLabelText, { flex: 0.8 }]}>KG</Text>
                      <Text style={[styles.setLabelText, { flex: 0.8 }]}>REPS</Text>
                      <Text style={{ width: 36 }} />
                    </View>

                    {/* Set Rows */}
                    {Array.from({ length: item.target_sets }).map((_, idx) => {
                      const setNum = idx + 1;
                      const completed = isSetCompleted(ex.id, setNum);
                      const key = `${ex.id}_${setNum}`;

                      const defaultKg = item.suggested_weight_kg ?? item.target_weight_kg ?? '';
                      const defaultReps = item.target_reps_max.toString();

                      const prevText = item.previous_weight_kg
                        ? `${item.previous_weight_kg} kg × ${item.previous_reps || item.target_reps_max}`
                        : `${item.suggested_weight_kg ?? '—'} kg × ${item.target_reps_min}-${item.target_reps_max}`;

                      return (
                        <View
                          key={setNum}
                          style={[styles.setRow, completed && styles.setRowCompleted]}
                        >
                          <Text style={styles.setNum}>{setNum}</Text>
                          <Text style={styles.setPrev} numberOfLines={1}>
                            {prevText}
                          </Text>
                          <TextInput
                            style={[styles.setInput, completed && styles.setInputDone]}
                            placeholder={defaultKg ? String(defaultKg) : '0'}
                            placeholderTextColor={C.textMuted}
                            keyboardType="numeric"
                            value={setInputs[key]?.weight}
                            onChangeText={(t) =>
                              setSetInputs((prev) => ({
                                ...prev,
                                [key]: { ...(prev[key] || { reps: defaultReps }), weight: t },
                              }))
                            }
                            editable={!completed}
                          />
                          <TextInput
                            style={[styles.setInput, completed && styles.setInputDone]}
                            placeholder={defaultReps}
                            placeholderTextColor={C.textMuted}
                            keyboardType="numeric"
                            value={setInputs[key]?.reps}
                            onChangeText={(t) =>
                              setSetInputs((prev) => ({
                                ...prev,
                                [key]: {
                                  ...(prev[key] || { weight: String(defaultKg) }),
                                  reps: t,
                                },
                              }))
                            }
                            editable={!completed}
                          />
                          <TouchableOpacity
                            style={[styles.setCheckBtn, completed && styles.setCheckBtnDone]}
                            onPress={() =>
                              handleLogSet(
                                ex.id,
                                setNum,
                                item.suggested_weight_kg,
                                item.target_reps_max
                              )
                            }
                            activeOpacity={0.7}
                            disabled={completed}
                          >
                            <Icon
                              name="check"
                              size={16}
                              color={completed ? '#101211' : '#788078'}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptySessionBox}>
                <Text style={styles.emptySessionTitle}>Freestyle Session In Progress</Text>
                <Text style={styles.emptySessionSub}>
                  Record sets or explore the exercise library below.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Floating Rest Timer Pill */}
          {restTimer > 0 ? (
            <View style={styles.floatingRestTimer}>
              <Ring
                value={Math.min(100, ((restTimerDuration - restTimer) / restTimerDuration) * 100)}
                size={44}
                width={4}
                color={C.accent}
              >
                <Icon name="clock" size={16} color={C.accent} />
              </Ring>
              <View style={styles.restTimerInfo}>
                <Text style={styles.restTimerKicker}>REST TIMER</Text>
                <Text style={styles.restTimerValue}>{formatTime(restTimer)}</Text>
              </View>
              <TouchableOpacity
                style={styles.restTimerBtn}
                onPress={() => addRestSeconds(30)}
                activeOpacity={0.7}
              >
                <Text style={styles.restTimerBtnText}>+30s</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.restTimerBtn}
                onPress={cancelRestTimer}
                activeOpacity={0.7}
              >
                <Text style={[styles.restTimerBtnText, { color: C.accent }]}>Skip</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </SafeAreaView>
      </View>
    );
  }

  // ── STANDARD WORKOUT DASHBOARD & SCHEDULE VIEW ──────────────────────────
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Header
            subtitle="YOUR TRAINING"
            title="Workouts"
            onCoach={() => router.push('/(tabs)/coach/index' as any)}
          />

          {/* Week Strip */}
          <View style={styles.weekStrip}>
            {weekDates.map((item) => {
              const isSelected = selectedDay === item.dayIndex;
              const isPastOrToday = item.dayIndex <= todayIndex;

              return (
                <TouchableOpacity
                  key={item.dayIndex}
                  style={[
                    styles.weekDayBtn,
                    isSelected && styles.weekDaySelected,
                    isPastOrToday && !isSelected && styles.weekDayDone,
                  ]}
                  onPress={() => setSelectedDay(item.dayIndex)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.weekDayName, isSelected && styles.weekDayTextActive]}>
                    {item.dayName}
                  </Text>
                  <Text style={[styles.weekDayNum, isSelected && styles.weekDayTextActive]}>
                    {item.dateNumber}
                  </Text>
                  {item.dayIndex < todayIndex && !isSelected ? (
                    <View style={styles.doneCheckDot}>
                      <Icon name="check" size={10} color={C.accent} />
                    </View>
                  ) : null}
                  {item.isToday && !isSelected ? (
                    <View style={styles.todayIndicatorDot} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Today's Prescribed AI Workout Card */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleTop}>
              <View style={styles.scheduleTopLeft}>
                <View style={[styles.pill, styles.pillLime]}>
                  <Text style={styles.pillText}>
                    AI RECOMMENDATION · {todaySuggestion?.recovery_status?.readiness_score ?? 100}% READINESS
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.scheduleTitle}>
              {todaySuggestion?.day_name || 'Full Body Workout'}
            </Text>
            <Text style={styles.scheduleMeta}>
              {todaySuggestion?.target_muscle_groups?.slice(0, 4).join(' · ').toUpperCase() ||
                'HYPERTROPHY'}
              {' · '}
              {todaySuggestion?.exercises?.length || 6} exercises · ~45 min
            </Text>

            {/* Exercise Stack Preview */}
            <View style={styles.exerciseStack}>
              {todaySuggestion?.exercises?.slice(0, 3).map((item, idx) => (
                <View key={item.exercise.id} style={styles.stackRow}>
                  <View style={styles.exerciseArt}>
                    <Text style={styles.exerciseArtText}>
                      {getInitials(item.exercise.name)}
                    </Text>
                  </View>
                  <View style={styles.stackInfo}>
                    <Text style={styles.stackName}>{item.exercise.name}</Text>
                    <Text style={styles.stackMeta}>
                      {item.target_sets} sets · {item.target_reps_min}–{item.target_reps_max} reps
                      {item.suggested_weight_kg ? ` · Suggested ${item.suggested_weight_kg} kg` : ''}
                    </Text>
                  </View>
                  {idx === 2 && (todaySuggestion?.exercises?.length ?? 0) > 3 ? (
                    <View style={styles.moreCountBadge}>
                      <Text style={styles.moreCountText}>
                        +{todaySuggestion!.exercises.length - 3}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.startWorkoutFullBtn}
              onPress={handleStartWorkout}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#101211" />
              ) : (
                <>
                  <Icon name="play" size={17} color="#11150E" />
                  <Text style={styles.startWorkoutFullText}>Start Prescribed Workout</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* This Week Summary */}
          <SectionTitle title="Training History" />
          <View style={styles.weekSummaryCard}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryNumber}>{history.length}</Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryNumber}>
                {Math.round(
                  history.reduce((acc, h) => acc + (h.duration_seconds || 0), 0) / 60
                )}{' '}
                min
              </Text>
              <Text style={styles.summaryLabel}>Training time</Text>
            </View>
            <View style={[styles.summaryCol, { borderRightWidth: 0 }]}>
              <Text style={styles.summaryNumber}>
                {Math.round(
                  history.reduce((acc, h) => acc + (h.total_volume_kg || 0), 0) / 1000
                )}k
              </Text>
              <Text style={styles.summaryLabel}>Volume (kg)</Text>
            </View>
          </View>

          {/* Exercise Library Search */}
          <SectionTitle title="Exercise library" action="See all" />
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color="#777F78" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercise library"
              placeholderTextColor="#777F78"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Filter Chips */}
          <View style={styles.chipsRow}>
            {['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Biceps', 'Triceps', 'Core'].map((cat) => {
              const isCatActive = filterCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, isCatActive && styles.chipActive]}
                  onPress={() => setFilterCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isCatActive && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Filtered Exercise Cards */}
          <View style={styles.libraryGrid}>
            {exerciseLibrary.slice(0, 6).map((ex) => (
              <View key={ex.id} style={styles.libraryItemCard}>
                <View style={styles.libraryItemLeft}>
                  <View style={styles.exerciseArt}>
                    <Text style={styles.exerciseArtText}>{getInitials(ex.name)}</Text>
                  </View>
                  <View style={styles.libraryItemInfo}>
                    <Text style={styles.libraryItemName}>{ex.name}</Text>
                    <Text style={styles.libraryItemMeta}>
                      {ex.muscle_groups.slice(0, 2).join(' · ')} · {ex.movement_type}
                    </Text>
                  </View>
                </View>
                <View style={styles.difficultyPill}>
                  <Text style={styles.difficultyPillText}>{ex.difficulty}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Workout Complete Summary Modal */}
        <Modal
          visible={showSummaryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSummaryModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.summaryModalBox}>
              <View style={styles.trophyIconBox}>
                <Icon name="trophy" size={32} color="#101211" />
              </View>
              <Text style={styles.modalTitle}>Workout Complete!</Text>
              <Text style={styles.modalSubtitle}>
                Crushed your session. Progression and sets recorded.
              </Text>

              <View style={styles.modalStatsRow}>
                <View style={styles.modalStatCol}>
                  <Text style={styles.modalStatValue}>
                    {formatTime(lastFinishedSession?.duration_seconds || 0)}
                  </Text>
                  <Text style={styles.modalStatLabel}>DURATION</Text>
                </View>
                <View style={styles.modalStatCol}>
                  <Text style={styles.modalStatValue}>
                    {(lastFinishedSession?.total_volume_kg || 0).toLocaleString()} kg
                  </Text>
                  <Text style={styles.modalStatLabel}>VOLUME</Text>
                </View>
                <View style={styles.modalStatCol}>
                  <Text style={styles.modalStatValue}>
                    {lastFinishedSession?.total_sets_completed || 0}
                  </Text>
                  <Text style={styles.modalStatLabel}>SETS</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalDoneBtn}
                onPress={() => setShowSummaryModal(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalDoneText}>Return to Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  activeContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 165,
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  weekDayBtn: {
    width: 42,
    height: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  weekDaySelected: {
    backgroundColor: C.accent,
  },
  weekDayDone: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  weekDayName: {
    fontSize: 10,
    color: '#777E78',
    fontWeight: FontWeight.medium,
  },
  weekDayNum: {
    fontSize: 13,
    color: '#777E78',
    fontWeight: FontWeight.bold,
  },
  weekDayTextActive: {
    color: '#101210',
  },
  doneCheckDot: {
    position: 'absolute',
    bottom: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2B312D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayIndicatorDot: {
    position: 'absolute',
    bottom: 6,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.accent,
  },
  scheduleCard: {
    backgroundColor: '#191C1A',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  scheduleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  pillLime: {
    backgroundColor: 'rgba(184, 243, 74, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(184, 243, 74, 0.25)',
  },
  pillText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: C.accent,
    letterSpacing: 0.5,
  },
  scheduleTitle: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: '#DFE3DD',
    marginBottom: 4,
  },
  scheduleMeta: {
    fontSize: FontSize.xs,
    color: '#777E78',
    marginBottom: 18,
  },
  exerciseStack: {
    gap: 12,
    marginBottom: 20,
  },
  stackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    padding: 10,
  },
  exerciseArt: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#242825',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseArtText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: C.accent,
  },
  stackInfo: {
    flex: 1,
  },
  stackName: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#DFE3DD',
    marginBottom: 2,
  },
  stackMeta: {
    fontSize: 12,
    color: '#777E78',
  },
  moreCountBadge: {
    backgroundColor: '#242825',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  moreCountText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: C.accent,
  },
  startWorkoutFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.accent,
    borderRadius: 16,
    paddingVertical: 14,
  },
  startWorkoutFullText: {
    fontSize: 15,
    fontWeight: FontWeight.extrabold,
    color: '#11150E',
  },
  weekSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#191C1A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    marginBottom: 20,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    color: '#DFE3DD',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#777E78',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191C1A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#DFE3DD',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  chipActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: FontWeight.semibold,
    color: '#777E78',
  },
  chipTextActive: {
    color: '#101210',
  },
  libraryGrid: {
    gap: 10,
  },
  libraryItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#191C1A',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  libraryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  libraryItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  libraryItemName: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#DFE3DD',
    marginBottom: 2,
  },
  libraryItemMeta: {
    fontSize: 12,
    color: '#777E78',
    textTransform: 'capitalize',
  },
  difficultyPill: {
    backgroundColor: '#242825',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyPillText: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    color: C.accent,
    textTransform: 'capitalize',
  },

  // Active workout styles
  activeWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  discardBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#261A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activeWorkoutCenter: {
    flex: 1,
  },
  activeWorkoutKicker: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: C.accent,
    letterSpacing: 1,
    marginBottom: 2,
  },
  activeWorkoutTitle: {
    fontSize: 20,
    fontWeight: FontWeight.extrabold,
    color: '#DFE3DD',
  },
  finishBtn: {
    backgroundColor: C.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  finishBtnText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: '#101211',
  },
  workoutTimeBar: {
    flexDirection: 'row',
    backgroundColor: '#191C1A',
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  workoutTimeItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
  },
  workoutTimeLabel: {
    fontSize: 11,
    color: '#777E78',
    marginBottom: 2,
  },
  workoutTimeValue: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: '#DFE3DD',
  },
  activeExerciseCard: {
    backgroundColor: '#191C1A',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  exerciseHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  exerciseHeadingInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: '#DFE3DD',
    marginBottom: 2,
  },
  exerciseMeta: {
    fontSize: 12,
    color: '#777E78',
  },
  setLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  setLabelText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#777E78',
    letterSpacing: 0.5,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141715',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
    gap: 8,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(184, 243, 74, 0.06)',
    borderColor: 'rgba(184, 243, 74, 0.2)',
    borderWidth: 1,
  },
  setNum: {
    width: 28,
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: '#777E78',
    textAlign: 'center',
  },
  setPrev: {
    flex: 1.2,
    fontSize: 12,
    color: '#8A928B',
  },
  setInput: {
    flex: 0.8,
    height: 36,
    backgroundColor: '#1B201D',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#DFE3DD',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  setInputDone: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: C.accent,
  },
  setCheckBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#242825',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setCheckBtnDone: {
    backgroundColor: C.accent,
  },
  emptySessionBox: {
    backgroundColor: '#191C1A',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  emptySessionTitle: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: '#DFE3DD',
    marginBottom: 4,
  },
  emptySessionSub: {
    fontSize: 13,
    color: '#777E78',
  },
  floatingRestTimer: {
    position: 'absolute',
    bottom: 84,
    left: 20,
    right: 20,
    backgroundColor: '#191C1A',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(184, 243, 74, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 50,
    gap: 12,
  },
  restTimerInfo: {
    flex: 1,
  },
  restTimerKicker: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#777E78',
    letterSpacing: 0.5,
  },
  restTimerValue: {
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    color: C.accent,
  },
  restTimerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: '#242825',
  },
  restTimerBtnText: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: '#DFE3DD',
  },

  // Summary Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  summaryModalBox: {
    width: '100%',
    backgroundColor: '#191C1A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  trophyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: '#DFE3DD',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#777E78',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalStatsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#141715',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  modalStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: C.accent,
    marginBottom: 2,
  },
  modalStatLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#777E78',
  },
  modalDoneBtn: {
    width: '100%',
    backgroundColor: C.accent,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalDoneText: {
    fontSize: 15,
    fontWeight: FontWeight.extrabold,
    color: '#101211',
  },
});
