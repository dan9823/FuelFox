import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

const reminderChoices = [
  { id: 'morning', emoji: '☀️', label: 'In the morning' },
  { id: 'before_meals', emoji: '🍴', label: 'Before all meals' },
  { id: 'pet_hungry', emoji: '❤️', label: 'When pet is hungry' },
];

export default function ReminderPreferencesScreen() {
  const router = useRouter();
  const { reminderPreferences, toggleArrayItem } = useOnboarding();

  const handleToggle = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleArrayItem('reminderPreferences', id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color={COLORS.black} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sparkle decorations */}
        <View style={styles.sparkleRow}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.sparkle}>✨</Text>
        </View>

        <Animated.Text entering={FadeIn.duration(400)} style={styles.title}>
          When would you like{'\n'}to receive reminders
        </Animated.Text>

        {/* Checkbox cards */}
        <View style={styles.options}>
          {reminderChoices.map((item, index) => {
            const isSelected = reminderPreferences.includes(item.id);
            return (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(100 + index * 100).duration(400)}
              >
                <TouchableOpacity
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  activeOpacity={0.7}
                  onPress={() => handleToggle(item.id)}
                >
                  <View style={[styles.emojiCircle, isSelected && styles.emojiCircleSelected]}>
                    <Text style={styles.optionEmoji}>{item.emoji}</Text>
                  </View>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {item.label}
                  </Text>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color={COLORS.white} />
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Tip box */}
        <Animated.View
          entering={FadeIn.delay(500).duration(400)}
          style={styles.tipBox}
        >
          <View style={styles.tipIconContainer}>
            <Ionicons name="bulb-outline" size={20} color={COLORS.orange} />
          </View>
          <Text style={styles.tipText}>
            Reminders build healthy eating habits{' '}
            <Text style={styles.tipBold}>2x faster</Text>
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Bottom */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={() => router.push('/onboarding/eating-habits-intro')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Set up later</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push('/onboarding/eating-habits-intro')}
        >
          <Text style={styles.buttonText}>Next  &gt;</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: SPACING.base,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.massive + SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  sparkleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xxl,
    marginBottom: SPACING.sm,
  },
  sparkle: {
    fontSize: 20,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 36,
  },
  options: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.base,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.card,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emojiCircleSelected: {
    backgroundColor: COLORS.primaryFaded,
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionLabel: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  optionLabelSelected: {
    color: COLORS.primaryDark,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.inactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  // Tip
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.12)',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    gap: SPACING.md,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  // Bottom
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
    alignItems: 'center',
  },
  skipText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.medium,
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: COLORS.black,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...SHADOWS.medium,
  },
  buttonText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
