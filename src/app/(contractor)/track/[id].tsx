import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AppCard,
  ErrorState,
  Header,
  ListSkeleton,
  Timeline,
} from '@/components';
import { DeliveryMap } from '@/features/delivery/DeliveryMap';
import { DriverContactCard } from '@/features/delivery/DriverContactCard';
import { ProofOfDeliverySummary } from '@/features/delivery/ProofOfDeliverySummary';
import { useRefreshByUser } from '@/hooks';
import { useOrderDetails } from '@/services/queries';
import { colors } from '@/theme';
import type { OrderStatus } from '@/types';
import { orderStatusMeta, withAlpha } from '@/utils';

const ORDER_PROGRESS: Record<OrderStatus, number> = {
  Pending: 0.06,
  Confirmed: 0.2,
  Preparing: 0.36,
  'Out for Delivery': 0.7,
  Delivered: 1,
  Cancelled: 0,
};

export default function TrackDelivery() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useOrderDetails(id);
  const { isRefreshing, onRefresh } = useRefreshByUser(refetch);

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
        <Header title="Track delivery" />
        <View className="px-5">
          <ListSkeleton count={3} />
        </View>
      </SafeAreaView>
    );
  }
  if (isError || !order) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
        <Header title="Track delivery" />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const statusKey = order?.status || 'Pending';
  const meta = orderStatusMeta(statusKey);
  const destLabel = typeof order?.address === 'object' && order.address ? (order.address.label || order.address.line1 || 'Destination') : 'Destination';
  const fullAddrStr =
    typeof order?.address === 'object' && order.address
      ? `${order.address.line1 || ''}${order.address.city ? `, ${order.address.city}` : ''}${order.address.state ? `, ${order.address.state}` : ''} ${order.address.zip || ''}`
      : typeof order?.address === 'string'
        ? order.address
        : 'Address details in order';
  const timelineEntries = Array.isArray(order?.timeline) ? order.timeline : [];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <Header title="Track delivery" subtitle={`#${order?.id || ''}`} />

      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
        }
      >
        {/* Live map */}
        <View className="mb-4">
          <DeliveryMap
            seed={order?.id || 'map'}
            progress={ORDER_PROGRESS[statusKey] ?? 0}
            destinationLabel={destLabel}
            etaLabel={order?.eta ?? null}
            statusLabel={meta.label}
            statusColor={meta.color}
            showDriver={!!order?.driver || statusKey === 'Out for Delivery' || statusKey === 'Delivered'}
          />
        </View>

        {/* Status hero */}
        <View
          className="rounded-card p-5 items-center"
          style={{ backgroundColor: withAlpha(meta.color, 0.1), borderWidth: 1, borderColor: withAlpha(meta.color, 0.3) }}
        >
          <View
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: withAlpha(meta.color, 0.18) }}
          >
            <MaterialCommunityIcons name={meta.icon} size={32} color={meta.color} />
          </View>
          <Text className="text-ink-0 text-xl font-extrabold mt-3">{meta.label}</Text>
          {order?.eta ? (
            <Text className="text-ink-2 text-[14px] mt-1">{order.eta}</Text>
          ) : (
            <Text className="text-ink-2 text-[14px] mt-1">Awaiting scheduling</Text>
          )}
        </View>

        {order?.driver ? (
          <View className="mt-4">
            <DriverContactCard driver={order.driver} eta={order.eta} threadId={order.id} />
          </View>
        ) : null}

        <AppCard className="mt-4">
          <Text className="text-ink-0 text-[15px] font-bold mb-3">Delivery progress</Text>
          <Timeline entries={timelineEntries} />
        </AppCard>

        <AppCard className="mt-4">
          <View className="flex-row items-start">
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.heat} />
            <View className="ml-2.5 flex-1">
              <Text className="text-ink-0 text-[15px] font-bold">{destLabel}</Text>
              <Text className="text-ink-2 text-[13px] mt-0.5">
                {fullAddrStr}
              </Text>
              {order?.timeWindow ? (
                <Text className="text-ink-3 text-xs mt-1">
                  Window: {order.timeWindow}
                </Text>
              ) : null}
            </View>
          </View>
          {order?.notes ? (
            <Text className="text-ink-2 text-[13px] mt-3 leading-5">{order.notes}</Text>
          ) : null}
        </AppCard>

        {order.proofOfDelivery ? (
          <View className="mt-4">
            <ProofOfDeliverySummary proof={order.proofOfDelivery} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
