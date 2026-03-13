import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { mainGoals } from '../../src/constants/onboardingData';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

export default function MainGoalScreen() {
  const router = useRouter();
  const { mainGoal, updateField } = useOnboarding();

  const handleSelect = (id) => {
    updateField('mainGoal', id);
    // Auto-navigate after brief delay
    setTimeout(() => {
      router.push('/onboarding/additional-goals');
    }, 400);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>What is your{'\n'}main goal?</Text>

          <View style={styles.options}>
            {mainGoals.map((item) => {
              const isSelected = mainGoal === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.option,
                    isSelected && styles.optionSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(item.id)}
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
                </TouchableOpacity>
              );
            })}
          </View>
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
    flex: 1,
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    marginBottom: SPACING.xxl,
  },
  options: {
    gap: SPACING.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
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
    fontSize: 28,
  },
  optionLabel: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.semiBold,
    color: COLORS.black,
  },
  optionLabelSelected: {
    color: COLORS.primaryDark,
  },
});
