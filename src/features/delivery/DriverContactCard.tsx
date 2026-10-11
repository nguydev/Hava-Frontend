import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, Text, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton, AppCard, Avatar } from '@/components';
import { colors } from '@/theme';
import type { DriverInfo } from '@/types';

export function DriverContactCard({
  driver,
  eta,
  threadId,
}: {
  driver?: DriverInfo | null;
  eta?: string | null;
  threadId?: string;
}) {
  const driverName = driver?.name || 'Assigned Driver';
  const driverPhone = driver?.phone || '';
  const driverVehicle = driver?.vehicle || 'Delivery vehicle';

  return (
    <AppCard>
      <View className="flex-row items-center">
        <Avatar name={driverName} uri={driver?.avatar} size={48} />
        <View className="flex-1 ml-3">
          <Text className="text-ink-0 text-[15px] font-bold">{driverName}</Text>
          <View className="flex-row items-center mt-0.5">
            <MaterialCommunityIcons name="truck-outline" size={13} color={colors.ink3} />
            <Text className="text-ink-2 text-[12px] ml-1">{driverVehicle}</Text>
          </View>
        </View>
        <View className="flex-row items-center rounded-pill px-2.5 py-1" style={{ backgroundColor: colors.heatSoft }}>
          <MaterialCommunityIcons name="shield-check" size={13} color={colors.heat} />
          <Text className="text-heat text-[11px] font-semibold ml-1">Verified</Text>
        </View>
      </View>

      {eta ? (
        <View className="flex-row items-center mt-3">
          <MaterialCommunityIcons name="clock-fast" size={16} color={colors.heat} />
          <Text className="text-heat text-sm font-semibold ml-2">ETA {eta}</Text>
        </View>
      ) : null}

      <View className="flex-row gap-3 mt-3">
        <AppButton
          label="Call"
          icon="phone"
          size="sm"
          variant="secondary"
          fullWidth={false}
          className="flex-1"
          onPress={() => Linking.openURL(`tel:${driverPhone.replace(/[^0-9]/g, '')}`)}
        />
        <AppButton
          label="Message"
          icon="message-text-outline"
          size="sm"
          variant="outline"
          fullWidth={false}
          className="flex-1"
          onPress={() =>
            router.push(
              `/(contractor)/message?thread=${encodeURIComponent(threadId ?? driver?.id ?? '')}&peer=${encodeURIComponent(driverName)}&role=${encodeURIComponent('Your delivery driver')}&phone=${encodeURIComponent(driverPhone)}`,
            )
          }
        />
      </View>
    </AppCard>
  );
}
