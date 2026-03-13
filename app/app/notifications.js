import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  registerForPushNotifications,
  scheduleMealReminder,
  scheduleHydrationReminders,
  scheduleFastingReminder,
  scheduleStreakReminder,
  cancelAllNotifications,
  getScheduledNotificationCount,
} from '../src/utils/notifications';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../src/constants/theme';

const NOTIFICATION_TYPES = [
  {
    id: 'meals',
    icon: '🍽️',
    title: 'Meal reminders',
    description: 'Get reminded to log breakfast, lunch & dinner',
    defaultEnabled: true,
  },
  {
    id: 'hydration',
    icon: '💧',
    title: 'Hydration reminders',
    description: 'Stay on top of your water intake throughout the day',
    defaultEnabled: true,
  },
  {
    id: 'fasting',
    icon: '🌙',
    title: 'Fasting alerts',
    description: 'Know when to start and break your fast',
    defaultEnabled: false,
  },
  {
    id: 'streak',
    icon: '🔥',
    title: 'Streak protection',
    description: "Evening reminder if you haven't logged today",
    defaultEnabled: true,
  },
  {
    id: 'insights',
    icon: '🦊',
    title: 'Fox insights',
    description: 'Daily nutrition tips and encouragement from Ember',
    defaultEnabled: false,
  },
];

function NotificationToggle({ item, enabled, onToggle }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleIcon}>{item.icon}</Text>
      <View style={styles.toggleContent}>
        <Text style={styles.toggleTitle}>{item.title}</Text>
        <Text style={styles.toggleDesc}>{item.description}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={(val) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle(item.id, val);
        }}
        trackColor={{ false: '#D1D1DE', true: COLORS.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D1D1DE"
      />
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [settings, setSettings] = useState(() => {
    const initial = {};
    NOTIFICATION_TYPES.forEach((t) => {
      initial[t.id] = t.defaultEnabled;
    });
    return initial;
  });
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    checkPermission();
    updateCount();
  }, []);

  async function checkPermission() {
    const token = await registerForPushNotifications();
    setPermissionGranted(!!token);
  }

  async function updateCount() {
    const count = await getScheduledNotificationCount();
    setScheduledCount(count);
  }

  const handleToggle = async (id, enabled) => {
    setSettings((prev) => ({ ...prev, [id]: enabled }));

    if (enabled) {
      switch (id) {
        case 'meals':
          await scheduleMealReminder(12, 0);
          break;
        case 'hydration':
          await scheduleHydrationReminders();
          break;
        case 'fasting':
          await scheduleFastingReminder(20, 12);
          break;
        case 'streak':
          await scheduleStreakReminder();
          break;
        case 'insights':
          // Fox insights scheduled similarly
          await scheduleMealReminder(8, 30);
          break;
      }
    }
    await updateCount();
  };

  const handleEnableAll = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newSettings = {};
    for (const type of NOTIFICATION_TYPES) {
      newSettings[type.id] = true;
    }
    setSettings(newSettings);

    await scheduleMealReminder(12, 0);
    await scheduleHydrationReminders();
    await scheduleFastingReminder(20, 12);
    await scheduleStreakReminder();
    await updateCount();

    Alert.alert('All Notifications Enabled', 'Ember will keep you on track throughout the day!');
  };

  const handleDisableAll = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSettings = {};
    for (const type of NOTIFICATION_TYPES) {
      newSettings[type.id] = false;
    }
    setSettings(newSettings);
    await cancelAllNotifications();
    await updateCount();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Permission status */}
        {!permissionGranted && (
          <TouchableOpacity style={styles.permissionBanner} onPress={checkPermission} activeOpacity={0.8}>
            <Ionicons name="notifications-off-outline" size={24} color="#EF5353" />
            <View style={styles.permissionBannerContent}>
              <Text style={styles.permissionTitle}>Notifications are disabled</Text>
              <Text style={styles.permissionDesc}>Tap to enable notifications so Ember can remind you</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}

        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>{scheduledCount}</Text>
              <Text style={styles.statusLabel}>Scheduled</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>
                {Object.values(settings).filter(Boolean).length}
              </Text>
              <Text style={styles.statusLabel}>Active types</Text>
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionBtn} onPress={handleEnableAll} activeOpacity={0.7}>
            <Ionicons name="notifications" size={18} color={COLORS.white} />
            <Text style={styles.quickActionText}>Enable all</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtnOutline} onPress={handleDisableAll} activeOpacity={0.7}>
            <Ionicons name="notifications-off-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.quickActionTextOutline}>Disable all</Text>
          </TouchableOpacity>
        </View>

        {/* Notification toggles */}
        <View style={styles.card}>
          {NOTIFICATION_TYPES.map((type, idx) => (
            <React.Fragment key={type.id}>
              <NotificationToggle
                item={type}
                enabled={settings[type.id]}
                onToggle={handleToggle}
              />
              {idx < NOTIFICATION_TYPES.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Schedule preview */}
        <Text style={styles.sectionTitle}>Today's schedule</Text>
        <View style={styles.card}>
          {[
            { time: '8:30 AM', label: 'Fox insight', icon: '🦊', enabled: settings.insights },
            { time: '9:00 AM', label: 'Hydration check', icon: '💧', enabled: settings.hydration },
            { time: '11:00 AM', label: 'Hydration check', icon: '💧', enabled: settings.hydration },
            { time: '12:00 PM', label: 'Log lunch', icon: '🍽️', enabled: settings.meals },
            { time: '1:00 PM', label: 'Hydration check', icon: '💧', enabled: settings.hydration },
            { time: '3:00 PM', label: 'Hydration check', icon: '💧', enabled: settings.hydration },
            { time: '8:00 PM', label: 'Start fast', icon: '🌙', enabled: settings.fasting },
            { time: '8:30 PM', label: 'Streak check', icon: '🔥', enabled: settings.streak },
          ]
            .filter((s) => s.enabled)
            .map((schedule, idx) => (
              <View key={idx} style={[styles.scheduleRow, idx > 0 && styles.scheduleRowBorder]}>
                <Text style={styles.scheduleTime}>{schedule.time}</Text>
                <Text style={styles.scheduleIcon}>{schedule.icon}</Text>
                <Text style={styles.scheduleLabel}>{schedule.label}</Text>
              </View>
            ))}
          {Object.values(settings).every((v) => !v) && (
            <Text style={styles.noSchedule}>No notifications scheduled. Enable some above!</Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  scrollContent: {
    padding: SPACING.base,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    gap: SPACING.md,
  },
  permissionBannerContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: '#EF5353',
  },
  permissionDesc: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    ...SHADOWS.card,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusValue: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  statusLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.divider,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  quickActionText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  quickActionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  quickActionTextOutline: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    ...SHADOWS.card,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  toggleIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  toggleContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  toggleTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.black,
  },
  toggleDesc: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  sectionTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  scheduleRowBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  scheduleTime: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: COLORS.primary,
    width: 70,
  },
  scheduleIcon: {
    fontSize: 16,
  },
  scheduleLabel: {
    flex: 1,
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
  },
  noSchedule: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
});
