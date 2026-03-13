import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
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

export default function TargetWeightScreen() {
  const router = useRouter();
  const { targetWeightKg, weightKg, mainGoal, updateField } = useOnboarding();

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

  const defaultWhole = targetWeightKg
    ? Math.floor(targetWeightKg) - MIN_KG
    : weightKg
    ? Math.floor(weightKg) - MIN_KG
    : 40;
  const defaultDec = targetWeightKg
    ? Math.round((targetWeightKg % 1) * 10)
    : 0;

  const [wholeIndex, setWholeIndex] = useState(Math.max(0, defaultWhole));
  const [decIndex, setDecIndex] = useState(defaultDec);

  const currentTarget = wholeKgs[wholeIndex] + decIndex * 0.1;
  const diff = weightKg ? Math.round((currentTarget - weightKg) * 10) / 10 : 0;
  const absDiff = Math.abs(diff);
  const isLosing = diff < 0;
  const isMaintaining = Math.abs(diff) < 0.5;
  const isGaining = diff > 0;

  const handleWholeChange = (index) => {
    setWholeIndex(index);
    const w = wholeKgs[index] + decIndex * 0.1;
    updateField('targetWeightKg', Math.round(w * 10) / 10);
  };

  const handleDecChange = (index) => {
    setDecIndex(index);
    const w = wholeKgs[wholeIndex] + index * 0.1;
    updateField('targetWeightKg', Math.round(w * 10) / 10);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!targetWeightKg) {
      updateField('targetWeightKg', currentTarget);
    }
    router.push('/onboarding/realistic-target');
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

  const actionText = isMaintaining
    ? 'Maintain weight'
    : isLosing
    ? `Lose ${absDiff.toFixed(1)} kg`
    : `Gain ${absDiff.toFixed(1)} kg`;

  const isRealistic = absDiff <= 20;

  const motivationalText = isMaintaining
    ? 'Maintaining your current weight is a great choice. We will help you stay on track!'
    : isLosing
    ? 'A steady pace of 0.5-1 kg per week is healthy and sustainable. You got this!'
    : 'Building mass requires patience and good nutrition. We will guide you through it!';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressWrapper}>
        <ProgressBar progress={0.8} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTag}>Personal details</Text>

          <QuestionBubble question="What's your target weight?" />

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
                {kgToLbs(currentTarget)} lbs
              </Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.actionText}>{actionText}</Text>
              {isRealistic && (
                <View style={styles.realisticBadge}>
                  <Text style={styles.realisticText}>Realistic</Text>
                </View>
              )}
            </View>
            <Text style={styles.motivationalText}>{motivationalText}</Text>
            <Pressable style={styles.sourceLink}>
              <Text style={styles.sourceLinkText}>Source of recommendations</Text>
            </Pressable>
          </View>
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
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    ...SHADOWS.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  actionText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  realisticBadge: {
    backgroundColor: '#FFF3E8',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
  realisticText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  motivationalText: {
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
