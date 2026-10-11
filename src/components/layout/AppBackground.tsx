import { LinearGradient } from 'expo-linear-gradient';
import { View, ViewStyle } from 'react-native';

import { colors } from '@/theme';

export interface AppBackgroundProps {
  /** Extra glow tint bleeding from the top — used on hero/auth screens. */
  glow?: boolean;
  style?: ViewStyle;
}

/**
 * App-wide backdrop derived from the brand `background image.svg`:
 * a diagonal slate → near-black → slate gradient over a deep base. Rendered
 * once behind the whole navigator so every screen shares the same field.
 * `pointerEvents="none"` so it never intercepts touches.
 */
export function AppBackground({ glow = false, style }: AppBackgroundProps) {
  return (
    <View
      pointerEvents="none"
      style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.bg }, style]}
    >
      {/* Diagonal slate → black → slate (matches the reference SVG stops) */}
      <LinearGradient
        colors={['#1C2739', '#080B12', '#161F2E']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {/* Soft brand glow bleeding from the top on hero screens */}
      {glow ? (
        <LinearGradient
          colors={['rgba(46,144,250,0.20)', 'rgba(34,211,238,0.06)', 'transparent']}
          locations={[0, 0.35, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 0.6 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 460 }}
        />
      ) : null}
    </View>
  );
}
