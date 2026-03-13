import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

function ClockIllustration() {
  return (
    <View style={styles.clockContainer}>
      {/* Outer clock circle */}
      <View style={styles.clockOuter}>
        {/* Clock face */}
        <View style={styles.clockFace}>
          {/* Hour markers */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
            <View
              key={i}
              style={[
                styles.hourMarker,
                {
                  transform: [
                    { rotate: `${deg}deg` },
                    { translateY: -58 },
                  ],
                },
              ]}
            />
          ))}

          {/* Fork icon - left side */}
          <View style={styles.forkContainer}>
            <View style={styles.forkHandle} />
            <View style={styles.forkTines}>
              <View style={styles.tine} />
              <View style={styles.tine} />
              <View style={styles.tine} />
            </View>
          </View>

          {/* Knife icon - right side */}
          <View style={styles.knifeContainer}>
            <View style={styles.knifeBlade} />
            <View style={styles.knifeHandle} />
          </View>

          {/* Moon icon - bottom */}
          <View style={styles.moonContainer}>
            <Text style={styles.moonEmoji}>🌙</Text>
          </View>
        </View>
      </View>

      {/* Colored arc accents */}
      <View style={styles.arcGreen} />
      <View style={styles.arcPurple} />
    </View>
  );
}

export default function FastingInfoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Clock illustration */}
          <ClockIllustration />

          {/* Main text */}
          <View style={styles.textSection}>
            <Text style={styles.title}>Fasting makes you{'\n'}lose weight</Text>
            <View style={styles.speedRow}>
              <Text style={styles.speedNumber}>1.2x</Text>
              <Text style={styles.speedLabel}> faster</Text>
            </View>

            <Text style={styles.description}>
              Intermittent fasting is a powerful tool that helps your body burn
              fat more efficiently. By limiting your eating window, you give your
              body time to switch from burning food to burning stored fat.
            </Text>
            <Text style={styles.description}>
              Combined with smart calorie tracking, fasting can accelerate your
              weight loss journey while improving energy levels and mental clarity.
            </Text>
          </View>

          {/* Harvard quote card */}
          <View style={styles.quoteCard}>
            <View style={styles.quoteHeader}>
              {/* Shield/crest icon */}
              <View style={styles.shieldIcon}>
                <Text style={styles.shieldText}>🛡️</Text>
              </View>
              <View style={styles.quoteHeaderText}>
                <Text style={styles.quoteSource}>Harvard Health Publishing</Text>
                <Text style={styles.quoteInstitution}>Harvard Medical School</Text>
              </View>
            </View>
            <Text style={styles.quoteText}>
              "Research suggests that intermittent fasting may be more beneficial
              than other dieting strategies in reducing inflammation and
              improving conditions associated with inflammation."
            </Text>
            <TouchableOpacity activeOpacity={0.6} onPress={() => Linking.openURL('https://www.health.harvard.edu/blog/intermittent-fasting-surprising-update-2018062914156')}>
              <Text style={styles.sourceLink}>Source of recommendations</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/meet-pet')}
          >
            <Text style={styles.buttonText}>Let's go</Text>
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
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.base,
  },
  // Clock illustration
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
    height: 180,
    position: 'relative',
  },
  clockOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  clockFace: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#E8E7EC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hourMarker: {
    position: 'absolute',
    width: 3,
    height: 8,
    backgroundColor: '#B0B0C0',
    borderRadius: 1.5,
  },
  forkContainer: {
    position: 'absolute',
    left: 25,
    top: 35,
    alignItems: 'center',
  },
  forkHandle: {
    width: 3,
    height: 24,
    backgroundColor: '#6B6B80',
    borderRadius: 1.5,
  },
  forkTines: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  tine: {
    width: 2,
    height: 10,
    backgroundColor: '#6B6B80',
    borderRadius: 1,
  },
  knifeContainer: {
    position: 'absolute',
    right: 25,
    top: 35,
    alignItems: 'center',
  },
  knifeBlade: {
    width: 6,
    height: 20,
    backgroundColor: '#9E9EB0',
    borderRadius: 3,
    borderTopLeftRadius: 1,
  },
  knifeHandle: {
    width: 4,
    height: 16,
    backgroundColor: '#6B6B80',
    borderRadius: 2,
    marginTop: 2,
  },
  moonContainer: {
    position: 'absolute',
    bottom: 18,
  },
  moonEmoji: {
    fontSize: 22,
  },
  arcGreen: {
    position: 'absolute',
    top: 2,
    right: '28%',
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8813A',
    transform: [{ rotate: '30deg' }],
  },
  arcPurple: {
    position: 'absolute',
    bottom: 2,
    left: '28%',
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7E57C2',
    transform: [{ rotate: '30deg' }],
  },
  // Text section
  textSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.lg,
  },
  speedNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#E8813A',
  },
  speedLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E8813A',
  },
  description: {
    fontSize: FONTS.body,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  // Harvard quote card
  quoteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  shieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldText: {
    fontSize: 20,
  },
  quoteHeaderText: {
    flex: 1,
  },
  quoteSource: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  quoteInstitution: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  quoteText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  sourceLink: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.medium,
    color: COLORS.info,
    textDecorationLine: 'underline',
  },
  // Bottom
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
