import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Polygon, Path, Circle, G, Line } from 'react-native-svg';
import { useApp } from '../../src/context/AppContext';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../../src/constants/theme';

// ------------------------------------------------------------------
//  Gold coin "B" icon component
// ------------------------------------------------------------------
function CoinIcon({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="#F5A623" />
      <Circle cx="12" cy="12" r="9.5" fill="#FFD700" />
      <Path
        d="M10 6v12h2v-4.5h3v-2h-3v-1.5h4v-2h-4V6h-2z"
        fill="#B8860B"
      />
    </Svg>
  );
}

// ------------------------------------------------------------------
//  Hexagonal badge icon component
// ------------------------------------------------------------------
function HexBadge({ iconType, size = 40 }) {
  const hexSize = size;
  const cx = hexSize / 2;
  const cy = hexSize / 2;
  const r = hexSize / 2 - 2;

  // Generate hexagon points
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  const hexPoints = points.join(' ');

  const renderIcon = () => {
    const ic = '#7A7A8A';
    switch (iconType) {
      case 'sun':
        // Sun / gear icon for "Start fresh"
        return (
          <G>
            <Circle cx={cx} cy={cy} r="4" fill={ic} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = cx + 6 * Math.cos(rad);
              const y1 = cy + 6 * Math.sin(rad);
              const x2 = cx + 8 * Math.cos(rad);
              const y2 = cy + 8 * Math.sin(rad);
              return (
                <Line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={ic}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        );
      case 'fork':
        // Fork/knife for "Stay consistent"
        return (
          <G>
            <Path
              d="M14 10v8M14 10c0-2.5 2-4 2-4M14 10c0-2.5-2-4-2-4M14 13h2M14 13h-2"
              stroke={ic}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M22 10l0 3c0 1-0.8 1.5-1.5 1.5H20v3.5"
              stroke={ic}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              transform={`translate(${cx - 18}, ${cy - 14}) scale(0.9)`}
            />
          </G>
        );
      case 'lightning':
        // Lightning bolt for calorie
        return (
          <Path
            d={`M${cx + 1} ${cy - 8}l-4 8h5l-3 8 8-10h-5l3-6z`}
            fill={ic}
          />
        );
      case 'speech':
        // Speech bubble for "Eat mindfully"
        return (
          <G>
            <Path
              d={`M${cx - 7} ${cy - 5}
                 h14 q2 0 2 2 v7 q0 2 -2 2 h-8 l-4 3 v-3 h-2 q-2 0 -2 -2 v-7 q0 -2 2 -2z`}
              fill={ic}
            />
          </G>
        );
      case 'droplet':
        // Water droplet for "Hydration hero"
        return (
          <Path
            d={`M${cx} ${cy - 8}
               c-4 5 -7 9 -7 12 c0 4 3 7 7 7 s7-3 7-7 c0-3 -3-7 -7-12z`}
            fill={ic}
          />
        );
      case 'wheat':
        // Plant/wheat for "Fiber focus"
        return (
          <G>
            <Path
              d={`M${cx} ${cy + 9} v-12`}
              stroke={ic}
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d={`M${cx} ${cy - 1} c-3-2-5-5-4-7 2 0 5 2 4 7z`}
              fill={ic}
            />
            <Path
              d={`M${cx} ${cy - 1} c3-2 5-5 4-7 -2 0-5 2-4 7z`}
              fill={ic}
            />
            <Path
              d={`M${cx} ${cy + 3} c-3-2-5-5-4-7 2 0 5 2 4 7z`}
              fill={ic}
            />
            <Path
              d={`M${cx} ${cy + 3} c3-2 5-5 4-7 -2 0-5 2-4 7z`}
              fill={ic}
            />
          </G>
        );
      case 'scale':
        // Scale / weight icon for "Track progress"
        return (
          <G>
            <Path
              d={`M${cx - 7} ${cy + 5} h14 q2 0 2-2 v-6 q0-2-2-2 h-14 q-2 0-2 2 v6 q0 2 2 2z`}
              fill={ic}
            />
            <Path
              d={`M${cx - 3} ${cy - 1} h6`}
              stroke="#C8C8D0"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <Circle cx={cx + 2} cy={cy - 1} r="1" fill="#C8C8D0" />
          </G>
        );
      case 'moon':
        // Moon for "Fasting flow"
        return (
          <Path
            d={`M${cx + 2} ${cy - 8}
               a9 9 0 1 0 0 16
               a7 7 0 0 1 0-16z`}
            fill={ic}
          />
        );
      case 'flame':
        // Flame for "Keep the streak"
        return (
          <Path
            d={`M${cx} ${cy - 9}
               c0 0 -7 6 -7 11 c0 4 3 7 7 7 s7-3 7-7
               c0-2-1-4-3-5 c0 2-1 3-2 3 c0-3-2-6-2-9z`}
            fill={ic}
          />
        );
      default:
        return <Circle cx={cx} cy={cy} r="6" fill={ic} />;
    }
  };

  return (
    <Svg width={hexSize} height={hexSize} viewBox={`0 0 ${hexSize} ${hexSize}`}>
      <Polygon points={hexPoints} fill="#E8E7EC" />
      {renderIcon()}
    </Svg>
  );
}

// ------------------------------------------------------------------
//  Challenge data
// ------------------------------------------------------------------
const DAILY_CHALLENGES = [
  {
    id: 'd1',
    iconType: 'sun',
    title: 'Start fresh',
    subtitle: 'Log your first meal',
    reward: 15,
    current: 0,
    total: 1,
    type: 'meal_count_any',
  },
  {
    id: 'd2',
    iconType: 'fork',
    title: 'Stay consistent',
    subtitle: 'Log meals 4 times',
    reward: 25,
    current: 0,
    total: 4,
    type: 'meal_count',
  },
  {
    id: 'd3',
    iconType: 'lightning',
    title: 'Calorie balance',
    subtitle: 'Reach 90% of your goal',
    reward: 35,
    current: 0,
    total: 1871,
    type: 'calorie_goal',
  },
  {
    id: 'd4',
    iconType: 'speech',
    title: 'Eat mindfully',
    subtitle: 'Score 70+ on 4 meals',
    reward: 35,
    current: 0,
    total: 4,
    type: 'meal_score',
  },
];

const WEEKLY_CHALLENGES = [
  {
    id: 'w1',
    iconType: 'lightning',
    title: 'Calorie control',
    subtitle: 'Hit your calorie goal 5 days',
    reward: 150,
    current: 0,
    total: 5,
    type: 'calorie_days',
  },
  {
    id: 'w2',
    iconType: 'droplet',
    title: 'Hydration hero',
    subtitle: 'Hit your water goal 5 days',
    reward: 100,
    current: 0,
    total: 5,
    type: 'water_days',
  },
  {
    id: 'w3',
    iconType: 'wheat',
    title: 'Fiber focus',
    subtitle: 'Keep optimal fiber 4 days',
    reward: 200,
    current: 0,
    total: 4,
    type: 'fiber_days',
  },
  {
    id: 'w4',
    iconType: 'scale',
    title: 'Track progress',
    subtitle: 'Log your weight',
    reward: 100,
    current: 0,
    total: 1,
    type: 'weight_log',
  },
  {
    id: 'w5',
    iconType: 'moon',
    title: 'Fasting flow',
    subtitle: 'Reach fasting goal 3 times',
    reward: 100,
    current: 0,
    total: 3,
    type: 'fasting_goal',
  },
  {
    id: 'w6',
    iconType: 'flame',
    title: 'Keep the streak',
    subtitle: 'Stay active 5 days',
    reward: 100,
    current: 0,
    total: 5,
    type: 'streak',
  },
];

// ------------------------------------------------------------------
//  Challenge item row component
// ------------------------------------------------------------------
function ChallengeItem({ iconType, title, subtitle, reward, current, total }) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <View style={styles.challengeItem}>
      <View style={styles.challengeItemLeft}>
        <HexBadge iconType={iconType} size={40} />
      </View>

      <View style={styles.challengeItemCenter}>
        <Text style={styles.challengeItemTitle}>{title}</Text>
        <Text style={styles.challengeItemSubtitle}>{subtitle}</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {current}/{total}
          </Text>
        </View>
      </View>

      <View style={styles.challengeItemRight}>
        <Text style={styles.rewardValue}>{reward}</Text>
        <CoinIcon size={16} />
      </View>
    </View>
  );
}

// ------------------------------------------------------------------
//  Section card component
// ------------------------------------------------------------------
function SectionCard({ title, completedCount, totalCount, timeLeft, challenges, getDynamicProgress }) {
  return (
    <View style={styles.sectionCard}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionHeaderRight}>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {completedCount}/{totalCount}
            </Text>
          </View>
          <Text style={styles.timeLeftText}>{timeLeft}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.sectionDivider} />

      {/* Challenge items */}
      {challenges.map((challenge, index) => {
        const currentProgress = getDynamicProgress
          ? getDynamicProgress(challenge)
          : challenge.current;
        return (
          <React.Fragment key={challenge.id}>
            <ChallengeItem
              iconType={challenge.iconType}
              title={challenge.title}
              subtitle={challenge.subtitle}
              reward={challenge.reward}
              current={currentProgress}
              total={challenge.total}
            />
            {index < challenges.length - 1 && (
              <View style={styles.itemDivider} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ------------------------------------------------------------------
//  Main challenges screen
// ------------------------------------------------------------------
export default function ChallengesScreen() {
  const { coins, dailyLog, streak, challenges, goals } = useApp();

  // Calculate live progress for daily challenges
  const getDailyProgress = useCallback(
    (challenge) => {
      switch (challenge.type) {
        case 'meal_count_any':
          return Math.min(dailyLog.meals.length > 0 ? 1 : 0, challenge.total);
        case 'meal_count':
          return Math.min(dailyLog.meals.length, challenge.total);
        case 'calorie_goal': {
          const target = Math.round(goals.calories * 0.9);
          return Math.min(dailyLog.calories, target);
        }
        case 'meal_score':
          return 0;
        default:
          return 0;
      }
    },
    [dailyLog, goals]
  );

  const getWeeklyProgress = useCallback(
    (challenge) => {
      switch (challenge.type) {
        case 'streak':
          return Math.min(streak, challenge.total);
        case 'weight_log':
          return dailyLog.weight ? 1 : 0;
        default:
          return 0;
      }
    },
    [streak, dailyLog]
  );

  const dailyChallenges =
    challenges.daily.length > 0 ? challenges.daily : DAILY_CHALLENGES;
  const weeklyChallenges =
    challenges.weekly.length > 0 ? challenges.weekly : WEEKLY_CHALLENGES;

  // Count completed for badges
  const dailyCompleted = dailyChallenges.filter((c) => {
    const prog = getDailyProgress(c);
    return prog >= c.total;
  }).length;

  const weeklyCompleted = weeklyChallenges.filter((c) => {
    const prog = getWeeklyProgress(c);
    return prog >= c.total;
  }).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Challenges</Text>
        <View style={styles.coinsPill}>
          <CoinIcon size={20} />
          <Text style={styles.coinsValue}>{coins}</Text>
        </View>
      </View>

      {/* Scrollable content with both sections */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily section */}
        <SectionCard
          title="Daily"
          completedCount={dailyCompleted}
          totalCount={dailyChallenges.length}
          timeLeft="10h left"
          challenges={dailyChallenges}
          getDynamicProgress={getDailyProgress}
        />

        {/* Weekly section */}
        <SectionCard
          title="Weekly"
          completedCount={weeklyCompleted}
          totalCount={weeklyChallenges.length}
          timeLeft="5d left"
          challenges={weeklyChallenges}
          getDynamicProgress={getWeeklyProgress}
        />

        {/* Fox Reward Shop */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fox Rewards</Text>
            <View style={styles.sectionHeaderRight}>
              <View style={styles.coinsPillSmall}>
                <CoinIcon size={14} />
                <Text style={styles.coinsPillSmallText}>{coins}</Text>
              </View>
            </View>
          </View>
          <View style={styles.sectionDivider} />

          <View style={styles.rewardsGrid}>
            {[
              { emoji: '🎩', name: 'Top Hat', cost: 200, desc: 'A dapper look for your fox' },
              { emoji: '🕶️', name: 'Sunglasses', cost: 150, desc: 'Cool shades for sunny days' },
              { emoji: '🧣', name: 'Scarf', cost: 100, desc: 'Stay cozy and stylish' },
              { emoji: '👑', name: 'Crown', cost: 500, desc: 'For true nutrition royalty' },
              { emoji: '🎀', name: 'Bow Tie', cost: 120, desc: 'Fancy fox, fancy feast' },
              { emoji: '🌸', name: 'Flower', cost: 80, desc: 'A spring bloom accessory' },
            ].map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[styles.rewardItem, coins < item.cost && styles.rewardItemLocked]}
                activeOpacity={0.7}
                onPress={() => {
                  if (coins >= item.cost) {
                    Alert.alert(
                      `Get ${item.name}?`,
                      `Spend ${item.cost} coins on ${item.name}?\n\n${item.desc}`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Buy', onPress: () => Alert.alert('Coming Soon', 'Fox accessories will be available in a future update!') },
                      ]
                    );
                  } else {
                    Alert.alert('Not Enough Coins', `You need ${item.cost - coins} more coins to unlock ${item.name}.`);
                  }
                }}
              >
                <Text style={styles.rewardEmoji}>{item.emoji}</Text>
                <Text style={styles.rewardName}>{item.name}</Text>
                <View style={styles.rewardCostRow}>
                  <CoinIcon size={12} />
                  <Text style={[styles.rewardCost, coins < item.cost && styles.rewardCostLocked]}>
                    {item.cost}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom padding for floating tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------------
//  Styles
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.base,
  },
  screenTitle: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  coinsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    gap: 8,
  },
  coinsValue: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
  },

  // Section card
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    ...SHADOWS.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countBadge: {
    backgroundColor: '#F0E6DB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  countBadgeText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
  timeLeftText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.medium,
    color: COLORS.textMuted,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: SPACING.md,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },

  // Challenge item
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeItemLeft: {
    marginRight: SPACING.md,
  },
  challengeItemCenter: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  challengeItemTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.black,
    marginBottom: 2,
  },
  challengeItemSubtitle: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.regular,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.divider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONTS.tiny,
    fontWeight: FONTS.medium,
    color: COLORS.textMuted,
    minWidth: 36,
    textAlign: 'right',
  },

  // Reward
  challengeItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: SPACING.xs,
  },
  rewardValue: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.orangeDark,
  },

  // Fox Rewards Shop
  coinsPillSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    gap: 4,
  },
  coinsPillSmallText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.orangeDark,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rewardItem: {
    width: '31%',
    backgroundColor: '#FFF8F0',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFE0C0',
  },
  rewardItemLocked: {
    opacity: 0.5,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.surface,
  },
  rewardEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  rewardName: {
    fontSize: 11,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  rewardCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rewardCost: {
    fontSize: 11,
    fontWeight: FONTS.bold,
    color: COLORS.orangeDark,
  },
  rewardCostLocked: {
    color: COLORS.textMuted,
  },
});
