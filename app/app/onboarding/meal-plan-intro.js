import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { useApp } from '../../src/context/AppContext';
import { FoxAvatar } from '../../src/components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const MEAL_EMOJIS = [
  ['🥣', '🍗', '🥗', '🥑'],
  ['🍳', '🥩', '🍝', '🥕'],
  ['🥞', '🌮', '🍲', '🥦'],
  ['🍌', '🍔', '🥘', '🍎'],
  ['🥐', '🐟', '🥙', '🍇'],
];

function CloudDecoration({ style }) {
  return (
    <View style={[styles.cloud, style]}>
      <View style={styles.cloudMain} />
      <View style={styles.cloudLeft} />
      <View style={styles.cloudRight} />
    </View>
  );
}

function MealDayRow({ day, emojis, index }) {
  const opacity = 1 - index * 0.25;
  const scale = 1 - index * 0.08;

  return (
    <Animated.View
      style={[
        styles.dayRow,
        {
          opacity: Math.max(opacity, 0.3),
          transform: [{ scale: Math.max(scale, 0.8) }],
        },
      ]}
    >
      <Text style={styles.dayLabel}>{day}</Text>
      <View style={styles.mealsRow}>
        {emojis.map((emoji, i) => (
          <View key={i} style={styles.mealCircle}>
            <Text style={styles.mealEmoji}>{emoji}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

export default function MealPlanIntroScreen() {
  const router = useRouter();
  const { dailyCalories, macros, weightKg, targetWeightKg, foxName } = useOnboarding();
  const { setUser, setGoals } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigateToTabs();
  };

  const handleExplore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigateToTabs();
  };

  const navigateToTabs = () => {
    // Transfer onboarding data to app context
    setUser({ foxName });
    setGoals({
      calories: dailyCalories || 2000,
      carbsG: macros?.carbsG || 250,
      fatsG: macros?.fatsG || 56,
      proteinsG: macros?.proteinsG || 125,
      targetWeight: targetWeightKg,
    });
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Cloud decorations */}
        <CloudDecoration style={{ top: 60, right: -30 }} />
        <CloudDecoration style={{ top: 120, left: -40 }} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* New feature badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>New feature</Text>
          </View>

          <Text style={styles.title}>Your personal{'\n'}meal plan</Text>
          <Text style={styles.subtitle}>
            Tailored to your {dailyCalories?.toLocaleString() || '2,000'} kcal goal
          </Text>

          {/* Fox peeking */}
          <View style={styles.foxPeek}>
            <FoxAvatar mood="excited" size={120} />
          </View>

          {/* Meal plan preview */}
          <View style={styles.mealPlanCard}>
            {DAYS.slice(0, 3).map((day, index) => (
              <MealDayRow
                key={day}
                day={day}
                emojis={MEAL_EMOJIS[index]}
                index={index}
              />
            ))}
          </View>
        </Animated.View>

        {/* Explore button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.exploreButton}
            activeOpacity={0.8}
            onPress={handleExplore}
          >
            <Text style={styles.exploreButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4EEFF',
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: SPACING.xl,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  cloud: {
    position: 'absolute',
    zIndex: 0,
  },
  cloudMain: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  cloudLeft: {
    position: 'absolute',
    left: 15,
    top: -15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  cloudRight: {
    position: 'absolute',
    right: 20,
    top: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SPACING.massive + SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  badge: {
    backgroundColor: '#64B5F6',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    marginBottom: SPACING.md,
  },
  badgeText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  title: {
    fontSize: FONTS.hero + 4,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  foxPeek: {
    marginBottom: -SPACING.xxl,
    zIndex: 5,
  },
  mealPlanCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  dayLabel: {
    width: 40,
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: '#64B5F6',
  },
  mealsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flex: 1,
  },
  mealCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  mealEmoji: {
    fontSize: 28,
  },
  bottomSection: {
    paddingHorizontal: SPACING.xxxl + SPACING.xxl,
    paddingBottom: SPACING.huge,
    paddingTop: SPACING.lg,
  },
  exploreButton: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonHeight / 2,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  exploreButtonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
