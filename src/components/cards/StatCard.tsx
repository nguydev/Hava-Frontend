import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors, shadow } from '@/theme';
import { withAlpha } from '@/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
}

export function StatCard({ label, value, icon, color = colors.heat }: StatCardProps) {
  return (
    <View
      style={shadow.card}
      className="flex-1 rounded-card bg-card border border-hair p-3.5"
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mb-2.5"
        style={{ backgroundColor: withAlpha(color, 0.16) }}
      >
        <MaterialCommunityIcons name={icon} size={18} color={color} />
      </View>
      <Text className="text-ink-0 text-2xl font-extrabold">{value}</Text>
      <Text className="text-ink-2 text-xs mt-0.5" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
