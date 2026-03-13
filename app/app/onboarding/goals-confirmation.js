import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { mainGoals, dietTypes } from '../../src/constants/onboardingData';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

export default function GoalsConfirmationScreen() {
  const router = useRouter();
  const { mainGoal, dietType, eatingWindowStart, eatingWindowEnd, fastingHours, foxName } = useOnboarding();

  const goalLabel = mainGoals.find((g) => g.id === mainGoal)?.label || 'Not set';
  const dietLabel = dietTypes.find((d) => d.id === dietType)?.label || 'Not set';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Great choices!</Text>
        <Text style={styles.subtitle}>Here is a summary of your preferences</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryEmoji}>🎯</Text>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Main goal</Text>
              <Text style={styles.summaryValue}>{goalLabel}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryEmoji}>🥗</Text>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Diet type</Text>
              <Text style={styles.summaryValue}>{dietLabel}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryEmoji}>⏰</Text>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Fasting schedule</Text>
              <Text style={styles.summaryValue}>
                {fastingHours}h fasting ({eatingWindowStart} - {eatingWindowEnd})
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <FoxAvatar mood="happy" size={80} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Your buddy</Text>
              <Text style={styles.summaryValue}>{foxName || 'Not named yet'}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.nextStepText}>
          Now let us get some personal details to calculate your perfect plan!
        </Text>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push('/onboarding/gender-select')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl, paddingTop: SPACING.massive, paddingBottom: SPACING.xxl },
  title: { fontSize: FONTS.h1, fontWeight: FONTS.bold, color: COLORS.black, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONTS.body, color: COLORS.textSecondary, marginBottom: SPACING.xxl },
  summaryCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: SPACING.lg,
    marginBottom: SPACING.xxl, ...SHADOWS.card,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm },
  summaryEmoji: { fontSize: 28 },
  summaryInfo: { flex: 1 },
  summaryLabel: { fontSize: FONTS.caption, color: COLORS.textMuted, marginBottom: 2 },
  summaryValue: { fontSize: FONTS.body, fontWeight: FONTS.semiBold, color: COLORS.black },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.xs },
  nextStepText: {
    fontSize: FONTS.body, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24,
  },
  bottomSection: { padding: SPACING.xl, paddingBottom: SPACING.huge },
  button: {
    backgroundColor: COLORS.primary, height: SIZES.buttonHeight, borderRadius: RADIUS.card,
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.button,
  },
  buttonText: { fontSize: FONTS.h4, fontWeight: FONTS.bold, color: COLORS.white },
});
