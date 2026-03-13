import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useApp } from '../src/context/AppContext';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../src/constants/theme';

const QUICK_MEALS = [
  { name: 'Oatmeal with berries', calories: 280, carbs: 48, fats: 6, proteins: 10, type: 'Breakfast', emoji: '🥣' },
  { name: 'Scrambled eggs (2)', calories: 180, carbs: 2, fats: 12, proteins: 14, type: 'Breakfast', emoji: '🥚' },
  { name: 'Toast with avocado', calories: 250, carbs: 26, fats: 14, proteins: 6, type: 'Breakfast', emoji: '🥑' },
  { name: 'Greek yogurt', calories: 130, carbs: 8, fats: 4, proteins: 18, type: 'Snack', emoji: '🥛' },
  { name: 'Chicken salad', calories: 350, carbs: 15, fats: 16, proteins: 35, type: 'Lunch', emoji: '🥗' },
  { name: 'Rice and chicken', calories: 420, carbs: 50, fats: 10, proteins: 32, type: 'Lunch', emoji: '🍚' },
  { name: 'Pasta with sauce', calories: 450, carbs: 62, fats: 14, proteins: 16, type: 'Dinner', emoji: '🍝' },
  { name: 'Salmon with veggies', calories: 380, carbs: 12, fats: 18, proteins: 40, type: 'Dinner', emoji: '🐟' },
  { name: 'Banana', calories: 105, carbs: 27, fats: 0, proteins: 1, type: 'Snack', emoji: '🍌' },
  { name: 'Protein shake', calories: 200, carbs: 10, fats: 3, proteins: 30, type: 'Snack', emoji: '🥤' },
  { name: 'Mixed nuts (30g)', calories: 180, carbs: 6, fats: 16, proteins: 5, type: 'Snack', emoji: '🥜' },
  { name: 'Apple', calories: 95, carbs: 25, fats: 0, proteins: 0, type: 'Snack', emoji: '🍎' },
];

const MEAL_TYPES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function QuickLogScreen() {
  const router = useRouter();
  const { addMeal } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filtered = QUICK_MEALS.filter((m) => {
    const matchesFilter = activeFilter === 'All' || m.type === activeFilter;
    const matchesSearch = m.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleQuickAdd = (meal) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addMeal({
      name: meal.name,
      calories: meal.calories,
      carbs: meal.carbs,
      fats: meal.fats,
      proteins: meal.proteins,
      type: meal.type,
    });
    Alert.alert(
      'Meal Logged!',
      `${meal.name} (${meal.calories} kcal) added to your ${meal.type.toLowerCase()}.`,
      [
        { text: 'Add More', style: 'default' },
        { text: 'Done', onPress: () => router.back() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Log</Text>
        <TouchableOpacity onPress={() => router.push('/camera')} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search meals..."
          placeholderTextColor={COLORS.textMuted}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {MEAL_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterChip, activeFilter === type && styles.filterChipActive]}
            onPress={() => setActiveFilter(type)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, activeFilter === type && styles.filterChipTextActive]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Meals list */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.map((meal, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.mealCard}
            onPress={() => handleQuickAdd(meal)}
            activeOpacity={0.7}
          >
            <Text style={styles.mealEmoji}>{meal.emoji}</Text>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealMacros}>
                C: {meal.carbs}g  F: {meal.fats}g  P: {meal.proteins}g
              </Text>
            </View>
            <View style={styles.mealCalContainer}>
              <Text style={styles.mealCalValue}>{meal.calories}</Text>
              <Text style={styles.mealCalUnit}>kcal</Text>
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🦊</Text>
            <Text style={styles.emptyText}>No meals found</Text>
            <Text style={styles.emptySub}>Try a different search or filter</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.bodySmall,
    color: COLORS.black,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  mealEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.black,
  },
  mealMacros: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  mealCalContainer: {
    alignItems: 'flex-end',
  },
  mealCalValue: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  mealCalUnit: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  emptySub: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
