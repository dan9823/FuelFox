import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  FadeIn,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { FoxAvatar } from '../../src/components';

export default function PetRevealScreen() {
  const router = useRouter();
  const { } = useOnboarding();
  const [revealed, setRevealed] = useState(false);

  const lidY = useSharedValue(0);
  const lidRotate = useSharedValue(0);
  const foxY = useSharedValue(40);
  const foxScale = useSharedValue(0);
  const foxOpacity = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  const lidStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: lidY.value },
      { rotate: `${lidRotate.value}deg` },
    ],
  }));

  const foxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: foxY.value },
      { scale: foxScale.value },
    ],
    opacity: foxOpacity.value,
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const nextButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleOpen = () => {
    if (revealed) return;
    setRevealed(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Lid lifts up and tilts
    lidY.value = withTiming(-80, { duration: 500, easing: Easing.out(Easing.back(1.5)) });
    lidRotate.value = withTiming(-15, { duration: 500 });

    // Fox emerges
    foxOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    foxY.value = withDelay(300, withSpring(0, { damping: 8, stiffness: 100 }));
    foxScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));

    // Sparkles appear
    sparkleOpacity.value = withDelay(600, withTiming(1, { duration: 300 }));

    // Next button appears
    buttonOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));
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

      <View style={styles.content}>
        <Animated.Text entering={FadeIn.duration(500)} style={styles.title}>
          {revealed ? 'It\'s a fox!' : 'Open to see\nwho is there'}
        </Animated.Text>

        {!revealed && (
          <Text style={styles.subtitle}>Your new buddy is hiding...</Text>
        )}

        {/* Trash can scene */}
        <View style={styles.sceneContainer}>
          {/* Scattered items around the can */}
          <View style={[styles.scatteredItem, styles.itemTopLeft]}>
            <Text style={styles.scatteredEmoji}>🍌</Text>
          </View>
          <View style={[styles.scatteredItem, styles.itemTopRight]}>
            <Text style={styles.scatteredEmoji}>🍎</Text>
          </View>
          <View style={[styles.scatteredItem, styles.itemBottomLeft]}>
            <Text style={styles.scatteredEmoji}>🐟</Text>
          </View>
          <View style={[styles.scatteredItem, styles.itemBottomRight]}>
            <Text style={styles.scatteredEmoji}>🍃</Text>
          </View>

          {/* Fox behind can */}
          <Animated.View style={[styles.foxContainer, foxStyle]}>
            <FoxAvatar mood="excited" size={160} />
          </Animated.View>

          {/* Fox tail peeking */}
          {!revealed && (
            <View style={styles.tailContainer}>
              {/* Tail made of striped views */}
              <View style={styles.tailSegment}>
                <View style={[styles.tailStripe, { backgroundColor: '#E8813A' }]} />
                <View style={[styles.tailStripe, { backgroundColor: '#C66A28' }]} />
                <View style={[styles.tailStripe, { backgroundColor: '#E8813A' }]} />
                <View style={[styles.tailStripe, { backgroundColor: '#F5C589' }]} />
                <View style={[styles.tailStripe, { backgroundColor: '#FFFFFF' }]} />
              </View>
            </View>
          )}

          {/* Trash can body */}
          <View style={styles.trashCan}>
            {/* Vertical stripes on can */}
            <View style={styles.canStripes}>
              <View style={[styles.canStripe, { left: '20%' }]} />
              <View style={[styles.canStripe, { left: '40%' }]} />
              <View style={[styles.canStripe, { left: '60%' }]} />
              <View style={[styles.canStripe, { left: '80%' }]} />
            </View>
          </View>

          {/* Trash can lid */}
          <Animated.View style={[styles.trashLid, lidStyle]}>
            <View style={styles.lidHandle} />
            <View style={styles.lidBody} />
          </Animated.View>

          {/* Sparkles on reveal */}
          <Animated.View style={[styles.sparklesContainer, sparkleStyle]}>
            <Text style={styles.sparkle1}>✨</Text>
            <Text style={styles.sparkle2}>✨</Text>
            <Text style={styles.sparkle3}>⭐</Text>
          </Animated.View>
        </View>

        {/* Open button */}
        {!revealed && (
          <Animated.View entering={FadeIn.delay(200).duration(400)}>
            <TouchableOpacity
              style={styles.openButton}
              activeOpacity={0.8}
              onPress={handleOpen}
            >
              <Text style={styles.openButtonText}>Open</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Next button - appears after reveal */}
      <Animated.View style={[styles.bottomSection, nextButtonStyle]}>
        {revealed && (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/name-pet')}
          >
            <Text style={styles.buttonText}>Name my buddy</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
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
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  sceneContainer: {
    width: 240,
    height: 280,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: SPACING.xl,
    position: 'relative',
  },
  // Scattered food items
  scatteredItem: {
    position: 'absolute',
    zIndex: 5,
  },
  itemTopLeft: { top: 60, left: 0 },
  itemTopRight: { top: 50, right: 10 },
  itemBottomLeft: { bottom: 20, left: 10 },
  itemBottomRight: { bottom: 30, right: 5 },
  scatteredEmoji: { fontSize: 24 },
  // Fox behind can
  foxContainer: {
    position: 'absolute',
    top: 20,
    zIndex: 4,
    alignItems: 'center',
  },
  // Tail peeking
  tailContainer: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    zIndex: 3,
    transform: [{ rotate: '30deg' }],
  },
  tailSegment: {
    flexDirection: 'row',
    height: 12,
    width: 50,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tailStripe: {
    flex: 1,
    height: '100%',
  },
  // Trash can
  trashCan: {
    width: 120,
    height: 130,
    backgroundColor: '#5BBFBA',
    borderRadius: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    zIndex: 6,
  },
  canStripes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  canStripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#4AA8A3',
  },
  // Trash can lid
  trashLid: {
    position: 'absolute',
    bottom: 125,
    zIndex: 7,
    alignItems: 'center',
  },
  lidHandle: {
    width: 30,
    height: 10,
    backgroundColor: '#4AA8A3',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: -1,
  },
  lidBody: {
    width: 140,
    height: 16,
    backgroundColor: '#5BBFBA',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4AA8A3',
  },
  // Sparkles
  sparklesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  sparkle1: { position: 'absolute', top: 10, left: 20, fontSize: 24 },
  sparkle2: { position: 'absolute', top: 5, right: 25, fontSize: 28 },
  sparkle3: { position: 'absolute', top: 40, left: 50, fontSize: 20 },
  // Open button
  openButton: {
    backgroundColor: COLORS.black,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.pill,
    minWidth: 160,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  openButtonText: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  buttonText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
