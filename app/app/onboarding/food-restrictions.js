import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { foodRestrictions } from '../../src/constants/onboardingData';
import ProgressBar from '../../src/components/ProgressBar';
import QuestionBubble from '../../src/components/QuestionBubble';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

export default function FoodRestrictionsScreen() {
  const router = useRouter();
  const { foodRestrictions: selected, toggleArrayItem } = useOnboarding();

  const handleChipPress = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleArrayItem('foodRestrictions', id);
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/water-habit');
  };

  const noneSelected = selected.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressWrapper}>
        <ProgressBar progress={0.7} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTag}>Eating habits</Text>

        <QuestionBubble question="Do you have any food restrictions or allergies?" />

        <View style={styles.chipsContainer}>
          {foodRestrictions.map((item) => {
            const isSelected = selected.includes(item.id);
            return (
              <Pressable
                key={item.id}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleChipPress(item.id)}
              >
                <View style={[styles.dot, isSelected && styles.dotSelected]} />
                <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.addChip} onPress={handleAddPress}>
            <Ionicons name="add" size={18} color={COLORS.textSecondary} />
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Pressable style={styles.button} onPress={handleNext}>
          <View style={styles.buttonContent}>
            {noneSelected && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.white}
                style={styles.buttonIcon}
              />
            )}
            <Text style={styles.buttonText}>
              {noneSelected ? 'I eat everything' : 'Next >'}
            </Text>
          </View>
        </Pressable>
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
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  sectionTag: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.base,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.base,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  chipSelected: {
    borderColor: COLORS.orange,
    backgroundColor: COLORS.white,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.inactive,
    marginRight: SPACING.sm,
  },
  dotSelected: {
    backgroundColor: COLORS.orange,
  },
  chipLabel: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.medium,
    color: COLORS.textPrimary,
  },
  chipLabelSelected: {
    color: COLORS.orangeDark,
    fontWeight: FONTS.semiBold,
  },
  addChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
  button: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonHeight / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    ...SHADOWS.large,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  buttonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
