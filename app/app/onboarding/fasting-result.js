import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FastingResultScreen() {
  const router = useRouter();
  const { fastingHours, eatingWindowHours } = useOnboarding();

  const displayFasting = fastingHours || 12;
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color={COLORS.white} />
      </TouchableOpacity>

      {/* Night sky gradient background */}
      <LinearGradient
        colors={['#0D1B3E', '#1A2F5A', '#2D4A7A', '#3D6B4F', '#4A8B3F']}
        locations={[0, 0.3, 0.55, 0.75, 1]}
        style={styles.gradientBg}
      >
        <View style={styles.content}>
          {/* Stars */}
          <View style={styles.starsContainer}>
            <Text style={styles.starDot}>.</Text>
            <Text style={[styles.starDot, { left: '20%', top: 15 }]}>.</Text>
            <Text style={[styles.starDot, { left: '60%', top: 30 }]}>.</Text>
            <Text style={[styles.starDot, { left: '80%', top: 10 }]}>.</Text>
            <Text style={[styles.starDot, { left: '40%', top: 45 }]}>.</Text>
          </View>

          {/* Title */}
          <Animated.Text entering={FadeIn.duration(500)} style={styles.title}>
            You're already{'\n'}fasting for
          </Animated.Text>

          {/* Big fasting hours number */}
          <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.hoursContainer}>
            <Text style={styles.hoursNumber}>{displayFasting.toFixed(1)}h</Text>
          </Animated.View>

          {/* Sleeping fox */}
          <Animated.View style={[styles.foxContainer, floatStyle]}>
            <FoxAvatar mood="sleeping" size={120} />
            <Text style={styles.sleepEmoji}>💤</Text>
          </Animated.View>

          {/* Green hills at bottom */}
          <View style={styles.hills}>
            <View style={styles.hill1} />
            <View style={styles.hill2} />
          </View>
        </View>

        {/* Info card */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.infoCard}
        >
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>14 h</Text>
            <View style={styles.badgeTag}>
              <Text style={styles.badgeTagText}>Recommended</Text>
            </View>
          </View>
          <Text style={styles.infoText}>
            We've set your goal to match your rhythm and support faster results.
          </Text>
        </Animated.View>

        {/* Buttons */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            onPress={() => router.push('/onboarding/where-eat')}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/where-eat')}
          >
            <Text style={styles.buttonText}>I want to try fasting  &gt;</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B3E',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: SPACING.base,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBg: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.massive + SPACING.xxl,
    position: 'relative',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  starDot: {
    position: 'absolute',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    left: '10%',
    top: 20,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 32,
  },
  hoursContainer: {
    backgroundColor: 'rgba(232, 129, 58, 0.25)',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
  },
  hoursNumber: {
    fontSize: 48,
    fontWeight: FONTS.bold,
    color: '#F5A860',
  },
  foxContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  sleepEmoji: {
    position: 'absolute',
    top: -10,
    right: -20,
    fontSize: 24,
  },
  hills: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  hill1: {
    position: 'absolute',
    bottom: 0,
    left: -20,
    width: SCREEN_WIDTH * 0.7,
    height: 80,
    backgroundColor: '#3D6B4F',
    borderTopRightRadius: 100,
    borderTopLeftRadius: 60,
  },
  hill2: {
    position: 'absolute',
    bottom: 0,
    right: -20,
    width: SCREEN_WIDTH * 0.6,
    height: 60,
    backgroundColor: '#4A8B3F',
    borderTopRightRadius: 60,
    borderTopLeftRadius: 100,
  },
  // Info card
  infoCard: {
    marginHorizontal: SPACING.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  recommendedText: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: '#F5A860',
  },
  badgeTag: {
    backgroundColor: 'rgba(232, 129, 58, 0.3)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  badgeTagText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: '#F5A860',
  },
  infoText: {
    fontSize: FONTS.bodySmall,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
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
    color: 'rgba(255, 255, 255, 0.5)',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#E8813A',
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
