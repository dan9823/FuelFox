import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SIZES } from '../src/constants/theme';
import { FoxAvatar } from '../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  // Floating animations
  const floatBowl = useRef(new Animated.Value(0)).current;
  const floatFox = useRef(new Animated.Value(0)).current;
  const floatWater = useRef(new Animated.Value(0)).current;
  const floatClock = useRef(new Animated.Value(0)).current;

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

    // Floating loop animations
    const createFloat = (anim, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -10,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 10,
            duration,
            useNativeDriver: true,
          }),
        ])
      );

    createFloat(floatBowl, 2000).start();
    createFloat(floatFox, 2500).start();
    createFloat(floatWater, 1800).start();
    createFloat(floatClock, 2200).start();
  }, []);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF3E8']}
      style={styles.gradient}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Floating elements area */}
          <View style={styles.floatingArea}>
            {/* Bowl - top left */}
            <Animated.View
              style={[
                styles.floatingItem,
                styles.bowlPosition,
                { transform: [{ translateY: floatBowl }] },
              ]}
            >
              <View style={styles.bowlCircle}>
                <Text style={styles.bowlEmoji}>🥗</Text>
              </View>
              <View style={styles.calorieLabel}>
                <Text style={styles.calorieLabelText}>310 kcal</Text>
              </View>
            </Animated.View>

            {/* Fox avatar - top right */}
            <Animated.View
              style={[
                styles.floatingItem,
                styles.foxPosition,
                { transform: [{ translateY: floatFox }] },
              ]}
            >
              <View style={styles.foxAvatar}>
                <FoxAvatar mood="waving" size={100} />
              </View>
              <View style={styles.heartsContainer}>
                <Text style={styles.heartText}>❤️</Text>
                <Text style={[styles.heartText, styles.heartSmall]}>💚</Text>
              </View>
            </Animated.View>

            {/* "With Cute fox" text with arrow */}
            <View style={styles.cuteFoxLabel}>
              <Text style={styles.cuteFoxText}>With Cute{'\n'}fox</Text>
              <Text style={styles.cuteArrow}>↗</Text>
            </View>

            {/* Water drop - left middle */}
            <Animated.View
              style={[
                styles.floatingItem,
                styles.waterPosition,
                { transform: [{ translateY: floatWater }] },
              ]}
            >
              <View style={styles.waterCircle}>
                <Text style={styles.waterEmoji}>💧</Text>
              </View>
            </Animated.View>

            {/* Fasting clock - right middle */}
            <Animated.View
              style={[
                styles.floatingItem,
                styles.clockPosition,
                { transform: [{ translateY: floatClock }] },
              ]}
            >
              <View style={styles.clockCircle}>
                <Text style={styles.clockText}>16:8</Text>
              </View>
            </Animated.View>
          </View>

          {/* Main text */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>
              Reach your{'\n'}weight goals
            </Text>
          </Animated.View>

          {/* Bottom section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => router.push('/onboarding-carousel')}
            >
              <Text style={styles.buttonText}>Get started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              activeOpacity={0.6}
              onPress={() => router.push('/onboarding/create-account')}
            >
              <Text style={styles.loginText}>I already have an account</Text>
            </TouchableOpacity>

            <Text style={styles.legalText}>
              By continuing you're accepting our{' '}
              <Text style={styles.legalLink}>Terms of Use</Text> and{' '}
              <Text style={styles.legalLink}>Privacy Notice</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  floatingArea: {
    flex: 1,
    position: 'relative',
    minHeight: 280,
  },
  floatingItem: {
    position: 'absolute',
  },
  bowlPosition: {
    top: 40,
    left: 20,
  },
  foxPosition: {
    top: 30,
    right: 20,
  },
  cuteFoxLabel: {
    position: 'absolute',
    top: 120,
    right: 90,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  cuteFoxText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  cuteArrow: {
    fontSize: 20,
    color: COLORS.textSecondary,
    marginTop: -4,
  },
  waterPosition: {
    top: 180,
    left: 30,
  },
  clockPosition: {
    top: 170,
    right: 30,
  },
  bowlCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bowlEmoji: {
    fontSize: 36,
  },
  calorieLabel: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: -8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  calorieLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  foxAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF0E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heartsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: -6,
    right: -10,
    gap: 2,
  },
  heartText: {
    fontSize: 16,
  },
  heartSmall: {
    fontSize: 12,
    marginTop: -4,
  },
  waterCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  waterEmoji: {
    fontSize: 28,
  },
  clockCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  clockText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  textContainer: {
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.black,
    lineHeight: 44,
    textAlign: 'center',
  },
  bottomSection: {
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
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
  loginLink: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  loginText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.medium,
    color: COLORS.textPrimary,
    textDecorationLine: 'underline',
  },
  legalText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: SPACING.xl,
  },
  legalLink: {
    textDecorationLine: 'underline',
  },
});
