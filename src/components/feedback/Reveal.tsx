import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export interface RevealProps {
  children: ReactNode;
  index?: number;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

/** Staggered fade-in-up entrance wrapper. Keep className off this node. */
export function Reveal({ children, index = 0, delay = 0, duration = 360, style }: RevealProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(duration).delay(delay + index * 55)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
