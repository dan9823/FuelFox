import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import ProgressBar from '../../src/components/ProgressBar';
import QuestionBubble from '../../src/components/QuestionBubble';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

const waterOptions = [
  {
    id: 'yes',
    label: 'Yes',
    icon: (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 40 }}>🥤</Text>
        <Text style={{ fontSize: 18, marginTop: 4 }}>✅</Text>
      </View>
    ),
  },
  {
    id: 'no',
    label: 'No',
    icon: (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 40 }}>🥤</Text>
        <Text style={{ fontSize: 18, marginTop: 4 }}>❌</Text>
      </View>
    ),
  },
  {
    id: 'not_sure',
    label: 'Not sure',
    icon: (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 40 }}>🤔</Text>
      </View>
    ),
  },
];

export default function WaterHabitScreen() {
  const router = useRouter();
  const { waterHabit, updateField } = useOnboarding();

  const handleSelect = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateField('waterHabit', id);
    setTimeout(() => {
      router.push('/onboarding/water-info');
    }, 400);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressWrapper}>
        <ProgressBar progress={0.8} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTag}>Eating habits</Text>

        <QuestionBubble question="Do you think you drink enough water?" />

        <View style={styles.cardsRow}>
          {waterOptions.map((item) => {
            const isSelected = waterHabit === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelect(item.id)}
              >
                <View style={styles.cardIcon}>{item.icon}</View>
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
  cardIcon: {
    marginBottom: SPACING.md,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
