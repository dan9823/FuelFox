import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Svg, { Rect } from 'react-native-svg';
import ProgressBar from '../../src/components/ProgressBar';
import SelectionCard from '../../src/components/SelectionCard';
import BackButton from '../../src/components/BackButton';
import QuestionBubble from '../../src/components/QuestionBubble';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

// Bar chart icon component using react-native-svg
function BarChartIcon({ level, color }) {
  const barWidth = 6;
  const gap = 3;
  const maxBars = 4;
  const maxHeight = 24;
  const heights = [6, 12, 18, 24];

  return (
    <Svg width={maxBars * (barWidth + gap) - gap} height={maxHeight}>
      {Array.from({ length: maxBars }).map((_, i) => {
        const filled = i < level;
        return (
          <Rect
            key={i}
            x={i * (barWidth + gap)}
            y={maxHeight - heights[i]}
            width={barWidth}
            height={heights[i]}
            rx={2}
            ry={2}
            fill={filled ? color : '#E0E0E0'}
          />
        );
      })}
    </Svg>
  );
}

const activityOptions = [
  {
    id: 'sedentary',
    label: 'Not active',
    subtitle: 'I quickly lose my breath climbing stairs',
    level: 1,
    color: '#EF5353',
  },
  {
    id: 'lightly_active',
    label: 'Lightly active',
    subtitle: 'Sometimes I do short workouts to keep myself moving',
    level: 2,
    color: '#FFC107',
  },
  {
    id: 'moderately_active',
    label: 'Moderately active',
    subtitle: 'I maintain a regular exercise routine of 1-2 times per week',
    level: 3,
    color: '#E8813A',
  },
  {
    id: 'very_active',
    label: 'Highly active',
    subtitle: 'Fitness is a core part of my lifestyle',
    level: 4,
    color: '#C66A28',
  },
];

export default function ActivityLevelScreen() {
  const router = useRouter();
  const { activityLevel, updateField } = useOnboarding();
  const navTimerRef = useRef(null);

  const handleSelect = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateField('activityLevel', id);

    // Auto-navigate after short delay
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(() => {
      router.push('/onboarding/height-select');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Back button */}
      <View style={styles.backButtonWrapper}>
        <BackButton
          onPress={() => {
            if (navTimerRef.current) clearTimeout(navTimerRef.current);
            router.back();
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.progressContainer}>
          <ProgressBar progress={0.4} height={6} color={COLORS.primary} />
        </Animated.View>

        {/* Question bubble */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.questionSection}
        >
          <QuestionBubble question="What's your activity level?" />
        </Animated.View>

        {/* Activity options */}
        <View style={styles.options}>
          {activityOptions.map((item, index) => {
            const isSelected = activityLevel === item.id;
            return (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(200 + index * 80).duration(400)}
              >
                <SelectionCard
                  label={item.label}
                  icon={<BarChartIcon level={item.level} color={item.color} />}
                  selected={isSelected}
                  onPress={() => handleSelect(item.id)}
                  style={styles.card}
                />
                <Text style={[styles.subtitle, isSelected && styles.subtitleSelected]}>
                  {item.subtitle}
                </Text>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 60,
    left: SPACING.base,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.massive + SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  progressContainer: {
    marginBottom: SPACING.xxl,
  },
  questionSection: {
    marginBottom: SPACING.xl,
  },
  options: {
    gap: SPACING.md,
  },
  card: {
    marginBottom: 0,
  },
  subtitle: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginLeft: SPACING.huge + SPACING.md,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  subtitleSelected: {
    color: COLORS.primaryDark,
  },
});
