import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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

function Chip({ label, selected, onPress }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withTiming(0.92, { duration: 60 }),
      withSpring(1, { damping: 14, stiffness: 200 })
    );
    onPress?.();
  }, [onPress]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.chip, selected && styles.chipSelected, animatedStyle]}
    >
      {selected && <View style={styles.filledDot} />}
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

function AddChip({ onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.addChip}>
      <Ionicons name="add" size={18} color={COLORS.textSecondary} />
    </Pressable>
  );
}

export default function ChipSelect({
  options = [],
  selectedValues = [],
  onSelect,
  onAdd,
  style,
}) {
  const handleToggle = useCallback(
    (value) => {
      if (selectedValues.includes(value)) {
        onSelect?.(selectedValues.filter((v) => v !== value));
      } else {
        onSelect?.([...selectedValues, value]);
      }
    },
    [selectedValues, onSelect]
  );

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        return (
          <Chip
            key={value}
            label={label}
            selected={selectedValues.includes(value)}
            onPress={() => handleToggle(value)}
          />
        );
      })}
      {onAdd && <AddChip onPress={onAdd} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  chipSelected: {
    borderColor: COLORS.orange,
    backgroundColor: COLORS.white,
  },
  filledDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
    marginRight: SPACING.xs + 2,
  },
  chipLabel: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.medium,
    color: COLORS.textPrimary,
  },
  chipLabelSelected: {
    color: COLORS.orangeDark,
    fontWeight: FONTS.semiBold,
  },
  addChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
});
