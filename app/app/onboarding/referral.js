import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { referralSources } from '../../src/constants/onboardingData';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

export default function ReferralScreen() {
  const router = useRouter();
  const { referralSource, updateField } = useOnboarding();

  const handleSelect = (id) => {
    updateField('referralSource', id);
  };

  const hasSelection = !!referralSource;

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
          <Text style={styles.title}>How did you hear{'\n'}about us?</Text>

          <View style={styles.options}>
            {referralSources.map((item) => {
              const isSelected = referralSource === item.id;
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
        </ScrollView>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => {
              router.push('/onboarding/main-goal');
            }}
          >
            <Text style={styles.buttonText}>
              {hasSelection ? 'Next >' : 'Skip >'}
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
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
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
    fontSize: 24,
  },
  optionLabel: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.black,
  },
  optionLabelSelected: {
    color: COLORS.primaryDark,
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
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
