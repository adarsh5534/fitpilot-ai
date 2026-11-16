import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';

const C = Colors.dark;

export default function TabsLayout() {
  return (
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
        name="coach/index"
        options={{
          title: 'Coach',
          tabBarIcon: () => (
            <View style={styles.centerOrb}>
              <Icon name="spark" size={20} color="#101210" />
            </View>
          ),
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
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
  centerOrb: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
