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
  withDelay,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { FoxAvatar } from '../../src/components';

export default function EatingHabitsIntroScreen() {
  const router = useRouter();
  const { } = useOnboarding();

  // Floating question marks
  const q1Y = useSharedValue(0);
  const q2Y = useSharedValue(0);
  const q3Y = useSharedValue(0);

  useEffect(() => {
    q1Y.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
    q2Y.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 1200 }),
          withTiming(0, { duration: 1200 })
        ),
        -1,
        true
      )
    );
    q3Y.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 900 }),
          withTiming(0, { duration: 900 })
        ),
        -1,
        true
      )
    );
  }, []);

  const q1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: q1Y.value }],
  }));
  const q2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: q2Y.value }],
  }));
  const q3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: q3Y.value }],
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
        <Animated.Text entering={FadeIn.duration(500)} style={styles.title}>
          Now let's talk about{'\n'}your eating habits
        </Animated.Text>

        {/* Fox thinking scene */}
        <View style={styles.sceneContainer}>
          {/* Floating question marks */}
          <Animated.Text style={[styles.questionMark, styles.q1, q1Style]}>?</Animated.Text>
          <Animated.Text style={[styles.questionMark, styles.q2, q2Style]}>?</Animated.Text>
          <Animated.Text style={[styles.questionMark, styles.q3, q3Style]}>?</Animated.Text>

          {/* Thought bubbles */}
          <Animated.View
            entering={FadeIn.delay(300).duration(400)}
            style={styles.thoughtBubbles}
          >
            <View style={[styles.thoughtBubble, styles.bubble1]}>
              <Text style={styles.bubbleEmoji}>🍎</Text>
            </View>
            <View style={[styles.thoughtBubble, styles.bubble2]}>
              <Text style={styles.bubbleEmoji}>🍗</Text>
            </View>
            {/* Small connecting bubbles */}
            <View style={[styles.smallBubble, styles.smallBubble1]} />
            <View style={[styles.smallBubble, styles.smallBubble2]} />
          </Animated.View>

          {/* Fox */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.foxContainer}
          >
            <FoxAvatar mood="thinking" size={120} />
          </Animated.View>

          {/* Thinking face overlay */}
          <Animated.Text
            entering={FadeIn.delay(400).duration(300)}
            style={styles.thinkingEmoji}
          >
            🤔
          </Animated.Text>
        </View>
      </View>

      {/* Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push('/onboarding/meals-per-day')}
        >
          <Text style={styles.buttonText}>Let's go</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0E0',
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
    marginBottom: SPACING.xxxl,
    lineHeight: 36,
  },
  sceneContainer: {
    width: 260,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // Floating question marks
  questionMark: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: FONTS.bold,
    color: 'rgba(232, 129, 58, 0.4)',
  },
  q1: { top: 10, left: 20 },
  q2: { top: 30, right: 15 },
  q3: { top: 60, left: 45 },
  // Thought bubbles
  thoughtBubbles: {
    position: 'absolute',
    top: 20,
    width: '100%',
    height: 120,
  },
  thoughtBubble: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  bubble1: { top: 0, right: 40 },
  bubble2: { top: 10, left: 40 },
  bubbleEmoji: { fontSize: 24 },
  smallBubble: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 50,
  },
  smallBubble1: {
    width: 14,
    height: 14,
    top: 55,
    right: 60,
  },
  smallBubble2: {
    width: 10,
    height: 10,
    top: 65,
    left: 75,
  },
  foxContainer: {
    marginTop: SPACING.xxl,
  },
  thinkingEmoji: {
    position: 'absolute',
    bottom: 60,
    right: 70,
    fontSize: 28,
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
