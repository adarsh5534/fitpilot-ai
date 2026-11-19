import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { Icon, type IconName } from '@/components/ui/icon';
import { useAuthStore } from '@/stores/auth.store';
import { apiClient } from '@/lib/api-client';
import type { UserProfile } from '@fitpilot/shared';

const C = Colors.dark;

function getInitials(name?: string | null): string {
  if (!name) return 'FP';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatGoal(goal?: string | null): string {
  switch (goal) {
    case 'muscle_gain':
      return 'Build muscle';
    case 'fat_loss':
      return 'Lose fat';
    case 'maintenance':
      return 'Maintain physique';
    case 'general_fitness':
      return 'General fitness';
    default:
      return 'Build muscle';
  }
}

export default function ProfileScreen() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setProfile = useAuthStore((s) => s.setProfile);

  // Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(profile?.display_name || '');
  const [editHeight, setEditHeight] = useState(profile?.height_cm ? String(profile.height_cm) : '-');
  const [editWeight, setEditWeight] = useState(profile?.weight_kg ? String(profile.weight_kg) : '-');
  const [isSaving, setIsSaving] = useState(false);

  // Info Modal for static settings items
  const [infoModalTitle, setInfoModalTitle] = useState<string | null>(null);
  const [infoModalContent, setInfoModalContent] = useState<string | null>(null);

  // Derived User Stats
  const displayName = profile?.display_name || 'Alex Morgan';
  const email = user?.email || 'athlete@fitpilot.ai';
  const weightKg = profile?.weight_kg ? Number(profile.weight_kg).toFixed(1) : '-';
  const heightCm = profile?.height_cm ? Math.round(Number(profile.height_cm)).toString() : '-';
  console.log(profile)
  const birthYear = profile?.date_of_birth
    ? new Date(profile.date_of_birth).getFullYear()
    : 1997;
  const age = new Date().getFullYear() - birthYear;

  const handleOpenEdit = () => {
    setEditName(displayName);
    setEditHeight(heightCm);
    setEditWeight(weightKg);
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await apiClient.patch<UserProfile>('/profile', {
        display_name: editName.trim(),
        height_cm: parseFloat(editHeight) || undefined,
        weight_kg: parseFloat(editWeight) || undefined,
      });

      if (res.success) {
        await setProfile(res.data);
        setIsEditModalVisible(false);
      } else {
        Alert.alert('Error', res.error.message);
      }
    } catch {
      Alert.alert('Error', 'Unable to reach the server. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined'
          ? window.confirm('Are you sure you want to log out of FitPilot AI?')
          : true;
      if (confirmed) {
        await clearSession();
        router.replace('/(auth)/login' as any);
      }
      return;
    }

    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of FitPilot AI?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await clearSession();
            router.replace('/(auth)/login' as any);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleItemPress = (title: string, content: string) => {
    setInfoModalTitle(title);
    setInfoModalContent(content);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={() => handleItemPress('Notifications', 'You have no unread notifications.')}
              accessibilityLabel="Notifications"
            >
              <Icon name="bell" size={18} color="#DFE3DD" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.coachOrb}
              onPress={() => router.push('/(tabs)/coach/index' as any)}
              activeOpacity={0.8}
              accessibilityLabel="Open AI Coach"
            >
              <Icon name="spark" size={18} color="#101210" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
              </View>
              <TouchableOpacity
                style={styles.cameraBadge}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert('Profile Photo', 'Custom avatar uploads will be enabled in next release.')
                }
              >
                <Icon name="camera" size={13} color="#DFE3DD" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {email}
              </Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO MEMBER</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={handleOpenEdit}
              activeOpacity={0.7}
              accessibilityLabel="Edit Profile"
            >
              <Icon name="edit" size={16} color="#DFE3DD" />
            </TouchableOpacity>
          </View>

          {/* Fitness Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{weightKg}</Text>
              <Text style={styles.statLabel}>Weight · kg</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{heightCm}</Text>
              <Text style={styles.statLabel}>Height · cm</Text>
            </View>
            <View style={[styles.statCol, { borderRightWidth: 0 }]}>
              <Text style={styles.statValue}>{age}</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
          </View>

          {/* My Plan Section */}
          <Text style={styles.sectionHeading}>My plan</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="target"
              title="Fitness goal"
              subtitle={formatGoal(profile?.primary_goal)}
              onPress={() =>
                handleItemPress(
                  'Fitness Goal',
                  `Your primary goal is currently set to ${formatGoal(profile?.primary_goal)}. FitPilot AI calibrates your daily volume and caloric target based on this metric.`
                )
              }
            />
            <MenuItem
              icon="workouts"
              title="Training preferences"
              subtitle={`${profile?.workout_days_per_week || 4} days / week`}
              onPress={() =>
                handleItemPress(
                  'Training Preferences',
                  `Scheduled for ${profile?.workout_days_per_week || 4} sessions per week. Your AI Coach adjusts rest intervals accordingly.`
                )
              }
            />
            <MenuItem
              icon="settings"
              title="Equipment"
              subtitle={
                profile?.equipment_access && profile.equipment_access.length > 0
                  ? profile.equipment_access.map((e) => e.replace(/_/g, ' ')).join(', ')
                  : 'Full gym'
              }
              onPress={() =>
                handleItemPress(
                  'Equipment Access',
                  'Calibrated for full gym equipment including barbells, dumbbells, cables, and machines.'
                )
              }
            />
            <MenuItem
              icon="nutrition"
              title="Dietary preferences"
              subtitle={
                profile?.dietary_preferences && profile.dietary_preferences.length > 0
                  ? profile.dietary_preferences.map((d) => d.replace(/_/g, ' ')).join(', ')
                  : 'High protein'
              }
              onPress={() =>
                handleItemPress(
                  'Dietary Preferences',
                  'Macro distribution targets 2.0g protein per kg of bodyweight.'
                )
              }
            />
            <MenuItem
              icon="bell"
              title="Notifications"
              subtitle="On"
              isLast
              onPress={() =>
                handleItemPress(
                  'Notifications',
                  'Daily workout reminders and recovery alerts are active.'
                )
              }
            />
          </View>

          {/* Settings Section */}
          <Text style={styles.sectionHeading}>Settings</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="profile"
              title="Personal Information"
              subtitle="Name, metrics, and account credentials"
              onPress={handleOpenEdit}
            />
            <MenuItem
              icon="lock"
              title="Privacy & security"
              subtitle="Data and biometric permissions"
              onPress={() =>
                handleItemPress(
                  'Privacy & Security',
                  'Your session credentials are encrypted in hardware-backed storage (SecureStore). Database rows are isolated using Row Level Security (RLS).'
                )
              }
            />
            <MenuItem
              icon="help"
              title="Help & support"
              subtitle="FAQs, guides, and athlete support"
              onPress={() =>
                handleItemPress(
                  'Help & Support',
                  'FitPilot AI Support:\nEmail: support@fitpilot.ai\nHours: 24/7 AI Coach Assistance.'
                )
              }
            />
            <MenuItem
              icon="fileText"
              title="Terms & Conditions"
              subtitle="Terms of use and fitness disclaimers"
              onPress={() =>
                handleItemPress(
                  'Terms & Conditions',
                  'FitPilot AI is an automated fitness guidance assistant. Consult a physician before beginning any high-intensity training program.'
                )
              }
            />
            <MenuItem
              icon="shield"
              title="Privacy Policy"
              subtitle="How your health data is stored and used"
              onPress={() =>
                handleItemPress(
                  'Privacy Policy',
                  'FitPilot AI never sells your biometric or health records. All AI reasoning runs server-side with strict encryption.'
                )
              }
            />
            <MenuItem
              icon="settings"
              title="App Settings"
              subtitle="Metric units (kg/cm) · Dark Theme"
              isLast
              onPress={() =>
                handleItemPress(
                  'App Settings',
                  'Current Version: FitPilot AI v1.0.0 (Phase 3 Build)\nTheme: Dark Navy + Lime Accent\nUnits: Metric (kg, cm).'
                )
              }
            />
          </View>

          {/* Destructive Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Icon name="logout" size={18} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionFooter}>FitPilot AI · v1.0.0 (Build 42)</Text>
        </ScrollView>

        {/* Edit Profile Modal */}
        <Modal
          visible={isEditModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.editModalBox}>
              <Text style={styles.editModalTitle}>Edit Profile</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.textInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Athlete Name"
                  placeholderTextColor="#777E78"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>HEIGHT (CM)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editHeight}
                    onChangeText={setEditHeight}
                    keyboardType="numeric"
                    placeholder="180"
                    placeholderTextColor="#777E78"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editWeight}
                    onChangeText={setEditWeight}
                    keyboardType="numeric"
                    placeholder="75"
                    placeholderTextColor="#777E78"
                  />
                </View>
              </View>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsEditModalVisible(false)}
                  disabled={isSaving}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#101211" />
                  ) : (
                    <Text style={styles.modalSaveText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Info Detail Modal */}
        <Modal
          visible={!!infoModalTitle}
          transparent
          animationType="fade"
          onRequestClose={() => setInfoModalTitle(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.editModalBox}>
              <Text style={styles.editModalTitle}>{infoModalTitle}</Text>
              <Text style={styles.infoModalBody}>{infoModalContent}</Text>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={() => setInfoModalTitle(null)}
              >
                <Text style={styles.modalSaveText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

interface MenuItemProps {
  icon: IconName;
  title: string;
  subtitle: string;
  isLast?: boolean;
  onPress?: () => void;
}

function MenuItem({ icon, title, subtitle, isLast = false, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconContainer}>
        <Icon name={icon} size={18} color="#DFE3DD" />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron" size={16} color="#777E78" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: FontWeight.extrabold,
    color: '#DFE3DD',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachOrb: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191C1A',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: '#101210',
    letterSpacing: 0.5,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#141715',
    borderWidth: 2,
    borderColor: '#191C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    color: '#DFE3DD',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: '#777E78',
    marginBottom: 8,
  },
  proBadge: {
    alignSelf: 'flex-start',
    backgroundColor: C.accent,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
    color: '#101210',
    letterSpacing: 0.8,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#242825',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#191C1A',
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
  },
  statValue: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: '#DFE3DD',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#777E78',
    fontWeight: FontWeight.medium,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: '#DFE3DD',
    marginTop: 22,
    marginBottom: 10,
    paddingLeft: 4,
  },
  menuGroup: {
    backgroundColor: '#191C1A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#242825',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#DFE3DD',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#777E78',
    textTransform: 'capitalize',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 26,
    marginBottom: 12,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: '#EF4444',
  },
  versionFooter: {
    textAlign: 'center',
    fontSize: 11,
    color: '#555A56',
    marginTop: 4,
    marginBottom: 16,
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  editModalBox: {
    width: '100%',
    backgroundColor: '#191C1A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: FontWeight.extrabold,
    color: '#DFE3DD',
    marginBottom: 16,
  },
  infoModalBody: {
    fontSize: 14,
    lineHeight: 22,
    color: '#ADB3AD',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#777E78',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#141715',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#DFE3DD',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#242825',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#DFE3DD',
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: C.accent,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: FontWeight.extrabold,
    color: '#101211',
  },
});
