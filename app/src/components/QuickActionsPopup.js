import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Dark theme colors for the popup
const POPUP_COLORS = {
  bg: '#3A2A1A',
  divider: 'rgba(255, 200, 150, 0.12)',
  label: '#FFFFFF',
  subtitle: 'rgba(255, 220, 180, 0.6)',
  iconBtnBg: '#4A3A2A',
  startBtnBg: '#E8813A',
  startBtnText: '#FFFFFF',
  iconColor: '#FFD4A8',
};

export default function QuickActionsPopup({ visible, onClose }) {
  const router = useRouter();
  const { dailyLog, goals, addWater, startFasting, stopFasting, logWeight } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const currentWeight = dailyLog.weight || goals.targetWeight || 60;
  const caloriesLeft = Math.max(0, goals.calories - dailyLog.calories);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 30,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const handleAction = (action) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();

    switch (action) {
      case 'camera':
        router.push('/camera');
        break;
      case 'type':
        router.push('/quick-log');
        break;
      case 'weight':
        Alert.prompt(
          'Log Weight',
          'Enter your weight in kg:',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Save',
              onPress: (val) => {
                const w = parseFloat(val);
                if (w > 0) {
                  logWeight(w);
                  Alert.alert('Saved', `Weight logged: ${w} kg`);
                }
              },
            },
          ],
          'plain-text',
          currentWeight.toString(),
          'decimal-pad'
        );
        break;
      case 'water':
        addWater(250);
        Alert.alert('Water Added', `+250 ml (Total: ${dailyLog.waterMl + 250} ml)`);
        break;
      case 'fasting_start':
        startFasting();
        Alert.alert('Fasting Started', 'Your fasting timer has started. Stay strong!');
        break;
      case 'fasting':
        if (dailyLog.fastingStartTime && !dailyLog.fastingEndTime) {
          Alert.alert(
            'End Fasting?',
            'Do you want to stop your current fast?',
            [
              { text: 'Keep Going', style: 'cancel' },
              {
                text: 'End Fast',
                onPress: () => stopFasting(),
              },
            ]
          );
        } else {
          startFasting();
          Alert.alert('Fasting Started', 'Your fasting timer has started.');
        }
        break;
      case 'food':
        router.push('/camera');
        break;
      default:
        break;
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Popup card */}
      <Animated.View
        style={[
          styles.popup,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        pointerEvents="auto"
      >
        {/* Weight row */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => handleAction('weight')}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionLabel}>Weight</Text>
            <Text style={styles.actionSubtitle}>{currentWeight} kg</Text>
          </View>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleAction('weight')}
            activeOpacity={0.7}
          >
            <Ionicons name="scale-outline" size={20} color={POPUP_COLORS.iconColor} />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Water row */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => handleAction('water')}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionLabel}>Water</Text>
            <Text style={styles.actionSubtitle}>{dailyLog.waterMl} ml</Text>
          </View>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleAction('water')}
            activeOpacity={0.7}
          >
            <Ionicons name="water-outline" size={20} color={POPUP_COLORS.iconColor} />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Fasting row */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => handleAction('fasting')}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionLabel}>Fasting</Text>
            <Text style={styles.actionSubtitle}>
              {dailyLog.fastingStartTime && !dailyLog.fastingEndTime
                ? 'In progress'
                : 'Planned at 4:30 PM'}
            </Text>
          </View>
          {!dailyLog.fastingStartTime ? (
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => handleAction('fasting_start')}
              activeOpacity={0.7}
            >
              <Text style={styles.startBtnText}>START</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleAction('fasting')}
              activeOpacity={0.7}
            >
              <Ionicons name="timer-outline" size={20} color={POPUP_COLORS.iconColor} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Food row */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => handleAction('food')}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionLabel}>Food</Text>
            <Text style={styles.actionSubtitle}>{caloriesLeft.toLocaleString()} kcal left</Text>
          </View>
          <View style={styles.foodActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleAction('type')}
              activeOpacity={0.7}
            >
              <Ionicons name="keypad-outline" size={20} color={POPUP_COLORS.iconColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleAction('camera')}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={20} color={POPUP_COLORS.iconColor} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  popup: {
    position: 'absolute',
    bottom: 96,
    right: 16,
    width: SCREEN_WIDTH * 0.82,
    backgroundColor: POPUP_COLORS.bg,
    borderRadius: 24,
    ...SHADOWS.large,
    paddingVertical: SPACING.xs,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
  },
  actionContent: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: FONTS.semiBold,
    color: POPUP_COLORS.label,
  },
  actionSubtitle: {
    fontSize: 13,
    fontWeight: FONTS.regular,
    color: POPUP_COLORS.subtitle,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: POPUP_COLORS.divider,
    marginHorizontal: SPACING.lg,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: POPUP_COLORS.iconBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtn: {
    backgroundColor: POPUP_COLORS.startBtnBg,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
  },
  startBtnText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: POPUP_COLORS.startBtnText,
    letterSpacing: 1.2,
  },
  foodActions: {
    flexDirection: 'row',
    gap: 10,
  },
});
