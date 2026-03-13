import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle as SvgCircle, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { useApp } from '../../src/context/AppContext';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../../src/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - SPACING.base * 4;
const CHART_HEIGHT = 160;

// ------------------------------------------------------------------
//  Circular progress ring
// ------------------------------------------------------------------
function ProgressRing({ size = 140, strokeWidth = 12, progress = 0, color = COLORS.primary, bgColor = COLORS.divider, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - circumference * Math.min(progress, 1);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {children}
    </View>
  );
}

// ------------------------------------------------------------------
//  Empty chart placeholder (rounded rectangle outlines)
// ------------------------------------------------------------------
function EmptyChartPlaceholder() {
  return (
    <View style={styles.emptyChartRow}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.emptyChartBox} />
      ))}
    </View>
  );
}

// ------------------------------------------------------------------
//  Placeholder chart (simple line chart with labels)
// ------------------------------------------------------------------
function PlaceholderChart() {
  const padLeft = 30;
  const padBottom = 20;
  const w = CHART_WIDTH - padLeft;
  const h = CHART_HEIGHT - padBottom;

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {/* Horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <Line
          key={`h-${pct}`}
          x1={padLeft}
          y1={h - h * pct}
          x2={CHART_WIDTH}
          y2={h - h * pct}
          stroke={COLORS.divider}
          strokeWidth={1}
        />
      ))}

      {/* Day labels */}
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
        <SvgText
          key={day}
          x={padLeft + (w / 6) * i}
          y={CHART_HEIGHT - 2}
          fontSize={10}
          fill={COLORS.textMuted}
          textAnchor="middle"
        >
          {day}
        </SvgText>
      ))}

      {/* Placeholder dashed line */}
      <Line
        x1={padLeft}
        y1={h * 0.5}
        x2={CHART_WIDTH}
        y2={h * 0.5}
        stroke={COLORS.inactive}
        strokeWidth={2}
        strokeDasharray="6,4"
      />
    </Svg>
  );
}

// ------------------------------------------------------------------
//  Main statistics screen
// ------------------------------------------------------------------
export default function StatisticsScreen() {
  const { dailyLog, goals, streak } = useApp();

  const hasData = dailyLog.meals.length > 0 || dailyLog.waterMl > 0 || dailyLog.weight !== null;
  const calPct = goals.calories > 0 ? dailyLog.calories / goals.calories : 0;
  const waterPct = goals.waterMl > 0 ? dailyLog.waterMl / goals.waterMl : 0;

  // Macro averages (just today for now)
  const carbsPct = goals.carbsG > 0 ? Math.round((dailyLog.carbs / goals.carbsG) * 100) : 0;
  const fatsPct = goals.fatsG > 0 ? Math.round((dailyLog.fats / goals.fatsG) * 100) : 0;
  const proteinsPct = goals.proteinsG > 0 ? Math.round((dailyLog.proteins / goals.proteinsG) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Statistics</Text>

        {!hasData ? (
          /* ---- Empty state ---- */
          <View style={styles.emptyState}>
            <ProgressRing
              size={160}
              strokeWidth={14}
              progress={0}
              color={COLORS.inactive}
              bgColor={COLORS.divider}
            >
              <Text style={styles.emptyRingText}>0%</Text>
            </ProgressRing>

            {/* Colored mini-bars row */}
            <View style={styles.emptyMiniBarRow}>
              {[COLORS.primary, COLORS.error, COLORS.orange, COLORS.water, COLORS.fasting].map((c, i) => (
                <View key={i} style={[styles.emptyMiniBar, { backgroundColor: c }]} />
              ))}
            </View>

            {/* Rounded rectangle placeholders */}
            <EmptyChartPlaceholder />

            {/* Log message with decorative stars */}
            <View style={styles.emptyMessageContainer}>
              <Text style={styles.emptyStarLeft}>✦</Text>
              <View style={styles.emptyMessageInner}>
                <Text style={styles.emptyMessage}>
                  Log{' '}
                  <Text style={styles.emptyHighlight}>3 days</Text>
                  {'\n'}to see statistics!
                </Text>
              </View>
              <Text style={styles.emptyStarRight}>✦</Text>
            </View>
          </View>
        ) : (
          /* ---- Data state ---- */
          <View>
            {/* Calorie progress ring */}
            <View style={styles.mainRingSection}>
              <ProgressRing
                size={160}
                strokeWidth={14}
                progress={calPct}
                color={calPct >= 1 ? COLORS.success : COLORS.primary}
                bgColor={COLORS.divider}
              >
                <View style={styles.ringContent}>
                  <Text style={styles.ringPct}>{Math.round(calPct * 100)}%</Text>
                  <Text style={styles.ringLabel}>of daily goal</Text>
                </View>
              </ProgressRing>
            </View>

            {/* Streak card */}
            <View style={styles.card}>
              <View style={styles.streakRow}>
                <View style={styles.streakIconBg}>
                  <Text style={{ fontSize: 24 }}>🔥</Text>
                </View>
                <View style={styles.streakInfo}>
                  <Text style={styles.streakValue}>{streak} day streak</Text>
                  <Text style={styles.streakSub}>Keep logging meals to maintain your streak!</Text>
                </View>
              </View>
            </View>

            {/* Weight chart placeholder */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Weight trend</Text>
              {dailyLog.weight ? (
                <View style={styles.weightChartSection}>
                  <Text style={styles.weightBig}>{Number.isInteger(dailyLog.weight) ? dailyLog.weight : dailyLog.weight.toFixed(1)} kg</Text>
                  <PlaceholderChart />
                  <Text style={styles.chartNote}>More data points needed for a trend line</Text>
                </View>
              ) : (
                <View style={styles.emptyCardContent}>
                  <PlaceholderChart />
                  <Text style={styles.chartNote}>Log your weight to start tracking trends</Text>
                </View>
              )}
            </View>

            {/* Calorie trends */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Calorie trends</Text>
              <View style={styles.trendRow}>
                <View style={styles.trendItem}>
                  <Text style={styles.trendValue}>{dailyLog.calories}</Text>
                  <Text style={styles.trendLabel}>Eaten</Text>
                </View>
                <View style={styles.trendDivider} />
                <View style={styles.trendItem}>
                  <Text style={[styles.trendValue, { color: COLORS.primary }]}>
                    {Math.max(0, goals.calories - dailyLog.calories)}
                  </Text>
                  <Text style={styles.trendLabel}>Remaining</Text>
                </View>
                <View style={styles.trendDivider} />
                <View style={styles.trendItem}>
                  <Text style={styles.trendValue}>{goals.calories}</Text>
                  <Text style={styles.trendLabel}>Goal</Text>
                </View>
              </View>
              <PlaceholderChart />
            </View>

            {/* Macro averages */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Macro averages</Text>

              <View style={styles.macroAvgRow}>
                <MacroAvgItem label="Carbs" pct={carbsPct} color={COLORS.primary} value={`${dailyLog.carbs}g`} />
                <MacroAvgItem label="Fat" pct={fatsPct} color={COLORS.orange} value={`${dailyLog.fats}g`} />
                <MacroAvgItem label="Protein" pct={proteinsPct} color={COLORS.fasting} value={`${dailyLog.proteins}g`} />
              </View>
            </View>

            {/* Water stats */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Water intake</Text>
              <View style={styles.waterStatsRow}>
                <ProgressRing
                  size={70}
                  strokeWidth={7}
                  progress={waterPct}
                  color={COLORS.water}
                  bgColor={COLORS.waterLight}
                >
                  <Text style={styles.waterStatPct}>{Math.round(waterPct * 100)}%</Text>
                </ProgressRing>
                <View style={styles.waterStatsInfo}>
                  <Text style={styles.waterStatsValue}>{dailyLog.waterMl} ml</Text>
                  <Text style={styles.waterStatsGoal}>of {goals.waterMl} ml goal</Text>
                </View>
              </View>
            </View>

            {/* Fox Insights */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightEmoji}>🦊</Text>
                <Text style={styles.insightTitle}>Ember's Insights</Text>
              </View>
              {(() => {
                const insights = [];
                if (calPct < 0.5 && dailyLog.calories > 0) {
                  insights.push({ icon: '🍽️', text: `You've eaten ${Math.round(calPct * 100)}% of your goal. Don't forget lunch!` });
                }
                if (calPct > 1.1) {
                  insights.push({ icon: '⚠️', text: `You're ${Math.round((calPct - 1) * 100)}% over your calorie goal. Consider a lighter dinner.` });
                }
                if (waterPct < 0.5 && dailyLog.waterMl > 0) {
                  insights.push({ icon: '💧', text: 'Hydration is low. Try drinking a glass of water right now!' });
                }
                if (waterPct >= 1) {
                  insights.push({ icon: '💧', text: 'Great hydration today! Your body thanks you.' });
                }
                if (proteinsPct < 50 && dailyLog.meals.length >= 2) {
                  insights.push({ icon: '💪', text: 'Protein intake is low. Add eggs, chicken, or beans to your next meal.' });
                }
                if (streak >= 3) {
                  insights.push({ icon: '🔥', text: `${streak}-day streak! Consistency is the key to lasting results.` });
                }
                if (insights.length === 0) {
                  insights.push({ icon: '✨', text: 'Start logging meals and water to get personalized insights from Ember!' });
                }
                return insights.slice(0, 3).map((insight, i) => (
                  <View key={i} style={styles.insightRow}>
                    <Text style={styles.insightRowIcon}>{insight.icon}</Text>
                    <Text style={styles.insightRowText}>{insight.text}</Text>
                  </View>
                ));
              })()}
            </View>

            {/* Fox Achievements */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Fox Achievements</Text>
              <View style={styles.achievementsGrid}>
                {[
                  { icon: '🔥', label: 'First Streak', desc: 'Log 3 days in a row', unlocked: streak >= 3 },
                  { icon: '💧', label: 'Hydration Hero', desc: 'Hit water goal', unlocked: waterPct >= 1 },
                  { icon: '🎯', label: 'On Target', desc: 'Hit calorie goal', unlocked: calPct >= 0.9 && calPct <= 1.1 },
                  { icon: '🌅', label: 'Early Bird', desc: 'Log breakfast', unlocked: dailyLog.meals.some(m => (m.type || '').toLowerCase() === 'breakfast') },
                  { icon: '📊', label: 'Data Lover', desc: 'Log weight', unlocked: dailyLog.weight !== null },
                  { icon: '⏱️', label: 'Fasting Pro', desc: 'Complete a fast', unlocked: dailyLog.fastingEndTime !== null },
                ].map((achievement, i) => (
                  <View key={i} style={[styles.achievementItem, !achievement.unlocked && styles.achievementLocked]}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text style={[styles.achievementLabel, !achievement.unlocked && styles.achievementLabelLocked]}>{achievement.label}</Text>
                    <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                    {achievement.unlocked && (
                      <View style={styles.achievementBadge}>
                        <Text style={styles.achievementBadgeText}>Done</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------------
//  Macro average item
// ------------------------------------------------------------------
function MacroAvgItem({ label, pct, color, value }) {
  return (
    <View style={styles.macroAvgItem}>
      <ProgressRing size={56} strokeWidth={5} progress={pct / 100} color={color} bgColor={COLORS.divider}>
        <Text style={[styles.macroAvgPct, { color }]}>{pct}%</Text>
      </ProgressRing>
      <Text style={styles.macroAvgLabel}>{label}</Text>
      <Text style={styles.macroAvgValue}>{value}</Text>
    </View>
  );
}

// ------------------------------------------------------------------
//  Styles
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.base,
  },
  screenTitle: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    marginBottom: SPACING.lg,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  emptyRingText: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.textMuted,
  },
  emptyMiniBarRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  emptyMiniBar: {
    width: 32,
    height: 8,
    borderRadius: 4,
    opacity: 0.3,
  },
  emptyChartRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  emptyChartBox: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.divider,
    backgroundColor: 'transparent',
  },
  emptyMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  emptyMessageInner: {
    alignItems: 'center',
  },
  emptyStarLeft: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: -20,
  },
  emptyStarRight: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 20,
  },
  emptyMessage: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 28,
  },
  emptyHighlight: {
    color: COLORS.primary,
    fontWeight: FONTS.bold,
  },

  // Main ring
  mainRingSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  ringContent: {
    alignItems: 'center',
  },
  ringPct: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  ringLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: -2,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    ...SHADOWS.card,
  },
  cardTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },

  // Streak
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  streakIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakInfo: {
    flex: 1,
  },
  streakValue: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  streakSub: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Weight chart
  weightChartSection: {
    alignItems: 'center',
  },
  weightBig: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  emptyCardContent: {
    alignItems: 'center',
  },
  chartNote: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },

  // Trend
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.base,
  },
  trendItem: {
    alignItems: 'center',
  },
  trendValue: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  trendLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  trendDivider: {
    width: 1,
    backgroundColor: COLORS.divider,
  },

  // Macro averages
  macroAvgRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroAvgItem: {
    alignItems: 'center',
  },
  macroAvgPct: {
    fontSize: FONTS.tiny,
    fontWeight: FONTS.bold,
  },
  macroAvgLabel: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  macroAvgValue: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Water stats
  waterStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  waterStatPct: {
    fontSize: 11,
    fontWeight: FONTS.bold,
    color: COLORS.water,
  },
  waterStatsInfo: {
    flex: 1,
  },
  waterStatsValue: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  waterStatsGoal: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Achievements
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementItem: {
    width: (SCREEN_WIDTH - SPACING.base * 4 - 20) / 3,
    backgroundColor: '#FFF8F0',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  achievementLocked: {
    opacity: 0.45,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.surface,
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  achievementLabel: {
    fontSize: 11,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
  },
  achievementLabelLocked: {
    color: COLORS.textMuted,
  },
  achievementDesc: {
    fontSize: 9,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  achievementBadge: {
    marginTop: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  achievementBadgeText: {
    fontSize: 9,
    fontWeight: FONTS.bold,
    color: '#FFFFFF',
  },

  // Fox Insights
  insightCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: '#FFE8D0',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  insightEmoji: {
    fontSize: 20,
  },
  insightTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  insightRowIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  insightRowText: {
    flex: 1,
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
