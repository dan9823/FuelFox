import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

const RANDOM_NAMES = [
  'Rocky', 'Bandit', 'Cookie', 'Mochi', 'Rascal',
  'Biscuit', 'Pepper', 'Oreo', 'Shadow', 'Ziggy',
  'Mango', 'Nutmeg', 'Waffles', 'Patches', 'Pebble',
  'Coco', 'Finn', 'Scout', 'Luna', 'Clover',
];

export default function NamePetScreen() {
  const router = useRouter();
  const { foxName, updateField } = useOnboarding();

  const generateRandomName = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const filtered = RANDOM_NAMES.filter((n) => n !== foxName);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    updateField('foxName', filtered[randomIndex]);
  }, [foxName, updateField]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color={COLORS.black} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Title */}
          <Animated.Text entering={FadeIn.duration(400)} style={styles.title}>
            This fox is now{'\n'}your virtual pet
          </Animated.Text>

          {/* Large fox */}
          <View style={styles.foxContainer}>
            <FoxAvatar mood="happy" size={120} />
          </View>

          {/* Name input section */}
          <Animated.View
            entering={FadeIn.delay(200).duration(400)}
            style={styles.inputSection}
          >
            <Text style={styles.inputLabel}>Name your fox</Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.nameInput}
                placeholder="Enter a name"
                placeholderTextColor={COLORS.textMuted}
                value={foxName}
                onChangeText={(text) => updateField('foxName', text)}
                maxLength={20}
                autoFocus={false}
                textAlign="center"
              />
              <TouchableOpacity
                style={styles.diceButton}
                onPress={generateRandomName}
                activeOpacity={0.7}
              >
                <Ionicons name="dice-outline" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {foxName.trim().length > 0 && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.previewCard}>
              <Text style={styles.previewText}>
                "Hi! I'm <Text style={styles.previewName}>{foxName}</Text>!
                Let's get healthy together!"
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Next button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.button, !foxName.trim() && styles.buttonDisabled]}
            activeOpacity={0.8}
            disabled={!foxName.trim()}
            onPress={() => router.push('/onboarding/rating-page')}
          >
            <Text style={styles.buttonText}>Next  &gt;</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: SPACING.base,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.massive + SPACING.xxl,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 32,
  },
  foxContainer: {
    marginBottom: SPACING.xxl,
  },
  inputSection: {
    width: '100%',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: SPACING.sm,
  },
  nameInput: {
    flex: 1,
    height: SIZES.inputHeight + 8,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.lg,
    fontSize: 26,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    ...SHADOWS.small,
  },
  diceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  previewCard: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primaryFaded,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    width: '100%',
  },
  previewText: {
    fontSize: FONTS.body,
    color: COLORS.primaryDark,
    textAlign: 'center',
    lineHeight: 24,
  },
  previewName: {
    fontWeight: FONTS.bold,
  },
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: COLORS.black,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  buttonDisabled: {
    backgroundColor: COLORS.inactive,
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
