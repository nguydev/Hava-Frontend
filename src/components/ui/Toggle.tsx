import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme';
import { haptics } from '@/utils';

export interface ToggleProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
  /** Track colour when on. Defaults to the brand blue. */
  activeColor?: string;
  disabled?: boolean;
  testID?: string;
}

const W = 52;
const H = 30;
const PAD = 3;
const THUMB = H - PAD * 2;
const TRAVEL = W - PAD * 2 - THUMB;

/** Smooth, cross-platform animated switch (replaces the janky core Switch). */
export function Toggle({ value, onValueChange, activeColor = colors.brandBlue, disabled, testID }: ToggleProps) {
  const progress = useDerivedValue(() => withTiming(value ? 1 : 0, { duration: 180 }), [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.card2, activeColor]),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRAVEL }],
  }));

  return (
    <Pressable
      testID={testID}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      hitSlop={8}
      onPress={() => {
        if (disabled) return;
        haptics.select();
        onValueChange(!value);
      }}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={[
          { width: W, height: H, borderRadius: H / 2, padding: PAD, justifyContent: 'center' },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: colors.white,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.25,
              shadowRadius: 2,
              elevation: 2,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
