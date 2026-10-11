import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme';
import type { TimelineEntry } from '@/types';
import { withAlpha } from '@/utils';

import { Reveal } from './Reveal';

function Dot({ done, current }: { done: boolean; current?: boolean }) {
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (current) pulse.value = withRepeat(withTiming(1.9, { duration: 1100 }), -1, false);
  }, [current, pulse]);
  const ring = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: current ? 2 - pulse.value : 0,
  }));
  const color = current ? colors.heat : done ? colors.ok : colors.ink3;
  return (
    <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
      {current ? (
        <Animated.View
          style={[
            { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: withAlpha(colors.heat, 0.5) },
            ring,
          ]}
        />
      ) : null}
      <View
        style={{
          width: current ? 14 : 12,
          height: current ? 14 : 12,
          borderRadius: 7,
          backgroundColor: done || current ? color : colors.card2,
          borderWidth: done || current ? 0 : 2,
          borderColor: colors.hair,
        }}
      />
    </View>
  );
}

export interface TimelineProps {
  entries: TimelineEntry[];
  animate?: boolean;
}

export function Timeline({ entries, animate = true }: TimelineProps) {
  return (
    <View>
      {entries.map((e, i) => {
        const isLast = i === entries.length - 1;
        const labelColor = e.current ? colors.heat : e.done ? colors.ink0 : colors.ink3;
        const Row = (
          <View className="flex-row">
            <View className="items-center mr-3" style={{ width: 18 }}>
              <Dot done={e.done} current={e.current} />
              {!isLast ? (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 30,
                    marginTop: 2,
                    backgroundColor: e.done ? withAlpha(colors.ok, 0.5) : colors.hair,
                  }}
                />
              ) : null}
            </View>
            <View className="flex-1 pb-5">
              <Text className="font-semibold text-[15px]" style={{ color: labelColor }}>
                {e.label}
              </Text>
              {e.description ? (
                <Text className="text-ink-2 text-[13px] mt-0.5">{e.description}</Text>
              ) : null}
              {e.timestamp ? (
                <Text className="text-ink-3 text-xs mt-1">{e.timestamp}</Text>
              ) : null}
            </View>
          </View>
        );
        return animate ? (
          <Reveal key={e.key} index={i}>
            {Row}
          </Reveal>
        ) : (
          <View key={e.key}>{Row}</View>
        );
      })}
    </View>
  );
}
