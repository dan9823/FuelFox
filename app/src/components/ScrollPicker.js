import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

function PickerColumn({
  items,
  selectedIndex,
  onSelect,
  suffix,
  width,
}) {
  const scrollY = useSharedValue(selectedIndex * ITEM_HEIGHT);
  const scrollRef = useRef(null);
  const lastIndex = useRef(selectedIndex);

  useEffect(() => {
    // Scroll to initial position after mount
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
    <View style={[styles.columnContainer, width && { width }]}>
      {/* Top fade overlay */}
      <View style={styles.overlayTop} pointerEvents="none" />
      {/* Center highlight */}
      <View style={styles.centerHighlight} pointerEvents="none" />
      {/* Bottom fade overlay */}
      <View style={styles.overlayBottom} pointerEvents="none" />

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
          <PickerItem
            key={`${item}-${index}`}
            label={typeof item === 'object' ? item.label : String(item)}
            suffix={suffix}
            index={index}
            scrollY={scrollY}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

function PickerItem({ label, suffix, index, scrollY }) {
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
      <Text style={styles.itemText}>
        {label}
        {suffix ? <Text style={styles.itemSuffix}> {suffix}</Text> : null}
      </Text>
    </Animated.View>
  );
}

export default function ScrollPicker({
  items = [],
  selectedIndex = 0,
  onSelect,
  suffix,
  // For weight: two columns
  columns,
  // For height: unit toggle
  unitToggle,
  style,
}) {
  // If columns are provided, render multi-column picker
  if (columns && columns.length > 0) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.multiColumnRow}>
          {columns.map((col, i) => (
            <React.Fragment key={i}>
              <PickerColumn
                items={col.items}
                selectedIndex={col.selectedIndex || 0}
                onSelect={col.onSelect}
                suffix={col.suffix}
                width={col.width}
              />
              {i < columns.length - 1 && (
                <Text style={styles.columnSeparator}>
                  {col.separator || '.'}
                </Text>
              )}
            </React.Fragment>
          ))}
          {unitToggle && (
            <View style={styles.unitToggleContainer}>{unitToggle}</View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.singleColumnRow}>
        <PickerColumn
          items={items}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          suffix={suffix}
        />
        {unitToggle && (
          <View style={styles.unitToggleContainer}>{unitToggle}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  singleColumnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiColumnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnContainer: {
    height: PICKER_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
    minWidth: 80,
  },
  scrollView: {
    height: PICKER_HEIGHT,
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  centerHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    zIndex: 0,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 28,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  itemSuffix: {
    fontSize: 18,
    fontWeight: FONTS.medium,
    color: COLORS.textSecondary,
  },
  columnSeparator: {
    fontSize: 28,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.xs,
    alignSelf: 'center',
  },
  unitToggleContainer: {
    marginLeft: SPACING.base,
    justifyContent: 'center',
  },
});
