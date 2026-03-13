import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { FoxAvatar } from '../../src/components';

const reviews = [
  {
    name: 'Felicia2',
    stars: 5,
    text: 'Exactly what I needed! I\'ve been trying to eat healthier for months, and this app made it so easy. The fox companion is adorable and actually motivates me to log my meals every day. The AI food scanner is crazy accurate too!',
  },
  {
    name: 'Joshua_la',
    stars: 5,
    text: 'Loving this app!!! The gamification aspect keeps me coming back. My fox is so happy when I hit my goals.',
  },
  {
    name: 'Criss.P',
    stars: 5,
    text: 'It\'s sooooo helpful... My little fox buddy reminds me to eat well and I actually look forward to logging my meals now. Never thought I\'d say that!',
  },
];

const Stars = ({ count }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Text key={i} style={styles.starIcon}>
        {i <= count ? '⭐' : '☆'}
      </Text>
    ))}
  </View>
);

export default function RatingPageScreen() {
  const router = useRouter();
  const { } = useOnboarding();

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Fox with star eyes */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.foxSection}>
          <FoxAvatar mood="excited" size={80} />
          <Text style={styles.starEyes}>🤩</Text>
        </Animated.View>

        {/* Titles */}
        <Animated.Text entering={FadeIn.delay(100).duration(400)} style={styles.subtitle}>
          Help us grow
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(200).duration(400)} style={styles.title}>
          Give us rating
        </Animated.Text>

        {/* Average rating badge */}
        <Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.ratingBadge}>
          <View style={styles.ratingStars}>
            <Stars count={5} />
          </View>
          <View style={styles.ratingInfo}>
            <Text style={styles.ratingNumber}>4.8 average rating</Text>
            <View style={styles.usersRow}>
              {/* User avatars */}
              <View style={styles.avatarStack}>
                <View style={[styles.avatar, styles.avatar1]}>
                  <Text style={styles.avatarText}>👩</Text>
                </View>
                <View style={[styles.avatar, styles.avatar2]}>
                  <Text style={styles.avatarText}>👨</Text>
                </View>
                <View style={[styles.avatar, styles.avatar3]}>
                  <Text style={styles.avatarText}>👩‍🦰</Text>
                </View>
              </View>
              <Text style={styles.usersText}>2M+ people</Text>
            </View>
          </View>
        </Animated.View>

        {/* Review cards */}
        {reviews.map((review, index) => (
          <Animated.View
            key={review.name}
            entering={FadeInDown.delay(400 + index * 150).duration(400)}
            style={styles.reviewCard}
          >
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>
                  {review.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <Stars count={review.stars} />
              </View>
            </View>
            <Text style={styles.reviewText} numberOfLines={4}>
              {review.text}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Next button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push('/onboarding/reminder-support')}
        >
          <Text style={styles.buttonText}>Next  &gt;</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
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
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.massive + SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  foxSection: {
    alignItems: 'center',
    marginBottom: SPACING.base,
    position: 'relative',
  },
  starEyes: {
    fontSize: 20,
    position: 'absolute',
    bottom: -4,
    right: '42%',
  },
  subtitle: {
    fontSize: FONTS.body,
    fontWeight: FONTS.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  ratingStars: {
    marginRight: SPACING.xs,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  starIcon: {
    fontSize: 14,
  },
  ratingInfo: {
    gap: 4,
  },
  ratingNumber: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  usersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarStack: {
    flexDirection: 'row',
    marginLeft: 0,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFE0B2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF9E6',
  },
  avatar1: { zIndex: 3 },
  avatar2: { marginLeft: -8, zIndex: 2, backgroundColor: '#BBDEFB' },
  avatar3: { marginLeft: -8, zIndex: 1, backgroundColor: '#FFE0C0' },
  avatarText: {
    fontSize: 12,
  },
  usersText: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  // Review cards
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  reviewAvatarText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewName: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    marginBottom: 2,
  },
  reviewText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  // Bottom
  bottomSection: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
    backgroundColor: '#FFF9E6',
  },
  button: {
    backgroundColor: COLORS.black,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  buttonText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
