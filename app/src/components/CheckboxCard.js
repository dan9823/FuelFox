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
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CheckboxCard({
  label,
  subtitle,
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
      withTiming(0.96, { duration: 80 }),
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
        {(emoji || icon) && (
          <View
            style={[styles.iconCircle, selected && styles.iconCircleSelected]}
          >
            {emoji ? (
              <Text style={styles.emoji}>{emoji}</Text>
            ) : icon ? (
              icon
            ) : null}
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            style={[styles.label, selected && styles.labelSelected]}
            numberOfLines={2}
          >
            {label}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && (
            <Ionicons name="checkmark" size={14} color={COLORS.white} />
          )}
        </View>
      </View>
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
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  label: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  labelSelected: {
    color: COLORS.primaryDark,
  },
  subtitle: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.regular,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.inactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
