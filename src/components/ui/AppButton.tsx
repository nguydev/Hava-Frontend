import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme';
import { cn } from '@/utils';
import { haptics } from '@/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconRight?: keyof typeof MaterialCommunityIcons.glyphMap;
  fullWidth?: boolean;
  className?: string;
  haptic?: boolean;
  testID?: string;
}

const SIZES: Record<ButtonSize, { pad: string; text: string; icon: number; height: number }> = {
  sm: { pad: 'px-3.5 py-2', text: 'text-sm', icon: 16, height: 38 },
  md: { pad: 'px-5 py-3.5', text: 'text-base', icon: 18, height: 50 },
  lg: { pad: 'px-6 py-4', text: 'text-[17px]', icon: 20, height: 56 },
};

function contentColor(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
    case 'danger':
      return colors.white;
    case 'ghost':
      return colors.heat;
    default:
      return colors.ink0;
  }
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = true,
  className,
  haptic = true,
  testID,
}: AppButtonProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const isDisabled = disabled || loading;
  const tint = contentColor(variant);
  const sz = SIZES[size];

  const onPressIn = () => {
    scale.value = withTiming(0.97, { duration: 90 });
  };
  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };
  const handlePress = () => {
    if (isDisabled) return;
    if (haptic) haptics.tap();
    onPress?.();
  };

  const inner = (
    <View className={cn('flex-row items-center justify-center gap-2', sz.pad)}>
      {loading ? (
        <ActivityIndicator color={tint} size="small" />
      ) : (
        <>
          {icon ? <MaterialCommunityIcons name={icon} size={sz.icon} color={tint} /> : null}
          <Text
            className={cn('font-bold tracking-wide', sz.text)}
            style={{ color: tint }}
            numberOfLines={1}
          >
            {label}
          </Text>
          {iconRight ? (
            <MaterialCommunityIcons name={iconRight} size={sz.icon} color={tint} />
          ) : null}
        </>
      )}
    </View>
  );

  const radius = Math.round(sz.height / 2); // pill
  const shellByVariant: Record<ButtonVariant, string> = {
    primary: '',
    secondary: 'bg-card-2 border border-hair',
    outline: 'bg-transparent border border-hair',
    ghost: 'bg-transparent',
    danger: 'bg-alert',
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      className={cn(fullWidth ? 'w-full' : 'self-start', className)}
    >
      <Animated.View style={[animStyle, { opacity: isDisabled ? 0.55 : 1 }]}>
        {variant === 'primary' ? (
          <LinearGradient
            colors={[colors.brandBlue, colors.brandCyan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: radius, minHeight: sz.height, justifyContent: 'center', overflow: 'hidden' }}
          >
            {inner}
          </LinearGradient>
        ) : (
          <View
            className={cn('overflow-hidden', shellByVariant[variant])}
            style={{ minHeight: sz.height, justifyContent: 'center', borderRadius: radius }}
          >
            {inner}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}
