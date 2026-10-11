import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';
import { withAlpha } from '@/utils';

import { AppButton } from '../ui/AppButton';

export interface EmptyStateProps {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tint?: string;
}

export function EmptyState({
  icon = 'inbox-outline',
  title,
  message,
  actionLabel,
  onAction,
  tint = colors.heat,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View
        className="items-center justify-center rounded-full mb-5"
        style={{ width: 92, height: 92, backgroundColor: withAlpha(tint, 0.12) }}
      >
        <MaterialCommunityIcons name={icon} size={44} color={tint} />
      </View>
      <Text className="text-ink-0 text-lg font-bold text-center">{title}</Text>
      {message ? (
        <Text className="text-ink-2 text-sm text-center mt-2 leading-5">{message}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-6 w-full max-w-[240px]">
          <AppButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
