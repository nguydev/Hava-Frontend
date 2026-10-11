import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { cn, withAlpha } from '@/utils';

export interface StatusBadgeProps {
  label: string;
  color: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ label, color, icon, size = 'md', className }: StatusBadgeProps) {
  const isSm = size === 'sm';
  return (
    <View
      className={cn('flex-row items-center self-start rounded-pill', isSm ? 'px-2 py-0.5' : 'px-2.5 py-1', className)}
      style={{ backgroundColor: withAlpha(color, 0.15) }}
    >
      {icon ? (
        <MaterialCommunityIcons name={icon} size={isSm ? 12 : 14} color={color} style={{ marginRight: 4 }} />
      ) : (
        <View
          style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, marginRight: 6 }}
        />
      )}
      <Text
        className={cn('font-semibold', isSm ? 'text-[11px]' : 'text-xs')}
        style={{ color }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}
