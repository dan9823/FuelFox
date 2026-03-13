import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../src/context/AppContext';
import { FoxAvatar } from '../src/components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../src/constants/theme';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const QUANTITY_OPTIONS = [0.5, 1, 1.5, 2];

export default function AnalysisResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addMeal } = useApp();

  // Parse the analysis data passed via route params
  const analysis = useMemo(() => {
    try {
      return JSON.parse(params.analysis || '{}');
    } catch {
      return {};
    }
  }, [params.analysis]);

  const isLabelMode = params.mode === 'label';
  const items = analysis.items || [];
  const product = analysis.product || null;

  // State for meal items
  const [checkedItems, setCheckedItems] = useState(
    () => new Set(items.map((_, i) => i))
  );
  const [quantities, setQuantities] = useState(
    () => items.map(() => 1)
  );
  const [mealType, setMealType] = useState(
    analysis.mealType || 'snack'
  );
  const [servingCount, setServingCount] = useState(1);

  // Toggle item checkbox
  const toggleItem = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Cycle quantity for an item
  const cycleQuantity = (index, direction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantities((prev) => {
      const next = [...prev];
      const currentIdx = QUANTITY_OPTIONS.indexOf(next[index]);
      const newIdx = Math.max(0, Math.min(QUANTITY_OPTIONS.length - 1, currentIdx + direction));
      next[index] = QUANTITY_OPTIONS[newIdx];
      return next;
    });
  };

  // Compute totals for checked items
  const totals = useMemo(() => {
    if (isLabelMode && product) {
      return {
        calories: Math.round((product.calories || 0) * servingCount),
        carbs: Math.round((product.carbs || 0) * servingCount),
        fats: Math.round((product.fats || 0) * servingCount),
        proteins: Math.round((product.proteins || 0) * servingCount),
      };
    }
    let cal = 0, carb = 0, fat = 0, prot = 0;
    items.forEach((item, i) => {
      if (checkedItems.has(i)) {
        const q = quantities[i];
        cal += (item.calories || 0) * q;
        carb += (item.carbs || 0) * q;
        fat += (item.fats || 0) * q;
        prot += (item.proteins || 0) * q;
      }
    });
    return {
      calories: Math.round(cal),
      carbs: Math.round(carb),
      fats: Math.round(fat),
      proteins: Math.round(prot),
    };
  }, [items, checkedItems, quantities, isLabelMode, product, servingCount]);

  // Log meal and navigate home
  const handleLogMeal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isLabelMode && product) {
      addMeal({
        name: product.name,
        calories: totals.calories,
        carbs: totals.carbs,
        fats: totals.fats,
        proteins: totals.proteins,
        type: mealType,
      });
    } else {
      items.forEach((item, i) => {
        if (checkedItems.has(i)) {
          const q = quantities[i];
          addMeal({
            name: item.name,
            calories: Math.round((item.calories || 0) * q),
            carbs: Math.round((item.carbs || 0) * q),
            fats: Math.round((item.fats || 0) * q),
            proteins: Math.round((item.proteins || 0) * q),
            type: mealType,
          });
        }
      });
    }
    router.replace('/(tabs)');
  };

  // Empty state
  const isEmpty = !isLabelMode && items.length === 0;
  if (isEmpty) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analysis Results</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <FoxAvatar mood="thinking" size={120} />
          <Text style={styles.emptyTitle}>No food detected</Text>
          <Text style={styles.emptySubtitle}>
            Try taking a clearer photo with better lighting
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isLabelMode ? 'Label Results' : 'Meal Analysis'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Fox avatar */}
        <View style={styles.foxRow}>
          <FoxAvatar mood="excited" size={80} />
          <Text style={styles.foxText}>
            {isLabelMode ? 'Got it! Here\'s what I found on the label.' : 'Here\'s what I spotted in your meal!'}
          </Text>
        </View>

        {/* Meal type selector (meal mode only) */}
        {!isLabelMode && (
          <View style={styles.mealTypeRow}>
            {MEAL_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[styles.mealTypeChip, mealType === type && styles.mealTypeChipActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMealType(type);
                }}
              >
                <Text style={[styles.mealTypeText, mealType === type && styles.mealTypeTextActive]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Label mode: single product card */}
        {isLabelMode && product ? (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productServing}>Serving: {product.servingSize}</Text>

            <View style={styles.macroGrid}>
              <MacroCell label="Calories" value={product.calories} unit="kcal" color={COLORS.primary} />
              <MacroCell label="Protein" value={product.proteins} unit="g" color="#5CB85C" />
              <MacroCell label="Carbs" value={product.carbs} unit="g" color="#42A5F5" />
              <MacroCell label="Fat" value={product.fats} unit="g" color="#FF9800" />
            </View>

            {(product.fiber > 0 || product.sugar > 0 || product.sodium > 0) && (
              <View style={styles.extraNutrients}>
                {product.fiber > 0 && <Text style={styles.extraText}>Fiber: {product.fiber}g</Text>}
                {product.sugar > 0 && <Text style={styles.extraText}>Sugar: {product.sugar}g</Text>}
                {product.sodium > 0 && <Text style={styles.extraText}>Sodium: {product.sodium}mg</Text>}
              </View>
            )}

            {/* Serving count adjuster */}
            <View style={styles.servingRow}>
              <Text style={styles.servingLabel}>Servings:</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setServingCount(Math.max(0.5, servingCount - 0.5)); }}
              >
                <Ionicons name="remove" size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{servingCount}x</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setServingCount(servingCount + 0.5); }}
              >
                <Ionicons name="add" size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {analysis.confidence != null && analysis.confidence < 0.7 && (
              <View style={styles.warningBadge}>
                <Ionicons name="warning-outline" size={14} color="#F57C00" />
                <Text style={styles.warningText}>Low confidence — double-check values</Text>
              </View>
            )}
          </View>
        ) : (
          /* Meal mode: items list */
          items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.itemCard}
              activeOpacity={0.7}
              onPress={() => toggleItem(index)}
            >
              <View style={styles.itemHeader}>
                <View style={[styles.checkbox, checkedItems.has(index) && styles.checkboxActive]}>
                  {checkedItems.has(index) && (
                    <Ionicons name="checkmark" size={14} color={COLORS.white} />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPortion}>{item.portion}</Text>
                </View>
                {item.confidence != null && item.confidence < 0.7 && (
                  <View style={styles.warningBadge}>
                    <Ionicons name="warning-outline" size={12} color="#F57C00" />
                    <Text style={[styles.warningText, { fontSize: 10 }]}>Low</Text>
                  </View>
                )}
              </View>

              <View style={styles.itemMacros}>
                <Text style={styles.itemCal}>{Math.round((item.calories || 0) * quantities[index])} kcal</Text>
                <View style={styles.macroRow}>
                  <Text style={[styles.macroTag, { color: '#5CB85C' }]}>P {Math.round((item.proteins || 0) * quantities[index])}g</Text>
                  <Text style={[styles.macroTag, { color: '#42A5F5' }]}>C {Math.round((item.carbs || 0) * quantities[index])}g</Text>
                  <Text style={[styles.macroTag, { color: '#FF9800' }]}>F {Math.round((item.fats || 0) * quantities[index])}g</Text>
                </View>
              </View>

              {/* Quantity adjuster */}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={(e) => { e.stopPropagation(); cycleQuantity(index, -1); }}
                >
                  <Ionicons name="remove" size={16} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantities[index]}x</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={(e) => { e.stopPropagation(); cycleQuantity(index, 1); }}
                >
                  <Ionicons name="add" size={16} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Totals card */}
        <View style={styles.totalsCard}>
          <Text style={styles.totalsTitle}>Total</Text>
          <View style={styles.totalsRow}>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totals.calories}</Text>
              <Text style={styles.totalLabel}>kcal</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalItem}>
              <Text style={[styles.totalValue, { color: '#5CB85C' }]}>{totals.proteins}g</Text>
              <Text style={styles.totalLabel}>Protein</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalItem}>
              <Text style={[styles.totalValue, { color: '#42A5F5' }]}>{totals.carbs}g</Text>
              <Text style={styles.totalLabel}>Carbs</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalItem}>
              <Text style={[styles.totalValue, { color: '#FF9800' }]}>{totals.fats}g</Text>
              <Text style={styles.totalLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {analysis.notes ? (
          <Text style={styles.notesText}>{analysis.notes}</Text>
        ) : null}
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <TouchableOpacity style={styles.logBtn} onPress={handleLogMeal} activeOpacity={0.8}>
          <Ionicons name="add-circle" size={22} color={COLORS.white} />
          <Text style={styles.logBtnText}>Log This Meal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MacroCell({ label, value, unit, color }) {
  return (
    <View style={styles.macroCell}>
      <Text style={[styles.macroCellValue, { color }]}>{value}</Text>
      <Text style={styles.macroCellUnit}>{unit}</Text>
      <Text style={styles.macroCellLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: FONTS.h4, fontWeight: FONTS.bold, color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: SPACING.huge,
  },

  // Fox
  foxRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  foxText: {
    flex: 1, fontSize: FONTS.body, color: COLORS.textSecondary, lineHeight: 22,
  },

  // Meal type
  mealTypeRow: {
    flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg,
  },
  mealTypeChip: {
    paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill, backgroundColor: COLORS.white,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  mealTypeChipActive: {
    backgroundColor: COLORS.primary, borderColor: COLORS.primary,
  },
  mealTypeText: {
    fontSize: FONTS.bodySmall, fontWeight: FONTS.semiBold, color: COLORS.textSecondary,
  },
  mealTypeTextActive: { color: COLORS.white },

  // Item card
  itemCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.base, marginBottom: SPACING.md, ...SHADOWS.card,
  },
  itemHeader: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary, borderColor: COLORS.primary,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: FONTS.body, fontWeight: FONTS.semiBold, color: COLORS.textPrimary },
  itemPortion: { fontSize: FONTS.caption, color: COLORS.textMuted, marginTop: 2 },
  itemMacros: { marginLeft: 36, marginBottom: SPACING.sm },
  itemCal: { fontSize: FONTS.h4, fontWeight: FONTS.bold, color: COLORS.textPrimary },
  macroRow: { flexDirection: 'row', gap: SPACING.md, marginTop: 4 },
  macroTag: { fontSize: FONTS.caption, fontWeight: FONTS.semiBold },
  qtyRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    marginLeft: 36,
  },
  qtyBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
  },
  qtyText: {
    fontSize: FONTS.body, fontWeight: FONTS.bold, color: COLORS.textPrimary, minWidth: 32, textAlign: 'center',
  },

  // Product card (label mode)
  productCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.card,
  },
  productName: { fontSize: FONTS.h3, fontWeight: FONTS.bold, color: COLORS.textPrimary, marginBottom: 4 },
  productServing: { fontSize: FONTS.bodySmall, color: COLORS.textMuted, marginBottom: SPACING.base },
  macroGrid: {
    flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.base,
  },
  macroCell: { alignItems: 'center' },
  macroCellValue: { fontSize: FONTS.h3, fontWeight: FONTS.bold },
  macroCellUnit: { fontSize: FONTS.caption, color: COLORS.textMuted },
  macroCellLabel: { fontSize: FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  extraNutrients: {
    flexDirection: 'row', justifyContent: 'center', gap: SPACING.lg,
    paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.divider, marginBottom: SPACING.md,
  },
  extraText: { fontSize: FONTS.bodySmall, color: COLORS.textSecondary },
  servingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  servingLabel: { fontSize: FONTS.body, fontWeight: FONTS.semiBold, color: COLORS.textPrimary },

  // Warning
  warningBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF3E0', paddingHorizontal: SPACING.sm, paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  warningText: { fontSize: FONTS.caption, color: '#F57C00', fontWeight: FONTS.medium },

  // Totals
  totalsCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.base, marginTop: SPACING.sm, marginBottom: SPACING.md, ...SHADOWS.card,
  },
  totalsTitle: {
    fontSize: FONTS.bodySmall, fontWeight: FONTS.bold, color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.md, textAlign: 'center',
  },
  totalsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
  },
  totalItem: { alignItems: 'center' },
  totalValue: { fontSize: FONTS.h3, fontWeight: FONTS.bold, color: COLORS.textPrimary },
  totalLabel: { fontSize: FONTS.caption, color: COLORS.textMuted, marginTop: 2 },
  totalDivider: { width: 1, height: 32, backgroundColor: COLORS.divider },

  notesText: {
    fontSize: FONTS.bodySmall, color: COLORS.textMuted, fontStyle: 'italic',
    textAlign: 'center', marginTop: SPACING.sm,
  },

  // CTA
  ctaSection: { padding: SPACING.base, paddingBottom: SPACING.huge },
  logBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.primary, height: 56, borderRadius: RADIUS.pill,
    ...SHADOWS.button,
  },
  logBtnText: { fontSize: FONTS.body, fontWeight: FONTS.bold, color: COLORS.white },

  // Empty
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  emptyTitle: { fontSize: FONTS.h3, fontWeight: FONTS.bold, color: COLORS.textPrimary, marginTop: SPACING.lg },
  emptySubtitle: { fontSize: FONTS.body, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm },
  retryBtn: {
    marginTop: SPACING.xl, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md, borderRadius: RADIUS.pill,
  },
  retryBtnText: { fontSize: FONTS.body, fontWeight: FONTS.bold, color: COLORS.white },
});
