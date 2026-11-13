/**
 * FitPilot AI Design Tokens
 * Dark navy/charcoal with green accents — premium fitness aesthetic.
 *
 * Colour decisions:
 * - Background: #0D1117 (GitHub dark — deep, eye-friendly for gym lighting)
 * - Surface: #161B22 (cards, modals)
 * - Surface elevated: #21262D (inputs, selected states)
 * - Accent: #22C55E (Tailwind green-500 — energetic, reads well on dark)
 * - Accent dim: #16A34A (pressed/hover state)
 * - Danger: #EF4444 (errors, delete actions)
 * - Warning: #F59E0B (warnings, fatigue indicators)
 */

import { Platform } from 'react-native';

export const Colors = {
  // ── Dark theme (primary) ───────────────────────────────────────────────────
  dark: {
    // Backgrounds
    background: '#0D1117',
    surface: '#161B22',
    surfaceElevated: '#21262D',
    surfaceBorder: '#30363D',

    // Text
    text: '#E6EDF3',
    textSecondary: '#8B949E',
    textMuted: '#484F58',
    textInverse: '#0D1117',

    // Accent (green)
    accent: '#22C55E',
    accentDim: '#16A34A',
    accentMuted: '#14532D',
    accentText: '#86EFAC',

    // Semantic
    danger: '#EF4444',
    dangerMuted: '#7F1D1D',
    warning: '#F59E0B',
    warningMuted: '#78350F',
    success: '#22C55E',
    info: '#3B82F6',

    // Tab bar
    tabBar: '#161B22',
    tabBarActive: '#22C55E',
    tabBarInactive: '#8B949E',

    // Legacy aliases kept for compatibility with existing components
    backgroundElement: '#21262D',
    backgroundSelected: '#30363D',
  },
  // ── Light theme (optional — app will force dark in Phase 1) ───────────────
  light: {
    background: '#FFFFFF',
    surface: '#F6F8FA',
    surfaceElevated: '#EAEEF2',
    surfaceBorder: '#D0D7DE',

    text: '#1F2328',
    textSecondary: '#636C76',
    textMuted: '#AFB8C1',
    textInverse: '#FFFFFF',

    accent: '#16A34A',
    accentDim: '#15803D',
    accentMuted: '#DCFCE7',
    accentText: '#15803D',

    danger: '#CF222E',
    dangerMuted: '#FFEBE9',
    warning: '#D1242F',
    warningMuted: '#FFF8C5',
    success: '#1A7F37',
    info: '#0969DA',

    tabBar: '#FFFFFF',
    tabBarActive: '#16A34A',
    tabBarInactive: '#636C76',

    backgroundElement: '#F6F8FA',
    backgroundSelected: '#EAEEF2',
  },
} as const;

export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  // Legacy aliases
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
