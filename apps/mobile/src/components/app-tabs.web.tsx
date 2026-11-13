// Web-specific tab navigation for FitPilot AI
// Uses expo-router/ui Tabs component (web-compatible)

import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps, TabListProps } from 'expo-router/ui';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

const C = Colors.dark;

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <WebTabBar>
          <TabTrigger name="home" href="/" asChild>
            <WebTabButton>Home</WebTabButton>
          </TabTrigger>
          <TabTrigger name="workout" href="/workout" asChild>
            <WebTabButton>Workout</WebTabButton>
          </TabTrigger>
          <TabTrigger name="nutrition" href="/nutrition" asChild>
            <WebTabButton>Nutrition</WebTabButton>
          </TabTrigger>
          <TabTrigger name="progress" href="/progress" asChild>
            <WebTabButton>Progress</WebTabButton>
          </TabTrigger>
          <TabTrigger name="coach" href="/coach" asChild>
            <WebTabButton>AI Coach</WebTabButton>
          </TabTrigger>
        </WebTabBar>
      </TabList>
    </Tabs>
  );
}

function WebTabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  // Cast needed: Expo Router's TabTriggerSlotProps ref type conflicts with React 19 / RN 0.88 Pressable ref.
  // This is a known upstream type mismatch — safe to cast here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pressableProps = props as any;
  return (
    <Pressable
      {...pressableProps}
      style={({ pressed }: { pressed: boolean }) => [
        styles.tabButton,
        isFocused && styles.tabButtonActive,
        pressed && styles.tabButtonPressed,
      ]}
    >
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
        {children}
      </Text>
    </Pressable>
  );
}

function WebTabBar(props: TabListProps) {
  return (
    <View style={styles.tabBarContainer}>
      <View {...props} style={styles.tabBarInner} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: C.tabBar,
    borderTopWidth: 1,
    borderTopColor: C.surfaceBorder,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  tabBarInner: {
    flexDirection: 'row',
    maxWidth: MaxContentWidth,
    width: '100%',
    gap: Spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: C.accentMuted,
  },
  tabButtonPressed: {
    opacity: 0.7,
  },
  tabLabel: {
    fontSize: 13,
    color: C.tabBarInactive,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: C.accent,
    fontWeight: '600',
  },
});
