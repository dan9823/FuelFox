import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

export default function RealisticTargetScreen() {
  const router = useRouter();
  const { weightKg, targetWeightKg } = useOnboarding();

  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const burstAnim = useRef(new Animated.Value(0)).current;

  const diff = (targetWeightKg || weightKg || 70) - (weightKg || 70);
  const absDiff = Math.abs(diff);
  const isMaintaining = absDiff < 0.5;
  const isLosing = diff < 0;

  const headlineText = isMaintaining
    ? `Maintaining ${Math.round(weightKg || 70)} kg is a realistic target`
    : isLosing
    ? `Losing ${absDiff.toFixed(1)} kg is a realistic target`
    : `Gaining ${absDiff.toFixed(1)} kg is a realistic target`;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(burstAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/personalizing-plan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        {/* Radial burst lines */}
        <Animated.View
          style={[
            styles.burstContainer,
            {
              opacity: burstAnim,
              transform: [
                {
                  scale: burstAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.burstLine,
                {
                  transform: [{ rotate: `${i * 30}deg` }],
                },
              ]}
            />
          ))}
        </Animated.View>

        <View style={styles.content}>
          <Animated.View
            style={{
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
              alignItems: 'center',
            }}
          >
            <FoxAvatar mood="excited" size={140} />
          </Animated.View>

          <Animated.View style={{ opacity: opacityAnim, alignItems: 'center' }}>
            <Text style={styles.title}>{headlineText}</Text>
            <Text style={styles.subtitle}>
              You are just one step away from getting your personalized plan
            </Text>
          </Animated.View>
        </View>

        <View style={styles.bottomSection}>
          <Pressable style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Get my personal plan</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8E1' },
  background: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  burstContainer: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    width: 300,
    height: 300,
    marginLeft: -150,
    marginTop: -150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burstLine: {
    position: 'absolute',
    width: 2,
    height: 150,
    backgroundColor: '#FFD54F',
    opacity: 0.4,
    top: 0,
    left: '50%',
    marginLeft: -1,
    transformOrigin: 'bottom center',
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: SPACING.base,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.base,
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
  buttonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
