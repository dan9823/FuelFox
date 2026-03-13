import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { FoxAvatar } from '../../src/components';
import { COLORS, FONTS, SPACING, SHADOWS, SIZES } from '../../src/constants/theme';

function FloatingDot({ size, color, top, left, delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const run = () => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    run();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 1, 0.4],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

function Sparkle({ top, left, delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        left,
        transform: [{ scale: anim }],
        opacity: anim,
      }}
    >
      <Ionicons name="sparkles" size={16} color={COLORS.primaryLight} />
    </Animated.View>
  );
}

export default function CreateAccountScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleApple = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/meal-plan-intro');
  };

  const handleGoogle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/meal-plan-intro');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Floating decorations */}
        <FloatingDot size={10} color={COLORS.primaryLight} top="30%" left="10%" delay={0} />
        <Sparkle top="35%" left="75%" delay={500} />
        <FloatingDot size={12} color={COLORS.info} top="50%" left="80%" delay={1000} />

        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Now let's{'\n'}create account</Text>
          <Text style={styles.subtitle}>
            Save your progress & reach your goals
          </Text>
        </Animated.View>

        {/* Fox */}
        <View style={styles.foxContainer}>
          <FoxAvatar mood="love" size={200} />
        </View>

        {/* Bottom buttons */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.appleButton}
            activeOpacity={0.8}
            onPress={handleApple}
          >
            <Ionicons name="logo-apple" size={22} color={COLORS.white} />
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.8}
            onPress={handleGoogle}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E8',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.massive,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.hero,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  foxContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.huge,
    gap: SPACING.md,
  },
  appleButton: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonHeight / 2,
    backgroundColor: COLORS.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    ...SHADOWS.large,
  },
  appleButtonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  googleButton: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonHeight / 2,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
});
