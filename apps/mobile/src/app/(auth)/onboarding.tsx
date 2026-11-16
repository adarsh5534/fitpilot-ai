import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { Icon, IconName } from '@/components/ui/icon';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth.store';
import type { OnboardingInput, UserProfile } from '@fitpilot/shared';

const C = Colors.dark;

const STEPS_DATA = [
  {
    kicker: "LET'S GET TO KNOW YOU",
    title: "What’s your primary goal?",
    subtitle: 'FitPilot will shape your training and nutrition plan around what matters most.',
    options: [
      { id: 'fat_loss', title: 'Lose weight', desc: 'Burn fat while preserving strength', icon: 'fire' as IconName },
      { id: 'muscle_gain', title: 'Build muscle', desc: 'Add lean mass and get stronger', icon: 'workouts' as IconName },
      { id: 'general_fitness', title: 'Improve fitness', desc: 'Build endurance and feel your best', icon: 'heart' as IconName },
      { id: 'maintenance', title: 'Stay healthy', desc: 'Create consistent, sustainable habits', icon: 'target' as IconName },
    ],
  },
  {
    kicker: 'YOUR EXPERIENCE',
    title: 'How do you train today?',
    subtitle: 'This helps us set the right intensity and exercise complexity.',
    options: [
      { id: 'beginner', title: 'Just starting', desc: 'Less than 6 months', icon: 'spark' as IconName },
      { id: 'intermediate', title: 'Intermediate', desc: '6 months to 2 years', icon: 'zap' as IconName },
      { id: 'advanced', title: 'Experienced', desc: 'More than 2 years', icon: 'trophy' as IconName },
      { id: 'returning', title: 'Getting back into it', desc: 'Returning after a break', icon: 'clock' as IconName },
    ],
  },
  {
    kicker: 'YOUR ROUTINE',
    title: 'Where will you train?',
    subtitle: "We'll only recommend exercises you can actually do.",
    options: [
      { id: 'full_gym', title: 'Full gym', desc: 'Machines, cables and free weights', icon: 'workouts' as IconName },
      { id: 'home_gym', title: 'Home gym', desc: 'Dumbbells, bench and bands', icon: 'home' as IconName },
      { id: 'bodyweight', title: 'Bodyweight only', desc: 'No equipment needed', icon: 'steps' as IconName },
      { id: 'flexible', title: 'A mix of places', desc: 'Flexible week to week', icon: 'calendar' as IconName },
    ],
  },
  {
    kicker: 'ALMOST THERE',
    title: 'Your body & routine',
    subtitle: 'Used to personalize calories, recovery, and weekly training load.',
    options: [],
  },
];

export default function OnboardingScreen() {
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const setProfile = useAuthStore((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selections
  const [selectedGoal, setSelectedGoal] = useState<'fat_loss' | 'muscle_gain' | 'maintenance' | 'general_fitness'>('muscle_gain');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [selectedPlace, setSelectedPlace] = useState('full_gym');

  // Form Stats
  const [displayName, setDisplayName] = useState(profile?.display_name || user?.email?.split('@')[0] || 'Alex');
  const [age, setAge] = useState('29');
  const [heightCm, setHeightCm] = useState(profile?.height_cm ? String(profile.height_cm) : '182');
  const [weightKg, setWeightKg] = useState(profile?.weight_kg ? String(profile.weight_kg) : '78.4');
  const [activityLevel, setActivityLevel] = useState('Moderately active');
  const [dietaryPref, setDietaryPref] = useState('High protein');

  const s = STEPS_DATA[step];

  const handleNext = () => {
    setErrorMessage(null);
    if (step < 3) {
      setStep((curr) => curr + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step > 0) {
      setStep((curr) => curr - 1);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    const h = Number(heightCm);
    const w = Number(weightKg);
    const a = Number(age);

    if (isNaN(h) || h < 50 || h > 300) {
      setErrorMessage('Please enter a valid height in cm (50 - 300).');
      return;
    }
    if (isNaN(w) || w < 20 || w > 500) {
      setErrorMessage('Please enter a valid weight in kg (20 - 500).');
      return;
    }

    setLoading(true);

    // Compute synthetic birth date from age
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - (a || 25);
    const dob = `${birthYear}-01-01`;

    const workoutDays = activityLevel === 'Very active' ? 5 : activityLevel === 'Moderately active' ? 4 : 3;

    const payload: OnboardingInput = {
      display_name: displayName.trim() || 'Alex',
      date_of_birth: dob,
      gender: 'male',
      height_cm: h,
      weight_kg: w,
      fitness_level: selectedLevel,
      primary_goal: selectedGoal,
      workout_days_per_week: workoutDays,
      equipment_access: [selectedPlace],
      dietary_preferences: [dietaryPref.toLowerCase().replace(' ', '_')],
    };

    try {
      const res = await apiClient.put<UserProfile>('/profile/onboarding', payload);

      if (!res.success) {
        setErrorMessage(res.error?.message || 'Failed to save profile.');
        return;
      }

      await setProfile(res.data);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Top Bar */}
          <View style={styles.onboardTop}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <Icon name="spark" size={18} color="#101210" />
              </View>
              <Text style={styles.brandTitle}>
                FitPilot <Text style={styles.brandAi}>AI</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.7}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Track */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${((step + 1) / 4) * 100}%` },
              ]}
            />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stepCount}>STEP {step + 1} OF 4</View>
            <Text style={styles.eyebrow}>{s.kicker}</Text>
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.subtitle}>{s.subtitle}</Text>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            ) : null}

            {/* Steps 1, 2, 3: Interactive Option Cards */}
            {step < 3 ? (
              <View style={styles.optionList}>
                {s.options.map((opt) => {
                  const isSelected =
                    step === 0
                      ? selectedGoal === opt.id
                      : step === 1
                        ? selectedLevel === opt.id
                        : selectedPlace === opt.id;

                  const handleSelect = () => {
                    if (step === 0) setSelectedGoal(opt.id as any);
                    if (step === 1) setSelectedLevel(opt.id as any);
                    if (step === 2) setSelectedPlace(opt.id);
                  };

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      onPress={handleSelect}
                      activeOpacity={0.8}
                    >
                      <View style={styles.optionIconWrapper}>
                        <Icon name={opt.icon} size={20} color={C.text} />
                      </View>
                      <View style={styles.optionInfo}>
                        <Text style={styles.optionTitle}>{opt.title}</Text>
                        <Text style={styles.optionDesc}>{opt.desc}</Text>
                      </View>
                      {isSelected ? (
                        <View style={styles.optionCheck}>
                          <Icon name="check" size={14} color="#101210" />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              /* Step 4: Body Metrics Form */
              <View style={styles.bodyForm}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Your Name</Text>
                  <View style={styles.formInputWrapper}>
                    <TextInput
                      style={styles.formInput}
                      value={displayName}
                      onChangeText={setDisplayName}
                      placeholder="Alex"
                      placeholderTextColor={C.textMuted}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Age</Text>
                  <View style={styles.formInputWrapper}>
                    <TextInput
                      style={styles.formInput}
                      value={age}
                      onChangeText={setAge}
                      keyboardType="numeric"
                    />
                    <Text style={styles.formUnit}>years</Text>
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Height</Text>
                    <View style={styles.formInputWrapper}>
                      <TextInput
                        style={styles.formInput}
                        value={heightCm}
                        onChangeText={setHeightCm}
                        keyboardType="numeric"
                      />
                      <Text style={styles.formUnit}>cm</Text>
                    </View>
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Weight</Text>
                    <View style={styles.formInputWrapper}>
                      <TextInput
                        style={styles.formInput}
                        value={weightKg}
                        onChangeText={setWeightKg}
                        keyboardType="numeric"
                      />
                      <Text style={styles.formUnit}>kg</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Activity Level</Text>
                  <View style={styles.chipPicker}>
                    {['Lightly active', 'Moderately active', 'Very active'].map((act) => (
                      <TouchableOpacity
                        key={act}
                        style={[
                          styles.chipOption,
                          activityLevel === act && styles.chipOptionActive,
                        ]}
                        onPress={() => setActivityLevel(act)}
                      >
                        <Text
                          style={[
                            styles.chipOptionText,
                            activityLevel === act && styles.chipOptionTextActive,
                          ]}
                        >
                          {act}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Dietary Preference</Text>
                  <View style={styles.chipPicker}>
                    {['No restrictions', 'High protein', 'Vegetarian', 'Vegan'].map((diet) => (
                      <TouchableOpacity
                        key={diet}
                        style={[
                          styles.chipOption,
                          dietaryPref === diet && styles.chipOptionActive,
                        ]}
                        onPress={() => setDietaryPref(diet)}
                      >
                        <Text
                          style={[
                            styles.chipOptionText,
                            dietaryPref === diet && styles.chipOptionTextActive,
                          ]}
                        >
                          {diet}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.onboardBottom}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={step > 0 ? handleBack : handleSubmit}
              activeOpacity={0.7}
            >
              <Icon name="back" size={16} color={C.textSecondary} />
              <Text style={styles.backBtnText}>
                {step > 0 ? 'Back' : 'Maybe later'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.continueBtn, loading && styles.continueBtnDisabled]}
              onPress={handleNext}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#11150E" size="small" />
              ) : (
                <>
                  <Text style={styles.continueBtnText}>
                    {step === 3 ? 'Generate my plan' : 'Continue'}
                  </Text>
                  <Icon name="chevron" size={17} color="#11150E" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
  keyboardView: {
    flex: 1,
  },
  onboardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  brandAi: {
    fontStyle: 'italic',
    color: C.accent,
  },
  skipText: {
    fontSize: 13,
    color: C.textSecondary,
    fontWeight: FontWeight.medium,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#202421',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: C.accent,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  stepCount: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: C.accent,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: C.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.6,
    color: C.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#8F9690',
    lineHeight: 18,
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: C.dangerMuted,
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
  },
  optionList: {
    gap: 11,
  },
  optionCard: {
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionCardSelected: {
    borderColor: C.accent,
    backgroundColor: '#20261C',
  },
  optionIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#242824',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  optionDesc: {
    fontSize: 11,
    color: '#8A918B',
    marginTop: 2,
  },
  optionCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyForm: {
    gap: 16,
  },
  formGroup: {
    gap: 6,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  formInput: {
    flex: 1,
    color: C.text,
    fontSize: 14,
  },
  formUnit: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: FontWeight.medium,
  },
  chipPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipOption: {
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipOptionActive: {
    backgroundColor: '#20261C',
    borderColor: C.accent,
  },
  chipOptionText: {
    color: '#8A918B',
    fontSize: 12,
    fontWeight: FontWeight.medium,
  },
  chipOptionTextActive: {
    color: C.accent,
    fontWeight: FontWeight.bold,
  },
  onboardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  backBtnText: {
    color: C.textSecondary,
    fontSize: 13,
    fontWeight: FontWeight.medium,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  continueBtnDisabled: {
    opacity: 0.6,
  },
  continueBtnText: {
    color: '#11150E',
    fontSize: 13,
    fontWeight: FontWeight.extrabold,
  },
});
