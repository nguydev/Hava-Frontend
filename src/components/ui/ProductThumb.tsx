import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/theme';

export interface ProductThumbProps {
  uri?: string | null;
  style?: ViewStyle;
  radius?: number;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconSize?: number;
}

/**
 * Product image with a branded gradient + icon placeholder behind it, so a
 * missing / slow / failed image never leaves a blank card.
 */
export function ProductThumb({
  uri,
  style,
  radius = 12,
  icon = 'package-variant-closed',
  iconSize = 26,
}: ProductThumbProps) {
  const [failed, setFailed] = useState(false);
  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden', backgroundColor: colors.card2 }, style]}>
      <LinearGradient
        colors={[colors.card2, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <MaterialCommunityIcons name={icon} size={iconSize} color={colors.ink3} />
      </View>
      {uri && !failed ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
          onError={() => setFailed(true)}
        />
      ) : null}
    </View>
  );
}
