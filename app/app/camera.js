import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { analyzeMealPhoto, analyzeLabelPhoto } from '../src/services/api';
import { FoxAvatar } from '../src/components';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../src/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIEWFINDER_SIZE = SCREEN_WIDTH * 0.7;

// ------------------------------------------------------------------
//  Tips data
// ------------------------------------------------------------------
const TIPS = [
  { id: 1, text: 'Place your meal on a flat surface for best results' },
  { id: 2, text: 'Make sure the food is well-lit and clearly visible' },
  { id: 3, text: 'Try to capture all items in a single photo' },
  { id: 4, text: 'For labels, hold steady and keep text in focus' },
];

// ------------------------------------------------------------------
//  Main camera screen
// ------------------------------------------------------------------
export default function CameraScreen() {
  const router = useRouter();
  const [mode, setMode] = useState('meal'); // 'meal' | 'label'
  const [flashOn, setFlashOn] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = useCallback(async (imageUri) => {
    setIsAnalyzing(true);
    try {
      const analyzeFunc = mode === 'meal' ? analyzeMealPhoto : analyzeLabelPhoto;
      const result = await analyzeFunc(imageUri);
      router.push({
        pathname: '/analysis-results',
        params: {
          analysis: JSON.stringify(result.analysis || {}),
          mode,
        },
      });
    } catch (err) {
      Alert.alert(
        'Analysis Failed',
        err.message || 'Could not analyze the image. Please try again.',
        [
          { text: 'Try Again', onPress: () => {} },
          { text: 'Go Back', onPress: () => router.back(), style: 'cancel' },
        ]
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [mode, router]);

  const handleCapture = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to scan food.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length > 0) {
      await analyzeImage(result.assets[0].uri);
    }
  }, [analyzeImage]);

  const handleGallery = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length > 0) {
      await analyzeImage(result.assets[0].uri);
    }
  }, [analyzeImage]);

  const handleType = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.prompt(
      'Log Food Manually',
      'Enter the food name and calories (e.g. "Chicken salad, 350"):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (val) => {
            if (val && val.trim()) {
              Alert.alert('Food Logged', `"${val.trim()}" has been added to your log.`);
              router.back();
            }
          },
        },
      ],
      'plain-text'
    );
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Loading overlay */}
      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <FoxAvatar mood="thinking" size={100} />
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.lg }} />
          <Text style={styles.loadingText}>Analyzing your {mode === 'meal' ? 'meal' : 'label'}...</Text>
          <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
        </View>
      )}

      {/* Camera preview placeholder (dark background simulates camera) */}
      <View style={styles.cameraPreview}>
        {/* Top controls */}
        <SafeAreaView edges={['top']} style={styles.topControls}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color={COLORS.white} />
          </TouchableOpacity>

          {/* Mode toggle pill */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'meal' && styles.modeBtnActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setMode('meal');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeBtnText, mode === 'meal' && styles.modeBtnTextActive]}>
                Meal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'label' && styles.modeBtnActiveGreen]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setMode('label');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeBtnText, mode === 'label' && styles.modeBtnTextActive]}>
                Label
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.topButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFlashOn(!flashOn);
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={flashOn ? 'flash' : 'flash-off'}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Viewfinder overlay */}
        <View style={styles.viewfinderArea}>
          {mode === 'meal' ? (
            /* Circular viewfinder for meal mode */
            <View style={styles.circleViewfinder}>
              <View style={styles.circleViewfinderInner} />
            </View>
          ) : (
            /* Rounded rectangle for label mode */
            <View style={styles.rectViewfinder}>
              {/* Corner marks */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          )}
        </View>

        {/* Bottom controls */}
        <SafeAreaView edges={['bottom']} style={styles.bottomSection}>
          {/* Action buttons row */}
          <View style={styles.actionRow}>
            {/* Gallery */}
            <TouchableOpacity
              style={styles.sideAction}
              onPress={handleGallery}
              activeOpacity={0.7}
              disabled={isAnalyzing}
            >
              <View style={styles.sideActionIcon}>
                <Ionicons name="image-outline" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.sideActionLabel}>Gallery</Text>
            </TouchableOpacity>

            {/* Capture button */}
            <TouchableOpacity
              style={[styles.captureButton, isAnalyzing && { opacity: 0.5 }]}
              onPress={handleCapture}
              activeOpacity={0.8}
              disabled={isAnalyzing}
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>

            {/* Type */}
            <TouchableOpacity
              style={styles.sideAction}
              onPress={handleType}
              activeOpacity={0.7}
              disabled={isAnalyzing}
            >
              <View style={styles.sideActionIcon}>
                <Ionicons name="keypad-outline" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.sideActionLabel}>Type</Text>
            </TouchableOpacity>
          </View>

          {/* Tips carousel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.tipsCarousel}
            contentContainerStyle={styles.tipsContent}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 64));
              setCurrentTip(index);
            }}
          >
            {TIPS.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <Ionicons name="bulb-outline" size={16} color={COLORS.yellow} />
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Tip dots */}
          <View style={styles.tipDots}>
            {TIPS.map((_, i) => (
              <View
                key={i}
                style={[styles.tipDot, i === currentTip && styles.tipDotActive]}
              />
            ))}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

// ------------------------------------------------------------------
//  Styles
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginTop: SPACING.lg,
  },
  loadingSubtext: {
    fontSize: FONTS.bodySmall,
    color: 'rgba(255,255,255,0.6)',
    marginTop: SPACING.sm,
  },

  // Top controls
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Mode toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.pill,
    padding: 3,
  },
  modeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
  },
  modeBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  modeBtnActiveGreen: {
    backgroundColor: COLORS.primary,
  },
  modeBtnText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.6)',
  },
  modeBtnTextActive: {
    color: COLORS.white,
  },

  // Viewfinder
  viewfinderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleViewfinder: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE,
    borderRadius: VIEWFINDER_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleViewfinderInner: {
    width: VIEWFINDER_SIZE - 16,
    height: VIEWFINDER_SIZE - 16,
    borderRadius: (VIEWFINDER_SIZE - 16) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  rectViewfinder: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE * 0.65,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.white,
  },
  cornerTL: {
    top: -1,
    left: -1,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: -1,
    right: -1,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 16,
  },

  // Bottom section
  bottomSection: {
    paddingBottom: SPACING.lg,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  sideAction: {
    alignItems: 'center',
    gap: 6,
  },
  sideActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideActionLabel: {
    fontSize: FONTS.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },

  // Tips
  tipsCarousel: {
    maxHeight: 50,
    marginBottom: SPACING.sm,
  },
  tipsContent: {
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.md,
  },
  tipCard: {
    width: SCREEN_WIDTH - 64,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tipText: {
    fontSize: FONTS.caption,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
  },
  tipDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tipDotActive: {
    backgroundColor: COLORS.white,
    width: 16,
  },
});
