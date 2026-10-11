import { Text, View } from 'react-native';

import { cn } from '@/utils';

export interface DetailRowProps {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}

/** Label / value row used in spec tables, order & delivery detail screens. */
export function DetailRow({ label, value, className, valueClassName }: DetailRowProps) {
  return (
    <View className={cn('flex-row items-center justify-between py-2', className)}>
      <Text className="text-ink-2 text-[13px] flex-1 pr-3">{label}</Text>
      <Text className={cn('text-ink-0 text-[13px] font-semibold text-right flex-1', valueClassName)}>
        {value}
      </Text>
    </View>
  );
}
