import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { initials } from '@/utils';

export interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
}

export function Avatar({ name, uri, size = 44 }: AvatarProps) {
  const radius = size / 2;
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radius }}
        contentFit="cover"
        transition={150}
      />
    );
  }
  return (
    <View
      className="items-center justify-center bg-card-2 border border-hair"
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <Text className="text-ink-0 font-bold" style={{ fontSize: size * 0.36 }}>
        {initials(name)}
      </Text>
    </View>
  );
}
