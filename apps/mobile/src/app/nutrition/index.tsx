import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

const C = Colors.dark;

// ─── Nutrition Tab — Phase 1 Placeholder ─────────────────────────────────────
// Full nutrition tracking (food search, meal logging, macros, water tracking)
// will be implemented in Phase 4, with AI features in Phase 5.

export default function NutritionScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Nutrition</Text>
          <Text style={styles.subtitle}>Coming in Phase 4</Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>What's coming</Text>
            {FEATURES.map((f) => (
              <View key={f} style={styles.row}>
                <Text style={styles.bullet}>→</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.card, styles.highlightCard]}>
            <Text style={styles.sectionTitle}>Kerala & Indian Food Support</Text>
            <Text style={styles.featureText}>
              Includes local foods like Dosa, Idli, Kerala Parotta, Fish Curry,
              Puttu, Kadala Curry, and more in the food database.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const FEATURES = [
  'Food search (Indian + Kerala foods)',
  'Manual food logging',
  'Breakfast, lunch, dinner & snacks',
  'Calories, protein, carbs, fat',
  'Water intake tracking',
  'Daily nutrition dashboard',
  'Meal history',
];

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  safe: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 100 },
  title: { fontSize: FontSize['2xl'], color: C.text, fontWeight: FontWeight.extrabold },
  subtitle: { fontSize: FontSize.base, color: C.textSecondary },
  card: {
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
  },
  highlightCard: { borderColor: C.accentMuted, backgroundColor: C.accentMuted },
  sectionTitle: { fontSize: FontSize.md, color: C.text, fontWeight: FontWeight.semibold },
  row: { flexDirection: 'row', gap: Spacing.sm },
  bullet: { color: C.accent, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  featureText: { color: C.textSecondary, fontSize: FontSize.sm, flex: 1 },
});
