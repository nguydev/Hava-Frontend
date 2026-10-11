import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { BottomSheet, SheetOption } from '../feedback/BottomSheet';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

export interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  sheetTitle?: string;
}

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select an option',
  options,
  icon,
  sheetTitle,
}: ControlledSelectProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === field.value);
  const borderColor = fieldState.error ? colors.alert : colors.hair;

  return (
    <View className="mb-1">
      {label ? <Text className="text-ink-1 text-[13px] font-semibold mb-1.5">{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center rounded-2xl bg-card px-3.5"
        style={{ borderWidth: 1.5, borderColor, minHeight: 52 }}
      >
        {icon ? (
          <MaterialCommunityIcons name={icon} size={20} color={colors.ink3} style={{ marginRight: 10 }} />
        ) : null}
        <Text className={selected ? 'flex-1 text-ink-0 text-[15px]' : 'flex-1 text-ink-3 text-[15px]'}>
          {selected?.label ?? placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={22} color={colors.ink3} />
      </Pressable>
      {fieldState.error ? (
        <View className="flex-row items-center mt-1.5">
          <MaterialCommunityIcons name="alert-circle" size={13} color={colors.alert} />
          <Text className="text-alert text-xs ml-1">{fieldState.error.message}</Text>
        </View>
      ) : null}

      <BottomSheet visible={open} onClose={() => setOpen(false)} title={sheetTitle ?? label}>
        {options.map((o) => (
          <SheetOption
            key={o.value}
            label={o.label}
            description={o.description}
            selected={o.value === field.value}
            onPress={() => {
              field.onChange(o.value);
              setOpen(false);
            }}
          />
        ))}
      </BottomSheet>
    </View>
  );
}
