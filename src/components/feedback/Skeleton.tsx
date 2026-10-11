import { useEffect } from 'react';
import { DimensionValue, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 14, radius = 8, style }: SkeletonProps) {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.9, { duration: 800 }), -1, true);
  }, [opacity]);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.card2 },
        animStyle,
        style,
      ]}
    />
  );
}

/** Card-shaped placeholder used while lists load. */
export function CardSkeleton() {
  return (
    <View className="rounded-card bg-card border border-hair p-4 flex-row">
      <Skeleton width={56} height={56} radius={14} />
      <View className="flex-1 ml-3 justify-center">
        <Skeleton width="70%" height={14} />
        <View className="h-2" />
        <Skeleton width="45%" height={12} />
        <View className="h-3" />
        <Skeleton width="30%" height={12} />
      </View>
    </View>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View className="gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}
