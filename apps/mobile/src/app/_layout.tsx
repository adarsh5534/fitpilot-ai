import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth.store';
import { isProfileComplete } from '@fitpilot/shared';

const C = Colors.dark;

// Keep splash screen visible until auth initialization finishes
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profile = useAuthStore((s) => s.profile);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isInitialized) return;

    // Hide native splash screen once initialized
    SplashScreen.hideAsync().catch(() => {});

    const inAuthGroup = segments[0] === '(auth)';
    const isOnboarding = segments[1] === 'onboarding';

    if (!isAuthenticated) {
      // User is not logged in: must be in auth flow (login/register)
      if (!inAuthGroup) {
        router.replace('/(auth)/login' as any);
      }
    } else {
      // User is authenticated: check if onboarding profile is filled
      const completed = profile ? isProfileComplete(profile) : false;

      if (!completed) {
        if (!isOnboarding) {
          router.replace('/(auth)/onboarding' as any);
        }
      } else {
        // Profile is complete: redirect away from auth pages to main tabs
        if (inAuthGroup) {
          router.replace('/(tabs)/index' as any);
        }
      }
    }
  }, [isInitialized, isAuthenticated, profile, segments, router]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={C.accent} />
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: C.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
