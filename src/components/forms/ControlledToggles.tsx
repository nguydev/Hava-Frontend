import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Pressable, Switch, Text, View } from 'react-native';

import { colors } from '@/theme';
import { withAlpha } from '@/utils';

/** Labeled switch row bound to a boolean field. */
export function ControlledSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
  icon,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}) {
  const { field } = useController({ control, name });
  return (
    <View className="flex-row items-center py-3">
      {icon ? (
        <View
          className="w-9 h-9 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: withAlpha(colors.heat, 0.14) }}
        >
          <MaterialCommunityIcons name={icon} size={18} color={colors.heat} />
        </View>
      ) : null}
      <View className="flex-1 pr-3">
        <Text className="text-ink-0 text-[15px] font-medium">{label}</Text>
        {description ? <Text className="text-ink-2 text-[13px] mt-0.5">{description}</Text> : null}
      </View>
      <Switch
        value={!!field.value}
        onValueChange={field.onChange}
        trackColor={{ false: colors.card2, true: withAlpha(colors.heat, 0.6) }}
        thumbColor={field.value ? colors.heat : colors.ink2}
        ios_backgroundColor={colors.card2}
      />
    </View>
  );
}

/** Checkbox row bound to a boolean field, with rich label support. */
export function ControlledCheckbox<T extends FieldValues>({
  control,
  name,
  label,
}: {
  control: Control<T>;
  name: Path<T>;
  label: ReactNode;
}) {
  const { field, fieldState } = useController({ control, name });
  const checked = !!field.value;
  return (
    <View>
      <Pressable className="flex-row items-start py-2" onPress={() => field.onChange(!checked)}>
        <View
          className="w-6 h-6 rounded-md items-center justify-center mr-3 mt-0.5"
          style={{
            backgroundColor: checked ? colors.heat : 'transparent',
            borderWidth: 2,
            borderColor: checked ? colors.heat : fieldState.error ? colors.alert : colors.hair,
          }}
        >
          {checked ? <MaterialCommunityIcons name="check" size={16} color={colors.white} /> : null}
        </View>
        <View className="flex-1">
          {typeof label === 'string' ? (
            <Text className="text-ink-1 text-[13px] leading-5">{label}</Text>
          ) : (
            label
          )}
        </View>
      </Pressable>
      {fieldState.error ? (
        <Text className="text-alert text-xs ml-9">{fieldState.error.message}</Text>
      ) : null}
    </View>
  );
}
