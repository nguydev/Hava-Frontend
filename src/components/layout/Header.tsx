import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';
import { cn } from '@/utils';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  large?: boolean;
  className?: string;
}

export function Header({
  title,
  subtitle,
  showBack = true,
  onBack,
  right,
  large = false,
  className,
}: HeaderProps) {
  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
  };

  return (
    <View className={cn('flex-row items-center px-5 pt-2 pb-3', className)}>
      {showBack ? (
        <Pressable
          onPress={handleBack}
          hitSlop={10}
          accessibilityLabel="Go back"
          className="w-10 h-10 rounded-xl bg-card-2 border border-hair items-center justify-center"
        >
          <MaterialCommunityIcons name="chevron-left" size={26} color={colors.ink0} />
        </Pressable>
      ) : null}
      <View className={cn('flex-1', showBack ? 'ml-3' : '')}>
        {title ? (
          <Text className={cn('text-ink-0 font-bold', large ? 'text-2xl' : 'text-lg')} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text className="text-ink-2 text-[13px] mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View className="ml-2">{right}</View> : null}
    </View>
  );
}

/** Circular icon button, handy for header `right` actions. */
export function HeaderIconButton({
  icon,
  onPress,
  badge,
  color = colors.ink0,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
  badge?: number;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="w-10 h-10 rounded-xl bg-card-2 border border-hair items-center justify-center"
    >
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      {badge && badge > 0 ? (
        <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-heat items-center justify-center">
          <Text className="text-white text-[10px] font-bold">{badge > 99 ? '99+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
