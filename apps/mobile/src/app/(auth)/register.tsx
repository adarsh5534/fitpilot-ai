import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth.store';
import type { AuthSession } from '@fitpilot/shared';

const C = Colors.dark;

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop';

export default function RegisterScreen() {
  const setSession = useAuthStore((s) => s.setSession);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRegister() {
    setErrorMessage(null);

    const cleanEmail = email.trim();
    const cleanName = displayName.trim();

    if (!cleanEmail || !password || !cleanName) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post<AuthSession>('/auth/register', {
        email: cleanEmail,
        password,
        display_name: cleanName,
      });

      if (!res.success) {
        setErrorMessage(res.error?.message || 'Registration failed.');
        return;
      }

      await setSession(res.data);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      {/* Hero Background Image with Gradient Overlay */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: HERO_IMAGE }}
          style={styles.heroImage}
          contentFit="cover"
          transition={500}
        />
        <LinearGradient
          colors={['rgba(16, 18, 17, 0.25)', 'rgba(16, 18, 17, 0.85)', '#101211']}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Top Brand Header */}
            <View style={styles.brandSection}>
              <View style={styles.badgeRow}>
                <View style={styles.livePulse} />
                <Text style={styles.badgeText}>SMART ONBOARDING</Text>
              </View>
              <Text style={styles.heroTitle}>Build Your Blueprint</Text>
              <Text style={styles.heroSubtitle}>
                Create an account to generate your AI-engineered fitness profile.
              </Text>
            </View>

            {/* Glassmorphism Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Create Account</Text>

              {errorMessage ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Alex Mercer"
                  placeholderTextColor={C.textMuted}
                  value={displayName}
                  onChangeText={setDisplayName}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="athlete@fitpilot.ai"
                  placeholderTextColor={C.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password (min. 8 characters)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={C.textMuted}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={C.textMuted}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#B8F34A', '#9FE828']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#101211" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Get Started</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#101211',
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },
  brandSection: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(184, 243, 74, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(184, 243, 74, 0.3)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B8F34A',
  },
  badgeText: {
    fontSize: 10,
    color: '#B8F34A',
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: FontSize['3xl'],
    color: '#FFFFFF',
    fontWeight: FontWeight.extrabold,
    lineHeight: 38,
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'rgba(25, 28, 26, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  cardHeader: {
    fontSize: FontSize.xl,
    color: '#FFFFFF',
    fontWeight: FontWeight.bold,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: FontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#141715',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    fontSize: FontSize.base,
    color: '#FFFFFF',
  },
  primaryButton: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  gradientButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#101211',
    fontSize: FontSize.base,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: FontSize.sm,
  },
  linkText: {
    color: '#B8F34A',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
