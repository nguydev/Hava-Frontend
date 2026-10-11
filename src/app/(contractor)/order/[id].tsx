import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AppButton,
  AppCard,
  DetailRow,
  Divider,
  ErrorState,
  Header,
  ListSkeleton,
  PriceSummary,
  ProductThumb,
  StatusBadge,
  Timeline,
} from '@/components';
import { DriverContactCard } from '@/features/delivery/DriverContactCard';
import { ProofOfDeliverySummary } from '@/features/delivery/ProofOfDeliverySummary';
import { useOrderDetails } from '@/services/queries';
import { colors } from '@/theme';
import { formatCurrency, orderStatusMeta } from '@/utils';

const TRACKABLE = ['Confirmed', 'Preparing', 'Out for Delivery'];

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useOrderDetails(id);

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
        <Header title="Order" />
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
        <Header title="Order" />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const meta = orderStatusMeta(order.status);
  const units = order.items.reduce((n, i) => n + i.quantity, 0);
  const canTrack = TRACKABLE.includes(order.status);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <Header title={`#${order.id}`} subtitle={`Placed ${order.preferredDate}`} />

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <StatusBadge label={meta.label} color={meta.color} icon={meta.icon} />
          {order.eta ? <Text className="text-heat text-[13px] font-semibold">{order.eta}</Text> : null}
        </View>

        <AppCard className="mt-4">
          <Text className="text-ink-0 text-[15px] font-bold mb-3">Status timeline</Text>
          <Timeline entries={order.timeline} />
        </AppCard>

        {order.driver ? (
          <View className="mt-4">
            <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mb-2">
              Driver
            </Text>
            <DriverContactCard driver={order.driver} eta={order.eta} threadId={order.id} />
          </View>
        ) : null}

        {order.proofOfDelivery ? (
          <View className="mt-4">
            <ProofOfDeliverySummary proof={order.proofOfDelivery} />
          </View>
        ) : null}

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-5 mb-2">
          Items ({units})
        </Text>
        <AppCard>
          {order.items.map((i, idx) => (
            <View key={i.productId}>
              <View className="flex-row items-center py-1.5">
                <ProductThumb uri={i.image} style={{ width: 46, height: 46 }} radius={10} iconSize={18} />
                <View className="flex-1 px-3">
                  <Text className="text-ink-0 text-[14px] font-semibold" numberOfLines={1}>
                    {i.name}
                  </Text>
                  <Text className="text-ink-3 text-xs mt-0.5">
                    {i.quantity} × {formatCurrency(i.unitPrice)}
                  </Text>
                </View>
                <Text className="text-ink-0 text-[14px] font-bold">
                  {formatCurrency((i.unitPrice ?? 0) * i.quantity)}
                </Text>
              </View>
              {idx < order.items.length - 1 ? <Divider /> : null}
            </View>
          ))}
          <Divider className="my-2" />
          <PriceSummary subtotal={order.subtotal} deliveryFee={order.deliveryFee} total={order.total} />
        </AppCard>

        {order.payment ? (
          <>
            <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-5 mb-2">
              Payment
            </Text>
            <AppCard>
              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.heatSoft }}
                >
                  <MaterialCommunityIcons
                    name={order.payment.status === 'Paid' ? 'credit-card-check-outline' : 'file-document-outline'}
                    size={20}
                    color={colors.heat}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-ink-0 text-[14px] font-bold">{order.payment.method}</Text>
                  <Text className="text-ink-2 text-[12px] mt-0.5">
                    {order.payment.paidAt ? `Paid ${order.payment.paidAt}` : 'Payment pending'}
                  </Text>
                </View>
                <StatusBadge
                  label={order.payment.status}
                  color={order.payment.status === 'Paid' ? colors.ok : colors.amber}
                  size="sm"
                />
              </View>
            </AppCard>
          </>
        ) : null}

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-5 mb-2">
          Delivery details
        </Text>
        <AppCard>
          <View className="flex-row items-start mb-1">
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.heat} />
            <View className="ml-2.5 flex-1">
              <Text className="text-ink-0 text-[15px] font-bold">{order.address.label}</Text>
              <Text className="text-ink-2 text-[13px] mt-0.5">
                {order.address.line1}, {order.address.city}, {order.address.state} {order.address.zip}
              </Text>
            </View>
          </View>
          <Divider className="my-3" />
          <DetailRow label="Contact" value={`${order.contactName} · ${order.contactPhone}`} />
          <DetailRow label="Time window" value={order.timeWindow} />
          <DetailRow label="Liftgate" value={order.liftgate ? 'Required' : 'Not needed'} />
          {order.notes ? (
            <>
              <Divider className="my-2" />
              <Text className="text-ink-2 text-[13px] mb-1">Notes</Text>
              <Text className="text-ink-1 text-[13px] leading-5">{order.notes}</Text>
            </>
          ) : null}
        </AppCard>
      </ScrollView>

      <View className="border-t border-hair bg-surface px-5 pt-3 pb-6 gap-3">
        {canTrack ? (
          <AppButton
            label="Track delivery"
            icon="map-marker-path"
            onPress={() => router.push(`/(contractor)/track/${order.id}`)}
          />
        ) : null}
        <AppButton
          label="Contact support"
          icon="headset"
          variant={canTrack ? 'outline' : 'primary'}
          onPress={() => router.push('/(contractor)/support')}
        />
      </View>
    </SafeAreaView>
  );
}
