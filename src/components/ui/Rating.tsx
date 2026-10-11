import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';

export interface RatingProps {
  value: number;
  reviews?: number;
  size?: number;
  showValue?: boolean;
}

export function Rating({ value, reviews, size = 14, showValue = true }: RatingProps) {
  const stars = [1, 2, 3, 4, 5].map((i) => {
    if (value >= i) return 'star';
    if (value >= i - 0.5) return 'star-half-full';
    return 'star-outline';
  });
  return (
    <View className="flex-row items-center">
      {stars.map((name, idx) => (
        <MaterialCommunityIcons
          key={idx}
          name={name as keyof typeof MaterialCommunityIcons.glyphMap}
          size={size}
          color={colors.amber}
        />
      ))}
      {showValue ? (
        <Text className="text-ink-2 text-xs ml-1.5">
          {value.toFixed(1)}
          {reviews != null ? ` (${reviews})` : ''}
        </Text>
      ) : null}
    </View>
  );
}
