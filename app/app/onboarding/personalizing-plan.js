import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Reanimated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ReanimatedCircle = Reanimated.createAnimatedComponent(Circle);

const CHECKLIST_ITEMS = [
  'Analyzing your answers',
  'Defining nutrient requirements',
  'Estimating weight progress',
  'Adjusting nutrition tips',
];

const REVIEW_CARDS = [
  {
    name: 'Sarah M.',
    stars: 5,
    text: 'Lost 8 kg in 3 months! The personalized plan made all the difference.',
  },
  {
    name: 'James K.',
    stars: 5,
    text: 'Finally an app that understands my eating habits. Love the fox buddy!',
  },
  {
    name: 'Priya R.',
    stars: 5,
    text: 'The calorie tracking is so easy with the AI camera feature. Highly recommend!',
  },
  {
    name: 'Mike T.',
    stars: 4,
    text: 'Great app for building healthy habits. The fasting timer is super helpful.',
  },
];

const CIRCLE_SIZE = 180;
const STROKE_WIDTH = 12;
const RADIUS_CIRCLE = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS_CIRCLE;

function ProgressRing({ progress }) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 500,
      easing: Easing.linear,
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCUMFERENCE * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={ringStyles.container}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS_CIRCLE}
          stroke={COLORS.border}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <ReanimatedCircle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS_CIRCLE}
          stroke={COLORS.primary}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
        />
      </Svg>
      <View style={ringStyles.centerText}>
        <Text style={ringStyles.percentage}>{Math.round(progress * 100)}%</Text>
      </View>
    </View>
  );
}

function ReviewCard({ item }) {
  return (
    <View style={reviewStyles.card}>
      <View style={reviewStyles.starsRow}>
        {Array.from({ length: item.stars }).map((_, i) => (
          <Ionicons key={i} name="star" size={16} color={COLORS.star} />
        ))}
      </View>
      <Text style={reviewStyles.text}>{item.text}</Text>
      <Text style={reviewStyles.name}>- {item.name}</Text>
    </View>
  );
}

export default function PersonalizingPlanScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const totalDuration = 8000;
    const step = 50;
    const increment = step / totalDuration;
    let currentProgress = 0;

    intervalRef.current = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 1) {
        currentProgress = 1;
        clearInterval(intervalRef.current);
        setTimeout(() => {
          router.push('/onboarding/personal-plan-ready');
        }, 500);
      }
      setProgress(currentProgress);
    }, step);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timers = CHECKLIST_ITEMS.map((_, index) =>
      setTimeout(() => {
        setCheckedItems((prev) => [...prev, index]);
      }, (index + 1) * 2000)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const renderReviewCard = ({ item }) => <ReviewCard item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Personalizing plan</Text>

        <ProgressRing progress={progress} />

        <View style={styles.checklist}>
          {CHECKLIST_ITEMS.map((item, index) => {
            const isChecked = checkedItems.includes(index);
            return (
              <View key={index} style={styles.checklistItem}>
                <View
                  style={[
                    styles.checkCircle,
                    isChecked && styles.checkCircleChecked,
                  ]}
                >
                  {isChecked && (
                    <Ionicons name="checkmark" size={14} color={COLORS.white} />
                  )}
                </View>
                <Text
                  style={[
                    styles.checklistText,
                    isChecked && styles.checklistTextChecked,
                  ]}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.carouselSection}>
        <FlatList
          data={REVIEW_CARDS}
          renderItem={renderReviewCard}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SCREEN_WIDTH * 0.75 + SPACING.md}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
        />
      </View>
    </SafeAreaView>
  );
}

const ringStyles = StyleSheet.create({
  container: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 36,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
});

const reviewStyles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginRight: SPACING.md,
    ...SHADOWS.card,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: SPACING.sm,
  },
  text: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: COLORS.textMuted,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF3E8' },
  content: {
    flex: 1,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginTop: SPACING.xxl,
  },
  checklist: {
    width: '100%',
    gap: SPACING.base,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.inactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checklistText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.medium,
    color: COLORS.textMuted,
  },
  checklistTextChecked: {
    color: COLORS.textPrimary,
    fontWeight: FONTS.semiBold,
  },
  carouselSection: {
    paddingBottom: SPACING.huge,
  },
  carouselContent: {
    paddingHorizontal: SPACING.xl,
  },
});
