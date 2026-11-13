import { View, type ViewProps } from 'react-native';

import type { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemeColor = keyof ThemeColors;

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();
  const bgColor = type ? theme[type] : theme.background;

  return <View style={[{ backgroundColor: bgColor }, style]} {...otherProps} />;
}
