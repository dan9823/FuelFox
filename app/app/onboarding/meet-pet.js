import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  FadeIn,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { FoxAvatar } from '../../src/components';

export default function MeetPetScreen() {
  const router = useRouter();
  const { } = useOnboarding();
  const timerRef = useRef(null);
  const bounceY = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);

  useEffect(() => {
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1,
      false
    );

    sparkleOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );

    timerRef.current = setTimeout(() => {
      router.push('/onboarding/pet-reveal');
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const handleTap = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    router.push('/onboarding/pet-reveal');
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.black} />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Sparkles */}
          <Animated.Text style={[styles.sparkles, sparkleStyle]}>
            ✨
          </Animated.Text>

          {/* Big bold centered text */}
          <Animated.Text
            entering={FadeIn.duration(500)}
            style={styles.title}
          >
            Let's meet your{'\n'}virtual pet!
          </Animated.Text>

          {/* Bouncing pet emoji */}
          <Animated.View style={[styles.petContainer, bounceStyle]}>
            <FoxAvatar mood="happy" size={120} />
          </Animated.View>

          <Animated.Text style={[styles.sparklesBottom, sparkleStyle]}>
            ✨    ✨
          </Animated.Text>

          {/* Tip card */}
          <Animated.View
            entering={FadeIn.delay(300).duration(500)}
            style={styles.tipCard}
          >
            <View style={styles.tipBadge}>
              <Text style={styles.tipBadgeText}>5x</Text>
            </View>
            <Text style={styles.tipText}>
              Gamification makes habits stick for up to{' '}
              <Text style={styles.tipBold}>5x longer</Text>
            </Text>
          </Animated.View>
        </View>

        {/* Tap hint */}
        <View style={styles.bottomHint}>
          <Text style={styles.hintText}>Tap anywhere to continue</Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  sparkles: {
    fontSize: 28,
    marginBottom: SPACING.md,
  },
  sparklesBottom: {
    fontSize: 24,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 40,
  },
  petContainer: {
    marginBottom: SPACING.sm,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    width: '100%',
    ...SHADOWS.card,
  },
  tipBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipBadgeText: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
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
  bottomHint: {
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
  },
  hintText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
  },
});
