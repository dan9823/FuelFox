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
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
  SIZES,
} from '../src/constants/theme';

const WIDGETS = [
  { id: 'streak', icon: '🔥', label: 'Streak motivation' },
  { id: 'fox_tip', icon: '🦊', label: 'Daily fox tip' },
  { id: 'calories', icon: '🍴', label: 'Calories & macros' },
  { id: 'meal_plan', icon: '🍲', label: 'Meal plan' },
  { id: 'water', icon: '💧', label: 'Water' },
  { id: 'fasting', icon: '⏱️', label: 'Fasting' },
  { id: 'nutrition', icon: '📊', label: 'Nutrition score' },
  { id: 'fiber', icon: '🌾', label: 'Fiber' },
  { id: 'weight', icon: '⚖️', label: 'Weight' },
  { id: 'mood', icon: '😊', label: 'Mood check-in' },
  { id: 'insight', icon: '💡', label: 'Daily insight' },
];

function DragHandle() {
  return (
    <View style={styles.dragHandle}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={styles.dotRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      ))}
    </View>
  );
}

export default function HomeLayoutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home layout</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {WIDGETS.map((widget) => (
          <View key={widget.id} style={styles.widgetCard}>
            <Text style={styles.widgetIcon}>{widget.icon}</Text>
            <Text style={styles.widgetLabel}>{widget.label}</Text>
            <DragHandle />
          </View>
        ))}

        <Text style={styles.helpText}>
          Drag to reorder. Widgets will appear in the same order on your Home page.
        </Text>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
  },
  widgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  widgetIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  widgetLabel: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: FONTS.medium,
    color: COLORS.black,
  },
  dragHandle: {
    gap: 3,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
  },
  helpText: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  saveButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 50,
    paddingVertical: 16,
  },
  saveButtonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
