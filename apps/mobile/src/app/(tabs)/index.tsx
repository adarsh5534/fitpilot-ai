import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Ring } from '@/components/ui/ring';
import { MacroBar } from '@/components/ui/macro-bar';
import { SectionTitle } from '@/components/ui/section-title';
import { Header } from '@/components/ui/header';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth.store';

const C = Colors.dark;

const HERO_IMG =
  'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?auto=format&fit=crop&w=900&q=85';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const [waterLiters, setWaterLiters] = useState(1.8);
  const [streakDays] = useState(12);

  // Formatted date string (e.g. "WEDNESDAY, JUNE 18")
  const todayDate = new Date()
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();

  const userName =
    profile?.display_name || user?.email?.split('@')[0] || 'Alex';

  // Deterministic nutrition targets from profile
  const calorieTarget = profile?.daily_calorie_target || 2300;
  const proteinTarget = profile?.daily_protein_target_g || 170;
  const currentCalories = 1540;
  const calorieProgress = Math.round((currentCalories / calorieTarget) * 100);

  const carbsTarget = Math.round((calorieTarget * 0.45) / 4);
  const fatsTarget = Math.round((calorieTarget * 0.25) / 9);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header */}
          <Header
            subtitle={todayDate}
            title={`Good morning, ${userName}`}
            onCoach={() => router.push('/(tabs)/coach/index' as any)}
          />

          {/* Hero Workout Banner */}
          <View style={styles.heroWorkout}>
            <Image
              source={{ uri: HERO_IMG }}
              style={styles.heroImage}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={[
                'rgba(8, 10, 9, 0.08)',
                'rgba(8, 10, 9, 0.25)',
                'rgba(8, 10, 9, 0.97)',
              ]}
              locations={[0, 0.25, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroTop}>
              <View style={[styles.pill, styles.pillLime]}>
                <Text style={styles.pillText}>TODAY</Text>
              </View>
              <View style={styles.streakBadge}>
                <Icon name="fire" size={15} color="#FFB45C" />
                <Text style={styles.streakText}>{streakDays} day streak</Text>
              </View>
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>PUSH • STRENGTH</Text>
              <Text style={styles.heroTitle}>Chest & Triceps</Text>
              <Text style={styles.heroMeta}>6 exercises · 45 min</Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push('/(tabs)/workout/index' as any)}
                activeOpacity={0.85}
              >
                <Icon name="play" size={17} color="#11150E" />
                <Text style={styles.primaryButtonText}>Start workout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Progress Section */}
          <SectionTitle
            title="Today's progress"
            action="Details"
            onAction={() => router.push('/(tabs)/progress/index' as any)}
          />

          <View style={[styles.card, styles.calorieCard]}>
            <Ring value={calorieProgress} size={116} width={10}>
              <Text style={styles.ringValue}>
                {currentCalories.toLocaleString()}
              </Text>
              <Text style={styles.ringSubtitle}>
                of {calorieTarget.toLocaleString()} kcal
              </Text>
            </Ring>

            <View style={styles.macroList}>
              <MacroBar
                label="Protein"
                value={118}
                total={proteinTarget}
                color={C.accent}
              />
              <MacroBar
                label="Carbs"
                value={142}
                total={carbsTarget}
                color={C.purple}
              />
              <MacroBar
                label="Fats"
                value={48}
                total={fatsTarget}
                color={C.orange}
              />
            </View>
          </View>

          {/* Stat Grid: Steps & Water */}
          <View style={styles.statGrid}>
            <View style={[styles.card, styles.miniStat]}>
              <View style={[styles.statIcon, styles.purpleStatIcon]}>
                <Icon name="steps" size={18} color={C.purple} />
              </View>
              <Text style={styles.statLabel}>Steps</Text>
              <Text style={styles.statValue}>7,842</Text>
              <Text style={styles.statSub}>of 10,000</Text>
              <View style={styles.statBar}>
                <View style={[styles.statBarFill, { width: '78%', backgroundColor: C.purple }]} />
              </View>
            </View>

            <View style={[styles.card, styles.miniStat]}>
              <View style={[styles.statIcon, styles.blueStatIcon]}>
                <Icon name="drop" size={18} color={C.blue} />
              </View>
              <Text style={styles.statLabel}>Water</Text>
              <Text style={styles.statValue}>
                {waterLiters.toFixed(1)} <Text style={styles.unitText}>L</Text>
              </Text>
              <Text style={styles.statSub}>of 2.5 L</Text>
              <TouchableOpacity
                style={styles.roundPlus}
                onPress={() => setWaterLiters((w) => Math.min(4.0, +(w + 0.25).toFixed(2)))}
                activeOpacity={0.7}
                accessibilityLabel="Add water"
              >
                <Icon name="plus" size={16} color={C.blue} />
              </TouchableOpacity>
            </View>
          </View>

          {/* FitPilot AI Coach Insight */}
          <SectionTitle title="FitPilot insight" />
          <TouchableOpacity
            style={styles.coachCard}
            onPress={() => router.push('/(tabs)/coach/index' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.aiMark}>
              <Icon name="spark" size={20} color="#101210" />
            </View>
            <View style={styles.coachContent}>
              <Text style={styles.coachHeading}>
                You're primed for a strong session
              </Text>
              <Text style={styles.coachBody}>
                Your recovery and protein adherence are up. Consider adding 2.5 kg to your bench press today.
              </Text>
              <View style={styles.coachLinkRow}>
                <Text style={styles.coachLinkText}>Ask FitPilot</Text>
                <Icon name="chevron" size={14} color={C.accent} />
              </View>
            </View>
          </TouchableOpacity>
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
  heroWorkout: {
    height: 328,
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 8,
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
  },
  heroTop: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
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
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(12, 14, 13, 0.7)',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 15,
  },
  streakText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: '#E5E8E4',
  },
  heroCopy: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
  },
  heroEyebrow: {
    fontSize: 10,
    letterSpacing: 1.45,
    fontWeight: FontWeight.bold,
    color: C.textSecondary,
  },
  heroTitle: {
    fontSize: 27,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.7,
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 2,
  },
  heroMeta: {
    color: '#B9BDB9',
    fontSize: 13,
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#11150E',
    fontWeight: FontWeight.extrabold,
    fontSize: 13,
  },
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
    borderRadius: 21,
  },
  calorieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 21,
    gap: 22,
  },
  ringValue: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  ringSubtitle: {
    fontSize: 9,
    color: C.textSecondary,
    marginTop: 2,
  },
  macroList: {
    flex: 1,
    gap: 14,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 12,
  },
  miniStat: {
    flex: 1,
    padding: 15,
    position: 'relative',
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  purpleStatIcon: {
    backgroundColor: C.purpleBg,
  },
  blueStatIcon: {
    backgroundColor: C.blueBg,
  },
  statLabel: {
    color: C.textSecondary,
    fontSize: 11,
    fontWeight: FontWeight.medium,
  },
  statValue: {
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginVertical: 2,
  },
  unitText: {
    fontSize: 12,
    fontWeight: FontWeight.regular,
    color: C.textSecondary,
  },
  statSub: {
    color: '#737A74',
    fontSize: 10,
  },
  statBar: {
    height: 4,
    backgroundColor: '#292D2A',
    borderRadius: Radius.full,
    marginTop: 10,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  roundPlus: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.bluePill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachCard: {
    backgroundColor: '#1A1E19',
    borderWidth: 1,
    borderColor: 'rgba(184, 243, 74, 0.18)',
    borderRadius: 21,
    padding: 17,
    flexDirection: 'row',
    gap: 13,
  },
  aiMark: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 3,
  },
  coachContent: {
    flex: 1,
  },
  coachHeading: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  coachBody: {
    color: '#9CA29C',
    fontSize: 11,
    lineHeight: 16,
    marginVertical: 6,
  },
  coachLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  coachLinkText: {
    color: C.accent,
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
});
