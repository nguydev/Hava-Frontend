import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';

import { AppCard } from '@/components';
import { colors } from '@/theme';
import type { ProofOfDelivery } from '@/types';
import { withAlpha } from '@/utils';

export function ProofOfDeliverySummary({ proof }: { proof: ProofOfDelivery }) {
  return (
    <AppCard style={{ borderColor: withAlpha(colors.ok, 0.35) }}>
      <View className="flex-row items-center mb-3">
        <MaterialCommunityIcons name="check-decagram" size={18} color={colors.ok} />
        <Text className="text-ink-0 text-[15px] font-bold ml-2">Proof of delivery</Text>
      </View>

      {proof.photos.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {proof.photos.map((uri, i) => (
            <Image
              key={`${uri}-${i}`}
              source={{ uri }}
              style={{ width: 104, height: 104, borderRadius: 14, backgroundColor: colors.card2 }}
              contentFit="cover"
              transition={150}
            />
          ))}
        </ScrollView>
      ) : null}

      <View className="flex-row items-center mt-3">
        <MaterialCommunityIcons name="account-check-outline" size={15} color={colors.ink3} />
        <Text className="text-ink-1 text-[13px] ml-2">Received by {proof.recipientName}</Text>
      </View>
      {proof.notes ? <Text className="text-ink-2 text-[13px] mt-2 leading-5">{proof.notes}</Text> : null}
      <Text className="text-ink-3 text-xs mt-2">{proof.signedAt}</Text>
    </AppCard>
  );
}
