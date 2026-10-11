import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';

import { colors } from '@/theme';
import { cn, withAlpha } from '@/utils';

interface BrandBannerProps {
  /** A required() asset module or a remote { uri } source. */
  source: number | { uri: string };
  /** Width:height ratio of the banner (client art is landscape). */
  aspectRatio?: number;
  rounded?: boolean;
  onPress?: () => void;
  className?: string;
}

/**
 * Displays a GOODR brand image as a rounded hero/promo banner with a subtle
 * bottom gradient so it melds into the dark UI. The artwork already carries its
 * own copy, so no text is overlaid.
 */
export function BrandBanner({
  source,
  aspectRatio = 16 / 9,
  rounded = true,
  onPress,
  className,
}: BrandBannerProps) {
  const Wrap: any = onPress ? Pressable : View;
  return (
    <Wrap
      onPress={onPress}
      className={cn('overflow-hidden border border-hair', rounded && 'rounded-card', className)}
    >
      <View style={{ width: '100%', aspectRatio }}>
        <Image
          source={source}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={220}
        />
        <LinearGradient
          colors={['transparent', withAlpha(colors.bg, 0.4)]}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%' }}
          pointerEvents="none"
        />
      </View>
    </Wrap>
  );
}
