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
import { Header } from '@/components/ui/header';
import { SectionTitle } from '@/components/ui/section-title';
import { useAuthStore } from '@/stores/auth.store';

const C = Colors.dark;

const MEALS_DATA = [
  { name: 'Breakfast', cal: '420 kcal', desc: 'Oats, banana & whey', letter: 'B', color: '#B8F34A' },
  { name: 'Lunch', cal: '680 kcal', desc: 'Chicken rice bowl', letter: 'L', color: '#74D7FF' },
  { name: 'Snack', cal: '210 kcal', desc: 'Greek yogurt & berries', letter: 'S', color: '#E6A6FF' },
  { name: 'Dinner', cal: '230 kcal', desc: '2 items logged', letter: 'D', color: '#FFB45C' },
];

export default function NutritionScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);

  const [waterGlasses, setWaterGlasses] = useState(5);

  const calorieTarget = profile?.daily_calorie_target || 2300;
  const foodCalories = 1540;
  const exerciseCalories = 0;
  const remainingCalories = Math.max(0, calorieTarget - foodCalories + exerciseCalories);
  const remainingProgress = Math.round((foodCalories / calorieTarget) * 100);

  const proteinTarget = profile?.daily_protein_target_g || 170;
  const carbsTarget = Math.round((calorieTarget * 0.45) / 4);
  const fatsTarget = Math.round((calorieTarget * 0.25) / 9);

  const todayDate = new Date()
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();

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
            subtitle={todayDate}
            title="Nutrition"
            onCoach={() => router.push('/(tabs)/coach/index' as any)}
          />

          {/* Date Switch */}
          <View style={styles.dateSwitch}>
            <TouchableOpacity style={styles.dateArrow} activeOpacity={0.7}>
              <Icon name="back" size={16} color="#767E77" />
            </TouchableOpacity>
            <Text style={styles.dateLabel}>Today</Text>
            <TouchableOpacity style={styles.dateArrow} activeOpacity={0.7}>
              <Icon name="chevron" size={16} color="#767E77" />
            </TouchableOpacity>
          </View>

          {/* Hero Nutrition Calorie Card */}
          <View style={[styles.card, styles.nutritionHero]}>
            <Ring value={remainingProgress} size={142} width={11}>
              <Text style={styles.remainingKicker}>Remaining</Text>
              <Text style={styles.remainingValue}>{remainingCalories}</Text>
              <Text style={styles.remainingUnit}>kcal</Text>
            </Ring>

            {/* Calorie Equation */}
            <View style={styles.calEquation}>
              <View style={styles.equationCol}>
                <Text style={styles.equationNum}>{calorieTarget.toLocaleString()}</Text>
                <Text style={styles.equationLabel}>Goal</Text>
              </View>
              <Text style={styles.equationOperator}>−</Text>
              <View style={styles.equationCol}>
                <Text style={styles.equationNum}>{foodCalories.toLocaleString()}</Text>
                <Text style={styles.equationLabel}>Food</Text>
              </View>
              <Text style={styles.equationOperator}>+</Text>
              <View style={styles.equationCol}>
                <Text style={styles.equationNum}>{exerciseCalories}</Text>
                <Text style={styles.equationLabel}>Exercise</Text>
              </View>
            </View>

            {/* Macro Circles */}
            <View style={styles.macroCirclesRow}>
              <View style={styles.macroCircleItem}>
                <Ring value={69} size={46} width={4} color={C.accent} />
                <Text style={styles.macroCircleValue}>118g</Text>
                <Text style={styles.macroCircleLabel}>Protein</Text>
              </View>

              <View style={styles.macroCircleItem}>
                <Ring value={59} size={46} width={4} color={C.purple} />
                <Text style={styles.macroCircleValue}>142g</Text>
                <Text style={styles.macroCircleLabel}>Carbs</Text>
              </View>

              <View style={styles.macroCircleItem}>
                <Ring value={64} size={46} width={4} color={C.orange} />
                <Text style={styles.macroCircleValue}>48g</Text>
                <Text style={styles.macroCircleLabel}>Fats</Text>
              </View>
            </View>
          </View>

          {/* Meals Section */}
          <SectionTitle title="Meals" />
          <View style={styles.mealList}>
            {MEALS_DATA.map((meal) => (
              <View key={meal.name} style={[styles.card, styles.mealCard]}>
                <View style={[styles.mealAvatar, { backgroundColor: `${meal.color}20` }]}>
                  <Text style={[styles.mealAvatarText, { color: meal.color }]}>
                    {meal.letter}
                  </Text>
                </View>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealDesc}>{meal.desc}</Text>
                </View>
                <View style={styles.mealRight}>
                  <Text style={styles.mealCal}>{meal.cal}</Text>
                  <TouchableOpacity style={styles.mealAddBtn} activeOpacity={0.7}>
                    <Icon name="plus" size={17} color={C.text} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Water Intake Card */}
          <View style={[styles.card, styles.waterCard]}>
            <View style={styles.waterTop}>
              <View style={[styles.statIcon, styles.blueStatIcon]}>
                <Icon name="drop" size={18} color={C.blue} />
              </View>
              <View style={styles.waterInfo}>
                <Text style={styles.waterTitle}>Water</Text>
                <Text style={styles.waterSub}>
                  {waterGlasses * 250} ml of 2,500 ml
                </Text>
              </View>
              <Text style={styles.waterCount}>{waterGlasses}/10</Text>
            </View>

            <View style={styles.waterGlassesTrack}>
              {Array.from({ length: 10 }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.waterGlassPill,
                    i < waterGlasses && styles.waterGlassFilled,
                  ]}
                  onPress={() => setWaterGlasses(i + 1)}
                  activeOpacity={0.7}
                />
              ))}
            </View>
          </View>

          {/* Floating Log Food CTA */}
          <TouchableOpacity style={styles.floatingAddBtn} activeOpacity={0.85}>
            <Icon name="plus" size={18} color="#11150E" />
            <Text style={styles.floatingAddText}>Log food</Text>
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
  dateSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: -7,
    marginBottom: 15,
  },
  dateArrow: {
    padding: 4,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
    borderRadius: 21,
  },
  nutritionHero: {
    padding: 19,
    alignItems: 'center',
  },
  remainingKicker: {
    fontSize: 9,
    color: C.textSecondary,
    marginBottom: 2,
  },
  remainingValue: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  remainingUnit: {
    fontSize: 10,
    color: C.textSecondary,
  },
  calEquation: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: C.surfaceBorder,
  },
  equationCol: {
    alignItems: 'center',
  },
  equationNum: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  equationLabel: {
    fontSize: 9,
    color: '#747B75',
    marginTop: 2,
  },
  equationOperator: {
    color: '#4C524D',
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
  macroCirclesRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#141715',
    borderRadius: 16,
    paddingVertical: 14,
  },
  macroCircleItem: {
    alignItems: 'center',
    gap: 4,
  },
  macroCircleValue: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginTop: 4,
  },
  macroCircleLabel: {
    fontSize: 9,
    color: C.textSecondary,
  },
  mealList: {
    gap: 10,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  mealAvatar: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealAvatarText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  mealDesc: {
    fontSize: 10,
    color: C.textSecondary,
    marginTop: 2,
  },
  mealRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mealCal: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: C.text,
  },
  mealAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#242824',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterCard: {
    padding: 16,
    marginTop: 14,
  },
  waterTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueStatIcon: {
    backgroundColor: C.blueBg,
  },
  waterInfo: {
    flex: 1,
  },
  waterTitle: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  waterSub: {
    fontSize: 10,
    color: C.textSecondary,
    marginTop: 1,
  },
  waterCount: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  waterGlassesTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  waterGlassPill: {
    flex: 1,
    height: 28,
    backgroundColor: '#242824',
    borderRadius: 7,
  },
  waterGlassFilled: {
    backgroundColor: C.blue,
  },
  floatingAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 20,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  floatingAddText: {
    color: '#11150E',
    fontSize: 13,
    fontWeight: FontWeight.extrabold,
  },
});
