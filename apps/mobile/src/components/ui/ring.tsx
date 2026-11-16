import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants/theme';

const C = Colors.dark;

interface RingProps {
  value: number; // percentage 0-100
  size?: number;
  width?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export function Ring({
  value,
  size = 88,
  width = 8,
  color = C.accent,
  backgroundColor = 'rgba(255, 255, 255, 0.08)',
  children,
}: RingProps) {
  const r = (size - width) / 2;
  const circumference = 2 * Math.PI * r;
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference * (1 - clampedValue / 100);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={backgroundColor}
          strokeWidth={width}
          fill="none"
        />
        {/* Active progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={width}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});
