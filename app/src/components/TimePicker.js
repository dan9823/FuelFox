import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

function generateTimes(startHour, endHour, intervalMinutes = 30) {
  const times = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      if (h === endHour && m > 0) break;
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? 'pm' : 'am';
      const minuteStr = m.toString().padStart(2, '0');
      times.push({
        label: `${hour12}:${minuteStr} ${ampm}`,
        hour24: h,
        minute: m,
      });
    }
  }
  return times;
}

function TimeColumn({ items, selectedIndex, onSelect, label }) {
  const scrollY = useSharedValue(selectedIndex * ITEM_HEIGHT);
  const scrollRef = useRef(null);
  const lastIndex = useRef(selectedIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const triggerHaptic = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  const handleSelect = useCallback(
    (index) => {
      onSelect?.(index);
    },
    [onSelect]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      if (clampedIndex !== lastIndex.current) {
        lastIndex.current = clampedIndex;
        runOnJS(triggerHaptic)();
      }
      runOnJS(handleSelect)(clampedIndex);
    },
  });

  return (
    <View style={styles.columnWrapper}>
      <Text style={styles.columnLabel}>{label}</Text>
      <View style={styles.columnContainer}>
        <View style={styles.centerHighlight} pointerEvents="none" />
        <Animated.ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: ITEM_HEIGHT * 2,
            paddingBottom: ITEM_HEIGHT * 2,
          }}
          style={styles.scrollView}
        >
          {items.map((item, index) => (
            <TimeItem
              key={`${item.label}-${index}`}
              label={item.label}
              index={index}
              scrollY={scrollY}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

function TimeItem({ label, index, scrollY }) {
  const animatedStyle = useAnimatedStyle(() => {
    const centerOffset = scrollY.value - index * ITEM_HEIGHT;

    const scale = interpolate(
      Math.abs(centerOffset),
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.85, 0.7],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      Math.abs(centerOffset),
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.4, 0.15],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <Text style={styles.itemText}>{label}</Text>
    </Animated.View>
  );
}

export default function TimePicker({
  startIndex = 0,
  finishIndex = 0,
  onStartChange,
  onFinishChange,
  startRange = { from: 6, to: 12 },
  finishRange = { from: 15, to: 23 },
  interval = 30,
  style,
}) {
  const startTimes = useMemo(
    () => generateTimes(startRange.from, startRange.to, interval),
    [startRange.from, startRange.to, interval]
  );

  const finishTimes = useMemo(
    () => generateTimes(finishRange.from, finishRange.to, interval),
    [finishRange.from, finishRange.to, interval]
  );

  // Calculate eating window
  const eatingWindow = useMemo(() => {
    const start = startTimes[startIndex];
    const finish = finishTimes[finishIndex];
    if (!start || !finish) return 0;
    const startMinutes = start.hour24 * 60 + start.minute;
    const finishMinutes = finish.hour24 * 60 + finish.minute;
    const diff = finishMinutes - startMinutes;
    return Math.max(0, diff / 60);
  }, [startIndex, finishIndex, startTimes, finishTimes]);

  const formatWindow = (hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) return `${wholeHours} hours`;
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.pickersRow}>
        <TimeColumn
          items={startTimes}
          selectedIndex={startIndex}
          onSelect={onStartChange}
          label="Start"
        />
        <View style={styles.divider} />
        <TimeColumn
          items={finishTimes}
          selectedIndex={finishIndex}
          onSelect={onFinishChange}
          label="Finish"
        />
      </View>

      <View style={styles.windowCard}>
        <Text style={styles.windowEmoji}>🍴</Text>
        <Text style={styles.windowText}>
          Eating window:{' '}
          <Text style={styles.windowValue}>{formatWindow(eatingWindow)}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  pickersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  columnWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  columnContainer: {
    height: PICKER_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  scrollView: {
    height: PICKER_HEIGHT,
  },
  centerHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: SPACING.sm,
    right: SPACING.sm,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    zIndex: 0,
  },
  divider: {
    width: 1,
    height: PICKER_HEIGHT,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.md,
    marginTop: 28,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  windowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    marginTop: SPACING.xl,
    ...SHADOWS.card,
  },
  windowEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  windowText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
  },
  windowValue: {
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
});
