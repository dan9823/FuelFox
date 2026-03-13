import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { eatingHabitChanges } from '../../src/constants/onboardingData';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

export default function EatingChangesScreen() {
  const router = useRouter();
  const { eatingChanges, toggleArrayItem } = useOnboarding();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What eating habits{'\n'}would you like to change?</Text>
        <Text style={styles.subtitle}>Select all that apply</Text>

        <View style={styles.options}>
          {eatingHabitChanges.map((item) => {
            const isSelected = eatingChanges.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.option, isSelected && styles.optionSelected]}
                activeOpacity={0.7}
                onPress={() => toggleArrayItem('eatingChanges', item.id)}
              >
                <Text style={styles.optionEmoji}>{item.emoji}</Text>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {item.label}
                </Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.button, eatingChanges.length === 0 && styles.buttonDisabled]}
          activeOpacity={0.8}
          disabled={eatingChanges.length === 0}
          onPress={() => router.push('/onboarding/goals-confirmation')}
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
  subtitle: { fontSize: FONTS.body, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  options: { gap: SPACING.md },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADIUS.card, padding: SPACING.base, gap: SPACING.md,
    borderWidth: 2, borderColor: 'transparent', ...SHADOWS.small,
  },
  optionSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryFaded },
  optionEmoji: { fontSize: 22 },
  optionLabel: { flex: 1, fontSize: FONTS.body, fontWeight: FONTS.medium, color: COLORS.black },
  optionLabelSelected: { color: COLORS.primaryDark },
  checkmark: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.primary },
  bottomSection: { padding: SPACING.xl, paddingBottom: SPACING.huge },
  button: {
    backgroundColor: COLORS.primary, height: SIZES.buttonHeight, borderRadius: RADIUS.card,
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.button,
  },
  buttonDisabled: { backgroundColor: COLORS.inactive, shadowOpacity: 0 },
  buttonText: { fontSize: FONTS.h4, fontWeight: FONTS.bold, color: COLORS.white },
});
