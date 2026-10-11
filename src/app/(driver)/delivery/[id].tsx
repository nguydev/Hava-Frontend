import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AppButton,
  AppCard,
  DetailRow,
  Divider,
  ErrorState,
  Header,
  ListSkeleton,
  StatusBadge,
  Timeline,
} from '@/components';
import { DeliveryMap } from '@/features/delivery/DeliveryMap';
import { ProofOfDeliverySummary } from '@/features/delivery/ProofOfDeliverySummary';
import { useRefreshByUser } from '@/hooks';
import { useUpdateDeliveryStatus } from '@/services/mutations';
import { useDeliveryDetails } from '@/services/queries';
import { colors } from '@/theme';
import type { DeliveryStatus } from '@/types';
import { deliveryStatusMeta, pluralize, withAlpha } from '@/utils';

const ACTIVE: DeliveryStatus[] = ['Assigned', 'Accepted', 'En Route', 'Arrived'];

const DELIVERY_PROGRESS: Record<DeliveryStatus, number> = {
  Assigned: 0.08,
  Accepted: 0.22,
  'En Route': 0.62,
  Arrived: 0.9,
  Delivered: 1,
  'Issue Reported': 0.62,
};

export default function DriverDeliveryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: delivery, isLoading, isError, refetch } = useDeliveryDetails(id);
  const updateStatus = useUpdateDeliveryStatus();
  const { isRefreshing, onRefresh } = useRefreshByUser(refetch);

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
        <Header title="Delivery" />
        <View className="px-5">
          <ListSkeleton count={3} />
        </View>
      </SafeAreaView>
    );
  }
  if (isError || !delivery) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
        <Header title="Delivery" />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const statusKey = delivery?.status || 'Assigned';
  const meta = deliveryStatusMeta(statusKey);
  const isActive = ACTIVE.includes(statusKey);
  const items = Array.isArray(delivery?.items) ? delivery.items : [];
  const units = items.reduce((n, i) => n + (i?.quantity ?? 1), 0);
  const fullAddress =
    typeof delivery?.address === 'object' && delivery.address
      ? `${delivery.address.line1 || ''}${delivery.address.city ? `, ${delivery.address.city}` : ''}${delivery.address.state ? `, ${delivery.address.state}` : ''} ${delivery.address.zip || ''}`
      : typeof delivery?.address === 'string'
        ? delivery.address
        : 'Address details in order';
  const priorityText = ((delivery?.priority as string) || 'NORMAL').toUpperCase();

  const nextAction = (): { label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; run: () => void } | null => {
    switch (statusKey) {
      case 'Assigned':
        return { label: 'Accept delivery', icon: 'thumb-up-outline', run: () => updateStatus.mutate({ id: delivery.id, status: 'Accepted' }) };
      case 'Accepted':
        return { label: 'Start driving', icon: 'truck-fast-outline', run: () => updateStatus.mutate({ id: delivery.id, status: 'En Route' }) };
      case 'En Route':
        return { label: 'Mark as arrived', icon: 'map-marker-check', run: () => updateStatus.mutate({ id: delivery.id, status: 'Arrived' }) };
      case 'Arrived':
        return { label: 'Complete delivery', icon: 'camera-outline', run: () => router.push(`/(driver)/proof-of-delivery?id=${delivery.id}`) };
      default:
        return null;
    }
  };
  const action = nextAction();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <Header title={`#${delivery?.id || ''}`} subtitle={delivery?.company || ''} />

      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
        }
      >
        <View className="flex-row items-center justify-between">
          <StatusBadge label={meta.label} color={meta.color} icon={meta.icon} />
          <View className="rounded-pill px-2.5 py-1" style={{ backgroundColor: withAlpha(colors.heat, 0.14) }}>
            <Text className="text-heat text-[11px] font-bold">{priorityText} PRIORITY</Text>
          </View>
        </View>

        {/* Live map */}
        <View className="mt-4">
          <DeliveryMap
            seed={delivery.id}
            progress={DELIVERY_PROGRESS[delivery.status] ?? 0}
            destinationLabel={delivery.jobSite}
            etaLabel={delivery.eta ?? null}
            distanceMi={delivery.distanceMi}
            statusLabel={meta.label}
            statusColor={meta.color}
          />
        </View>

        {/* Job site */}
        <AppCard className="mt-4">
          <Text className="text-ink-0 text-lg font-bold">{delivery.jobSite}</Text>
          <View className="flex-row items-start mt-2">
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.heat} />
            <Text className="text-ink-1 text-[14px] ml-2 flex-1">{fullAddress}</Text>
          </View>
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.ink3} />
            <Text className="text-ink-2 text-[14px] ml-2">{delivery.timeWindow}</Text>
            {delivery.distanceMi ? (
              <Text className="text-ink-2 text-[14px] ml-3">· {delivery.distanceMi} mi</Text>
            ) : null}
          </View>
          {delivery.eta ? (
            <View className="flex-row items-center mt-2">
              <MaterialCommunityIcons name="truck-fast-outline" size={16} color={colors.heat} />
              <Text className="text-heat text-[14px] font-semibold ml-2">ETA {delivery.eta}</Text>
            </View>
          ) : null}
        </AppCard>

        {/* Contractor contact */}
        <AppCard className="mt-4">
          <Text className="text-ink-2 text-[12px] font-semibold uppercase tracking-wide mb-2">
            On-site contact
          </Text>
          <View>
            <Text className="text-ink-0 text-[15px] font-bold">{delivery.contractorName}</Text>
            <Text className="text-ink-2 text-[13px] mt-0.5">{delivery.company}</Text>
            <Text className="text-ink-2 text-[13px]">{delivery.contactPhone}</Text>
          </View>
          <View className="flex-row gap-3 mt-3">
            <AppButton
              label="Call"
              icon="phone"
              size="sm"
              variant="secondary"
              fullWidth={false}
              className="flex-1"
              onPress={() => Linking.openURL(`tel:${delivery.contactPhone.replace(/[^0-9]/g, '')}`)}
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
                  `/(driver)/message?thread=${encodeURIComponent(delivery.id)}&peer=${encodeURIComponent(delivery.contractorName)}&role=${encodeURIComponent('On-site contact · ' + delivery.company)}&phone=${encodeURIComponent(delivery.contactPhone)}`,
                )
              }
            />
          </View>
        </AppCard>

        {/* Instructions */}
        {delivery.instructions ? (
          <AppCard className="mt-4" style={{ borderColor: withAlpha(colors.amber, 0.35) }}>
            <View className="flex-row items-start">
              <MaterialCommunityIcons name="information-outline" size={18} color={colors.amber} />
              <View className="ml-2 flex-1">
                <Text className="text-ink-1 text-[13px] font-bold mb-0.5">Delivery instructions</Text>
                <Text className="text-ink-2 text-[13px] leading-5">{delivery.instructions}</Text>
              </View>
            </View>
          </AppCard>
        ) : null}

        {/* Items */}
        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-5 mb-2">
          Items to deliver ({units} {pluralize(units, 'unit')})
        </Text>
        <AppCard>
          {delivery.items.map((item, idx) => (
            <View key={`${item.model}-${idx}`}>
              <View className="flex-row items-center py-1.5">
                <View
                  className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                  style={{ backgroundColor: colors.card2 }}
                >
                  <Text className="text-ink-0 text-[13px] font-bold">{item.quantity}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-ink-0 text-[14px] font-semibold" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-ink-3 text-xs">{item.model}</Text>
                </View>
              </View>
              {idx < delivery.items.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </AppCard>

        {/* Progress */}
        <AppCard className="mt-4">
          <Text className="text-ink-0 text-[15px] font-bold mb-3">Delivery status</Text>
          <Timeline entries={delivery.timeline} />
        </AppCard>

        {/* Issue */}
        {delivery.issue ? (
          <AppCard className="mt-4" style={{ borderColor: withAlpha(colors.alert, 0.35) }}>
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="alert-outline" size={18} color={colors.alert} />
              <Text className="text-ink-0 text-[15px] font-bold ml-2">Issue reported</Text>
            </View>
            <DetailRow label="Type" value={delivery.issue.type} />
            <Text className="text-ink-2 text-[13px] mt-2 leading-5">{delivery.issue.notes}</Text>
            {delivery.issue.photos.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginTop: 12 }}>
                {delivery.issue.photos.map((uri, i) => (
                  <Image key={i} source={{ uri }} style={{ width: 96, height: 96, borderRadius: 12 }} contentFit="cover" />
                ))}
              </ScrollView>
            ) : null}
            <Text className="text-ink-3 text-xs mt-2">{delivery.issue.reportedAt}</Text>
          </AppCard>
        ) : null}

        {/* Proof (delivered) */}
        {delivery.proofOfDelivery ? (
          <View className="mt-4">
            <ProofOfDeliverySummary proof={delivery.proofOfDelivery} />
          </View>
        ) : null}
      </ScrollView>

      {/* Action footer */}
      {isActive ? (
        <View className="border-t border-hair bg-surface px-5 pt-3 pb-6">
          {action ? (
            <AppButton
              label={action.label}
              icon={action.icon}
              loading={updateStatus.isPending}
              onPress={action.run}
            />
          ) : null}
          <View className="flex-row gap-3 mt-3">
            <AppButton
              label="Update ETA"
              icon="clock-edit-outline"
              variant="secondary"
              fullWidth={false}
              className="flex-1"
              onPress={() => router.push(`/(driver)/eta-update?id=${delivery.id}`)}
            />
            <AppButton
              label="Report issue"
              icon="alert-outline"
              variant="outline"
              fullWidth={false}
              className="flex-1"
              onPress={() => router.push(`/(driver)/delivery-issue?id=${delivery.id}`)}
            />
          </View>
        </View>
      ) : (
        <View className="border-t border-hair bg-surface px-5 pt-3 pb-6">
          <View className="flex-row items-center justify-center">
            <MaterialCommunityIcons name={meta.icon} size={18} color={meta.color} />
            <Text className="text-ink-1 text-sm font-semibold ml-2">
              {delivery.status === 'Delivered' ? 'Delivery completed' : delivery.status}
              {delivery.completedAt ? ` · ${delivery.completedAt}` : ''}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
