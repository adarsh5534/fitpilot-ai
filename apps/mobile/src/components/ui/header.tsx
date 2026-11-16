import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from './icon';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

const C = Colors.dark;

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onCoach?: () => void;
  onNotifications?: () => void;
}

export function Header({ title, subtitle, onCoach, onNotifications }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {subtitle ? <Text style={styles.eyebrow}>{subtitle}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotifications}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
        >
          <Icon name="bell" size={18} color="#DFE3DD" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.coachOrb}
          onPress={onCoach}
          activeOpacity={0.8}
          accessibilityLabel="Open AI Coach"
        >
          <Icon name="spark" size={20} color="#101210" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  textContainer: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.45,
    fontWeight: FontWeight.bold,
    color: C.textSecondary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FontSize['2xl'],
    lineHeight: 32,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.8,
    color: C.text,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1D1B',
    borderWidth: 1,
    borderColor: C.surfaceBorder,
  },
  coachOrb: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.accent,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
});
