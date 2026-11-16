import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Ring } from '@/components/ui/ring';
import { LineChart } from '@/components/ui/line-chart';
import { Header } from '@/components/ui/header';
import { SectionTitle } from '@/components/ui/section-title';
import { useAuthStore } from '@/stores/auth.store';

const C = Colors.dark;

const PERIODS = ['1M', '3M', '6M', '1Y'];

const STRENGTH_DATA = [
  { name: 'Bench press', weight: '82.5 kg', gain: '+7.5 kg' },
  { name: 'Back squat', weight: '110 kg', gain: '+10 kg' },
  { name: 'Deadlift', weight: '140 kg', gain: '+12.5 kg' },
];

export default function ProgressScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);

  const [period, setPeriod] = useState('3M');

  const currentWeight = profile?.weight_kg || 78.4;
  const goalWeight = profile?.primary_goal === 'fat_loss' ? currentWeight - 5 : currentWeight + 3;

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
            subtitle="KEEP MOVING FORWARD"
            title="Progress"
            onCoach={() => router.push('/(tabs)/coach/index' as any)}
          />

          {/* Segmented Period Tabs */}
          <View style={styles.segmentedContainer}>
            {PERIODS.map((p) => {
              const active = period === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                  onPress={() => setPeriod(p)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Weight Chart Card */}
          <View style={[styles.card, styles.weightCard]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartKicker}>CURRENT WEIGHT</Text>
                <Text style={styles.chartWeightNum}>
                  {currentWeight} <Text style={styles.chartUnit}>kg</Text>
                </Text>
              </View>
              <View style={styles.trendBadge}>
                <Text style={styles.trendText}>−3.8 kg</Text>
              </View>
            </View>

            {/* SVG Line Chart */}
            <View style={styles.chartWrapper}>
              <LineChart height={150} />
            </View>

            {/* Month Labels */}
            <View style={styles.monthLabels}>
              <Text style={styles.monthLabelText}>MAR</Text>
              <Text style={styles.monthLabelText}>APR</Text>
              <Text style={styles.monthLabelText}>MAY</Text>
              <Text style={styles.monthLabelText}>JUN</Text>
            </View>

            {/* Goal Weight Line */}
            <View style={styles.goalLine}>
              <Icon name="target" size={16} color={C.accent} />
              <Text style={styles.goalLabel}>Goal weight</Text>
              <Text style={styles.goalValue}>{goalWeight.toFixed(1)} kg</Text>
            </View>
          </View>

          {/* Body Fat & Muscle Mass Grid */}
          <View style={styles.statGrid}>
            <View style={[styles.card, styles.statCard]}>
              <View style={[styles.statIcon, styles.purpleStatIcon]}>
                <Icon name="ruler" size={18} color={C.purple} />
              </View>
              <Text style={styles.statCardLabel}>Body fat</Text>
              <Text style={styles.statCardValue}>18.2%</Text>
              <Text style={styles.statCardDelta}>−1.4%</Text>
            </View>

            <View style={[styles.card, styles.statCard]}>
              <View style={[styles.statIcon, styles.orangeStatIcon]}>
                <Icon name="zap" size={18} color={C.orange} />
              </View>
              <Text style={styles.statCardLabel}>Muscle mass</Text>
              <Text style={styles.statCardValue}>34.8 kg</Text>
              <Text style={[styles.statCardDelta, { color: C.accent }]}>+0.6 kg</Text>
            </View>
          </View>

          {/* Strength Progress Section */}
          <SectionTitle title="Strength progress" action="See all" />
          <View style={[styles.card, styles.strengthCard]}>
            {STRENGTH_DATA.map((lift, i) => (
              <View
                key={lift.name}
                style={[
                  styles.strengthRow,
                  i !== 0 && styles.strengthRowBorder,
                ]}
              >
                <View style={styles.liftIconWrapper}>
                  <Icon name="workouts" size={18} color={C.textSecondary} />
                </View>
                <View style={styles.liftInfo}>
                  <Text style={styles.liftName}>{lift.name}</Text>
                  <Text style={styles.liftMeta}>Estimated 1 rep max</Text>
                </View>
                <View style={styles.liftNumbers}>
                  <Text style={styles.liftWeight}>{lift.weight}</Text>
                  <Text style={styles.liftGain}>{lift.gain}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Consistency Section */}
          <SectionTitle title="Consistency" />
          <View style={[styles.card, styles.consistencyCard]}>
            <View style={styles.consistencyTop}>
              <Ring value={86} size={82} width={7} color={C.accent}>
                <Text style={styles.consistencyPercentage}>86%</Text>
              </Ring>
              <View style={styles.consistencyInfo}>
                <Text style={styles.consistencyWorkouts}>12 workouts</Text>
                <Text style={styles.consistencyPlanned}>of 14 planned</Text>
              </View>
            </View>

            <View style={styles.dayDots}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const isHit = i !== 3; // Wednesday rest day
                return (
                  <View key={i} style={styles.dayDotCol}>
                    <View style={[styles.dayDotCircle, isHit && styles.dayDotHit]}>
                      {isHit ? <Icon name="check" size={11} color="#101210" /> : null}
                    </View>
                    <Text style={styles.dayDotText}>{day}</Text>
                  </View>
                );
              })}
            </View>
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
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#191C1A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
    padding: 3,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 11,
  },
  segmentBtnActive: {
    backgroundColor: '#262B28',
  },
  segmentText: {
    color: '#777E78',
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
  segmentTextActive: {
    color: C.text,
  },
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
    borderRadius: 21,
  },
  weightCard: {
    padding: 18,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  chartKicker: {
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: FontWeight.bold,
    color: C.textSecondary,
  },
  chartWeightNum: {
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginTop: 2,
  },
  chartUnit: {
    fontSize: 14,
    fontWeight: FontWeight.regular,
    color: C.textSecondary,
  },
  trendBadge: {
    backgroundColor: 'rgba(184, 243, 74, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  trendText: {
    color: C.accent,
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
  chartWrapper: {
    marginVertical: 4,
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  monthLabelText: {
    fontSize: 9,
    color: '#6F766F',
    fontWeight: FontWeight.semibold,
  },
  goalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: C.surfaceBorder,
  },
  goalLabel: {
    flex: 1,
    fontSize: 11,
    color: C.textSecondary,
  },
  goalValue: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    padding: 15,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  purpleStatIcon: {
    backgroundColor: C.purpleBg,
  },
  orangeStatIcon: {
    backgroundColor: C.orangeBg,
  },
  statCardLabel: {
    fontSize: 10,
    color: C.textSecondary,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginVertical: 2,
  },
  statCardDelta: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#74D7FF',
  },
  strengthCard: {
    paddingHorizontal: 16,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  strengthRowBorder: {
    borderTopWidth: 1,
    borderTopColor: C.surfaceBorder,
  },
  liftIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#242824',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftInfo: {
    flex: 1,
  },
  liftName: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  liftMeta: {
    fontSize: 9,
    color: C.textSecondary,
    marginTop: 1,
  },
  liftNumbers: {
    alignItems: 'flex-end',
  },
  liftWeight: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  liftGain: {
    fontSize: 10,
    color: C.accent,
    fontWeight: FontWeight.bold,
  },
  consistencyCard: {
    padding: 18,
    gap: 16,
  },
  consistencyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  consistencyPercentage: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  consistencyInfo: {
    flex: 1,
  },
  consistencyWorkouts: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  consistencyPlanned: {
    fontSize: 10,
    color: C.textSecondary,
    marginTop: 2,
  },
  dayDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.surfaceBorder,
  },
  dayDotCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayDotCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#252A26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotHit: {
    backgroundColor: C.accent,
  },
  dayDotText: {
    fontSize: 9,
    color: '#777E78',
    fontWeight: FontWeight.medium,
  },
});
