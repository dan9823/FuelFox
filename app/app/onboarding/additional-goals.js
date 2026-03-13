import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { additionalGoals } from '../../src/constants/onboardingData';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

export default function AdditionalGoalsScreen() {
  const router = useRouter();
  const { additionalGoals: selected, toggleArrayItem } = useOnboarding();

  const hasSelection = selected.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Any additional{'\n'}goals?</Text>

          <View style={styles.options}>
            {additionalGoals.map((item) => {
              const isSelected = selected.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.option,
                    isSelected && styles.optionSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => toggleArrayItem('additionalGoals', item.id)}
                >
                  <Text style={styles.optionEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {/* Circular checkbox */}
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/long-term-results')}
          >
            <Text style={styles.buttonText}>
              {hasSelection ? 'Next >' : 'No additional goals >'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.base,
    marginTop: SPACING.sm,
  },
  backArrow: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  content: {
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    marginBottom: SPACING.xl,
  },
  options: {
    gap: SPACING.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    gap: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionLabel: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: FONTS.medium,
    color: COLORS.black,
  },
  optionLabelSelected: {
    color: COLORS.primaryDark,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#D1D1DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: COLORS.black,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
