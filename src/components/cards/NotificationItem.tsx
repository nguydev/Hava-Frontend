import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';
import type { AppNotification, NotificationCategory } from '@/types';
import { cn, withAlpha } from '@/utils';

const META: Record<
  NotificationCategory,
  { color: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  Order: { color: colors.info, icon: 'package-variant' },
  Quote: { color: colors.amber, icon: 'file-document-outline' },
  Delivery: { color: colors.heat, icon: 'truck-delivery-outline' },
  ETA: { color: colors.steel, icon: 'clock-fast' },
  Driver: { color: colors.ok, icon: 'account-hard-hat' },
  System: { color: colors.brandCyan, icon: 'bell-ring-outline' },
};

export interface NotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const meta = META[notification.category];
  const unread = !notification.read;
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-start rounded-2xl p-3.5 border',
        unread ? 'bg-card border-heat' : 'bg-card border-hair',
      )}
      style={
        unread
          ? { backgroundColor: withAlpha(colors.brandBlue, 0.05), borderColor: withAlpha(colors.brandBlue, 0.55) }
          : undefined
      }
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: withAlpha(meta.color, 0.16) }}
      >
        <MaterialCommunityIcons name={meta.icon} size={20} color={meta.color} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text
            className={cn('text-[14px] flex-1', notification.read ? 'text-ink-1 font-semibold' : 'text-ink-0 font-bold')}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          {!notification.read ? <View className="w-2 h-2 rounded-full bg-heat ml-2" /> : null}
        </View>
        <Text className="text-ink-2 text-[13px] mt-0.5 leading-5">{notification.message}</Text>
        <Text className="text-ink-3 text-xs mt-1">{notification.time}</Text>
      </View>
    </Pressable>
  );
}
