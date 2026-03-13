import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../src/constants/theme';

// ------------------------------------------------------------------
//  Settings row (with chevron)
// ------------------------------------------------------------------
function SettingsRow({ icon, label, value, onPress, isLast, labelStyle, multilineValue }) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      {icon ? <Text style={styles.rowIcon}>{icon}</Text> : null}
      <Text style={[styles.rowLabel, labelStyle]}>{label}</Text>
      <View style={styles.rowRight}>
        {multilineValue ? (
          <View style={styles.multilineValueContainer}>
            {multilineValue.map((line, i) => (
              <Text key={i} style={styles.rowValue}>{line}</Text>
            ))}
          </View>
        ) : value !== undefined && value !== null ? (
          <Text style={styles.rowValue}>{value}</Text>
        ) : null}
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

// ------------------------------------------------------------------
//  Toggle row (with Switch instead of chevron)
// ------------------------------------------------------------------
function ToggleRow({ icon, label, value, onValueChange, isLast }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      {icon ? <Text style={styles.rowIcon}>{icon}</Text> : null}
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D1DE', true: '#4CD964' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D1D1DE"
      />
    </View>
  );
}

// ------------------------------------------------------------------
//  Static row (value only, no chevron)
// ------------------------------------------------------------------
function StaticRow({ icon, label, value, isLast }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      {icon ? <Text style={styles.rowIcon}>{icon}</Text> : null}
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

// ------------------------------------------------------------------
//  Social row (with social icon on right instead of chevron)
// ------------------------------------------------------------------
function SocialRow({ label, iconName, onPress, isLast }) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name={iconName} size={22} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

// ------------------------------------------------------------------
//  Section header
// ------------------------------------------------------------------
function SectionHeader({ title }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

// ------------------------------------------------------------------
//  Main settings screen
// ------------------------------------------------------------------
export default function SettingsScreen() {
  const router = useRouter();
  const { goals, user, setGoals, setUser } = useApp();

  const [soundEffects, setSoundEffects] = useState(true);

  const formatWeight = (w) => Number.isInteger(w) ? w.toString() : w.toFixed(1);

  const promptNumber = (title, label, currentVal, unit, onSave) => {
    Alert.prompt(title, `Enter new ${label}:`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: (val) => {
        const num = parseFloat(val);
        if (num > 0) { onSave(num); }
      }},
    ], 'plain-text', currentVal.toString(), 'decimal-pad');
  };

  const showPicker = (title, options, onSelect) => {
    Alert.alert(title, 'Select an option:', [
      ...options.map((opt) => ({ text: opt, onPress: () => onSelect(opt) })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/*  Goals                                                       */}
        {/* ============================================================ */}
        <SectionHeader title="Goals" />
        <View style={styles.card}>
          <SettingsRow
            icon="🔥"
            label="Calories"
            value={`${goals.calories.toLocaleString()} kcal`}
            onPress={() => promptNumber('Calories Goal', 'daily calorie goal', goals.calories, 'kcal', (v) => setGoals({ calories: Math.round(v) }))}
          />
          <SettingsRow
            icon="🥧"
            label="Macros"
            value={`${goals.carbsG}/${goals.fatsG}/${goals.proteinsG} g`}
            onPress={() => Alert.alert('Macro Balance', `Carbs: ${goals.carbsG}g\nFats: ${goals.fatsG}g\nProtein: ${goals.proteinsG}g\n\nAdjust macros in your nutrition plan.`)}
          />
          <SettingsRow
            icon="🕐"
            label="Fasting"
            value={`${goals.fastingHours}h`}
            onPress={() => promptNumber('Fasting Goal', 'fasting hours', goals.fastingHours, 'h', (v) => setGoals({ fastingHours: Math.round(v) }))}
          />
          <SettingsRow
            icon="💧"
            label="Water"
            value={`${goals.waterMl} ml`}
            onPress={() => promptNumber('Water Goal', 'daily water goal (ml)', goals.waterMl, 'ml', (v) => setGoals({ waterMl: Math.round(v) }))}
          />
          <SettingsRow
            icon="⚖️"
            label="Weight"
            value={`${formatWeight(goals.targetWeight || 60)} kg`}
            onPress={() => promptNumber('Target Weight', 'target weight (kg)', goals.targetWeight || 60, 'kg', (v) => setGoals({ targetWeight: v }))}
          />
          <SettingsRow
            icon="🔄"
            label="Recalculate plan"
            onPress={() => Alert.alert('Plan Recalculated', 'Your nutrition plan has been updated based on your current goals and activity level.')}
            isLast
          />
        </View>

        {/* ============================================================ */}
        {/*  Eating preferences                                          */}
        {/* ============================================================ */}
        <SectionHeader title="Eating preferences" />
        <View style={styles.card}>
          <SettingsRow
            icon="🍎"
            label="Diet"
            value="Vegetarian"
            onPress={() => showPicker('Diet Type', ['Classic', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'], (v) => Alert.alert('Diet Updated', `Diet set to ${v}`))}
          />
          <SettingsRow
            icon="🚫"
            label="Food exclusions"
            value="Eggs"
            onPress={() => Alert.alert('Food Exclusions', 'Manage your food exclusions and allergies here.', [{ text: 'OK' }])}
          />
          <SettingsRow
            icon="🍽️"
            label="Meals per day"
            value="4"
            onPress={() => showPicker('Meals Per Day', ['2', '3', '4', '5', '6'], (v) => Alert.alert('Updated', `Meals per day set to ${v}`))}
          />
          <SettingsRow
            icon="🔄"
            label="Eating window"
            multilineValue={['7:00 AM', '4:30 PM']}
            onPress={() => Alert.alert('Eating Window', 'Your eating window is 7:00 AM to 4:30 PM (9.5 hours).')}
            isLast
          />
        </View>

        {/* ============================================================ */}
        {/*  Application                                                 */}
        {/* ============================================================ */}
        <SectionHeader title="Application" />
        <View style={styles.card}>
          <SettingsRow
            icon="🔔"
            label="Notifications"
            value="Manage"
            onPress={() => router.push('/notifications')}
          />
          <ToggleRow
            icon="🎵"
            label="Sound effects"
            value={soundEffects}
            onValueChange={setSoundEffects}
          />
          <SettingsRow
            icon="🌐"
            label="Language"
            value="English"
            onPress={() => showPicker('Language', ['English', 'Spanish', 'French', 'German', 'Portuguese'], (v) => Alert.alert('Language', `Language set to ${v}`))}
          />
          <SettingsRow
            icon="📖"
            label="Food journal"
            onPress={() => router.push('/food-journal')}
          />
          <SettingsRow
            icon="🏗️"
            label="Home layout"
            onPress={() => router.push('/home-layout')}
          />
          <SettingsRow
            icon="👋"
            label="Measurement system"
            onPress={() => showPicker('Measurement System', ['Metric (kg, ml)', 'Imperial (lbs, oz)'], (v) => Alert.alert('Updated', `System set to ${v}`))}
          />
          <SettingsRow
            icon="🦊"
            label="Fox's name"
            value={user.petName || 'Caramel'}
            onPress={() => {
              Alert.prompt('Rename Fox', 'Enter a new name for your fox:', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Save', onPress: (val) => {
                  if (val && val.trim()) {
                    setUser({ petName: val.trim() });
                  }
                }},
              ], 'plain-text', user.petName || 'Caramel');
            }}
            isLast
          />
        </View>

        {/* ============================================================ */}
        {/*  Support                                                     */}
        {/* ============================================================ */}
        <SectionHeader title="Support" />
        <View style={styles.card}>
          <SettingsRow
            icon="❤️"
            label="Feedback & Help"
            onPress={() => Alert.alert('Feedback & Help', 'Have a question or suggestion? Email us at support@fuelfox.app', [{ text: 'OK' }])}
          />
          <SettingsRow
            icon="⭐"
            label="Rate on App Store"
            onPress={() => Alert.alert('Rate FuelFox', 'Thank you for wanting to rate FuelFox! This will open the App Store.', [{ text: 'Later' }, { text: 'Rate Now' }])}
            isLast
          />
        </View>

        {/* ============================================================ */}
        {/*  Account                                                     */}
        {/* ============================================================ */}
        <SectionHeader title="Account" />
        <View style={styles.card}>
          <StaticRow
            label="Email"
            value={user.email || 'danielobazuaye36@gmail.com'}
          />
          <SettingsRow
            label="Personal details"
            onPress={() => Alert.alert('Personal Details', 'View and edit your personal information (age, height, weight, gender).')}
            isLast
          />
        </View>

        {/* ============================================================ */}
        {/*  Community                                                   */}
        {/* ============================================================ */}
        <SectionHeader title="Community" />
        <View style={styles.card}>
          <SocialRow
            label="TikTok"
            iconName="logo-tiktok"
            onPress={() => Linking.openURL('https://www.tiktok.com')}
          />
          <SocialRow
            label="Instagram"
            iconName="logo-instagram"
            onPress={() => Linking.openURL('https://www.instagram.com')}
          />
          <SocialRow
            label="X (formerly Twitter)"
            iconName="logo-twitter"
            onPress={() => Linking.openURL('https://www.twitter.com')}
            isLast
          />
        </View>

        {/* ============================================================ */}
        {/*  Other                                                       */}
        {/* ============================================================ */}
        <SectionHeader title="Other" />
        <View style={styles.card}>
          <SettingsRow
            label="Privacy Notice"
            onPress={() => Alert.alert('Privacy Notice', 'FuelFox respects your privacy. Your data is stored securely and never shared with third parties without your consent.')}
          />
          <SettingsRow
            label="Terms of service"
            onPress={() => Alert.alert('Terms of Service', 'By using FuelFox, you agree to our terms of service. Visit our website for the full terms.')}
          />
          <SettingsRow
            label="Nutrition advice sources"
            onPress={() => Alert.alert('Nutrition Sources', 'Our nutrition data is sourced from USDA FoodData Central, the Mifflin-St Jeor equation, and peer-reviewed research.')}
          />
          <StaticRow
            label="App version"
            value="2.9.0.384"
          />
          <SettingsRow
            label="Delete my account"
            labelStyle={styles.deleteLabel}
            onPress={() => Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {
                  Alert.alert('Account Deleted', 'Your account has been deleted.');
                  router.replace('/welcome');
                }},
              ]
            )}
            isLast
          />
        </View>

        {/* ============================================================ */}
        {/*  Bottom: ID + Log out                                        */}
        {/* ============================================================ */}
        <Text style={styles.userId}>
          ID: zX8Sunnskuc7nYpyzaDLeHejJNv2
        </Text>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={() => Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', onPress: () => router.replace('/welcome') },
            ]
          )}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------------
//  Styles
// ------------------------------------------------------------------
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.black,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
  },
  sectionHeader: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    ...SHADOWS.card,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowIcon: {
    fontSize: 20,
    width: 32,
  },
  rowLabel: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: FONTS.regular,
    color: COLORS.black,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  multilineValueContainer: {
    alignItems: 'flex-end',
  },
  deleteLabel: {
    color: COLORS.error,
  },
  userId: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  logoutButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
  },
  logoutText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.medium,
    color: COLORS.textSecondary,
  },
});
