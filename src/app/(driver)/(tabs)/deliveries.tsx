import { useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppBackground,
  AppCard,
  AppButton,
  DeliveryCard,
  EmptyState,
  ErrorState,
  ListSkeleton,
} from '@/components';
import { useRefreshByUser } from '@/hooks';
import { useDeliveries } from '@/services/queries';
import { useClaimDelivery } from '@/services/mutations';
import { colors } from '@/theme';

export default function DriverDeliveries() {
  const [tab, setTab] = useState<'my' | 'available'>('my');

  const myRoute = useDeliveries({ scope: 'today' });
  const availablePool = useDeliveries({ scope: 'available' });
  const { mutate: claimDelivery, isPending: isClaiming } = useClaimDelivery();

  const refetchAll = async () => {
    await Promise.all([myRoute.refetch(), availablePool.refetch()]);
  };

  const { isRefreshing, onRefresh } = useRefreshByUser(refetchAll);

  const activeQuery = tab === 'my' ? myRoute : availablePool;
  const listData = Array.isArray(activeQuery.data) ? activeQuery.data : [];
  const myRouteCount = Array.isArray(myRoute.data) ? myRoute.data.length : 0;
  const availableCount = Array.isArray(availablePool.data) ? availablePool.data.length : 0;

  const primaryLabel = (status: string) => (status === 'Assigned' ? 'Start delivery' : 'Continue');

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      {/* Header bar */}
      <View className="px-5 pt-2 pb-3 flex-row items-center justify-between">
        <View>
          <Text className="text-ink-0 text-2xl font-extrabold">Deliveries Hub</Text>
          <Text className="text-ink-2 text-[13px] mt-0.5">
            {tab === 'my'
              ? `${myRouteCount} active assignments on your route`
              : `${availableCount} open deliveries available to claim`}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/(driver)/new-order')}
          className="bg-heat px-3 py-2 rounded-xl flex-row items-center gap-1 shadow-sm"
        >
          <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
          <Text className="text-white font-bold text-xs">Add Order</Text>
        </Pressable>
      </View>

      {/* Segment Tabs */}
      <View className="px-5 mb-4">
        <View className="flex-row bg-surface-card border border-surface-border p-1 rounded-xl">
          <Pressable
            onPress={() => setTab('my')}
            className={`flex-1 py-2 rounded-lg items-center ${
              tab === 'my' ? 'bg-heat' : 'bg-transparent'
            }`}
          >
            <Text
              className={`font-bold text-xs ${
                tab === 'my' ? 'text-white' : 'text-ink-2'
              }`}
            >
              My Route ({myRouteCount})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('available')}
            className={`flex-1 py-2 rounded-lg items-center ${
              tab === 'available' ? 'bg-heat' : 'bg-transparent'
            }`}
          >
            <Text
              className={`font-bold text-xs ${
                tab === 'available' ? 'text-white' : 'text-ink-2'
              }`}
            >
              Available Pool ({availableCount})
            </Text>
          </Pressable>
        </View>
      </View>

      {activeQuery.isLoading ? (
        <View className="px-5">
          <ListSkeleton count={4} />
        </View>
      ) : activeQuery.isError ? (
        <ErrorState onRetry={refetchAll} />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(d) => d?.id || Math.random().toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
          }
          renderItem={({ item }) =>
            tab === 'my' ? (
              <DeliveryCard
                delivery={item}
                onPress={() => router.push(`/(driver)/delivery/${item.id}`)}
                onPrimary={() => router.push(`/(driver)/delivery/${item.id}`)}
                primaryLabel={primaryLabel(item.status)}
              />
            ) : (
              <AppCard className="p-4" style={{ borderLeftWidth: 4, borderLeftColor: colors.amber }}>
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <View className="px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)' }}>
                      <Text className="font-bold text-xs" style={{ color: colors.amber }}>OPEN POOL</Text>
                    </View>
                    <Text className="text-ink-2 text-xs">{item.timeWindow || 'Flexible'}</Text>
                  </View>
                  <Text className="text-ink-2 text-xs font-semibold">
                    {item.distanceMi ? `${item.distanceMi} mi` : ''}
                  </Text>
                </View>

                <Text className="text-ink-0 font-extrabold text-base">{item.jobSite || 'Job Site Delivery'}</Text>
                <Text className="text-ink-2 text-xs mt-1" numberOfLines={1}>
                  📍 {typeof item.address === 'object' && item.address ? `${item.address.line1 || ''}, ${item.address.city || ''}` : typeof item.address === 'string' ? item.address : 'Address details in order'}
                </Text>
                {item.notes ? (
                  <Text className="text-ink-3 text-xs mt-1 italic" numberOfLines={2}>
                    Notes: {item.notes}
                  </Text>
                ) : null}

                <View className="mt-3.5 flex-row items-center justify-between pt-3 border-t border-surface-border">
                  <Text className="text-ink-1 text-xs font-medium">
                    {item.items?.length || 1} item(s) · {item.priority || 'Normal'} priority
                  </Text>
                  <AppButton
                    label="Claim Delivery"
                    size="sm"
                    loading={isClaiming}
                    onPress={() => claimDelivery(item.id)}
                  />
                </View>
              </AppCard>
            )
          }
          ListEmptyComponent={
            tab === 'my' ? (
              <EmptyState
                icon="truck-check-outline"
                title="No active deliveries"
                message="You have no assigned deliveries on your route today. Check the Available Pool tab to claim one!"
                tint={colors.heat}
              />
            ) : (
              <EmptyState
                icon="tray-full"
                title="No available open deliveries"
                message="There are no unassigned deliveries in the open pool right now. Or click '+ Add Order' to create one."
                tint={colors.ok}
              />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}
