import { NativeTabs } from 'expo-router/native-tabs';
import { Platform } from 'react-native';
import { Colors } from '@/constants/theme';

// ─── FitPilot Tab Navigator ───────────────────────────────────────────────────
// 5 tabs as specified: Home, Workout, Nutrition, Progress, AI Coach
//
// Design: dark tab bar with green active indicator.
// We force dark theme — the tab bar will always be dark navy.
//
// Note on icons: NativeTabs.Trigger.Icon requires PNG assets.
// We use SF Symbols on iOS via expo-symbols in Phase 2.
// For now, we use text-only labels (fully functional in Expo Go).

const C = Colors.dark;

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={C.tabBar}
      indicatorColor={C.accent}
      labelStyle={{
        selected: { color: C.accent },
        default: { color: C.tabBarInactive },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="workout/index">
        <NativeTabs.Trigger.Label>Workout</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="nutrition/index">
        <NativeTabs.Trigger.Label>Nutrition</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="progress/index">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="coach/index">
        <NativeTabs.Trigger.Label>AI Coach</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
