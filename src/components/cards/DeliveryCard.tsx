import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';
import type { Delivery, DeliveryPriority } from '@/types';
import { deliveryStatusMeta, pluralize, withAlpha } from '@/utils';

import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';
import { Divider } from '../ui/Divider';
import { StatusBadge } from '../ui/StatusBadge';

const PRIORITY_COLOR: Record<string, string> = {
  Urgent: colors.alert,
  Priority: colors.heat,
  Normal: colors.steel,
  Standard: colors.steel,
};

export interface DeliveryCardProps {
  delivery: Delivery;
  onPress: () => void;
  onPrimary?: () => void;
  primaryLabel?: string;
}

export function DeliveryCard({ delivery, onPress, onPrimary, primaryLabel }: DeliveryCardProps) {
  const meta = deliveryStatusMeta(delivery?.status || 'Assigned');
  const items = Array.isArray(delivery?.items) ? delivery.items : [];
  const units = items.reduce((n, i) => n + (i?.quantity ?? 1), 0);
  const priorityKey = (delivery?.priority as string) || 'Normal';
  const pColor = PRIORITY_COLOR[priorityKey] || colors.steel;
  const addressLine =
    typeof delivery?.address === 'object' && delivery.address
      ? `${delivery.address.line1 || 'Address details'}${delivery.address.city ? `, ${delivery.address.city}` : ''}`
      : typeof delivery?.address === 'string'
        ? delivery.address
        : 'Address details in order';

  return (
    <AppCard onPress={onPress}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className="rounded-pill px-2 py-0.5 mr-2"
            style={{ backgroundColor: withAlpha(pColor, 0.16) }}
          >
            <Text className="text-[10px] font-bold" style={{ color: pColor }}>
              {priorityKey.toUpperCase()}
            </Text>
          </View>
          <Text className="text-ink-0 text-base font-bold">#{delivery?.id || ''}</Text>
        </View>
        <StatusBadge label={meta.label} color={meta.color} icon={meta.icon} />
      </View>

      <Text className="text-ink-0 text-[17px] font-bold mt-2.5">{delivery?.jobSite || 'Job Site Delivery'}</Text>
      {delivery?.company ? <Text className="text-ink-2 text-sm mt-0.5">{delivery.company}</Text> : null}

      <View className="flex-row items-center mt-2.5">
        <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.ink3} />
        <Text className="text-ink-1 text-sm ml-2 flex-1" numberOfLines={1}>
          {addressLine}
        </Text>
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="clock-outline" size={16} color={colors.ink3} />
          <Text className="text-ink-1 text-sm ml-2">{delivery?.timeWindow || 'Flexible'}</Text>
        </View>
        <Text className="text-ink-2 text-sm">
          {units} {pluralize(units, 'unit')}
          {delivery?.distanceMi ? ` · ${delivery.distanceMi} mi` : ''}
        </Text>
      </View>

      {delivery.eta ? (
        <View
          className="flex-row items-center rounded-xl mt-3 px-3 py-2"
          style={{ backgroundColor: withAlpha(colors.heat, 0.12) }}
        >
          <MaterialCommunityIcons name="truck-fast-outline" size={18} color={colors.heat} />
          <Text className="text-heat text-sm font-bold ml-2">ETA {delivery.eta}</Text>
        </View>
      ) : null}

      {onPrimary && primaryLabel ? (
        <>
          <Divider className="my-3" />
          <AppButton label={primaryLabel} size="sm" icon="navigation-variant" onPress={onPrimary} />
        </>
      ) : null}
    </AppCard>
  );
}
