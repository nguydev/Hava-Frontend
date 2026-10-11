import { Pressable, Text, View } from 'react-native';

import { cn } from '@/utils';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <View className={cn('flex-row items-center justify-between mb-3', className)}>
      <View className="flex-1 pr-3">
        <Text className="text-ink-0 text-lg font-bold">{title}</Text>
        {subtitle ? <Text className="text-ink-2 text-[13px] mt-0.5">{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-heat text-[13px] font-semibold">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
