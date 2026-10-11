import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

import { colors } from '@/theme';
import { cn, haptics } from '@/utils';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  className?: string;
}

export function Chip({ label, selected = false, onPress, icon, className }: ChipProps) {
  return (
    <Pressable
      onPress={() => {
        haptics.select();
        onPress?.();
      }}
      className={cn(
        'flex-row items-center rounded-pill border px-3.5 py-2',
        selected ? 'bg-heat border-heat' : 'bg-card-2 border-hair',
        className,
      )}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={15}
          color={selected ? colors.white : colors.ink2}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <Text
        className={cn('text-[13px] font-semibold', selected ? 'text-white' : 'text-ink-2')}
      >
        {label}
      </Text>
    </Pressable>
  );
}
