import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { calculateBMI, getBMICategory } from '../../src/utils/calculations';
import ProgressBar from '../../src/components/ProgressBar';
import QuestionBubble from '../../src/components/QuestionBubble';
import ScrollPicker from '../../src/components/ScrollPicker';
import CTAButton from '../../src/components/CTAButton';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

const MIN_KG = 30;
const MAX_KG = 200;

function kgToLbs(kg) {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export default function CurrentWeightScreen() {
  const router = useRouter();
  const { weightKg, heightCm, updateField } = useOnboarding();

  const [useKg, setUseKg] = useState(true);

  const wholeKgs = useMemo(() => {
    const arr = [];
    for (let i = MIN_KG; i <= MAX_KG; i++) {
      arr.push(i);
    }
    return arr;
  }, []);

  const decimals = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= 9; i++) {
      arr.push(`.${i}`);
    }
    return arr;
  }, []);

  const defaultWholeIndex = weightKg ? Math.floor(weightKg) - MIN_KG : 40;
  const defaultDecIndex = weightKg ? Math.round((weightKg % 1) * 10) : 0;

  const [wholeIndex, setWholeIndex] = useState(Math.max(0, defaultWholeIndex));
  const [decIndex, setDecIndex] = useState(defaultDecIndex);

  const currentWeight = wholeKgs[wholeIndex] + decIndex * 0.1;

  const handleWholeChange = (index) => {
    setWholeIndex(index);
    const w = wholeKgs[index] + decIndex * 0.1;
    updateField('weightKg', Math.round(w * 10) / 10);
  };

  const handleDecChange = (index) => {
    setDecIndex(index);
    const w = wholeKgs[wholeIndex] + index * 0.1;
    updateField('weightKg', Math.round(w * 10) / 10);
  };

  const bmi = calculateBMI(currentWeight, heightCm);
  const bmiCategory = getBMICategory(bmi);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!weightKg) {
      updateField('weightKg', currentWeight);
    }
    router.push('/onboarding/personal-summary');
  };

  const toggleUnit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUseKg(!useKg);
  };

  const unitToggle = (
    <View style={styles.unitToggle}>
      <Pressable onPress={() => { if (!useKg) toggleUnit(); }}>
        <Text style={[styles.unitText, useKg && styles.unitTextActive]}>kg</Text>
      </Pressable>
      <Pressable onPress={() => { if (useKg) toggleUnit(); }}>
        <Text style={[styles.unitText, !useKg && styles.unitTextActive]}>lbs</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressWrapper}>
        <ProgressBar progress={0.6} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTag}>Personal details</Text>

          <QuestionBubble question="What's your current weight?" />

          <View style={styles.pickerWrapper}>
            <ScrollPicker
              columns={[
                {
                  items: wholeKgs,
                  selectedIndex: wholeIndex,
                  onSelect: handleWholeChange,
                  width: 80,
                },
                {
                  items: decimals,
                  selectedIndex: decIndex,
                  onSelect: handleDecChange,
                  width: 60,
                },
              ]}
              unitToggle={unitToggle}
            />
            {!useKg && (
              <Text style={styles.convertedText}>
                {kgToLbs(currentWeight)} lbs
              </Text>
            )}
          </View>

          {bmi > 0 && (
            <View style={styles.bmiCard}>
              <View style={styles.bmiRow}>
                <Text style={styles.bmiLabel}>Your BMI:</Text>
                <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
                <View style={[styles.bmiBadge, { backgroundColor: bmiCategory.color }]}>
                  <Text style={styles.bmiBadgeText}>{bmiCategory.label}</Text>
                </View>
              </View>
              <Text style={styles.bmiDescription}>{bmiCategory.description}</Text>
              <Pressable style={styles.sourceLink}>
                <Text style={styles.sourceLinkText}>Source of recommendations</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <CTAButton title="Next >" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  progressWrapper: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
  },
  sectionTag: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.base,
  },
  pickerWrapper: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  convertedText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  unitToggle: {
    gap: SPACING.md,
  },
  unitText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.semiBold,
    color: COLORS.textMuted,
    paddingVertical: SPACING.xs,
  },
  unitTextActive: {
    color: COLORS.black,
    fontWeight: FONTS.bold,
  },
  bmiCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    ...SHADOWS.card,
  },
  bmiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bmiLabel: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  bmiValue: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.md,
  },
  bmiBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
  bmiBadgeText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  bmiDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  sourceLink: {
    paddingVertical: SPACING.xs,
  },
  sourceLinkText: {
    fontSize: FONTS.caption,
    color: COLORS.info,
    textDecorationLine: 'underline',
  },
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
});
