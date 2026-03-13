import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import ProgressBar from '../../src/components/ProgressBar';
import ScrollPicker from '../../src/components/ScrollPicker';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

const MEAL_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function MealsPerDayScreen() {
  const router = useRouter();
  const { mealsPerDay, updateField } = useOnboarding();

  // Default to 3 meals (index 2)
  const initialIndex = mealsPerDay
    ? MEAL_OPTIONS.indexOf(Number(mealsPerDay))
    : 2;
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex >= 0 ? initialIndex : 2
  );

  const handleSelect = useCallback(
    (index) => {
      setSelectedIndex(index);
      const value = String(MEAL_OPTIONS[index]);
      updateField('mealsPerDay', value);
      Haptics.selectionAsync();
    },
    [updateField]
  );

  const handleNext = () => {
    if (!mealsPerDay) {
      updateField('mealsPerDay', String(MEAL_OPTIONS[selectedIndex]));
    }
    router.push('/onboarding/eating-window');
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

      <View style={styles.inner}>
        {/* Progress bar */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.progressContainer}>
          <ProgressBar progress={0.15} height={6} color={COLORS.primary} />
        </Animated.View>

        {/* Question bubble with fox */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.questionSection}
        >
          <View style={styles.questionRow}>
            <View style={styles.foxBubbleAvatar}>
              <FoxAvatar mood="happy" size={40} />
            </View>
            <View style={styles.questionBubble}>
              <Text style={styles.questionText}>
                How many meals per day do you usually have?
              </Text>
            </View>
          </View>
          <View style={styles.bubbleTail} />
        </Animated.View>

        {/* Scroll picker */}
        <View style={styles.pickerContainer}>
          <ScrollPicker
            items={MEAL_OPTIONS}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />
        </View>
      </View>

      {/* Next button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleNext}
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
    backgroundColor: COLORS.background,
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
  inner: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.massive + SPACING.xxl,
  },
  progressContainer: {
    marginBottom: SPACING.xxl,
  },
  // Question bubble
  questionSection: {
    marginBottom: SPACING.xxl,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  foxBubbleAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: SPACING.xs,
  },
  questionBubble: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    borderTopLeftRadius: 4,
    padding: SPACING.base,
    ...SHADOWS.card,
  },
  questionText: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    lineHeight: 28,
  },
  bubbleTail: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.white,
    marginLeft: 30,
    marginTop: -2,
    transform: [{ rotate: '45deg' }],
  },
  // Picker
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  // Bottom
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: COLORS.black,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  buttonText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
