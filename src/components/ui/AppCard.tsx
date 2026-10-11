import { ReactNode } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';

import { colors, shadow } from '@/theme';
import { cn, withAlpha } from '@/utils';

export interface AppCardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  elevated?: boolean;
  /** Brand-blue glowing border — used to highlight active / featured cards. */
  glow?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function AppCard({
  children,
  className,
  onPress,
  elevated = true,
  glow = false,
  style,
  testID,
}: AppCardProps) {
  const classes = cn(
    'rounded-card bg-card border p-4',
    glow ? 'border-heat' : 'border-hair',
    className,
  );

  const glowStyle: ViewStyle | null = glow
    ? { backgroundColor: withAlpha(colors.brandBlue, 0.06), borderColor: withAlpha(colors.brandBlue, 0.55) }
    : null;

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        style={({ pressed }) => [
          elevated ? shadow.card : null,
          glowStyle,
          style,
          { opacity: pressed ? 0.92 : 1 },
        ]}
        className={classes}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      testID={testID}
      className={classes}
      style={[elevated ? shadow.card : null, glowStyle, style]}
    >
      {children}
    </View>
  );
}
