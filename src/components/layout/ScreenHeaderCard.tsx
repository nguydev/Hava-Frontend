import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';
import { cn, withAlpha } from '@/utils';

export interface ScreenHeaderCardProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  /** Optional trailing action rendered on the back row (e.g. a bell button). */
  right?: ReactNode;
  /** Small brand icon shown left of the title inside the card. */
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  align?: 'center' | 'left';
  className?: string;
}

/**
 * Signature GOODR header: a hairline-bordered card holding a large cyan title
 * and a muted subtitle, with an optional back chevron + trailing action row
 * above it. Matches the brand's login / basket / notifications references.
 */
export function ScreenHeaderCard({
  title,
  subtitle,
  showBack = true,
  onBack,
  right,
  icon,
  align = 'center',
  className,
}: ScreenHeaderCardProps) {
  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
  };

  const centered = align === 'center';

  return (
    <View className={cn('px-5 pt-1', className)}>
      {showBack || right ? (
        <View className="flex-row items-center justify-between mb-2 min-h-[36px]">
          {showBack ? (
            <Pressable
              onPress={handleBack}
              hitSlop={12}
              accessibilityLabel="Go back"
              className="w-9 h-9 -ml-1 items-center justify-center"
            >
              <MaterialCommunityIcons name="chevron-left" size={30} color={colors.brandBlue} />
            </Pressable>
          ) : (
            <View className="w-9 h-9" />
          )}
          {right ?? <View className="w-9 h-9" />}
        </View>
      ) : null}

      <View
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: withAlpha(colors.white, 0.1),
          backgroundColor: withAlpha(colors.white, 0.02),
          paddingVertical: 18,
          paddingHorizontal: 18,
        }}
      >
        <View className={cn('flex-row items-center', centered ? 'justify-center' : '')}>
          {icon ? (
            <MaterialCommunityIcons
              name={icon}
              size={24}
              color={colors.brandCyan}
              style={{ marginRight: 8 }}
            />
          ) : null}
          <Text
            className={cn('font-extrabold', centered ? 'text-center' : '')}
            style={{ color: colors.brandCyan, fontSize: 28, letterSpacing: 0.3 }}
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text
            className={cn('text-ink-2 text-[13px] mt-1', centered ? 'text-center' : '')}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
