import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { dietTypes, activityLevels } from '../../src/constants/onboardingData';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

function MacroBar({ carbsPct, fatsPct, proteinsPct }) {
  return (
    <View style={macroStyles.container}>
      <View style={macroStyles.bar}>
        <View style={[macroStyles.segment, { flex: carbsPct, backgroundColor: '#FF9800' }]} />
        <View style={[macroStyles.segment, { flex: fatsPct, backgroundColor: '#42A5F5' }]} />
        <View style={[macroStyles.segment, { flex: proteinsPct, backgroundColor: '#E8813A' }]} />
      </View>
      <View style={macroStyles.legend}>
        <View style={macroStyles.legendItem}>
          <View style={[macroStyles.legendDot, { backgroundColor: '#FF9800' }]} />
          <Text style={macroStyles.legendText}>Carbs {carbsPct}%</Text>
        </View>
        <View style={macroStyles.legendItem}>
          <View style={[macroStyles.legendDot, { backgroundColor: '#42A5F5' }]} />
          <Text style={macroStyles.legendText}>Fats {fatsPct}%</Text>
        </View>
        <View style={macroStyles.legendItem}>
          <View style={[macroStyles.legendDot, { backgroundColor: '#E8813A' }]} />
          <Text style={macroStyles.legendText}>Protein {proteinsPct}%</Text>
        </View>
      </View>
    </View>
  );
}

export default function PersonalPlanReadyScreen() {
  const router = useRouter();
  const {
    dailyCalories,
    macros,
    gender,
    age,
    dietType,
    activityLevel,
  } = useOnboarding();

  const dietLabel = dietTypes.find((d) => d.id === dietType)?.label || 'Balanced';
  const activityLabel = activityLevels.find((a) => a.id === activityLevel)?.label || 'Active';
  const genderLabel = gender === 'female' ? 'women' : gender === 'male' ? 'men' : 'individuals';

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/paywall');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <FoxAvatar mood="excited" size={80} />
          <Text style={styles.title}>Your personal plan{'\n'}is ready!</Text>
        </View>

        <View style={styles.planCard}>
          <View style={styles.calorieRow}>
            <Text style={styles.calorieLabel}>Daily calories target</Text>
            <Text style={styles.calorieValue}>{dailyCalories} kcal</Text>
          </View>

          <MacroBar
            carbsPct={macros.carbsPct}
            fatsPct={macros.fatsPct}
            proteinsPct={macros.proteinsPct}
          />

          <View style={styles.divider} />

          <View style={styles.bullets}>
            <View style={styles.bulletRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
              <Text style={styles.bulletText}>
                Customized for {genderLabel} age {age || 25}+
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
              <Text style={styles.bulletText}>
                Tailored for {dietLabel} diet
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
              <Text style={styles.bulletText}>
                Adapted to {activityLabel.toLowerCase()} lifestyle
              </Text>
            </View>
          </View>

          <Text style={styles.planDescription}>
            Your plan is designed to help you reach your goals with a sustainable approach to nutrition and healthy habits.
          </Text>
        </View>

        <View style={styles.reviewCard}>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons key={i} name="star" size={20} color={COLORS.star} />
            ))}
          </View>
          <Text style={styles.reviewTitle}>Over 10,000+ with 5-star reviews worldwide</Text>
          <Text style={styles.reviewSubtitle}>
            Join thousands who have transformed their health with FuelFox
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Commit to my goal ></Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const macroStyles = StyleSheet.create({
  container: {
    marginVertical: SPACING.base,
  },
  bar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  segment: {
    height: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.medium,
    color: COLORS.textSecondary,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF3E8' },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 36,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  calorieRow: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  calorieLabel: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  calorieValue: {
    fontSize: FONTS.hero,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },
  bullets: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bulletText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textPrimary,
    fontWeight: FONTS.medium,
  },
  planDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  reviewTitle: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  reviewSubtitle: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.huge,
    backgroundColor: '#FFF3E8',
  },
  button: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonHeight / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    ...SHADOWS.large,
  },
  buttonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
