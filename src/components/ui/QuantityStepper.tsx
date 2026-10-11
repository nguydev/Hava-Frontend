import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';
import { cn, haptics } from '@/utils';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantityStepperProps) {
  const btn = size === 'sm' ? 30 : 36;
  const change = (next: number) => {
    if (next < min || next > max) return;
    haptics.select();
    onChange(next);
  };

  const Button = ({
    icon,
    disabled,
    onPress,
  }: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    disabled: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn('items-center justify-center rounded-xl bg-card-2 border border-hair')}
      style={{ width: btn, height: btn, opacity: disabled ? 0.4 : 1 }}
    >
      <MaterialCommunityIcons name={icon} size={size === 'sm' ? 16 : 18} color={colors.ink0} />
    </Pressable>
  );

  return (
    <View className="flex-row items-center">
      <Button icon="minus" disabled={value <= min} onPress={() => change(value - 1)} />
      <Text
        className={cn('text-ink-0 font-bold text-center', size === 'sm' ? 'text-sm w-8' : 'text-base w-10')}
      >
        {value}
      </Text>
      <Button icon="plus" disabled={value >= max} onPress={() => change(value + 1)} />
    </View>
  );
}
