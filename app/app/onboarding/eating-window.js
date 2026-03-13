import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useMemo, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import ProgressBar from '../../src/components/ProgressBar';
import TimePicker from '../../src/components/TimePicker';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

export default function EatingWindowScreen() {
  const router = useRouter();
  const { updateField } = useOnboarding();

  const [startIndex, setStartIndex] = useState(2); // 8:00 am
  const [finishIndex, setFinishIndex] = useState(4); // 7:00 pm

  // Calculate eating window for display
  const eatingWindowHours = useMemo(() => {
    // Start times: 6am=0, 6:30am=1, 7am=2, ... index * 0.5 + 6
    const startHour = startIndex * 0.5 + 6;
    // Finish times: 3pm(15)=0, 3:30pm=1, 4pm=2, ... index * 0.5 + 15
    const finishHour = finishIndex * 0.5 + 15;
    const diff = finishHour - startHour;
    return Math.max(0, diff);
  }, [startIndex, finishIndex]);

  const formatWindow = (hours) => {
    const whole = Math.floor(hours);
    const mins = Math.round((hours - whole) * 60);
    if (mins === 0) return `${whole} hours`;
    return `${whole}h ${mins}m`;
  };

  // Convert index to time string for context storage
  const indexToStartTime = (idx) => {
    const hour24 = Math.floor(idx / 2) + 6;
    const min = (idx % 2) * 30;
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${min.toString().padStart(2, '0')} ${ampm}`;
  };

  const indexToFinishTime = (idx) => {
    const hour24 = Math.floor(idx / 2) + 15;
    const min = (idx % 2) * 30;
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${min.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleStartChange = useCallback((idx) => {
    setStartIndex(idx);
  }, []);

  const handleFinishChange = useCallback((idx) => {
    setFinishIndex(idx);
  }, []);

  const handleNext = () => {
    updateField('eatingWindowStart', indexToStartTime(startIndex));
    updateField('eatingWindowEnd', indexToFinishTime(finishIndex));
    router.push('/onboarding/fasting-result');
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
        {/* Progress bar */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.progressContainer}>
          <ProgressBar progress={0.3} height={6} color={COLORS.primary} />
        </Animated.View>

        {/* Question bubble */}
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
                Between what hours do you eat?
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Time Picker */}
        <Animated.View entering={FadeIn.delay(300).duration(400)}>
          <TimePicker
            startIndex={startIndex}
            finishIndex={finishIndex}
            onStartChange={handleStartChange}
            onFinishChange={handleFinishChange}
            startRange={{ from: 6, to: 12 }}
            finishRange={{ from: 15, to: 23 }}
            interval={30}
          />
        </Animated.View>

        {/* Info card */}
        <Animated.View
          entering={FadeIn.delay(500).duration(400)}
          style={styles.infoCard}
        >
          <Text style={styles.infoEmoji}>🍴</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>
              Eating window: <Text style={styles.infoValue}>{formatWindow(eatingWindowHours)}</Text>
            </Text>
          </View>
        </Animated.View>

        {/* Tip */}
        <Animated.View
          entering={FadeIn.delay(600).duration(400)}
          style={styles.tipCard}
        >
          <Ionicons name="bulb-outline" size={18} color={COLORS.orange} />
          <Text style={styles.tipText}>
            Eating within an <Text style={styles.tipBold}>8-10 hour window</Text> may support overall health.
          </Text>
        </Animated.View>
      </ScrollView>

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
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.massive + SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  progressContainer: {
    marginBottom: SPACING.xl,
  },
  // Question bubble
  questionSection: {
    marginBottom: SPACING.xl,
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
  // Info card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginTop: SPACING.base,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  infoEmoji: {
    fontSize: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  // Tip
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 152, 0, 0.08)',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginTop: SPACING.md,
    gap: SPACING.sm,
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
