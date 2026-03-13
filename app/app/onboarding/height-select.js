import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import ProgressBar from '../../src/components/ProgressBar';
import QuestionBubble from '../../src/components/QuestionBubble';
import ScrollPicker from '../../src/components/ScrollPicker';
import CTAButton from '../../src/components/CTAButton';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

const MIN_HEIGHT_CM = 120;
const MAX_HEIGHT_CM = 220;

function cmToFtIn(cm) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

function ftInToCm(feet, inches) {
  return Math.round((feet * 12 + inches) * 2.54);
}

export default function HeightSelectScreen() {
  const router = useRouter();
  const { heightCm, updateField } = useOnboarding();

  const [useCm, setUseCm] = useState(true);

  const heights = useMemo(() => {
    const arr = [];
    for (let i = MIN_HEIGHT_CM; i <= MAX_HEIGHT_CM; i++) {
      arr.push(i);
    }
    return arr;
  }, []);

  const defaultIndex = heightCm ? heightCm - MIN_HEIGHT_CM : 50;
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    const selected = heights[index];
    updateField('heightCm', selected);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!heightCm) {
      updateField('heightCm', heights[selectedIndex]);
    }
    router.push('/onboarding/current-weight');
  };

  const toggleUnit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUseCm(!useCm);
  };

  const displayValue = useCm
    ? `${heights[selectedIndex]} cm`
    : cmToFtIn(heights[selectedIndex]);

  const unitToggle = (
    <View style={styles.unitToggle}>
      <Pressable onPress={() => { if (!useCm) toggleUnit(); }}>
        <Text style={[styles.unitText, useCm && styles.unitTextActive]}>cm</Text>
      </Pressable>
      <Pressable onPress={() => { if (useCm) toggleUnit(); }}>
        <Text style={[styles.unitText, !useCm && styles.unitTextActive]}>ft</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressWrapper}>
        <ProgressBar progress={0.4} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTag}>Personal details</Text>

        <QuestionBubble question="How tall are you?" />

        <View style={styles.pickerWrapper}>
          <ScrollPicker
            items={heights}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
            suffix={useCm ? 'cm' : undefined}
            unitToggle={unitToggle}
          />
          {!useCm && (
            <Text style={styles.convertedText}>{cmToFtIn(heights[selectedIndex])}</Text>
          )}
        </View>
      </View>

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
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
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
});
