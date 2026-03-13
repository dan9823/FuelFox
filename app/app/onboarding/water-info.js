import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

export default function WaterInfoScreen() {
  const router = useRouter();
  const { waterGoalMl } = useOnboarding();

  const glasses = Math.round(waterGoalMl / 250);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>💧</Text>
        <Text style={styles.title}>Your water goal</Text>
        <Text style={styles.goalAmount}>{waterGoalMl} ml</Text>
        <Text style={styles.goalGlasses}>That's about {glasses} glasses per day</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why hydration matters</Text>
          <View style={styles.infoItems}>
            {[
              { emoji: '🧠', text: 'Improves focus and mental clarity' },
              { emoji: '💪', text: 'Supports muscle recovery' },
              { emoji: '🔥', text: 'Boosts metabolism and fat burning' },
              { emoji: '✨', text: 'Keeps your skin healthy and glowing' },
            ].map((item, i) => (
              <View key={i} style={styles.infoRow}>
                <Text style={styles.infoEmoji}>{item.emoji}</Text>
                <Text style={styles.infoText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push('/onboarding/eating-changes')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: {
    flex: 1, padding: SPACING.xl, paddingTop: SPACING.massive, alignItems: 'center',
  },
  emoji: { fontSize: 64, marginBottom: SPACING.lg },
  title: { fontSize: FONTS.h2, fontWeight: FONTS.bold, color: COLORS.black, marginBottom: SPACING.sm },
  goalAmount: {
    fontSize: 48, fontWeight: FONTS.bold, color: COLORS.water, marginBottom: SPACING.xs,
  },
  goalGlasses: {
    fontSize: FONTS.body, color: COLORS.textSecondary, marginBottom: SPACING.xxl,
  },
  infoCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: SPACING.base,
    width: '100%', ...SHADOWS.card,
  },
  infoTitle: {
    fontSize: FONTS.body, fontWeight: FONTS.bold, color: COLORS.black, marginBottom: SPACING.md,
  },
  infoItems: { gap: SPACING.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  infoEmoji: { fontSize: 20 },
  infoText: { flex: 1, fontSize: FONTS.bodySmall, color: COLORS.textSecondary, lineHeight: 20 },
  bottomSection: { padding: SPACING.xl, paddingBottom: SPACING.huge },
  button: {
    backgroundColor: COLORS.primary, height: SIZES.buttonHeight, borderRadius: RADIUS.card,
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.button,
  },
  buttonText: { fontSize: FONTS.h4, fontWeight: FONTS.bold, color: COLORS.white },
});
