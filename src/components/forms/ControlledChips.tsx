import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Text, View } from 'react-native';

import { colors } from '@/theme';

import { Chip } from '../ui/Chip';

export interface ControlledChipsProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: { label: string; value: string }[];
}

export function ControlledChips<T extends FieldValues>({
  control,
  name,
  label,
  options,
}: ControlledChipsProps<T>) {
  const { field, fieldState } = useController({ control, name });
  return (
    <View className="mb-1">
      {label ? <Text className="text-ink-1 text-[13px] font-semibold mb-2">{label}</Text> : null}
      <View className="flex-row flex-wrap gap-2">
        {options.map((o) => (
          <Chip
            key={o.value}
            label={o.label}
            selected={field.value === o.value}
            onPress={() => field.onChange(o.value)}
          />
        ))}
      </View>
      {fieldState.error ? (
        <View className="flex-row items-center mt-1.5">
          <MaterialCommunityIcons name="alert-circle" size={13} color={colors.alert} />
          <Text className="text-alert text-xs ml-1">{fieldState.error.message}</Text>
        </View>
      ) : null}
    </View>
  );
}
