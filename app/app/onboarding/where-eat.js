import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import ProgressBar from '../../src/components/ProgressBar';
import CheckboxCard from '../../src/components/CheckboxCard';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

const locationOptions = [
  { id: 'cook', emoji: '🍲', label: 'Cook at home' },
  { id: 'delivery', emoji: '🏪', label: 'Order delivery' },
  { id: 'eat_out', emoji: '🥡', label: 'Eat out' },
];

export default function WhereEatScreen() {
  const router = useRouter();
  const { eatingLocation, updateField } = useOnboarding();
  const navTimerRef = useRef(null);

  const handleSelect = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateField('eatingLocation', id);

    // Auto-navigate after short delay
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(() => {
      router.push('/onboarding/diet-type');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (navTimerRef.current) clearTimeout(navTimerRef.current);
          router.back();
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color={COLORS.black} />
      </TouchableOpacity>

      <View style={styles.inner}>
        {/* Progress bar */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.progressContainer}>
          <ProgressBar progress={0.5} height={6} color={COLORS.primary} />
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
                Where do you usually eat?
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Options */}
        <View style={styles.options}>
          {locationOptions.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(200 + index * 100).duration(400)}
            >
              <CheckboxCard
                label={item.label}
                emoji={item.emoji}
                selected={eatingLocation === item.id}
                onPress={() => handleSelect(item.id)}
              />
            </Animated.View>
          ))}
        </View>
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
  // Options
  options: {
    gap: SPACING.md,
  },
});
