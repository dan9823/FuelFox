import React, { useCallback } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SelectionCard({
  label,
  emoji,
  icon,
  selected = false,
  onPress,
  style,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withTiming(0.95, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    onPress?.();
  }, [onPress]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.container,
        selected && styles.containerSelected,
        animatedStyle,
        style,
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconCircle,
            selected && styles.iconCircleSelected,
          ]}
        >
          {emoji ? (
            <Text style={styles.emoji}>{emoji}</Text>
          ) : icon ? (
            icon
          ) : null}
        </View>
        <Text
          style={[styles.label, selected && styles.labelSelected]}
          numberOfLines={2}
        >
          {label}
        </Text>
      </View>
      {selected && <View style={styles.checkDot} />}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.base,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.card,
  },
  containerSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    borderColor: COLORS.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconCircleSelected: {
    backgroundColor: COLORS.primaryFaded,
  },
  emoji: {
    fontSize: 20,
  },
  label: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  labelSelected: {
    color: COLORS.primaryDark,
  },
  checkDot: {
    position: 'absolute',
    right: SPACING.base,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: -4,
  },
});
