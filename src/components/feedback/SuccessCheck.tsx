import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { colors } from '@/theme';
import { withAlpha } from '@/utils';

export interface SuccessCheckProps {
  size?: number;
  color?: string;
}

export function SuccessCheck({ size = 104, color = colors.ok }: SuccessCheckProps) {
  const inner = size * 0.66;
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(12)}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: withAlpha(color, 0.16),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: inner,
          height: inner,
          borderRadius: inner / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialCommunityIcons name="check-bold" size={inner * 0.5} color={colors.white} />
      </View>
    </Animated.View>
  );
}
