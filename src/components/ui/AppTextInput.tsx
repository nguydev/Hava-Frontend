import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '@/theme';
import { cn } from '@/utils';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightSlot?: ReactNode;
  secureToggle?: boolean;
  containerClassName?: string;
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(function AppTextInput(
  {
    label,
    error,
    hint,
    icon,
    rightSlot,
    secureToggle,
    containerClassName,
    multiline,
    style,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const inputRef = useRef<TextInput>(null);
  useImperativeHandle(ref, () => inputRef.current!);

  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderColor = error ? colors.alert : focused ? colors.heat : colors.hair;

  return (
    <View className={cn('mb-1', containerClassName)}>
      {label ? <Text className="text-ink-1 text-[13px] font-semibold mb-1.5">{label}</Text> : null}
      <Pressable
        onPress={() => inputRef.current?.focus()}
        className="flex-row items-center rounded-2xl bg-card px-3.5"
        style={{
          borderWidth: 1.5,
          borderColor,
          minHeight: multiline ? 104 : 52,
          alignItems: multiline ? 'flex-start' : 'center',
          paddingVertical: multiline ? 12 : 0,
        }}
      >
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={focused ? colors.heat : colors.ink3}
            style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }}
          />
        ) : null}
        <TextInput
          ref={inputRef}
          placeholderTextColor={colors.ink3}
          multiline={multiline}
          secureTextEntry={secureToggle ? hidden : rest.secureTextEntry}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className="flex-1 text-ink-0 text-[15px]"
          style={[
            { paddingVertical: multiline ? 0 : 12, textAlignVertical: multiline ? 'top' : 'center', outlineStyle: 'none' as any },
            style,
          ]}
          {...rest}
        />
        {secureToggle ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} className="pl-2">
            <MaterialCommunityIcons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.ink3}
            />
          </Pressable>
        ) : null}
        {rightSlot ? <View className="pl-2">{rightSlot}</View> : null}
      </Pressable>
      {error ? (
        <View className="flex-row items-center mt-1.5">
          <MaterialCommunityIcons name="alert-circle" size={13} color={colors.alert} />
          <Text className="text-alert text-xs ml-1">{error}</Text>
        </View>
      ) : hint ? (
        <Text className="text-ink-3 text-xs mt-1.5">{hint}</Text>
      ) : null}
    </View>
  );
});
