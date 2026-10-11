import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';
import type { Order } from '@/types';
import { formatCurrency, orderStatusMeta, pluralize } from '@/utils';

import { AppCard } from '../ui/AppCard';
import { Divider } from '../ui/Divider';
import { ProductThumb } from '../ui/ProductThumb';
import { StatusBadge } from '../ui/StatusBadge';

export interface OrderCardProps {
  order: Order;
  onPress: () => void;
  testID?: string;
}

export function OrderCard({ order, onPress, testID }: OrderCardProps) {
  const meta = orderStatusMeta(order?.status || 'Pending');
  const items = Array.isArray(order?.items) ? order.items : [];
  const units = items.reduce((n, i) => n + (i?.quantity ?? 1), 0);
  const first = items[0];
  const more = Math.max(0, items.length - 1);
  const addrText =
    typeof order?.address === 'object' && order.address
      ? `${order.address.label || order.address.line1 || ''}${order.address.city ? ` · ${order.address.city}` : ''}`
      : typeof order?.address === 'string'
        ? order.address
        : '';

  return (
    <AppCard onPress={onPress} testID={testID}>
      <View className="flex-row items-center justify-between">
        <Text className="text-ink-0 text-base font-bold">#{order?.id || ''}</Text>
        <StatusBadge label={meta.label} color={meta.color} icon={meta.icon} />
      </View>

      <View className="flex-row items-center mt-2.5">
        <ProductThumb uri={first?.image} style={{ width: 52, height: 52 }} radius={12} iconSize={20} />
        <View className="flex-1 ml-3">
          <Text className="text-ink-0 text-[14px] font-semibold" numberOfLines={1}>
            {first?.name || 'HVAC Equipment Order'}
            {more > 0 ? ` +${more} more` : ''}
          </Text>
          <Text className="text-ink-2 text-[12px] mt-0.5">
            {units} {pluralize(units, 'unit')}
          </Text>
          {addrText ? (
            <View className="flex-row items-center mt-0.5">
              <MaterialCommunityIcons name="map-marker-outline" size={13} color={colors.ink3} />
              <Text className="text-ink-2 text-[12px] ml-1 flex-1" numberOfLines={1}>
                {addrText}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {order?.eta ? (
        <View className="flex-row items-center mt-2">
          <MaterialCommunityIcons name="clock-outline" size={15} color={colors.heat} />
          <Text className="text-heat text-[13px] font-semibold ml-2">{order.eta}</Text>
        </View>
      ) : null}

      <Divider className="my-3" />
      <View className="flex-row items-center justify-between">
        <Text className="text-ink-3 text-xs">{order?.preferredDate || 'Standard Delivery'}</Text>
        <Text className="text-ink-0 text-base font-extrabold">{formatCurrency(order?.total ?? 0)}</Text>
      </View>
    </AppCard>
  );
}
