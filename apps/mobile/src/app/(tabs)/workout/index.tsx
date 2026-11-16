import React, { useEffect, useState } from 'react';
import {
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

const C = Colors.dark;

const EXERCISES_LIST = [
  { name: 'Barbell Bench Press', meta: '4 sets · 6–8 reps', prev: 'Last: 80 kg × 7', letter: 'BP' },
  { name: 'Incline Dumbbell Press', meta: '3 sets · 8–10 reps', prev: 'Last: 28 kg × 9', letter: 'IP' },
  { name: 'Cable Chest Fly', meta: '3 sets · 10–12 reps', prev: 'Last: 16 kg × 12', letter: 'CF' },
  { name: 'Rope Tricep Pushdown', meta: '3 sets · 10–12 reps', prev: 'Last: 25 kg × 11', letter: 'TP' },
];

export default function WorkoutScreen() {
  const router = useRouter();

  const [active, setActive] = useState(false);
  const [done, setDone] = useState<number[]>([]);
  const [rest, setRest] = useState(0);
  const [selectedDay, setSelectedDay] = useState(2);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active workout rest timer countdown
  useEffect(() => {
    if (!rest) return;
    const timer = setInterval(() => setRest((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(timer);
  }, [rest]);

  const toggleSetComplete = (index: number) => {
    setDone((prev) => {
      const isAlreadyDone = prev.includes(index);
      if (isAlreadyDone) {
        return prev.filter((i) => i !== index);
      } else {
        setRest(90); // 90 second rest timer
        return [...prev, index];
      }
    });
  };

  // ── ACTIVE WORKOUT VIEW ──────────────────────────────────────────────────
  if (active) {
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
                style={styles.iconButton}
                onPress={() => setActive(false)}
                activeOpacity={0.7}
              >
                <Icon name="back" size={20} color="#DFE3DD" />
              </TouchableOpacity>
              <View style={styles.activeWorkoutCenter}>
                <Text style={styles.activeWorkoutKicker}>ACTIVE WORKOUT</Text>
                <Text style={styles.activeWorkoutTitle}>Chest & Triceps</Text>
              </View>
              <TouchableOpacity
                style={styles.finishBtn}
                onPress={() => setActive(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.finishBtnText}>Finish</Text>
              </TouchableOpacity>
            </View>

            {/* Time / Volume / Sets Stats Row */}
            <View style={styles.workoutTimeBar}>
              <View style={styles.workoutTimeItem}>
                <Text style={styles.workoutTimeLabel}>Duration</Text>
                <Text style={styles.workoutTimeValue}>24:18</Text>
              </View>
              <View style={styles.workoutTimeItem}>
                <Text style={styles.workoutTimeLabel}>Volume</Text>
                <Text style={styles.workoutTimeValue}>4,820 kg</Text>
              </View>
              <View style={[styles.workoutTimeItem, { borderRightWidth: 0 }]}>
                <Text style={styles.workoutTimeLabel}>Sets</Text>
                <Text style={styles.workoutTimeValue}>{done.length}/10</Text>
              </View>
            </View>

            {/* Active Exercise Card */}
            <View style={styles.activeExerciseCard}>
              <View style={styles.exerciseHeading}>
                <View style={styles.exerciseArt}>
                  <Text style={styles.exerciseArtText}>BP</Text>
                </View>
                <View style={styles.exerciseHeadingInfo}>
                  <Text style={styles.exerciseName}>Barbell Bench Press</Text>
                  <Text style={styles.exerciseMeta}>4 sets · 6–8 reps</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                  <Icon name="more" size={20} color={C.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Set Labels */}
              <View style={styles.setLabels}>
                <Text style={[styles.setLabelText, { width: 28 }]}>SET</Text>
                <Text style={[styles.setLabelText, { flex: 1.25 }]}>PREVIOUS</Text>
                <Text style={[styles.setLabelText, { flex: 0.7 }]}>KG</Text>
                <Text style={[styles.setLabelText, { flex: 0.7 }]}>REPS</Text>
                <Text style={{ width: 34 }} />
              </View>

              {/* Set Rows */}
              {[
                { set: '1', prev: '77.5 × 8', kg: '80', reps: '8' },
                { set: '2', prev: '77.5 × 7', kg: '80', reps: '7' },
                { set: '3', prev: '77.5 × 7', kg: '80', reps: '' },
                { set: '4', prev: '75 × 8', kg: '77.5', reps: '' },
              ].map((row, i) => {
                const isComplete = done.includes(i);
                return (
                  <View
                    key={row.set}
                    style={[styles.setRow, isComplete && styles.setRowCompleted]}
                  >
                    <Text style={styles.setNum}>{row.set}</Text>
                    <Text style={styles.setPrev}>{row.prev}</Text>
                    <TextInput
                      style={styles.setInput}
                      defaultValue={row.kg}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.setInput}
                      defaultValue={row.reps}
                      placeholder="—"
                      placeholderTextColor={C.textMuted}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={[styles.setCheckBtn, isComplete && styles.setCheckBtnDone]}
                      onPress={() => toggleSetComplete(i)}
                      activeOpacity={0.7}
                    >
                      <Icon
                        name="check"
                        size={16}
                        color={isComplete ? '#101210' : '#788078'}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}

              <TouchableOpacity style={styles.addSetBtn} activeOpacity={0.7}>
                <Icon name="plus" size={16} color="#ADB3AD" />
                <Text style={styles.addSetText}>Add set</Text>
              </TouchableOpacity>
            </View>

            {/* Next Exercise Preview */}
            <View style={styles.nextExerciseCard}>
              <Text style={styles.nextExerciseKicker}>NEXT EXERCISE</Text>
              <Text style={styles.nextExerciseName}>Incline Dumbbell Press</Text>
              <Text style={styles.nextExerciseMeta}>3 sets · 8–10 reps</Text>
            </View>
          </ScrollView>

          {/* Floating Rest Timer */}
          {rest > 0 ? (
            <View style={styles.floatingRestTimer}>
              <Ring value={((90 - rest) / 90) * 100} size={44} width={4}>
                <Icon name="clock" size={16} color={C.accent} />
              </Ring>
              <View style={styles.restTimerInfo}>
                <Text style={styles.restTimerKicker}>REST TIMER</Text>
                <Text style={styles.restTimerValue}>
                  {Math.floor(rest / 60)}:{String(rest % 60).padStart(2, '0')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.restTimerBtn}
                onPress={() => setRest((r) => r + 30)}
              >
                <Text style={styles.restTimerBtnText}>+30s</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.restTimerBtn}
                onPress={() => setRest(0)}
              >
                <Text style={[styles.restTimerBtnText, { color: C.accent }]}>Skip</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </SafeAreaView>
      </View>
    );
  }

  // ── STANDARD WORKOUT SCHEDULE VIEW ──────────────────────────────────────
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
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const isSelected = selectedDay === i;
              const isDone = i < 2;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.weekDayBtn,
                    isSelected && styles.weekDaySelected,
                    isDone && !isSelected && styles.weekDayDone,
                  ]}
                  onPress={() => setSelectedDay(i)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.weekDayName,
                      isSelected && styles.weekDayTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                  <Text
                    style={[
                      styles.weekDayNum,
                      isSelected && styles.weekDayTextActive,
                    ]}
                  >
                    {16 + i}
                  </Text>
                  {isDone && !isSelected ? (
                    <View style={styles.doneCheckDot}>
                      <Icon name="check" size={10} color={C.accent} />
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Today's Schedule Card */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleTop}>
              <View style={styles.scheduleTopLeft}>
                <View style={[styles.pill, styles.pillLime]}>
                  <Text style={styles.pillText}>TODAY</Text>
                </View>
                <Text style={styles.scheduleSub}>WEEK 3 · DAY 2</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Icon name="more" size={20} color={C.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.scheduleTitle}>Chest & Triceps</Text>
            <Text style={styles.scheduleMeta}>Strength · 6 exercises · 45 min</Text>

            {/* Exercise Stack */}
            <View style={styles.exerciseStack}>
              {EXERCISES_LIST.slice(0, 3).map((item, i) => (
                <View key={item.name} style={styles.stackRow}>
                  <View style={styles.exerciseArt}>
                    <Text style={styles.exerciseArtText}>{item.letter}</Text>
                  </View>
                  <View style={styles.stackInfo}>
                    <Text style={styles.stackName}>{item.name}</Text>
                    <Text style={styles.stackMeta}>{item.meta}</Text>
                  </View>
                  {i === 2 ? (
                    <View style={styles.moreCountBadge}>
                      <Text style={styles.moreCountText}>+3</Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.startWorkoutFullBtn}
              onPress={() => setActive(true)}
              activeOpacity={0.85}
            >
              <Icon name="play" size={17} color="#11150E" />
              <Text style={styles.startWorkoutFullText}>Start workout</Text>
            </TouchableOpacity>
          </View>

          {/* This Week Summary */}
          <SectionTitle title="This week" />
          <View style={styles.weekSummaryCard}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryNumber}>2</Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryNumber}>1h 34m</Text>
              <Text style={styles.summaryLabel}>Training time</Text>
            </View>
            <View style={[styles.summaryCol, { borderRightWidth: 0 }]}>
              <Text style={styles.summaryNumber}>12.4k</Text>
              <Text style={styles.summaryLabel}>Volume</Text>
            </View>
          </View>

          {/* Exercise Library Search */}
          <SectionTitle title="Exercise library" action="See all" />
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color="#777F78" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises"
              placeholderTextColor="#777F78"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity activeOpacity={0.7} accessibilityLabel="Filter">
              <Icon name="settings" size={18} color="#777F78" />
            </TouchableOpacity>
          </View>

          {/* Category Chips */}
          <View style={styles.chipsRow}>
            {['All', 'Chest', 'Back', 'Legs', 'Arms'].map((cat) => {
              const isCatActive = filterCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, isCatActive && styles.chipActive]}
                  onPress={() => setFilterCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isCatActive && styles.chipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
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
    paddingBottom: 130,
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
  scheduleCard: {
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: 25,
    padding: 19,
  },
  scheduleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  pillLime: {
    backgroundColor: C.accent,
  },
  pillText: {
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1,
    color: '#11150E',
  },
  scheduleSub: {
    fontSize: 9,
    color: '#7F867F',
    letterSpacing: 0.5,
  },
  scheduleTitle: {
    fontSize: 23,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginTop: 16,
    marginBottom: 3,
  },
  scheduleMeta: {
    fontSize: 11,
    color: '#8F9690',
  },
  exerciseStack: {
    marginTop: 17,
  },
  stackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.075)',
  },
  exerciseArt: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#292E29',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseArtText: {
    color: '#ADB5AD',
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
  stackInfo: {
    flex: 1,
  },
  stackName: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  stackMeta: {
    fontSize: 9,
    color: '#7E857F',
    marginTop: 1,
  },
  moreCountBadge: {
    backgroundColor: '#262A27',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },
  moreCountText: {
    fontSize: 10,
    color: '#ADB5AD',
    fontWeight: FontWeight.bold,
  },
  startWorkoutFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 18,
  },
  startWorkoutFullText: {
    color: '#11150E',
    fontSize: 13,
    fontWeight: FontWeight.extrabold,
  },
  weekSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: 21,
    paddingVertical: 17,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.075)',
  },
  summaryNumber: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#828983',
    marginTop: 2,
  },
  searchBox: {
    height: 47,
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: C.text,
    fontSize: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 11,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: '#191C1A',
    borderRadius: 16,
  },
  chipActive: {
    backgroundColor: '#DCEFC0',
  },
  chipText: {
    fontSize: 10,
    color: '#898F89',
    fontWeight: FontWeight.medium,
  },
  chipTextActive: {
    color: '#17200C',
    fontWeight: FontWeight.bold,
  },

  // Active workout styles
  activeWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1D1B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeWorkoutCenter: {
    alignItems: 'center',
  },
  activeWorkoutKicker: {
    color: C.accent,
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.2,
  },
  activeWorkoutTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: FontWeight.bold,
    marginTop: 2,
  },
  finishBtn: {
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  finishBtnText: {
    color: '#101210',
    fontSize: 11,
    fontWeight: FontWeight.extrabold,
  },
  workoutTimeBar: {
    flexDirection: 'row',
    backgroundColor: '#181B19',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: 16,
  },
  workoutTimeItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.075)',
  },
  workoutTimeLabel: {
    color: '#787F79',
    fontSize: 9,
  },
  workoutTimeValue: {
    color: C.text,
    fontSize: 14,
    fontWeight: FontWeight.bold,
    marginTop: 2,
  },
  activeExerciseCard: {
    backgroundColor: '#181B19',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: 22,
    padding: 15,
  },
  exerciseHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseHeadingInfo: {
    flex: 1,
  },
  exerciseName: {
    color: C.text,
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
  exerciseMeta: {
    color: '#7F867F',
    fontSize: 10,
    marginTop: 1,
  },
  setLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 18,
    marginBottom: 7,
  },
  setLabelText: {
    fontSize: 8,
    color: '#6F766F',
    textAlign: 'center',
    fontWeight: FontWeight.bold,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 6,
    borderRadius: 8,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(184, 243, 74, 0.035)',
  },
  setNum: {
    width: 28,
    color: C.text,
    fontSize: 11,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  setPrev: {
    flex: 1.25,
    color: '#828983',
    fontSize: 10,
    textAlign: 'center',
  },
  setInput: {
    flex: 0.7,
    backgroundColor: '#242824',
    borderRadius: 9,
    textAlign: 'center',
    paddingVertical: 7,
    color: C.text,
    fontSize: 12,
  },
  setCheckBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#272C28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setCheckBtnDone: {
    backgroundColor: C.accent,
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#222622',
    borderRadius: 11,
    paddingVertical: 10,
    marginTop: 10,
  },
  addSetText: {
    color: '#ADB3AD',
    fontSize: 11,
    fontWeight: FontWeight.semibold,
  },
  nextExerciseCard: {
    marginTop: 13,
    backgroundColor: '#181B19',
    borderRadius: 18,
    padding: 15,
  },
  nextExerciseKicker: {
    color: C.accent,
    fontSize: 8,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  nextExerciseName: {
    color: C.text,
    fontSize: 13,
    fontWeight: FontWeight.bold,
    marginTop: 4,
  },
  nextExerciseMeta: {
    color: '#777E78',
    fontSize: 9,
    marginTop: 1,
  },
  floatingRestTimer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#242824',
    borderWidth: 1,
    borderColor: '#394036',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  restTimerInfo: {
    flex: 1,
  },
  restTimerKicker: {
    color: '#858C86',
    fontSize: 8,
    fontWeight: FontWeight.bold,
  },
  restTimerValue: {
    color: C.text,
    fontSize: 15,
    fontWeight: FontWeight.bold,
  },
  restTimerBtn: {
    backgroundColor: '#303530',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  restTimerBtnText: {
    color: '#DFE3DD',
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
});
