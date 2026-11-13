import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  // FitPilot always starts in dark mode — user can toggle in settings (Phase 2+)
  const resolvedScheme = scheme === 'light' ? 'light' : 'dark';
  return Colors[resolvedScheme];
}
