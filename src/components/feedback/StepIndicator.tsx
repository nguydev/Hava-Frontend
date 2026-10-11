import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fragment } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/theme';

export interface StepIndicatorProps {
  steps: string[];
  current: number; // zero-based index of the active step
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <View className="flex-row items-start">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const filled = done || active;
        return (
          <Fragment key={label}>
            <View className="items-center" style={{ width: 56 }}>
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: filled ? colors.heat : colors.card2,
                  borderWidth: filled ? 0 : 1,
                  borderColor: colors.hair,
                }}
              >
                {done ? (
                  <MaterialCommunityIcons name="check" size={16} color={colors.white} />
                ) : (
                  <Text
                    className="text-xs font-bold"
                    style={{ color: active ? colors.white : colors.ink3 }}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                className="text-[10px] text-center mt-1.5"
                style={{ color: active ? colors.ink0 : colors.ink3 }}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
            {i < steps.length - 1 ? (
              <View
                className="mt-[14px]"
                style={{
                  flex: 1,
                  height: 2,
                  marginHorizontal: -6,
                  backgroundColor: i < current ? colors.heat : colors.hair,
                }}
              />
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
}
