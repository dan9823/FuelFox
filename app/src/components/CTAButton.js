import React, { useCallback } from 'react';
import { Pressable, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, SIZES } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CTAButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  showArrow = true,
  icon,
  style,
  textStyle,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, []);

  const handlePress = useCallback(() => {
    if (loading || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  }, [onPress, loading, disabled]);

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isSkip = variant === 'skip';

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isSkip && styles.skip,
        isPrimary && !disabled && SHADOWS.large,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? COLORS.white : COLORS.textPrimary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.text,
              isPrimary && styles.textPrimary,
              isSecondary && styles.textSecondary,
              isSkip && styles.textSkip,
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {showArrow && !isSkip && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={
                disabled
                  ? COLORS.textMuted
                  : isPrimary
                  ? COLORS.white
                  : COLORS.textPrimary
              }
              style={styles.arrow}
            />
          )}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonHeight / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.black,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  skip: {
    backgroundColor: 'transparent',
    height: 44,
  },
  disabled: {
    backgroundColor: COLORS.inactive,
    borderColor: COLORS.inactive,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  text: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
  },
  textPrimary: {
    color: COLORS.white,
  },
  textSecondary: {
    color: COLORS.black,
  },
  textSkip: {
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
    fontSize: FONTS.bodySmall,
  },
  textDisabled: {
    color: COLORS.textMuted,
  },
  arrow: {
    marginLeft: SPACING.sm,
  },
});
