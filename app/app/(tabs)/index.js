import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Circle as SvgCircle, Ellipse } from 'react-native-svg';
import { useApp } from '../../src/context/AppContext';
import FoxAvatar from '../../src/components/FoxAvatar';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
  SIZES,
} from '../../src/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = SPACING.base;

// ------------------------------------------------------------------
//  Daily Fox Tips - unique to FuelFox
// ------------------------------------------------------------------
const FOX_TIPS = [
  { emoji: '🦊', tip: 'Drinking water before meals can help reduce appetite by up to 25%.', category: 'Hydration' },
  { emoji: '🔥', tip: 'Your metabolism is highest in the morning. Front-load your calories for better energy.', category: 'Metabolism' },
  { emoji: '🥗', tip: 'Eating slowly gives your brain 20 minutes to register fullness. Savor each bite!', category: 'Mindful Eating' },
  { emoji: '💪', tip: 'Protein keeps you fuller longer. Aim for 25-30g per meal to curb cravings.', category: 'Nutrition' },
  { emoji: '😴', tip: 'Poor sleep increases ghrelin (hunger hormone) by 28%. Prioritize 7-9 hours.', category: 'Recovery' },
  { emoji: '🏃', tip: 'A 10-minute walk after meals can lower blood sugar by up to 22%.', category: 'Activity' },
  { emoji: '🧠', tip: 'Stress eating? Try 5 deep breaths before reaching for a snack.', category: 'Mindfulness' },
  { emoji: '🍎', tip: 'Fiber-rich foods expand in your stomach, keeping you satisfied with fewer calories.', category: 'Nutrition' },
  { emoji: '⏰', tip: 'Eating at consistent times trains your metabolism to burn calories more efficiently.', category: 'Timing' },
  { emoji: '🫐', tip: 'Berries are low-cal superfoods — packed with antioxidants and fiber per calorie.', category: 'Smart Choices' },
];

function getDailyTip() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return FOX_TIPS[dayOfYear % FOX_TIPS.length];
}

// ------------------------------------------------------------------
//  Streak motivational messages
// ------------------------------------------------------------------
function getStreakMessage(streak) {
  if (streak === 0) return { text: "Start logging to begin your streak!", icon: "flame-outline" };
  if (streak === 1) return { text: "Day 1! Every journey begins with a single step.", icon: "footsteps-outline" };
  if (streak <= 3) return { text: `${streak} days strong! Building momentum.`, icon: "trending-up-outline" };
  if (streak <= 7) return { text: `${streak}-day streak! You're on fire!`, icon: "flame" };
  if (streak <= 14) return { text: `${streak} days! Ember is so proud of you!`, icon: "heart" };
  if (streak <= 30) return { text: `${streak}-day streak! You're unstoppable!`, icon: "rocket-outline" };
  return { text: `${streak} days! Legendary dedication!`, icon: "trophy" };
}

// ------------------------------------------------------------------
//  Circular progress ring component
// ------------------------------------------------------------------
const ProgressRing = React.memo(function ProgressRing({ size = 100, strokeWidth = 8, progress = 0, color = COLORS.primary, bgColor = COLORS.divider, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(progress, 1));

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
});

// ------------------------------------------------------------------
//  Mini macro progress bar
// ------------------------------------------------------------------
const MacroMiniBar = React.memo(function MacroMiniBar({ label, current, goal, color }) {
  const pct = goal > 0 ? Math.min(current / goal, 1) : 0;
  return (
    <View style={styles.macroMiniItem}>
      <View style={styles.macroMiniHeader}>
        <Text style={[styles.macroMiniLabel, { color }]}>{label}</Text>
        <Text style={styles.macroMiniValue}>{current}/{goal} g</Text>
      </View>
      <View style={styles.macroMiniBarBg}>
        <View style={[styles.macroMiniBarFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
});

// ------------------------------------------------------------------
//  Water glass icon
// ------------------------------------------------------------------
const WaterGlass = React.memo(function WaterGlass({ filled }) {
  return (
    <View style={[styles.waterGlass, filled && styles.waterGlassFilled]}>
      <Ionicons
        name={filled ? 'water' : 'water-outline'}
        size={20}
        color={filled ? COLORS.water : COLORS.inactive}
      />
    </View>
  );
});

// ------------------------------------------------------------------
//  Main home screen
// ------------------------------------------------------------------
export default function HomeScreen() {
  const router = useRouter();
  const {
    user,
    dailyLog,
    goals,
    streak,
    coins,
    mealPlan,
    ensureTodayLog,
    addWater,
    startFasting,
    stopFasting,
    logWeight,
    logMood,
  } = useApp();

  const [fastingTimer, setFastingTimer] = useState('00:00:00');
  const [fastingProgress, setFastingProgress] = useState(0);
  const fastingIntervalRef = useRef(null);

  useEffect(() => {
    ensureTodayLog();
  }, []);

  // Fasting timer logic
  useEffect(() => {
    if (dailyLog.fastingStartTime && !dailyLog.fastingEndTime) {
      const tick = () => {
        const start = new Date(dailyLog.fastingStartTime).getTime();
        const now = Date.now();
        const diff = Math.max(0, now - start);
        const totalSeconds = Math.floor(diff / 1000);
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        setFastingTimer(
          `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
        const goalMs = goals.fastingHours * 3600 * 1000;
        setFastingProgress(Math.min(diff / goalMs, 1));
      };
      tick();
      fastingIntervalRef.current = setInterval(tick, 1000);
      return () => clearInterval(fastingIntervalRef.current);
    } else {
      setFastingTimer('00:00:00');
      setFastingProgress(0);
    }
  }, [dailyLog.fastingStartTime, dailyLog.fastingEndTime, goals.fastingHours]);

  const isFasting = dailyLog.fastingStartTime && !dailyLog.fastingEndTime;

  const calorieProgress = goals.calories > 0 ? dailyLog.calories / goals.calories : 0;
  const waterGlasses = Math.floor(dailyLog.waterMl / 250);
  const totalGlasses = 8;
  const waterProgress = goals.waterMl > 0 ? dailyLog.waterMl / goals.waterMl : 0;

  const foxMood = dailyLog.calories === 0
    ? 'thinking'
    : dailyLog.calories >= goals.calories
    ? 'excited'
    : isFasting
    ? 'sleeping'
    : 'happy';

  const handleAddWater = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addWater(250);
  }, [addWater]);

  const handleFastingToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isFasting) {
      stopFasting();
    } else {
      startFasting();
    }
  }, [isFasting, startFasting, stopFasting]);

  const rawWeight = dailyLog.weight || goals.targetWeight || 60;
  const rawTarget = goals.targetWeight || 60;
  const currentWeight = Number.isInteger(rawWeight) ? rawWeight : parseFloat(rawWeight.toFixed(1));
  const targetWeight = Number.isInteger(rawTarget) ? rawTarget : parseFloat(rawTarget.toFixed(1));
  const atGoal = currentWeight === targetWeight;

  const totalFiber = dailyLog.meals.reduce((sum, m) => sum + (m.fiber || 0), 0);
  const nutritionScore = dailyLog.meals.length > 0
    ? Math.min(Math.round((dailyLog.calories / goals.calories) * 100), 100)
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {/* Green gradient hero section with nature scene */}
        <LinearGradient
          colors={['#D4742F', '#B85E22', '#9A4B1A']}
          style={styles.heroGradient}
        >
          {/* Nature decorations */}
          <View style={styles.natureDecorations} pointerEvents="none">
            <Svg width={SCREEN_WIDTH} height={320} style={StyleSheet.absoluteFill}>
              {/* Coral blobs top-right */}
              <SvgCircle cx={SCREEN_WIDTH - 30} cy={40} r={35} fill="rgba(255,200,100,0.45)" />
              <SvgCircle cx={SCREEN_WIDTH - 60} cy={70} r={25} fill="rgba(255,200,100,0.45)" />
              {/* Leaf shapes */}
              <Ellipse cx={20} cy={140} rx={18} ry={40} fill="rgba(200,120,50,0.3)" rotation={-20} origin="20,140" />
              <Ellipse cx={SCREEN_WIDTH - 25} cy={160} rx={14} ry={35} fill="rgba(255,130,150,0.3)" rotation={20} origin={`${SCREEN_WIDTH - 25},160`} />
              {/* Bush shapes at bottom */}
              <Ellipse cx={SCREEN_WIDTH * 0.2} cy={300} rx={100} ry={50} fill="rgba(100,50,20,0.5)" />
              <Ellipse cx={SCREEN_WIDTH * 0.8} cy={305} rx={120} ry={55} fill="rgba(100,50,20,0.5)" />
              <Ellipse cx={SCREEN_WIDTH * 0.5} cy={310} rx={SCREEN_WIDTH * 0.6} ry={40} fill="rgba(80,40,15,0.6)" />
            </Svg>
          </View>

          <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
            {/* Top bar: pet name + settings gear */}
            <View style={styles.topBar}>
              <View style={styles.petNameContainer}>
                <Text style={styles.petNameText}>{user.petName || 'Ember'}</Text>
                <Text style={styles.petHearts}>{'❤️'.repeat(4)}</Text>
              </View>

              <View style={styles.topBarButtons}>
                <TouchableOpacity
                  onPress={() => router.push('/notifications')}
                  activeOpacity={0.7}
                  style={styles.topBarIconBtn}
                >
                  <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/settings')}
                  activeOpacity={0.7}
                  style={styles.topBarIconBtn}
                >
                  <Ionicons name="settings-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Fox pet area */}
            <View style={styles.petArea}>
              <FoxAvatar mood={foxMood} size={140} style={styles.foxAvatar} />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Cards section */}
        <View style={styles.cardsContainer}>

          {/* ---------- TODAY INFO ROW ---------- */}
          <View style={styles.todayRow}>
            <View style={styles.todayLeft}>
              <Text style={styles.todayIcon}>📅</Text>
              <Text style={styles.todayText}>Today</Text>
            </View>
            <View style={styles.todayCenter}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakText}>{streak}</Text>
            </View>
            <TouchableOpacity style={styles.todayRight} activeOpacity={0.7} onPress={() => router.push('/settings')}>
              <Ionicons name="trophy-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* ---------- STREAK MOTIVATION BANNER ---------- */}
          {(() => {
            const streakMsg = getStreakMessage(streak);
            return (
              <View style={styles.streakBanner}>
                <Ionicons name={streakMsg.icon} size={20} color="#FFF" />
                <Text style={styles.streakBannerText}>{streakMsg.text}</Text>
              </View>
            );
          })()}

          {/* ---------- DAILY FOX TIP ---------- */}
          {(() => {
            const tip = getDailyTip();
            return (
              <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <View style={styles.tipIconCircle}>
                    <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                  </View>
                  <View style={styles.tipHeaderText}>
                    <Text style={styles.tipTitle}>Daily Fox Tip</Text>
                    <Text style={styles.tipCategory}>{tip.category}</Text>
                  </View>
                  <FoxAvatar mood="happy" size={40} />
                </View>
                <Text style={styles.tipBody}>{tip.tip}</Text>
              </View>
            );
          })()}

          {/* ---------- CALORIES CARD ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.caloriesTitleRow}>
                <Text style={styles.cardTitle}>Calories eaten</Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} style={{ marginLeft: 4 }} />
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => router.push('/settings')}
              >
                <Ionicons name="create-outline" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.calorieSection}>
              <ProgressRing
                size={120}
                strokeWidth={10}
                progress={calorieProgress}
                color={calorieProgress >= 1 ? COLORS.success : COLORS.primary}
                bgColor={COLORS.divider}
              >
                <View style={styles.calorieRingContent}>
                  <Text style={styles.calorieRingValue}>{dailyLog.calories}</Text>
                  <Text style={styles.calorieRingLabel}>/{goals.calories}</Text>
                  <Text style={styles.calorieRingUnit}>kcal</Text>
                </View>
              </ProgressRing>
            </View>

            <View style={styles.macroRow}>
              <MacroMiniBar label="Carbs" current={dailyLog.carbs} goal={goals.carbsG} color={COLORS.primary} />
              <MacroMiniBar label="Fats" current={dailyLog.fats} goal={goals.fatsG} color={COLORS.orange} />
              <MacroMiniBar label="Proteins" current={dailyLog.proteins} goal={goals.proteinsG} color={COLORS.fasting} />
            </View>

            <Text style={styles.calorieGoalText}>Goal: {goals.calories} kcal</Text>
          </View>

          {/* ---------- MEAL PLAN CARD ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Meal plan</Text>
              <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/food-journal')}>
                <Ionicons name="journal-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {mealPlan.length === 0 && dailyLog.meals.length === 0 ? (
              <View style={styles.emptyMealPlan}>
                <Ionicons name="restaurant-outline" size={40} color={COLORS.inactive} />
                <Text style={styles.emptyMealPlanText}>Add your first meal</Text>
                <Text style={styles.emptyMealPlanSub}>
                  Tap the + button to log breakfast, lunch, dinner, or a snack
                </Text>
              </View>
            ) : (
              <View>
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((mealType) => {
                  const mealsOfType = dailyLog.meals.filter(
                    (m) => (m.type || '').toLowerCase() === mealType.toLowerCase()
                  );
                  const planOfType = mealPlan.filter(
                    (m) => (m.type || '').toLowerCase() === mealType.toLowerCase()
                  );
                  const items = mealsOfType.length > 0 ? mealsOfType : planOfType;

                  return (
                    <View key={mealType} style={styles.mealSection}>
                      <View style={styles.mealSectionHeader}>
                        <Text style={styles.mealSectionIcon}>
                          {mealType === 'Breakfast' ? '🌅' : mealType === 'Lunch' ? '☀️' : mealType === 'Dinner' ? '🌙' : '🍿'}
                        </Text>
                        <Text style={styles.mealSectionTitle}>{mealType}</Text>
                        {items.length > 0 && (
                          <Text style={styles.mealSectionCal}>
                            {items.reduce((s, m) => s + (m.calories || 0), 0)} kcal
                          </Text>
                        )}
                      </View>
                      {items.length > 0 ? (
                        items.map((item, idx) => (
                          <Text key={idx} style={styles.mealItemText}>
                            {item.name} - {item.calories || 0} kcal
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.mealItemPlaceholder}>+ Add {mealType.toLowerCase()}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* ---------- WATER CARD ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Water</Text>
              <TouchableOpacity onPress={handleAddWater} activeOpacity={0.7} style={styles.waterAddBtn}>
                <Ionicons name="add-circle" size={28} color={COLORS.water} />
              </TouchableOpacity>
            </View>

            <Text style={styles.waterAmount}>{dailyLog.waterMl} ml</Text>

            <View style={styles.glassesRow}>
              {Array.from({ length: totalGlasses }).map((_, i) => (
                <WaterGlass key={i} filled={i < waterGlasses} />
              ))}
            </View>

            <View style={styles.waterProgressRow}>
              <ProgressRing
                size={48}
                strokeWidth={5}
                progress={waterProgress}
                color={COLORS.water}
                bgColor={COLORS.waterLight}
              >
                <Text style={styles.waterPctText}>{Math.round(waterProgress * 100)}%</Text>
              </ProgressRing>
              <View style={{ flex: 1 }}>
                <Text style={styles.waterGoalText}>{dailyLog.waterMl} / {goals.waterMl} ml</Text>
                <Text style={styles.waterHintText}>
                  {waterProgress >= 1
                    ? 'Goal reached! Great hydration today.'
                    : waterProgress >= 0.5
                    ? `${Math.round((goals.waterMl - dailyLog.waterMl) / 250)} more glasses to go!`
                    : 'Tap + to log each glass (250ml)'}
                </Text>
              </View>
            </View>
          </View>

          {/* ---------- FASTING CARD ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Fasting</Text>
              {isFasting && (
                <View style={styles.fastingPhaseBadge}>
                  <Text style={styles.fastingPhaseText}>
                    {fastingProgress < 0.25 ? 'Fed State'
                      : fastingProgress < 0.5 ? 'Fat Burning'
                      : fastingProgress < 0.75 ? 'Ketosis'
                      : 'Deep Ketosis'}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.fastingTimer}>{fastingTimer}</Text>

            <View style={styles.fastingBarContainer}>
              <View style={styles.fastingBarBg}>
                <View
                  style={[
                    styles.fastingBarFill,
                    { width: `${Math.min(fastingProgress * 100, 100)}%` },
                  ]}
                />
              </View>
              <View style={styles.fastingMilestones}>
                <Text style={styles.fastingMilestone}>🌙</Text>
                <Text style={styles.fastingMilestone}>🔥</Text>
                <Text style={styles.fastingMilestone}>🍽️</Text>
                <Text style={styles.fastingMilestone}>🏁</Text>
              </View>
            </View>

            {isFasting && (
              <View style={styles.fastingFox}>
                <FoxAvatar mood="sleeping" size={60} />
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.fastingButton,
                isFasting && styles.fastingButtonActive,
              ]}
              onPress={handleFastingToggle}
              activeOpacity={0.8}
            >
              <Text style={[styles.fastingButtonText, isFasting && styles.fastingButtonTextActive]}>
                {isFasting ? 'STOP' : 'START'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ---------- NUTRITION SCORE CARD ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Nutrition score</Text>
              {nutritionScore > 0 && (
                <View style={[styles.gradeChip, {
                  backgroundColor: nutritionScore >= 90 ? '#E8F5E9' : nutritionScore >= 70 ? '#FFF3E8' : nutritionScore >= 50 ? '#FFF9C4' : '#FFEBEE',
                }]}>
                  <Text style={[styles.gradeText, {
                    color: nutritionScore >= 90 ? '#2E7D32' : nutritionScore >= 70 ? '#E8813A' : nutritionScore >= 50 ? '#F57F17' : '#EF5353',
                  }]}>
                    {nutritionScore >= 95 ? 'A+' : nutritionScore >= 90 ? 'A' : nutritionScore >= 80 ? 'B+' : nutritionScore >= 70 ? 'B' : nutritionScore >= 60 ? 'C' : nutritionScore >= 50 ? 'D' : 'F'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.centeredContent}>
              <ProgressRing
                size={80}
                strokeWidth={7}
                progress={nutritionScore / 100}
                color={nutritionScore > 0 ? COLORS.primary : COLORS.inactive}
                bgColor={COLORS.divider}
              >
                <Text style={[styles.scoreValue, nutritionScore === 0 && { color: COLORS.textMuted }]}>
                  {nutritionScore > 0 ? nutritionScore : '0'}
                </Text>
              </ProgressRing>
              <Text style={styles.scoreSubtext}>
                {nutritionScore >= 90
                  ? 'Incredible! Your meals are perfectly balanced today.'
                  : nutritionScore >= 70
                  ? 'Great job! A few more balanced meals to reach A grade.'
                  : nutritionScore > 0
                  ? 'Keep logging meals — variety and balance boost your score!'
                  : 'No score yet — log meals to see your grade'}
              </Text>
            </View>
          </View>

          {/* ---------- FIBER CARD ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Fiber</Text>
            </View>

            <View style={styles.centeredContent}>
              <ProgressRing
                size={80}
                strokeWidth={7}
                progress={totalFiber > 0 ? Math.min(totalFiber / 25, 1) : 0}
                color={totalFiber > 0 ? COLORS.primary : COLORS.inactive}
                bgColor={COLORS.divider}
              >
                <Text style={[styles.scoreValue, totalFiber === 0 && { color: COLORS.textMuted }]}>
                  {totalFiber}g
                </Text>
              </ProgressRing>
              <Text style={styles.scoreSubtext}>
                {totalFiber > 0
                  ? `${totalFiber}g of fiber today`
                  : 'No fiber yet'}
              </Text>
              <Text style={styles.scoreHint}>Start logging your meals to see your daily fiber insights.</Text>
            </View>
          </View>

          {/* ---------- WEIGHT CARD ---------- */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: COLORS.textMuted, fontSize: FONTS.bodySmall, fontWeight: FONTS.medium, marginBottom: SPACING.xs }]}>Weight</Text>

            <View style={styles.weightRow}>
              <View style={styles.weightLeft}>
                <Text style={styles.weightValue}>
                  {currentWeight}
                  <Text style={styles.weightUnit}> kg</Text>
                </Text>
              </View>
              <TouchableOpacity
                style={styles.weightAddCircle}
                activeOpacity={0.7}
                onPress={() => {
                  Alert.prompt(
                    'Log Weight',
                    'Enter your weight in kg:',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Save', onPress: (val) => {
                        const w = parseFloat(val);
                        if (w > 0) { logWeight(w); }
                      }},
                    ],
                    'plain-text',
                    String(currentWeight),
                    'numeric'
                  );
                }}
              >
                <Ionicons name="add" size={28} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.weightBottomRow}>
              {atGoal ? (
                <View style={styles.weightGoalBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.weightGoalText}>At goal: {targetWeight} kg</Text>
                </View>
              ) : targetWeight > 0 ? (
                <Text style={styles.weightTargetText}>Target: {targetWeight} kg</Text>
              ) : <View />}
              <TouchableOpacity activeOpacity={0.6} onPress={() => Alert.alert('Weight Options', 'Weight tracking options coming soon!')}>
                <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ---------- MOOD CHECK-IN CARD ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>How are you feeling?</Text>
              <FoxAvatar mood="thinking" size={32} />
            </View>

            <Text style={styles.moodSubtext}>Track your mood to see how food affects your energy</Text>

            <View style={styles.moodRow}>
              {[
                { emoji: '😊', label: 'Great' },
                { emoji: '🙂', label: 'Good' },
                { emoji: '😐', label: 'Okay' },
                { emoji: '😔', label: 'Low' },
                { emoji: '😴', label: 'Tired' },
              ].map((mood) => (
                <TouchableOpacity
                  key={mood.label}
                  style={[
                    styles.moodOption,
                    dailyLog.mood === mood.label && styles.moodOptionSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    logMood(mood.label);
                  }}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    dailyLog.mood === mood.label && styles.moodLabelSelected,
                  ]}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ---------- DAILY INSIGHT CARD ---------- */}
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
              <Text style={styles.insightTitle}>Today's Insight</Text>
            </View>
            <Text style={styles.insightBody}>
              {dailyLog.calories === 0
                ? "Start logging your meals and Ember will give you personalized insights about your nutrition patterns."
                : dailyLog.calories < goals.calories * 0.5
                ? `You've eaten ${dailyLog.calories} kcal so far. You have ${goals.calories - dailyLog.calories} kcal remaining — plenty of room for a balanced dinner!`
                : dailyLog.calories < goals.calories
                ? `Almost there! Just ${goals.calories - dailyLog.calories} kcal to go. Consider a protein-rich snack to finish strong.`
                : `You've reached your calorie goal! Great job staying on track today.`
              }
            </Text>
          </View>

          {/* ---------- CHANGE ORDER BUTTON ---------- */}
          <TouchableOpacity style={styles.changeOrderBtn} activeOpacity={0.7} onPress={() => router.push('/home-layout')}>
            <Ionicons name="swap-vertical" size={18} color={COLORS.textSecondary} />
            <Text style={styles.changeOrderText}>Change order</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroGradient: {
    paddingBottom: 30,
  },
  natureDecorations: {
    ...StyleSheet.absoluteFillObject,
  },
  heroSafeArea: {
    paddingHorizontal: SPACING.base,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  petNameContainer: {
    gap: 2,
  },
  petNameText: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  petHearts: {
    fontSize: 14,
    letterSpacing: 2,
  },
  topBarButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  topBarIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    gap: 6,
  },
  coinsText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  petArea: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    minHeight: 180,
    justifyContent: 'flex-end',
  },
  foxAvatar: {
    marginBottom: 8,
  },
  foodItem1: {
    position: 'absolute',
    left: 40,
    bottom: 40,
    fontSize: 28,
  },
  foodItem2: {
    position: 'absolute',
    right: 40,
    bottom: 50,
    fontSize: 28,
  },
  groundLine: {
    width: 200,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  cardsContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: SPACING.lg,
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.base,
    gap: SPACING.sm,
  },
  streakBannerText: {
    flex: 1,
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
  },
  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.card,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  tipIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipEmoji: {
    fontSize: 18,
  },
  tipHeaderText: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  tipCategory: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  tipBody: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
    paddingHorizontal: SPACING.xs,
  },
  todayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayIcon: {
    fontSize: 16,
  },
  todayText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
  todayCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakIcon: {
    fontSize: 16,
  },
  streakText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.textSecondary,
  },
  todayRight: {
    padding: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  caloriesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calorieSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  calorieRingContent: {
    alignItems: 'center',
  },
  calorieRingValue: {
    fontSize: 26,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  calorieRingLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: -2,
  },
  calorieRingUnit: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
  },
  calorieGoalText: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  macroRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  macroMiniItem: {
    flex: 1,
  },
  macroMiniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  macroMiniLabel: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
  },
  macroMiniValue: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
  },
  macroMiniBarBg: {
    height: 6,
    backgroundColor: COLORS.divider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroMiniBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyMealPlan: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyMealPlanText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptyMealPlanSub: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.xxl,
  },
  mealSection: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  mealSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  mealSectionIcon: {
    fontSize: 18,
  },
  mealSectionTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.black,
    flex: 1,
  },
  mealSectionCal: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
  },
  mealItemText: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: 28,
    marginTop: 2,
  },
  mealItemPlaceholder: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginLeft: 28,
    marginTop: 2,
    fontStyle: 'italic',
  },
  waterAmount: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  glassesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  waterGlass: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterGlassFilled: {
    backgroundColor: COLORS.waterLight,
  },
  waterAddBtn: {
    padding: 2,
  },
  waterProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  waterPctText: {
    fontSize: 10,
    fontWeight: FONTS.bold,
    color: COLORS.water,
  },
  waterGoalText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
  },
  waterHintText: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  fastingTimer: {
    fontSize: 40,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.base,
    fontVariant: ['tabular-nums'],
  },
  fastingPhaseBadge: {
    backgroundColor: COLORS.fastingLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  fastingPhaseText: {
    fontSize: FONTS.tiny,
    fontWeight: FONTS.bold,
    color: COLORS.fasting,
  },
  fastingBarContainer: {
    marginBottom: SPACING.base,
  },
  fastingBarBg: {
    height: 8,
    backgroundColor: COLORS.divider,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  fastingBarFill: {
    height: '100%',
    backgroundColor: COLORS.fasting,
    borderRadius: 4,
  },
  fastingMilestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  fastingMilestone: {
    fontSize: 16,
  },
  fastingFox: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  fastingButton: {
    backgroundColor: COLORS.fasting,
    paddingVertical: 14,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
  },
  fastingButtonActive: {
    backgroundColor: COLORS.error,
  },
  fastingButtonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    letterSpacing: 2,
  },
  fastingButtonTextActive: {
    color: COLORS.white,
  },
  gradeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  gradeText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
  },
  centeredContent: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  scoreValue: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  scoreSubtext: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  scoreHint: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  weightLeft: {
    flex: 1,
  },
  weightValue: {
    fontSize: 40,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  weightUnit: {
    fontSize: 24,
    fontWeight: FONTS.medium,
    color: COLORS.textMuted,
  },
  weightAddCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weightGoalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weightGoalText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.success,
  },
  weightTargetText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
  },
  moodSubtext: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: 2,
  },
  moodOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryFaded,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    fontWeight: FONTS.medium,
  },
  moodLabelSelected: {
    color: COLORS.primary,
    fontWeight: FONTS.bold,
  },
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
    marginBottom: SPACING.sm,
  },
  insightTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  insightBody: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  changeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill,
    gap: SPACING.sm,
    ...SHADOWS.small,
    marginTop: SPACING.sm,
  },
  changeOrderText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
});
