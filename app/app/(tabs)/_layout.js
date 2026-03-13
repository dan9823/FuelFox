import React, { useState, useCallback } from 'react';
import { Tabs } from 'expo-router';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../../src/constants/theme';
import QuickActionsPopup from '../../src/components/QuickActionsPopup';

const TAB_ITEMS = [
  { name: 'index', label: 'Home', iconActive: 'home', iconInactive: 'home-outline' },
  { name: 'challenges', label: 'Challenges', iconActive: 'star', iconInactive: 'star-outline' },
  { name: 'statistics', label: 'Statistics', iconActive: 'bar-chart', iconInactive: 'bar-chart-outline' },
];

function CustomTabBar({ state, descriptors, navigation }) {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleFABPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowQuickActions(true);
  }, []);

  return (
    <>
      <View style={styles.tabBarWrapper}>
        {/* Frosted pill tab bar */}
        <View style={styles.tabBarPill}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const tabConfig = TAB_ITEMS.find((t) => t.name === route.name);
            if (!tabConfig) return null;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={tabConfig.label}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isFocused ? tabConfig.iconActive : tabConfig.iconInactive}
                  size={24}
                  color={isFocused ? COLORS.black : COLORS.tabInactive}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FAB button on the right */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={handleFABPress}
        >
          <Ionicons name="add" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Quick actions popup */}
      <QuickActionsPopup
        visible={showQuickActions}
        onClose={() => setShowQuickActions(false)}
      />
    </>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="challenges" />
      <Tabs.Screen name="statistics" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 12,
    ...SHADOWS.large,
    // Frosted glass effect fallback
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  tabItem: {
    width: 52,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginLeft: 12,
  },
});
