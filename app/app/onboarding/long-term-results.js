import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function SparkleStars() {
  return (
    <>
      <Text style={[styles.sparkle, { top: 60, left: 30 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: 40, right: 50 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: 120, right: 25 }]}>✦</Text>
      <Text style={[styles.sparkleSmall, { top: 80, left: 60 }]}>✧</Text>
      <Text style={[styles.sparkleSmall, { top: 150, left: 40 }]}>✧</Text>
    </>
  );
}

function WeightGraph() {
  // FuelFox curve (orange, solid, trending down)
  const fuelfoxPoints = [
    { x: 10, y: 30 },
    { x: 25, y: 40 },
    { x: 40, y: 48 },
    { x: 55, y: 55 },
    { x: 70, y: 65 },
    { x: 85, y: 72 },
    { x: 95, y: 80 },
  ];

  // Other apps curve (red, dashed, trending up after initial drop)
  const otherPoints = [
    { x: 10, y: 30 },
    { x: 25, y: 40 },
    { x: 40, y: 35 },
    { x: 55, y: 28 },
    { x: 70, y: 22 },
    { x: 85, y: 18 },
    { x: 95, y: 15 },
  ];

  return (
    <View style={styles.graphCard}>
      {/* Y axis label */}
      <View style={styles.yAxisLabel}>
        <Text style={styles.axisText}>Your weight</Text>
      </View>

      <View style={styles.graphArea}>
        {/* Grid lines */}
        <View style={[styles.gridLine, { top: '25%' }]} />
        <View style={[styles.gridLine, { top: '50%' }]} />
        <View style={[styles.gridLine, { top: '75%' }]} />

        {/* FuelFox curve dots (orange, trending down = weight loss) */}
        {fuelfoxPoints.map((p, i) => (
          <View
            key={`bp-${i}`}
            style={[
              styles.greenDot,
              { left: `${p.x}%`, top: `${100 - p.y}%` },
            ]}
          />
        ))}

        {/* Connect FuelFox dots with lines */}
        {fuelfoxPoints.slice(0, -1).map((p, i) => {
          const next = fuelfoxPoints[i + 1];
          const dx = (next.x - p.x) * (SCREEN_WIDTH - 120) / 100;
          const dy = (p.y - next.y) * 1.6;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(-dy, dx) * (180 / Math.PI);
          return (
            <View
              key={`bpl-${i}`}
              style={[
                styles.greenLine,
                {
                  left: `${p.x}%`,
                  top: `${100 - p.y}%`,
                  width: length,
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          );
        })}

        {/* Other apps curve dots (red dashed, trending up = weight regain) */}
        {otherPoints.map((p, i) => (
          <View
            key={`oa-${i}`}
            style={[
              styles.redDot,
              { left: `${p.x}%`, top: `${100 - p.y}%` },
            ]}
          />
        ))}

        {/* Connect Other dots with dashed lines */}
        {otherPoints.slice(0, -1).map((p, i) => {
          const next = otherPoints[i + 1];
          const dx = (next.x - p.x) * (SCREEN_WIDTH - 120) / 100;
          const dy = (p.y - next.y) * 1.6;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(-dy, dx) * (180 / Math.PI);
          return (
            <View
              key={`oal-${i}`}
              style={[
                styles.redLineDashed,
                {
                  left: `${p.x}%`,
                  top: `${100 - p.y}%`,
                  width: length,
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          );
        })}

        {/* Legend labels at end of lines */}
        <View style={styles.fuelfoxLabel}>
          <View style={[styles.legendDot, { backgroundColor: '#E8813A' }]} />
          <Text style={[styles.legendText, { color: '#C66A28' }]}>FuelFox</Text>
        </View>
        <View style={styles.otherLabel}>
          <View style={[styles.legendDot, { backgroundColor: '#EF5353' }]} />
          <Text style={[styles.legendText, { color: '#EF5353' }]}>Other apps</Text>
        </View>
      </View>

      {/* X axis label */}
      <View style={styles.xAxisLabel}>
        <Text style={styles.axisText}>Time</Text>
      </View>
    </View>
  );
}

export default function LongTermResultsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Sparkle stars scattered */}
        <SparkleStars />

        <View style={styles.content}>
          <Text style={styles.title}>
            FuelFox provides{'\n'}long-term results
          </Text>

          {/* Graph card */}
          <WeightGraph />

          {/* Tip box */}
          <View style={styles.tipBox}>
            <Text style={styles.tipEmoji}>✨</Text>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>76%</Text> FuelFox users maintain their weight loss over 6 months
            </Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/calorie-experience')}
          >
            <Text style={styles.buttonText}>Next {'>'}</Text>
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
  sparkle: {
    position: 'absolute',
    fontSize: 20,
    color: '#E8813A',
    zIndex: 1,
  },
  sparkleSmall: {
    position: 'absolute',
    fontSize: 14,
    color: '#F5A860',
    zIndex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  graphCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.base,
    ...SHADOWS.medium,
    marginBottom: SPACING.xl,
  },
  yAxisLabel: {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: [{ rotate: '-90deg' }],
  },
  axisText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  graphArea: {
    height: 180,
    marginLeft: 30,
    marginRight: 10,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F0F0F5',
  },
  greenDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8813A',
    marginLeft: -4,
    marginTop: -4,
  },
  greenLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#E8813A',
    transformOrigin: 'left center',
  },
  redDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF5353',
    marginLeft: -4,
    marginTop: -4,
  },
  redLineDashed: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#EF5353',
    opacity: 0.5,
    transformOrigin: 'left center',
    borderStyle: 'dashed',
  },
  fuelfoxLabel: {
    position: 'absolute',
    bottom: 4,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  otherLabel: {
    position: 'absolute',
    top: 4,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  xAxisLabel: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  tipBox: {
    backgroundColor: 'rgba(232, 129, 58, 0.12)',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipText: {
    flex: 1,
    fontSize: FONTS.bodySmall,
    color: '#C66A28',
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: '800',
    fontSize: 16,
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
