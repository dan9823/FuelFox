import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import FoxAvatar from '../src/components/FoxAvatar';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../src/constants/theme';

const MEAL_ICONS = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍿',
};

function getMealIcon(type) {
  return MEAL_ICONS[(type || '').toLowerCase()] || '🍽️';
}

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function FoodJournalScreen() {
  const router = useRouter();
  const { dailyLog, goals } = useApp();

  const caloriesLeft = Math.max(0, goals.calories - dailyLog.calories);
  const carbsPct = goals.carbsG > 0 ? Math.round((dailyLog.carbs / goals.carbsG) * 100) : 0;
  const fatsPct = goals.fatsG > 0 ? Math.round((dailyLog.fats / goals.fatsG) * 100) : 0;
  const proteinsPct = goals.proteinsG > 0 ? Math.round((dailyLog.proteins / goals.proteinsG) * 100) : 0;

  // Group meals by type
  const mealGroups = {};
  dailyLog.meals.forEach((meal) => {
    const type = (meal.type || 'other').toLowerCase();
    if (!mealGroups[type]) mealGroups[type] = [];
    mealGroups[type].push(meal);
  });

  const groupOrder = ['breakfast', 'lunch', 'dinner', 'snack', 'other'];
  const orderedGroups = groupOrder
    .filter((t) => mealGroups[t] && mealGroups[t].length > 0)
    .map((t) => ({ type: t, meals: mealGroups[t] }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Journal</Text>
        <TouchableOpacity onPress={() => router.push('/camera')} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{dailyLog.calories}</Text>
              <Text style={styles.summaryLabel}>Eaten</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: COLORS.primary }]}>{caloriesLeft}</Text>
              <Text style={styles.summaryLabel}>Remaining</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{goals.calories}</Text>
              <Text style={styles.summaryLabel}>Goal</Text>
            </View>
          </View>

          {/* Macro bars */}
          <View style={styles.macroSummary}>
            {[
              { label: 'Carbs', pct: carbsPct, current: dailyLog.carbs, goal: goals.carbsG, color: COLORS.primary },
              { label: 'Protein', pct: proteinsPct, current: dailyLog.proteins, goal: goals.proteinsG, color: COLORS.fasting },
              { label: 'Fats', pct: fatsPct, current: dailyLog.fats, goal: goals.fatsG, color: COLORS.orange },
            ].map((m) => (
              <View key={m.label} style={styles.macroItem}>
                <View style={styles.macroLabelRow}>
                  <Text style={[styles.macroLabel, { color: m.color }]}>{m.label}</Text>
                  <Text style={styles.macroVal}>{m.current}/{m.goal}g</Text>
                </View>
                <View style={styles.macroTrack}>
                  <View style={[styles.macroFill, { width: `${Math.min(m.pct, 100)}%`, backgroundColor: m.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Meals */}
        {orderedGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <FoxAvatar mood="thinking" size={100} />
            <Text style={styles.emptyTitle}>No meals logged yet</Text>
            <Text style={styles.emptySub}>Tap the camera icon or + button to log your first meal of the day</Text>
          </View>
        ) : (
          orderedGroups.map(({ type, meals }) => (
            <View key={type} style={styles.mealGroup}>
              <View style={styles.mealGroupHeader}>
                <Text style={styles.mealGroupIcon}>{getMealIcon(type)}</Text>
                <Text style={styles.mealGroupTitle}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                <Text style={styles.mealGroupCal}>
                  {meals.reduce((s, m) => s + (m.calories || 0), 0)} kcal
                </Text>
              </View>

              {meals.map((meal, idx) => (
                <View key={meal.id || idx} style={styles.mealItem}>
                  <View style={styles.mealItemLeft}>
                    <Text style={styles.mealName}>{meal.name || 'Unnamed meal'}</Text>
                    {meal.time && <Text style={styles.mealTime}>{formatTime(meal.time)}</Text>}
                  </View>
                  <View style={styles.mealItemRight}>
                    <Text style={styles.mealCal}>{meal.calories || 0}</Text>
                    <Text style={styles.mealCalUnit}>kcal</Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}

        {/* Mood summary */}
        {dailyLog.mood && (
          <View style={styles.moodCard}>
            <Text style={styles.moodCardTitle}>Today's Mood</Text>
            <Text style={styles.moodCardEmoji}>
              {dailyLog.mood === 'Great' ? '😊' : dailyLog.mood === 'Good' ? '🙂' : dailyLog.mood === 'Okay' ? '😐' : dailyLog.mood === 'Low' ? '😔' : '😴'}
            </Text>
            <Text style={styles.moodCardLabel}>{dailyLog.mood}</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  scrollContent: {
    padding: SPACING.base,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    ...SHADOWS.card,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  summaryLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.divider,
  },
  macroSummary: {
    gap: SPACING.sm,
  },
  macroItem: {
    gap: 4,
  },
  macroLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroLabel: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
  },
  macroVal: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
  },
  macroTrack: {
    height: 6,
    backgroundColor: COLORS.divider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    marginTop: SPACING.md,
  },
  emptySub: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  mealGroup: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  mealGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  mealGroupIcon: {
    fontSize: 20,
  },
  mealGroupTitle: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  mealGroupCal: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.primary,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  mealItemLeft: {
    flex: 1,
  },
  mealName: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.medium,
    color: COLORS.black,
  },
  mealTime: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  mealItemRight: {
    alignItems: 'flex-end',
  },
  mealCal: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  mealCalUnit: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
  },
  moodCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    alignItems: 'center',
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#FFE8D0',
  },
  moodCardTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  moodCardEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  moodCardLabel: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
});
