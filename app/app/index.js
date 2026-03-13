import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

const SPLASH_BG = '#F5E6D3';

function FoxMaskLogo({ size = 140 }) {
  return (
    <View style={{ width: size, height: size * 0.7 }}>
      <Svg width={size} height={size * 0.7} viewBox="0 0 200 140">
        {/* Left eye mask - warm orange */}
        <Ellipse cx="65" cy="50" rx="44" ry="34" fill="#D4742F" stroke="#B85E22" strokeWidth="3" />
        {/* Right eye mask */}
        <Ellipse cx="135" cy="50" rx="44" ry="34" fill="#D4742F" stroke="#B85E22" strokeWidth="3" />

        {/* Left eye white - BIGGER */}
        <Ellipse cx="65" cy="48" rx="22" ry="24" fill="white" stroke="#9A4B1A" strokeWidth="2" />
        {/* Left pupil - fills most of eye */}
        <Circle cx="65" cy="48" r="14" fill="#1A1A1E" />
        {/* Left highlight - single large dot */}
        <Circle cx="71" cy="42" r="5.5" fill="white" />
        <Circle cx="60" cy="54" r="2.5" fill="white" />

        {/* Right eye white - BIGGER */}
        <Ellipse cx="135" cy="48" rx="22" ry="24" fill="white" stroke="#9A4B1A" strokeWidth="2" />
        {/* Right pupil */}
        <Circle cx="135" cy="48" r="14" fill="#1A1A1E" />
        {/* Right highlight */}
        <Circle cx="141" cy="42" r="5.5" fill="white" />
        <Circle cx="130" cy="54" r="2.5" fill="white" />

        {/* Eyebrow lines - warm brown */}
        <Path d="M 36 18 Q 65 4 94 20" fill="none" stroke="#9A4B1A" strokeWidth="5" strokeLinecap="round" />
        <Path d="M 106 20 Q 135 4 164 18" fill="none" stroke="#9A4B1A" strokeWidth="5" strokeLinecap="round" />

        {/* Nose - small dark triangle */}
        <Path
          d="M 94 88 L 100 80 L 106 88 Z"
          fill="#1A1A1E"
        />
        {/* Mouth */}
        <Path
          d="M 88 96 Q 94 104 100 98 Q 106 104 112 96"
          fill="none"
          stroke="#1A1A1E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/welcome');
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.center}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: 'center',
          }}
        >
          <FoxMaskLogo size={160} />
          <Text style={styles.brandName}>FuelFox</Text>
          <Text style={styles.tagline}>Smart nutrition, naturally</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#C66A28',
    marginTop: 20,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    color: '#A0907E',
    marginTop: 6,
    letterSpacing: 0.5,
  },
});
