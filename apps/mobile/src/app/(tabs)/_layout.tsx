import React from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';

const C = Colors.dark;

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const isCoachScreen = pathname.includes('/coach');

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: C.accent,
          tabBarInactiveTintColor: C.tabBarInactive,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Icon name="home" size={20} color={String(color)} />,
          }}
        />
        <Tabs.Screen
          name="workout/index"
          options={{
            title: 'Workouts',
            tabBarIcon: ({ color }) => <Icon name="workouts" size={20} color={String(color)} />,
          }}
        />
        <Tabs.Screen
          name="nutrition/index"
          options={{
            title: 'Nutrition',
            tabBarIcon: ({ color }) => <Icon name="nutrition" size={20} color={String(color)} />,
          }}
        />
        <Tabs.Screen
          name="progress/index"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color }) => <Icon name="progress" size={20} color={String(color)} />,
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Icon name="profile" size={20} color={String(color)} />,
          }}
        />
        {/* AI Coach route accessible via FAB/headers but hidden from bottom tab slots */}
        <Tabs.Screen
          name="coach/index"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tabs>

      {/* Floating AI Coach Action Button (FAB) */}
      {!isCoachScreen ? (
        <TouchableOpacity
          style={styles.coachFab}
          onPress={() => router.push('/(tabs)/coach/index' as any)}
          activeOpacity={0.85}
          accessibilityLabel="Open AI Coach"
        >
          <Icon name="spark" size={24} color="#101210" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  tabBar: {
    backgroundColor: '#101211',
    borderTopColor: 'rgba(255, 255, 255, 0.075)',
    borderTopWidth: 1,
    height: 68,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  coachFab: {
    position: 'absolute',
    bottom: 84,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
