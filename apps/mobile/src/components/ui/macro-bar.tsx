import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

const C = Colors.dark;

interface MacroBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

export function MacroBar({ label, value, total, color }: MacroBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / (total || 1)) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}
          <Text style={styles.total}> / {total}g</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#C3C7C3',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  value: {
    color: C.text,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  total: {
    color: C.textSecondary,
    fontWeight: FontWeight.medium,
  },
  track: {
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: '#292D2A',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
