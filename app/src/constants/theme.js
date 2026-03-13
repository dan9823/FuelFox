import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const COLORS = {
  // Primary oranges (fox theme)
  primary: '#E8813A',
  primaryDark: '#C66A28',
  primaryLight: '#F5A860',
  primaryFaded: 'rgba(232, 129, 58, 0.12)',

  // Backgrounds
  background: '#FFF8F2',
  backgroundDark: '#F0E6DB',
  white: '#FFFFFF',
  card: '#FFFFFF',

  surface: '#F5F0EA',

  // Text
  black: '#2A1A0E',
  textPrimary: '#2A1A0E',
  textSecondary: '#7A6A5A',
  textMuted: '#A0907E',
  textLight: '#B8A898',

  // Accents
  orange: '#FF9800',
  orangeDark: '#F57C00',
  orangeLight: '#FFE0B2',
  yellow: '#FFD700',
  yellowLight: '#FFF9C4',
  star: '#FFD700',
  coin: '#E8813A',

  // Status
  success: '#5CB85C',
  error: '#EF5353',
  errorLight: '#FFEBEE',
  warning: '#FFC107',
  info: '#2196F3',

  // UI elements
  border: '#F0E6DB',
  divider: '#F5F0EA',
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  inactive: '#D8CCBE',
  tabInactive: '#B8A898',

  // Water
  water: '#42A5F5',
  waterLight: '#E3F2FD',

  // Fasting
  fasting: '#7E57C2',
  fastingLight: '#EDE7F6',

  // Gradients (used with expo-linear-gradient)
  gradientPrimary: ['#E8813A', '#C66A28'],
  gradientOrange: ['#FF9800', '#F57C00'],
  gradientPurple: ['#7E57C2', '#5E35B1'],
  gradientBlue: ['#42A5F5', '#1976D2'],
};

export const FONTS = {
  // Weights
  bold: '800',
  semiBold: '700',
  medium: '600',
  regular: '400',
  light: '300',

  // Sizes
  hero: 34,
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,
};

export const TYPOGRAPHY = {
  hero: {
    fontSize: FONTS.hero,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    lineHeight: 42,
  },
  h1: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    lineHeight: 36,
  },
  h2: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    lineHeight: 32,
  },
  h3: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.semiBold,
    color: COLORS.black,
    lineHeight: 28,
  },
  h4: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.semiBold,
    color: COLORS.black,
    lineHeight: 26,
  },
  body: {
    fontSize: FONTS.body,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.regular,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  button: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
    lineHeight: 20,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  card: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 50,
  circle: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#E8813A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const SIZES = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  buttonHeight: 56,
  buttonHeightSmall: 44,
  inputHeight: 52,
  tabBarHeight: 80,
  headerHeight: 56,
  iconSmall: 20,
  iconMedium: 24,
  iconLarge: 32,
  avatarSmall: 40,
  avatarMedium: 60,
  avatarLarge: 100,
  petAvatar: 120,
  progressBarHeight: 8,
  cardMinHeight: 80,
};

const theme = {
  COLORS,
  FONTS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  SIZES,
};

export default theme;
