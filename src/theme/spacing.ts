import { Platform, ViewStyle } from 'react-native';

import { colors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  card: 18,
  xl: 24,
  pill: 999,
} as const;

/** Soft, elevated shadow used across cards. */
export const shadow = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }) as ViewStyle,
  glow: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.heat,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.28,
      shadowRadius: 10,
    },
    android: { elevation: 5 },
    default: {},
  }) as ViewStyle,
} as const;
