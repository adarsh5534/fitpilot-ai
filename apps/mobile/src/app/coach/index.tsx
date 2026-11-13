import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

const C = Colors.dark;

export default function CoachScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.aiChip}>
              <Text style={styles.aiChipText}>AI Powered</Text>
            </View>
            <Text style={styles.title}>AI Coach</Text>
            <Text style={styles.subtitle}>Coming in Phase 5</Text>
          </View>

          {/* AI Flow Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>How the AI Coach works</Text>
            <Text style={styles.description}>
              The AI never invents data. Every recommendation is based on your
              actual workout history and nutrition records stored in the database.
            </Text>
            {FLOW_STEPS.map((step, i) => (
              <View key={step} style={styles.row}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.featureText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Sample Questions */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Example questions you can ask</Text>
            {SAMPLE_QUESTIONS.map((q) => (
              <View key={q} style={styles.questionBubble}>
                <Text style={styles.questionText}>"{q}"</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const FLOW_STEPS = [
  'You ask a question or request a recommendation',
  'Backend retrieves your relevant history from the database',
  'AI receives real data as context — no assumptions',
  'AI generates a structured, validated response',
  'Response is saved and shown to you with reasoning',
];

const SAMPLE_QUESTIONS = [
  'What exercise should I do next?',
  'How much protein have I consumed today?',
  'What was my bench press weight last week?',
  'Am I improving over time?',
  'What should I eat for dinner to hit my protein goal?',
  'Should I take a rest day today?',
];

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  safe: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 100 },
  header: { gap: Spacing.xs, paddingVertical: Spacing.md },
  aiChip: {
    alignSelf: 'flex-start',
    backgroundColor: C.accentMuted,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  aiChipText: { fontSize: FontSize.xs, color: C.accent, fontWeight: FontWeight.semibold },
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
  description: { fontSize: FontSize.sm, color: C.textSecondary, lineHeight: 20 },
  row: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontSize: FontSize.xs, color: C.accent, fontWeight: FontWeight.bold },
  featureText: { color: C.textSecondary, fontSize: FontSize.sm, flex: 1 },
  questionBubble: {
    backgroundColor: C.surfaceElevated,
    borderRadius: 8,
    padding: Spacing.sm,
  },
  questionText: { fontSize: FontSize.sm, color: C.text, fontStyle: 'italic' },
});
