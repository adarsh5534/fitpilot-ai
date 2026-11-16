/**
 * FitPilot AI Design Tokens
 * Source of Truth: Figma Make Design System
 *
 * Theme Colors:
 * - Lime Accent: #B8F34A (var --lime)
 * - Main Background: #101211 (var --bg)
 * - Deep Radial Glow: #080A09 -> #22291D
 * - Card Surface: #191C1A (var --card)
 * - Line / Border: rgba(255, 255, 255, 0.075) (var --line)
 * - Text: #F5F7F2
 * - Muted: #8F9690
 */

import { Platform } from 'react-native';

export const Colors = {
  dark: {
    // Backgrounds
    background: '#101211',
    backgroundRoot: '#080A09',
    surface: '#191C1A',
    surfaceElevated: '#242824',
    surfaceBorder: 'rgba(255, 255, 255, 0.075)',
    line: 'rgba(255, 255, 255, 0.075)',

    // Text
    text: '#F5F7F2',
    textSecondary: '#8F9690',
    textMuted: '#6F766F',
    textInverse: '#101210',

    // Accent (Figma Electric Lime)
    accent: '#B8F34A',
    accentDim: '#9AD630',
    accentMuted: 'rgba(184, 243, 74, 0.15)',
    accentGlow: 'rgba(184, 243, 74, 0.25)',
    accentText: '#11150E',

    // Stat Palette
    purple: '#E6A6FF',
    purpleBg: '#2B2230',
    blue: '#74D7FF',
    blueBg: '#172B34',
    bluePill: '#25343A',
    orange: '#FFB45C',
    orangeBg: '#35271B',

    // Semantic
    danger: '#FF6B6B',
    dangerMuted: '#3D1E1E',
    warning: '#FFB45C',
    warningMuted: '#35271B',
    success: '#B8F34A',
    info: '#74D7FF',

    // Tab bar
    tabBar: '#101211',
    tabBarActive: '#B8F34A',
    tabBarInactive: '#777E78',
    tabBarBorder: 'rgba(255, 255, 255, 0.075)',

    // Compatibility aliases
    backgroundElement: '#242824',
    backgroundSelected: 'rgba(184, 243, 74, 0.12)',
  },
  light: {
    background: '#F5F7F2',
    backgroundRoot: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceElevated: '#EAECE7',
    surfaceBorder: '#E0E3DD',
    line: '#E0E3DD',

    text: '#101211',
    textSecondary: '#6F766F',
    textMuted: '#8F9690',
    textInverse: '#FFFFFF',

    accent: '#5E9B06',
    accentDim: '#4E8204',
    accentMuted: 'rgba(94, 155, 6, 0.15)',
    accentGlow: 'rgba(94, 155, 6, 0.25)',
    accentText: '#FFFFFF',

    purple: '#A855F7',
    purpleBg: '#F3E8FF',
    blue: '#0284C7',
    blueBg: '#E0F2FE',
    bluePill: '#BAE6FD',
    orange: '#EA580C',
    orangeBg: '#FFEDD5',

    danger: '#DC2626',
    dangerMuted: '#FEE2E2',
    warning: '#D97706',
    warningMuted: '#FEF3C7',
    success: '#16A34A',
    info: '#0284C7',

    tabBar: '#FFFFFF',
    tabBarActive: '#5E9B06',
    tabBarInactive: '#8F9690',
    tabBarBorder: '#E0E3DD',

    backgroundElement: '#EAECE7',
    backgroundSelected: '#DCFCE7',
  },
} as const;

export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof Colors.dark;

export const Fonts = {
  display: 'Manrope_700Bold',
  displayExtra: 'Manrope_800ExtraBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' }) ?? 'monospace',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 28,
  '2xl': 40,
  '3xl': 60,
  // Compatibility aliases
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 9,
  md: 14,
  lg: 18,
  xl: 21,
  '2xl': 26,
  full: 9999,
} as const;

export const FontSize = {
  '2xs': 9,
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
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
