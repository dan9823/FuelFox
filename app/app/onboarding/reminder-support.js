import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { FoxAvatar } from '../../src/components';

export default function ReminderSupportScreen() {
  const router = useRouter();
  const { } = useOnboarding();

  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1200 }),
        withTiming(0, { duration: 1200 })
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
        <Ionicons name="chevron-back" size={28} color={COLORS.black} />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Title */}
        <Animated.Text entering={FadeIn.duration(500)} style={styles.title}>
          We'll support you{'\n'}to keep logging
        </Animated.Text>

        {/* Notification card preview */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.notifCard}
        >
          <View style={styles.notifHeader}>
            <View style={styles.notifAvatar}>
              <FoxAvatar mood="happy" size={32} />
            </View>
            <View style={styles.notifTextContainer}>
              <Text style={styles.notifAppName}>FuelFox</Text>
              <Text style={styles.notifMessage}>
                Don't forget to snap your meal! 📸
              </Text>
            </View>
            <Text style={styles.notifTime}>now</Text>
          </View>

          {/* Hearts meter */}
          <View style={styles.heartsRow}>
            <Text style={styles.heartsLabel}>Pet health:</Text>
            <View style={styles.hearts}>
              <Text style={styles.heartIcon}>❤️</Text>
              <Text style={styles.heartIcon}>🤍</Text>
              <Text style={styles.heartIcon}>🤍</Text>
              <Text style={styles.heartIcon}>🤍</Text>
              <Text style={styles.heartIcon}>🤍</Text>
            </View>
            <Text style={styles.heartsCount}>1 left!</Text>
          </View>
        </Animated.View>

        {/* Large fox on rainbow */}
        <Animated.View style={[styles.foxScene, floatStyle]}>
          {/* Rainbow arc */}
          <View style={styles.rainbowContainer}>
            <View style={[styles.rainbowStripe, { backgroundColor: '#FF6B6B', width: 200, height: 100 }]} />
            <View style={[styles.rainbowStripe, { backgroundColor: '#FFD93D', width: 176, height: 88, top: 6 }]} />
            <View style={[styles.rainbowStripe, { backgroundColor: '#6BCB77', width: 152, height: 76, top: 12 }]} />
            <View style={[styles.rainbowStripe, { backgroundColor: '#4D96FF', width: 128, height: 64, top: 18 }]} />
            <View style={[styles.rainbowStripe, { backgroundColor: '#9B59B6', width: 104, height: 52, top: 24 }]} />
            <View style={[styles.rainbowStripe, { backgroundColor: '#FFE4E1', width: 80, height: 40, top: 30 }]} />
          </View>
          <FoxAvatar mood="waving" size={140} />
        </Animated.View>
      </View>

      {/* Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push('/onboarding/reminder-preferences')}
        >
          <Text style={styles.buttonText}>Set up reminders  &gt;</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.massive + SPACING.xxl,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 36,
  },
  // Notification card
  notifCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    ...SHADOWS.card,
    marginBottom: SPACING.xxl,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  notifAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  notifTextContainer: {
    flex: 1,
  },
  notifAppName: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  notifMessage: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.black,
    lineHeight: 22,
  },
  notifTime: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
  },
  heartsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  heartsLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  hearts: {
    flexDirection: 'row',
    gap: 2,
  },
  heartIcon: { fontSize: 16 },
  heartsCount: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.error,
    marginLeft: 'auto',
  },
  // Fox on rainbow
  foxScene: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  rainbowContainer: {
    width: 200,
    height: 100,
    alignItems: 'center',
    position: 'relative',
    marginBottom: -20,
  },
  rainbowStripe: {
    position: 'absolute',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    alignSelf: 'center',
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
