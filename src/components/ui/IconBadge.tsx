import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

import { colors } from '@/theme';
import { withAlpha } from '@/utils';

export interface IconBadgeProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  size?: number;
  className?: string;
}

export function IconBadge({ icon, color = colors.heat, size = 44, className }: IconBadgeProps) {
  return (
    <View
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: withAlpha(color, 0.16),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MaterialCommunityIcons name={icon} size={size * 0.5} color={color} />
    </View>
  );
}
