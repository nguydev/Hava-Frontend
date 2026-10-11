import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';
import { withAlpha } from '@/utils';

export interface MenuRowProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
  tint?: string;
}

export function MenuRow({ icon, label, onPress, danger, tint = colors.heat }: MenuRowProps) {
  const accent = danger ? colors.alert : tint;
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3.5">
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: withAlpha(accent, 0.14) }}
      >
        <MaterialCommunityIcons name={icon} size={18} color={accent} />
      </View>
      <Text
        className="text-[15px] font-medium flex-1"
        style={{ color: danger ? colors.alert : colors.ink0 }}
      >
        {label}
      </Text>
      {!danger ? <MaterialCommunityIcons name="chevron-right" size={20} color={colors.ink3} /> : null}
    </Pressable>
  );
}
