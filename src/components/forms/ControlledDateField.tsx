import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '@/theme';
import { formatDate } from '@/utils';

import { BottomSheet, SheetOption } from '../feedback/BottomSheet';

export interface ControlledDateFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  days?: number;
}

/** Dependency-free date picker: a scrollable list of upcoming dates in a sheet. */
export function ControlledDateField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select a date',
  days = 21,
}: ControlledDateFieldProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const value = formatDate(d);
      const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
      const label = i === 0 ? `Today · ${value}` : i === 1 ? `Tomorrow · ${value}` : value;
      return { value, label, description: i > 1 ? weekday : undefined };
    });
  }, [days]);

  const borderColor = fieldState.error ? colors.alert : colors.hair;

  return (
    <View className="mb-1">
      {label ? <Text className="text-ink-1 text-[13px] font-semibold mb-1.5">{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center rounded-2xl bg-card px-3.5"
        style={{ borderWidth: 1.5, borderColor, minHeight: 52 }}
      >
        <MaterialCommunityIcons name="calendar-month-outline" size={20} color={colors.ink3} style={{ marginRight: 10 }} />
        <Text className={field.value ? 'flex-1 text-ink-0 text-[15px]' : 'flex-1 text-ink-3 text-[15px]'}>
          {field.value || placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={22} color={colors.ink3} />
      </Pressable>
      {fieldState.error ? (
        <View className="flex-row items-center mt-1.5">
          <MaterialCommunityIcons name="alert-circle" size={13} color={colors.alert} />
          <Text className="text-alert text-xs ml-1">{fieldState.error.message}</Text>
        </View>
      ) : null}

      <BottomSheet visible={open} onClose={() => setOpen(false)} title="Choose a date">
        <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
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
        </ScrollView>
      </BottomSheet>
    </View>
  );
}
