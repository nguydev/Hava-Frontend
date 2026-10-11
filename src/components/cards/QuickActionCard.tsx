import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors, shadow } from '@/theme';
import { haptics, withAlpha } from '@/utils';

export interface QuickActionCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

export function QuickActionCard({ icon, label, onPress, color = colors.heat }: QuickActionCardProps) {
  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      style={shadow.card}
      className="flex-1 rounded-card bg-card border border-hair p-3.5 items-start"
    >
      <View
        className="w-11 h-11 rounded-xl items-center justify-center mb-2.5"
        style={{ backgroundColor: withAlpha(color, 0.16) }}
      >
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <Text className="text-ink-0 text-[13px] font-semibold" numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}
