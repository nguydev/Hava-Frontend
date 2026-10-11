import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { colors, shadow } from '@/theme';
import { withAlpha } from '@/utils';

export interface AnnouncementCardProps {
  title: string;
  message: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
}

export function AnnouncementCard({
  title,
  message,
  icon = 'headset',
  actionLabel,
  onAction,
}: AnnouncementCardProps) {
  return (
    <LinearGradient
      colors={[withAlpha(colors.brandBlue, 0.26), withAlpha(colors.brandCyan, 0.1)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: 20, borderWidth: 1, borderColor: withAlpha(colors.brandCyan, 0.38) }, shadow.card]}
    >
      <View className="p-4 flex-row items-center">
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center mr-3.5"
          style={{ backgroundColor: withAlpha(colors.brandCyan, 0.2) }}
        >
          <MaterialCommunityIcons name={icon} size={24} color={colors.brandCyan} />
        </View>
        <View className="flex-1">
          <Text className="text-ink-0 text-[15px] font-bold">{title}</Text>
          <Text className="text-ink-1 text-[13px] mt-0.5 leading-5">{message}</Text>
          {actionLabel && onAction ? (
            <Pressable onPress={onAction} hitSlop={6} className="mt-2 self-start">
              <Text className="text-heat text-[13px] font-bold">{actionLabel} →</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </LinearGradient>
  );
}
