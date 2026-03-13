import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { genders } from '../../src/constants/onboardingData';
import ProgressBar from '../../src/components/ProgressBar';
import QuestionBubble from '../../src/components/QuestionBubble';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

export default function GenderSelectScreen() {
  const router = useRouter();
  const { gender, updateField } = useOnboarding();

  const handleSelect = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateField('gender', id);
    setTimeout(() => {
      router.push('/onboarding/age-select');
    }, 400);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressWrapper}>
        <ProgressBar progress={0.1} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTag}>Personal details</Text>

        <QuestionBubble question="Select your gender." />

        <View style={styles.cardsRow}>
          {genders.map((item) => {
            const isSelected = gender === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelect(item.id)}
              >
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
  cardsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xxl,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.card,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryFaded,
  },
  cardEmoji: {
    fontSize: 44,
    marginBottom: SPACING.md,
  },
  cardLabel: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  cardLabelSelected: {
    color: COLORS.primaryDark,
  },
});
