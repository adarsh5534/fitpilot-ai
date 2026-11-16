import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Line,
  Path,
  Circle,
} from 'react-native-svg';
import { Colors } from '@/constants/theme';

const C = Colors.dark;

interface LineChartProps {
  width?: number;
  height?: number;
}

export function LineChart({ width = 340, height = 150 }: LineChartProps) {
  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 340 150" width="100%" height={height} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={C.accent} stopOpacity="0.26" />
            <Stop offset="1" stopColor={C.accent} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {[25, 65, 105, 145].map((y) => (
          <Line
            key={y}
            x1="0"
            y1={y}
            x2="340"
            y2={y}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Area fill under curve */}
        <Path
          d="M0 22 C35 30,45 40,78 42 S122 65,155 70 S198 88,230 95 S280 100,340 128 L340 150 L0 150Z"
          fill="url(#chartFill)"
        />

        {/* Trend line */}
        <Path
          d="M0 22 C35 30,45 40,78 42 S122 65,155 70 S198 88,230 95 S280 100,340 128"
          fill="none"
          stroke={C.accent}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Active focal point */}
        <Circle
          cx="230"
          cy="95"
          r="5"
          fill="#101211"
          stroke={C.accent}
          strokeWidth="3"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
