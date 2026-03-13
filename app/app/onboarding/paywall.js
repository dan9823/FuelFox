import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sophie',
    flag: '🇬🇧',
    before: '67 kg',
    after: '62 kg',
    duration: '1 month',
    quote:
      "I've tried so many calorie counters, but FuelFox is actually different. Logging meals doesn't feel like a chore anymore!",
  },
  {
    id: '2',
    name: 'Marcus',
    flag: '🇩🇪',
    before: '95 kg',
    after: '84 kg',
    duration: '3 months',
    quote:
      'The fox buddy makes tracking fun. I actually look forward to logging my meals every day.',
  },
  {
    id: '3',
    name: 'Emily',
    flag: '🇺🇸',
    before: '72 kg',
    after: '65 kg',
    duration: '2 months',
    quote:
      'FuelFox helped me understand my eating habits and build a healthier relationship with food.',
  },
];

const FEATURES = [
  { label: 'AI calorie counter', free: true, plus: true },
  { label: 'Intermittent fasting', free: false, plus: true },
  { label: 'Macro balance tracker', free: false, plus: true },
  { label: 'Personalized meal plan', free: false, plus: true },
  { label: 'Statistics with insights', free: false, plus: true },
  { label: 'Awards & Highlights', free: false, plus: true },
];

function TestimonialCard({ item }) {
  return (
    <View style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>
        <View style={styles.testimonialMeta}>
          <Text style={styles.testimonialName}>
            {item.name} {item.flag}
          </Text>
          <Text style={styles.testimonialStats}>
            {item.before} → {item.after} in {item.duration}
          </Text>
        </View>
      </View>
      <Text style={styles.testimonialQuote}>"{item.quote}"</Text>
    </View>
  );
}

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [showPlans, setShowPlans] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/create-account');
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/create-account');
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveTestimonial(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Success Stories Section */}
          <Text style={styles.sectionTitle}>
            Success stories{'\n'}from our clients
          </Text>

          <FlatList
            data={TESTIMONIALS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TestimonialCard item={item} />}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            style={styles.testimonialList}
          />

          {/* Pagination dots */}
          <View style={styles.dotsRow}>
            {TESTIMONIALS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeTestimonial && styles.dotActive]}
              />
            ))}
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.7</Text>
              <Text style={styles.statLabel}>average{'\n'}rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1M</Text>
              <Text style={styles.statLabel}>users{'\n'}worldwide</Text>
            </View>
          </View>

          {/* FuelFox Pro Header */}
          <View style={styles.plusHeader}>
            <Text style={styles.plusBrand}>FuelFox</Text>
            <View style={styles.plusBadge}>
              <Text style={styles.plusBadgeText}>Pro</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Achieve your{'\n'}goals <Text style={styles.heroHighlight}>4.2x</Text> faster
          </Text>

          {/* Plans */}
          {showPlans && (
            <View style={styles.plansSection}>
              {/* Annual plan */}
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === 'annual' && styles.planCardSelected,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedPlan('annual');
                }}
                activeOpacity={0.8}
              >
                <View style={styles.planBadgeGreen}>
                  <Text style={styles.planBadgeGreenText}>Most popular</Text>
                </View>
                <View style={styles.planRow}>
                  <View>
                    <Text style={styles.planName}>Annual</Text>
                    <Text style={styles.planOriginalPrice}>
                      €69.99 → €39.99/yr
                    </Text>
                  </View>
                  <View style={styles.planPriceCol}>
                    <Text style={styles.planPrice}>€3.33</Text>
                    <Text style={styles.planPeriod}>per month</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Weekly plan */}
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === 'weekly' && styles.planCardSelected,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedPlan('weekly');
                }}
                activeOpacity={0.8}
              >
                <View style={styles.planBadgeGrey}>
                  <Text style={styles.planBadgeGreyText}>Pay-as-you-go</Text>
                </View>
                <View style={styles.planRow}>
                  <View>
                    <Text style={styles.planName}>Weekly</Text>
                    <Text style={styles.planOriginalPrice}>
                      No commitment. Cancel anytime.
                    </Text>
                  </View>
                  <View style={styles.planPriceCol}>
                    <Text style={styles.planPrice}>€3.99</Text>
                    <Text style={styles.planPeriod}>per week</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Toggle plans */}
          <TouchableOpacity
            style={styles.togglePlans}
            onPress={() => setShowPlans((v) => !v)}
          >
            <Text style={styles.togglePlansText}>
              {showPlans ? 'Hide plans' : 'Show plans'}
            </Text>
            <Ionicons
              name={showPlans ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>

          {/* Feature comparison */}
          <View style={styles.featuresSection}>
            <View style={styles.featuresHeader}>
              <Text style={styles.featuresTitle}>What you get</Text>
              <Text style={styles.featuresFreeLabel}>Free</Text>
              <View style={styles.plusColumnBadge}>
                <Text style={styles.plusColumnBadgeText}>Plus</Text>
              </View>
            </View>

            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureLabel}>{feature.label}</Text>
                <View style={styles.featureIcon}>
                  {feature.free ? (
                    <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                  ) : (
                    <Ionicons name="lock-closed" size={18} color={COLORS.textMuted} />
                  )}
                </View>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                </View>
              </View>
            ))}
          </View>

          {/* Legal text */}
          <Text style={styles.legalText}>
            Your yearly or weekly subscription automatically renews for the same
            term unless cancelled at least 24 hours prior to the end of the
            current term. Cancel any time in the App Store at no additional cost;
            your subscription will then cease at the end of the current term.
          </Text>

          {/* Footer links */}
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => Alert.alert('Restore Purchases', 'No previous purchases found. If you believe this is an error, contact support@fuelfox.app.')}>
              <Text style={styles.footerLink}>Restore</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Terms of Use', 'By using FuelFox, you agree to our terms of service. Visit our website for the full terms.')}>
              <Text style={styles.footerLink}>Terms of Use</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Privacy Notice', 'FuelFox respects your privacy. Your data is stored securely and never shared with third parties without your consent.')}>
              <Text style={styles.footerLink}>Privacy Notice</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.8}
            onPress={handleContinue}
          >
            <Text style={styles.ctaButtonText}>Continue</Text>
          </TouchableOpacity>
          <View style={styles.securedRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.securedText}>
              Secured with App Store. Easy to cancel.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.hero,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    lineHeight: 42,
    marginBottom: SPACING.lg,
  },
  testimonialList: {
    marginHorizontal: -SPACING.xl,
  },
  testimonialCard: {
    width: SCREEN_WIDTH - SPACING.xl * 2,
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.textSecondary,
  },
  testimonialMeta: { flex: 1 },
  testimonialName: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  testimonialStats: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  testimonialQuote: {
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.base,
    marginBottom: SPACING.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.inactive,
  },
  dotActive: {
    backgroundColor: COLORS.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xxxl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statValue: {
    fontSize: 48,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  statLabel: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  plusHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  plusBrand: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  plusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  plusBadgeText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  heroTitle: {
    fontSize: FONTS.hero,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: SPACING.xl,
  },
  heroHighlight: {
    color: COLORS.primary,
  },
  plansSection: {
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  planCard: {
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  planCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF7F0',
  },
  planBadgeGreen: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  planBadgeGreenText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  planBadgeGrey: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  planBadgeGreyText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.textSecondary,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  planOriginalPrice: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  planPriceCol: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  planPeriod: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
  },
  togglePlans: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.base,
    marginBottom: SPACING.lg,
  },
  togglePlansText: {
    fontSize: FONTS.body,
    color: COLORS.textMuted,
  },
  featuresSection: {
    marginBottom: SPACING.xl,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  featuresTitle: {
    flex: 1,
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  featuresFreeLabel: {
    width: 50,
    textAlign: 'center',
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
  plusColumnBadge: {
    width: 50,
    alignItems: 'center',
  },
  plusColumnBadgeText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
    backgroundColor: '#FFF3E8',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  featureLabel: {
    flex: 1,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
  },
  featureIcon: {
    width: 50,
    alignItems: 'center',
  },
  legalText: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.base,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  footerLink: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.medium,
    color: COLORS.textPrimary,
  },
  bottomSection: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
  },
  ctaButton: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonHeight / 2,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  ctaButtonText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  securedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  securedText: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
  },
});
