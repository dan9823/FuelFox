import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onboardingCarouselPages } from '../src/constants/onboardingData';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../src/constants/theme';
import { FoxAvatar } from '../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Illustration card content for each page
function TrackCaloriesCard() {
  return (
    <View style={cardStyles.container}>
      {/* Plate illustration */}
      <View style={cardStyles.plateOuter}>
        <View style={cardStyles.plateInner}>
          <View style={[cardStyles.foodItem, { backgroundColor: '#F5A860', top: 15, left: 20 }]}>
            <Text style={cardStyles.foodEmoji}>🥦</Text>
          </View>
          <View style={[cardStyles.foodItem, { backgroundColor: '#FF9800', top: 10, right: 20 }]}>
            <Text style={cardStyles.foodEmoji}>🍗</Text>
          </View>
          <View style={[cardStyles.foodItem, { backgroundColor: '#FFC107', bottom: 15, left: 30 }]}>
            <Text style={cardStyles.foodEmoji}>🍚</Text>
          </View>
        </View>
      </View>
      {/* Calorie labels */}
      <View style={cardStyles.labelRow}>
        <View style={[cardStyles.calorieTag, { backgroundColor: '#FFF3E8' }]}>
          <Text style={[cardStyles.calorieText, { color: '#C66A28' }]}>120 kcal</Text>
        </View>
        <View style={[cardStyles.calorieTag, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[cardStyles.calorieText, { color: '#E65100' }]}>250 kcal</Text>
        </View>
        <View style={[cardStyles.calorieTag, { backgroundColor: '#FFF8E1' }]}>
          <Text style={[cardStyles.calorieText, { color: '#F57F17' }]}>180 kcal</Text>
        </View>
      </View>
      {/* Fox peeking from bottom */}
      <View style={cardStyles.foxPeek}>
        <FoxAvatar size={100} mood="peeking" />
      </View>
    </View>
  );
}

function StayHydratedCard() {
  const glasses = [0.9, 0.75, 0.6, 0.45, 0.3, 0.15, 0, 0];
  return (
    <View style={[cardStyles.container, { backgroundColor: '#E3F2FD' }]}>
      {/* Fox swimming */}
      <View style={{ marginBottom: SPACING.md }}>
        <FoxAvatar size={110} mood="excited" />
      </View>
      <View style={cardStyles.glassesRow}>
        {glasses.map((fill, i) => (
          <View key={i} style={cardStyles.glass}>
            <View style={cardStyles.glassOutline}>
              {fill > 0 && (
                <View
                  style={[
                    cardStyles.glassFill,
                    { height: `${fill * 100}%` },
                  ]}
                />
              )}
            </View>
            {fill > 0 && <Text style={cardStyles.checkmark}>✓</Text>}
          </View>
        ))}
      </View>
      <View style={cardStyles.waterGoalBar}>
        <View style={cardStyles.waterGoalFillTrack}>
          <View style={[cardStyles.waterGoalFill, { width: '75%' }]} />
        </View>
        <Text style={cardStyles.waterGoalText}>6/8 glasses</Text>
      </View>
    </View>
  );
}

function EnjoyFastingCard() {
  return (
    <View style={cardStyles.container}>
      {/* Fasting timer UI */}
      <View style={cardStyles.fastingTimerBar}>
        <Text style={cardStyles.fastingTimerLabel}>Fasting</Text>
        <Text style={cardStyles.fastingTimerTime}>00:01:20</Text>
      </View>
      {/* Fox sleeping on grass */}
      <View style={cardStyles.grassScene}>
        <View style={cardStyles.grassBg} />
        <FoxAvatar size={120} mood="sleeping" />
      </View>
    </View>
  );
}

function SeeResultsCard() {
  return (
    <View style={cardStyles.container}>
      {/* Fox with heart eyes */}
      <View style={{ marginBottom: SPACING.sm }}>
        <FoxAvatar size={110} mood="love" />
      </View>
      {/* Weight chart */}
      <View style={cardStyles.chartContainer}>
        <View style={cardStyles.chartYAxis}>
          <Text style={cardStyles.chartLabel}>80kg</Text>
          <Text style={cardStyles.chartLabel}>75kg</Text>
          <Text style={cardStyles.chartLabel}>70kg</Text>
        </View>
        <View style={cardStyles.chartArea}>
          {/* Simplified line chart with dots */}
          <View style={cardStyles.chartLine}>
            <View style={[cardStyles.chartDot, { top: 10, left: '5%' }]} />
            <View style={[cardStyles.chartDot, { top: 20, left: '20%' }]} />
            <View style={[cardStyles.chartDot, { top: 30, left: '35%' }]} />
            <View style={[cardStyles.chartDot, { top: 35, left: '50%' }]} />
            <View style={[cardStyles.chartDot, { top: 50, left: '65%' }]} />
            <View style={[cardStyles.chartDot, { top: 60, left: '80%' }]} />
            <View style={[cardStyles.chartDotGreen, { top: 70, left: '95%' }]} />
          </View>
          {/* Trend line */}
          <View style={cardStyles.trendLine} />
        </View>
      </View>
      <View style={cardStyles.resultBadge}>
        <Text style={cardStyles.resultBadgeText}>-5.2 kg in 4 weeks</Text>
      </View>
    </View>
  );
}

function FeelTheLoveCard() {
  return (
    <View style={cardStyles.container}>
      {/* Macro header */}
      <Text style={cardStyles.macroHeading}>What a well-balanced plate! Good job!</Text>
      {/* Macro progress bar */}
      <View style={cardStyles.macroSection}>
        <View style={cardStyles.macroRow}>
          <Text style={cardStyles.macroLabel}>Protein</Text>
          <View style={cardStyles.macroBarTrack}>
            <View style={[cardStyles.macroBarFill, { width: '70%', backgroundColor: '#E8813A' }]} />
          </View>
          <Text style={cardStyles.macroValue}>84g</Text>
        </View>
        <View style={cardStyles.macroRow}>
          <Text style={cardStyles.macroLabel}>Carbs</Text>
          <View style={cardStyles.macroBarTrack}>
            <View style={[cardStyles.macroBarFill, { width: '55%', backgroundColor: '#FF9800' }]} />
          </View>
          <Text style={cardStyles.macroValue}>132g</Text>
        </View>
        <View style={cardStyles.macroRow}>
          <Text style={cardStyles.macroLabel}>Fat</Text>
          <View style={cardStyles.macroBarTrack}>
            <View style={[cardStyles.macroBarFill, { width: '40%', backgroundColor: '#F44336' }]} />
          </View>
          <Text style={cardStyles.macroValue}>45g</Text>
        </View>
      </View>
      {/* Fox in circle */}
      <View style={cardStyles.foxCircle}>
        <FoxAvatar size={60} mood="happy" />
      </View>
    </View>
  );
}

const PAGE_CARDS = {
  track: TrackCaloriesCard,
  hydrate: StayHydratedCard,
  fasting: EnjoyFastingCard,
  results: SeeResultsCard,
  pet: FeelTheLoveCard,
};

function CarouselPage({ item }) {
  const CardContent = PAGE_CARDS[item.key];
  return (
    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
      <View style={styles.illustrationCard}>
        <CardContent />
      </View>
      <Text style={styles.pageTitle}>{item.title}</Text>
      <Text style={styles.pageSubtitle}>{item.subtitle}</Text>
    </View>
  );
}

export default function OnboardingCarouselScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLast = currentIndex === onboardingCarouselPages.length - 1;

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (isLast) {
      router.push('/onboarding/referral');
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Top bar: back button + dots */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backArrow}>{'<'}</Text>
          </TouchableOpacity>
          <View style={styles.dotsContainer}>
            {onboardingCarouselPages.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
          <View style={styles.backButton} />
        </View>

        {/* Carousel */}
        <FlatList
          ref={flatListRef}
          data={onboardingCarouselPages}
          renderItem={({ item }) => <CarouselPage item={item} />}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />

        {/* Bottom button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              Next {'>'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  // Track Calories card
  plateOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
  },
  plateInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  foodItem: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodEmoji: {
    fontSize: 20,
  },
  labelRow: {
    flexDirection: 'row',
    gap: 8,
  },
  calorieTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  calorieText: {
    fontSize: 12,
    fontWeight: '700',
  },
  // Fox additions
  foxPeek: {
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
  },
  foxCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  macroHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A2E',
    textAlign: 'left',
    width: '100%',
    marginBottom: 10,
  },
  grassScene: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    width: '100%',
  },
  grassBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#E8813A',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  fastingTimerBar: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  fastingTimerLabel: {
    fontSize: 14,
    color: '#9E9EB0',
    fontWeight: '500',
  },
  fastingTimerTime: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  // Stay Hydrated card
  glassesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.base,
  },
  glass: {
    alignItems: 'center',
  },
  glassOutline: {
    width: 28,
    height: 44,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#90CAF9',
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  glassFill: {
    width: '100%',
    backgroundColor: '#42A5F5',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  checkmark: {
    fontSize: 10,
    color: '#E8813A',
    fontWeight: '700',
    marginTop: 2,
  },
  waterGoalBar: {
    width: '100%',
    alignItems: 'center',
    gap: 6,
  },
  waterGoalFillTrack: {
    width: '80%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E3F2FD',
  },
  waterGoalFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#42A5F5',
  },
  waterGoalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976D2',
  },
  // Enjoy Fasting card
  timerCircleOuter: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  timerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: '#7E57C2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  timerNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  timerLabel: {
    fontSize: 13,
    color: '#6B6B80',
    marginTop: 2,
  },
  timerArcSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arcDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  arcLabel: {
    fontSize: 12,
    color: '#6B6B80',
    marginRight: 8,
  },
  fastingInfo: {
    alignItems: 'center',
  },
  fastingProtocol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  fastingDesc: {
    fontSize: 13,
    color: '#6B6B80',
    marginTop: 2,
  },
  // See Results card
  chartContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 120,
    marginBottom: SPACING.md,
  },
  chartYAxis: {
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  chartLabel: {
    fontSize: 11,
    color: '#9E9EB0',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chartDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8813A',
  },
  chartDotGreen: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E8813A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  trendLine: {
    position: 'absolute',
    top: 10,
    left: '5%',
    right: '5%',
    height: 2,
    backgroundColor: '#F5A860',
    transform: [{ rotate: '25deg' }],
  },
  resultBadge: {
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resultBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C66A28',
  },
  // Feel the Love card
  macroSection: {
    width: '100%',
    gap: 10,
    marginBottom: SPACING.base,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroLabel: {
    width: 50,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B6B80',
  },
  macroBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F0F0F5',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  macroValue: {
    width: 35,
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'right',
  },
  foodPhotoPlaceholder: {
    width: 120,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  foodPhotoEmoji: {
    fontSize: 36,
  },
  aiLabel: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#E8813A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  aiLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: COLORS.black,
    width: 24,
  },
  dotInactive: {
    backgroundColor: '#D1D1DE',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  illustrationCard: {
    width: SCREEN_WIDTH - 64,
    height: 340,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  pageTitle: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  pageSubtitle: {
    fontSize: FONTS.body,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.base,
  },
  bottomSection: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: COLORS.black,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
