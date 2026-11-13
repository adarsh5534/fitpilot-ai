import { DarkTheme, ThemeProvider } from 'expo-router';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Colors } from '@/constants/theme';
import { Text } from 'react-native';

const C = Colors.dark;

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after root layout mounts
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: C.tabBar,
            borderTopColor: C.surfaceBorder,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: C.accent,
          tabBarInactiveTintColor: C.tabBarInactive,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏠</Text>,
          }}
        />
        <Tabs.Screen
          name="workout/index"
          options={{
            title: 'Workout',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏋️</Text>,
          }}
        />
        <Tabs.Screen
          name="nutrition/index"
          options={{
            title: 'Nutrition',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🥗</Text>,
          }}
        />
        <Tabs.Screen
          name="progress/index"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📈</Text>,
          }}
        />
        <Tabs.Screen
          name="coach/index"
          options={{
            title: 'AI Coach',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🤖</Text>,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
