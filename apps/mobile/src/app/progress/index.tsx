import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

const C = Colors.dark;

export default function ProgressScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Coming in Phase 6</Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>What's coming</Text>
            {FEATURES.map((f) => (
              <View key={f} style={styles.row}>
                <Text style={styles.bullet}>→</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const FEATURES = [
  'Weight tracking & trends',
  'Body measurements',
  'Progress photographs',
  'Workout performance analytics',
  'Weekly & monthly reports',
  'Goal completion tracking',
  'AI-generated progress summaries',
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
  sectionTitle: { fontSize: FontSize.md, color: C.text, fontWeight: FontWeight.semibold },
  row: { flexDirection: 'row', gap: Spacing.sm },
  bullet: { color: C.accent, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  featureText: { color: C.textSecondary, fontSize: FontSize.sm, flex: 1 },
});
