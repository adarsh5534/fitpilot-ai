import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '@/lib/api-client';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

const C = Colors.dark;

type HealthData = {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  version: string;
  services: { database: 'connected' | 'disconnected' | 'unknown' };
};

type ConnectionState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'success'; data: HealthData }
  | { phase: 'error'; message: string };

// ─── Home Screen ──────────────────────────────────────────────────────────────
// Phase 1: Shows a connectivity test to the backend API.
// This verifies that mobile → API → Supabase chain is working.
// Will be replaced with the real dashboard in Phase 2.

export default function HomeScreen() {
  const [connection, setConnection] = useState<ConnectionState>({
    phase: 'idle',
  });

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    setConnection({ phase: 'loading' });
    const result = await apiClient.get<HealthData>('/health');
    if (result.success) {
      setConnection({ phase: 'success', data: result.data });
    } else {
      setConnection({ phase: 'error', message: result.error.message });
    }
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.appName}>FitPilot AI</Text>
            <Text style={styles.subtitle}>Your AI-powered fitness coach</Text>
          </View>

          {/* API Connection Status Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Backend Connection</Text>
            <Text style={styles.cardDescription}>
              Phase 1 connectivity test
            </Text>

            {connection.phase === 'loading' && (
              <View style={styles.statusRow}>
                <ActivityIndicator color={C.accent} size="small" />
                <Text style={styles.statusText}>Connecting to API…</Text>
              </View>
            )}

            {connection.phase === 'success' && (
              <View>
                <StatusRow
                  label="API"
                  status="connected"
                  value={`v${connection.data.version}`}
                />
                <StatusRow
                  label="Database"
                  status={
                    connection.data.services.database === 'connected'
                      ? 'connected'
                      : 'error'
                  }
                  value={connection.data.services.database}
                />
                <StatusRow
                  label="Status"
                  status={connection.data.status === 'ok' ? 'connected' : 'warning'}
                  value={connection.data.status}
                />
                <Text style={styles.timestamp}>
                  {new Date(connection.data.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            )}

            {connection.phase === 'error' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTitle}>⚠️ Connection Failed</Text>
                <Text style={styles.errorMessage}>{connection.message}</Text>
                <Text style={styles.errorHint}>
                  Make sure the API is running:{'\n'}
                  cd apps/api && npm run dev
                </Text>
              </View>
            )}

            {connection.phase === 'idle' && null}
          </View>

          {/* Phase Overview Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Phase 1 Complete ✅</Text>
            <Text style={styles.cardDescription}>Foundation established</Text>
            {PHASE_ITEMS.map((item) => (
              <View key={item} style={styles.phaseItem}>
                <Text style={styles.phaseCheck}>✓</Text>
                <Text style={styles.phaseText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Coming Next */}
          <View style={[styles.card, styles.comingCard]}>
            <Text style={styles.cardTitle}>Coming in Phase 2</Text>
            <Text style={styles.phaseText}>Authentication & User Profile</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StatusRow({
  label,
  status,
  value,
}: {
  label: string;
  status: 'connected' | 'error' | 'warning';
  value: string;
}) {
  const dot =
    status === 'connected' ? C.accent : status === 'warning' ? C.warning : C.danger;
  return (
    <View style={styles.statusRow}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  );
}

const PHASE_ITEMS = [
  'npm workspace monorepo',
  'Express API with TypeScript',
  'Supabase PostgreSQL schema',
  'Row Level Security policies',
  'Exercise library seed data',
  'Expo mobile app + 5-tab nav',
  'API connectivity verified',
];

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
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: 100,
  },
  header: {
    paddingVertical: Spacing.lg,
  },
  greeting: {
    fontSize: FontSize.base,
    color: C.textSecondary,
    fontWeight: FontWeight.regular,
  },
  appName: {
    fontSize: FontSize['2xl'],
    color: C.text,
    fontWeight: FontWeight.extrabold,
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: C.accent,
    fontWeight: FontWeight.medium,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
  },
  comingCard: {
    borderColor: C.accentMuted,
    backgroundColor: C.accentMuted,
  },
  cardTitle: {
    fontSize: FontSize.md,
    color: C.text,
    fontWeight: FontWeight.semibold,
  },
  cardDescription: {
    fontSize: FontSize.sm,
    color: C.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: FontSize.sm,
    color: C.textSecondary,
    flex: 1,
  },
  statusValue: {
    fontSize: FontSize.sm,
    color: C.text,
    fontWeight: FontWeight.medium,
  },
  statusText: {
    fontSize: FontSize.sm,
    color: C.textSecondary,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    marginTop: Spacing.xs,
  },
  errorBox: {
    backgroundColor: C.dangerMuted,
    borderRadius: 8,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  errorTitle: {
    fontSize: FontSize.sm,
    color: C.danger,
    fontWeight: FontWeight.semibold,
  },
  errorMessage: {
    fontSize: FontSize.sm,
    color: C.text,
  },
  errorHint: {
    fontSize: FontSize.xs,
    color: C.textSecondary,
    fontFamily: 'monospace',
    marginTop: Spacing.xs,
  },
  phaseItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  phaseCheck: {
    fontSize: FontSize.sm,
    color: C.accent,
    fontWeight: FontWeight.bold,
  },
  phaseText: {
    fontSize: FontSize.sm,
    color: C.text,
    flex: 1,
  },
});
