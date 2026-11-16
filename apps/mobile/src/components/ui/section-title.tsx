import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from './icon';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

const C = Colors.dark;

interface SectionTitleProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, action, onAction }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.actionText}>{action}</Text>
          <Icon name="chevron" size={14} color="#A8AEA8" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm + 4,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: FontSize.md,
    color: C.text,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: FontSize.xs,
    color: '#A8AEA8',
    fontWeight: FontWeight.medium,
  },
});
