import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import ProgressBar from '../../src/components/ProgressBar';
import QuestionBubble from '../../src/components/QuestionBubble';
import ScrollPicker from '../../src/components/ScrollPicker';
import CTAButton from '../../src/components/CTAButton';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

const MIN_AGE = 14;
const MAX_AGE = 80;

export default function AgeSelectScreen() {
  const router = useRouter();
  const { age, updateField } = useOnboarding();

  const ages = useMemo(() => {
    const arr = [];
    for (let i = MIN_AGE; i <= MAX_AGE; i++) {
      arr.push(i);
    }
    return arr;
  }, []);

  const defaultIndex = age ? age - MIN_AGE : 11;
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    const selectedAge = ages[index];
    updateField('age', selectedAge);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!age) {
      updateField('age', ages[selectedIndex]);
    }
    router.push('/onboarding/activity-level');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressWrapper}>
        <ProgressBar progress={0.2} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTag}>Personal details</Text>

        <QuestionBubble question="What's your age?" />

        <View style={styles.pickerWrapper}>
          <ScrollPicker
            items={ages}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />
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
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
});
