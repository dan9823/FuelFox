import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SIZES } from '../../src/constants/theme';
import { FoxAvatar } from '../../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.6;

export default function WhyFuelFoxWorksScreen() {
  const router = useRouter();

  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createFloat = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 8,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );

    createFloat(float1, 0).start();
    createFloat(float2, 300).start();
    createFloat(float3, 600).start();
  }, []);

  return (
    <LinearGradient
      colors={['#FFF3E8', '#FFF8F2', '#FFFFFF']}
      style={styles.gradient}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Why FuelFox's{'\n'}unique approach{'\n'}works
          </Text>

          {/* Three floating tilted cards */}
          <View style={styles.cardsContainer}>
            {/* Blue card - Photo */}
            <Animated.View
              style={[
                styles.floatingCard,
                styles.blueCard,
                {
                  transform: [
                    { rotate: '-6deg' },
                    { translateY: float1 },
                  ],
                  left: 10,
                  top: 0,
                  zIndex: 1,
                },
              ]}
            >
              <View style={styles.cardIconRow}>
                <View style={[styles.foodCircle, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={styles.foodCircleEmoji}>🍕</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>Just take a photo{'\n'}of your food</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>AI Powered</Text>
              </View>
            </Animated.View>

            {/* Dark grey card - Progress */}
            <Animated.View
              style={[
                styles.floatingCard,
                styles.darkCard,
                {
                  transform: [
                    { rotate: '3deg' },
                    { translateY: float2 },
                  ],
                  right: 10,
                  top: 40,
                  zIndex: 2,
                },
              ]}
            >
              <Text style={styles.darkCardLabel}>Total</Text>
              <Text style={styles.darkCardNumber}>680</Text>
              <Text style={styles.darkCardUnit}>KCAL</Text>
              <Text style={styles.cardSubLabel}>Track your daily progress</Text>
            </Animated.View>

            {/* Coral/orange card - Pet support */}
            <Animated.View
              style={[
                styles.floatingCard,
                styles.coralCard,
                {
                  transform: [
                    { rotate: '-3deg' },
                    { translateY: float3 },
                  ],
                  left: SCREEN_WIDTH * 0.15,
                  top: 200,
                  zIndex: 3,
                },
              ]}
            >
              <FoxAvatar mood="love" size={60} />
              <View style={styles.speechBubble}>
                <Text style={styles.speechText}>Love it!</Text>
              </View>
              <Text style={styles.coralSubtext}>Get support from{'\n'}your fox buddy</Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/fasting-knowledge')}
          >
            <Text style={styles.buttonText}>Let's go {'>'}</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 36,
  },
  cardsContainer: {
    flex: 1,
    position: 'relative',
  },
  floatingCard: {
    position: 'absolute',
    width: CARD_WIDTH,
    borderRadius: 20,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  // Blue card
  blueCard: {
    backgroundColor: '#4A90D9',
  },
  cardIconRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  foodCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodCircleEmoji: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  cardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Dark card
  darkCard: {
    backgroundColor: '#2C2C3A',
  },
  darkCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
  },
  darkCardNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 48,
  },
  darkCardUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: SPACING.sm,
  },
  cardSubLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  // Coral card
  coralCard: {
    backgroundColor: '#FF8A65',
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: SPACING.sm,
  },
  speechText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF8A65',
  },
  coralSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 18,
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
