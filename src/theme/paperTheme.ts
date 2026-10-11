import { MD3DarkTheme, configureFonts } from 'react-native-paper';

import { colors } from './colors';

const fontConfig = {
  displayLarge: { fontFamily: 'System', fontWeight: '800' as const },
} as const;

/** Branded React Native Paper (MD3) dark theme. */
export const paperTheme = {
  ...MD3DarkTheme,
  roundness: 4,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.heat,
    onPrimary: colors.white,
    primaryContainer: colors.heatDark,
    secondary: colors.brandCyan,
    background: colors.bg,
    surface: colors.surface,
    surfaceVariant: colors.card,
    onSurface: colors.ink0,
    onSurfaceVariant: colors.ink2,
    outline: colors.hair,
    error: colors.alert,
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: 'transparent',
      level1: colors.surface,
      level2: colors.card,
      level3: colors.card2,
      level4: colors.card2,
      level5: colors.card2,
    },
  },
};

export type AppPaperTheme = typeof paperTheme;
