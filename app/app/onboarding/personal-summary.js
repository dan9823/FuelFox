import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { getBMICategory } from '../../src/utils/calculations';
import { activityLevels, dietTypes } from '../../src/constants/onboardingData';
import CTAButton from '../../src/components/CTAButton';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

const BMI_RANGES = [
  { label: 'Underweight', min: 0, max: 18.5, color: '#42A5F5' },
  { label: 'Normal', min: 18.5, max: 25, color: '#E8813A' },
  { label: 'Overweight', min: 25, max: 30, color: '#FF9800' },
  { label: 'Obese', min: 30, max: 50, color: '#EF5353' },
];

const GRADIENT_COLORS = ['#42A5F5', '#E8813A', '#F5A860', '#FFEB3B', '#FF9800', '#EF5353'];

function BMIBar({ bmi }) {
  const minScale = 15;
  const maxScale = 40;
  const range = maxScale - minScale;
  const clampedBMI = Math.max(minScale, Math.min(maxScale, bmi));
  const markerPosition = ((clampedBMI - minScale) / range) * 100;

  const category = getBMICategory(bmi);

  return (
    <View style={bmiStyles.container}>
      <View style={bmiStyles.markerRow}>
        <View style={[bmiStyles.markerContainer, { left: `${markerPosition}%` }]}>
          <View style={bmiStyles.youBadge}>
            <Text style={bmiStyles.youText}>You: {bmi.toFixed(1)}</Text>
          </View>
          <View style={bmiStyles.markerLine} />
          <View style={bmiStyles.markerDot} />
        </View>
      </View>

      <View style={bmiStyles.bar}>
        {GRADIENT_COLORS.map((color, i) => (
          <View
            key={i}
            style={[
              bmiStyles.barSegment,
              {
                backgroundColor: color,
                flex: 1,
                borderTopLeftRadius: i === 0 ? 6 : 0,
                borderBottomLeftRadius: i === 0 ? 6 : 0,
                borderTopRightRadius: i === GRADIENT_COLORS.length - 1 ? 6 : 0,
                borderBottomRightRadius: i === GRADIENT_COLORS.length - 1 ? 6 : 0,
              },
            ]}
          />
        ))}
      </View>

      <View style={bmiStyles.labels}>
        <Text style={bmiStyles.scaleLabel}>15</Text>
        <Text style={bmiStyles.scaleLabel}>18.5</Text>
        <Text style={bmiStyles.scaleLabel}>25</Text>
        <Text style={bmiStyles.scaleLabel}>30</Text>
        <Text style={bmiStyles.scaleLabel}>40</Text>
      </View>

      <View style={bmiStyles.categoryLabels}>
        <Text style={[bmiStyles.categoryLabel, { color: '#42A5F5' }]}>Underweight</Text>
        <Text style={[bmiStyles.categoryLabel, { color: '#E8813A' }]}>Normal</Text>
        <Text style={[bmiStyles.categoryLabel, { color: '#FF9800' }]}>Overweight</Text>
        <Text style={[bmiStyles.categoryLabel, { color: '#EF5353' }]}>Obese</Text>
      </View>

      <View style={[bmiStyles.messageCard, { backgroundColor: category.color + '18' }]}>
        <Text style={[bmiStyles.messageTitle, { color: category.color }]}>
          {category.label === 'Normal' ? 'Healthy BMI' : category.label}
        </Text>
        <Text style={bmiStyles.messageText}>
          {category.label === 'Normal'
            ? "You're right where you need to be!"
            : category.description}
        </Text>
      </View>
    </View>
  );
}

export default function PersonalSummaryScreen() {
  const router = useRouter();
  const { bmi, activityLevel, dietType, gender, age } = useOnboarding();

  const activityInfo = activityLevels.find((a) => a.id === activityLevel);
  const dietInfo = dietTypes.find((d) => d.id === dietType);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/target-weight');
  };

  const metabolismText = gender === 'male'
    ? 'Higher lean mass tends to support a faster resting metabolism.'
    : gender === 'female'
    ? 'Hormonal cycles can slightly affect metabolic rate throughout the month.'
    : 'Individual metabolic rates vary based on body composition and activity.';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <FoxAvatar mood="thinking" size={100} />
          <Text style={styles.title}>Your personal summary</Text>
        </View>

        <BMIBar bmi={bmi || 22} />

        <View style={styles.infoRows}>
          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>🏃</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Activity level</Text>
              <Text style={styles.infoValue}>
                {activityInfo ? activityInfo.label : 'Not set'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>🥗</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Diet type</Text>
              <Text style={styles.infoValue}>
                {dietInfo ? dietInfo.label : 'Not set'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>🔥</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Metabolism</Text>
              <Text style={styles.infoDesc}>{metabolismText}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <CTAButton title="Next >" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const bmiStyles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  markerRow: {
    height: 50,
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -30 }],
  },
  youBadge: {
    backgroundColor: COLORS.black,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    marginBottom: 4,
  },
  youText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  markerLine: {
    width: 2,
    height: 8,
    backgroundColor: COLORS.black,
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.black,
  },
  bar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barSegment: {
    height: 12,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    paddingHorizontal: 2,
  },
  scaleLabel: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    fontWeight: FONTS.medium,
  },
  categoryLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.xs,
  },
  categoryLabel: {
    fontSize: FONTS.tiny,
    fontWeight: FONTS.semiBold,
  },
  messageCard: {
    marginTop: SPACING.md,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
  },
  messageTitle: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  messageText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF3E8' },
  content: {
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
  },
  infoRows: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    ...SHADOWS.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  infoEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  infoDesc: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.huge,
    backgroundColor: '#FFF3E8',
  },
});
