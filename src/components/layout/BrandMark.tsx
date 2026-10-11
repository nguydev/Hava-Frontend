import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { colors } from '@/theme';
import { cn } from '@/utils';

const MARK = require('../../../assets/images/goodr-mark.png');

export interface BrandMarkProps {
  size?: number;
  /** Soft cyan glow behind the mark. */
  glow?: boolean;
  className?: string;
}

/** The GOODR "G" app mark. */
export function BrandMark({ size = 44, glow = false, className }: BrandMarkProps) {
  return (
    <View
      className={className}
      style={
        glow
          ? {
              shadowColor: colors.brandCyan,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 18,
              elevation: 10,
            }
          : undefined
      }
    >
      <Image
        source={MARK}
        style={{ width: size, height: size, borderRadius: size * 0.24 }}
        contentFit="contain"
      />
    </View>
  );
}

export interface BrandLockupProps {
  size?: number;
  subtitle?: string;
  glow?: boolean;
  className?: string;
}

/** GOODR mark + wordmark, laid out horizontally. */
export function BrandLockup({ size = 46, subtitle, glow = true, className }: BrandLockupProps) {
  return (
    <View className={cn('flex-row items-center', className)}>
      <BrandMark size={size} glow={glow} />
      <View className="ml-3">
        <Text
          className="text-ink-0 font-extrabold"
          style={{ fontSize: size * 0.5, letterSpacing: 1.5 }}
        >
          GOODR
        </Text>
        {subtitle ? <Text className="text-ink-2 text-xs mt-0.5">{subtitle}</Text> : null}
      </View>
    </View>
  );
}
