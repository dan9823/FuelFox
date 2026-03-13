import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, RADIUS } from '../constants/theme';

export default function ProgressBar({
  progress = 0,
  height = 4,
  color = COLORS.primary,
  trackColor = COLORS.border,
  animated = true,
  duration = 400,
  style,
}) {
  const widthProgress = useSharedValue(0);

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    if (animated) {
      widthProgress.value = withTiming(clampedProgress, {
        duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    } else {
      widthProgress.value = clampedProgress;
    }
  }, [progress, animated, duration]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${widthProgress.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            backgroundColor: color,
            borderRadius: height / 2,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
