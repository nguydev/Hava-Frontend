import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AppCard,
  Avatar,
  DeliveryCard,
  ErrorState,
  HeaderIconButton,
  ListSkeleton,
  Reveal,
  ScreenContainer,
  SectionHeader,
  StatCard,
  StatusBadge,
  QuickActionCard,
  Chip,
  AppButton,
} from '@/components';
import { useRefreshByUser } from '@/hooks';
import { useDeliveries, useNotifications } from '@/services/queries';
import { useAuthStore } from '@/store/zustand';
import { colors } from '@/theme';
import { useUpdateProfile, useClaimDelivery } from '@/services/mutations';
import { withAlpha } from '@/utils';

const IN_PROGRESS = ['Accepted', 'En Route', 'Arrived'];
const ROUTE_OPTIONS = ['North', 'West', 'East', 'South', 'Local', 'Long Distance'];

export default function DriverToday() {
  const user = useAuthStore((s) => s.user);
  const today = useDeliveries({ scope: 'today' });
  const available = useDeliveries({ scope: 'available' });
  const notifications = useNotifications();
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: claimDelivery, isPending: isClaiming } = useClaimDelivery();
  
  const { isRefreshing, onRefresh } = useRefreshByUser(() =>
    Promise.all([today.refetch(), available.refetch(), notifications.refetch()]),
  );

  const list = Array.isArray(today.data) ? today.data : [];
  const availableList = Array.isArray(available.data) ? available.data : [];
  const active = list.find((d) => d?.status && IN_PROGRESS.includes(d.status));
  const pending = list.filter((d) => d?.status === 'Assigned');
  const totalMiles = list.reduce((n, d) => n + (d?.distanceMi ?? 0), 0);
  const unreadData = Array.isArray(notifications.data) ? notifications.data : [];
  const unread = unreadData.filter((n) => !n?.read).length;
  const statusColor =
    user?.driverStatus === 'On Delivery'
      ? colors.heat
      : user?.driverStatus === 'Available'
        ? colors.ok
        : colors.ink3;

  const primaryLabel = (status: string) => (status === 'Assigned' ? 'Start delivery' : 'Continue');

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      {/* Header bar */}
      <View className="flex-row items-center px-5 pt-2 pb-3 border-b border-surface-border bg-surface-card">
        <Avatar name={user?.name ?? 'Driver'} size={46} />
        <View className="flex-1 ml-3">
          <Text className="text-ink-0 text-lg font-bold" numberOfLines={1}>
            {user?.name ?? 'Driver'}
          </Text>
          <View className="flex-row items-center mt-0.5 gap-2">
            <StatusBadge label={user?.driverStatus ?? 'Available'} color={statusColor} size="sm" />
            <Text className="text-ink-3 text-xs">· {user?.vehicle || 'Fleet Vehicle'}</Text>
          </View>
        </View>
        <HeaderIconButton
          icon="bell-outline"
          badge={unread}
          onPress={() => router.push('/(driver)/notifications')}
        />
      </View>

      <ScreenContainer
        scroll
        edges={[]}
        background={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
        }
      >
        {/* Quick actions */}
        <Reveal>
          <View className="flex-row gap-2.5 mt-4">
            <QuickActionCard icon="plus-box-outline" label="+ Add Delivery" onPress={() => router.push('/(driver)/new-order')} />
            <QuickActionCard icon="truck-fast-outline" label="Open Pool" color={colors.amber} onPress={() => router.push('/(driver)/(tabs)/deliveries')} />
            <QuickActionCard icon="message-text-outline" label="Admin Chat" color={colors.info} onPress={() => router.push('/(driver)/chat')} />
          </View>
        </Reveal>

        {/* Route Preference */}
        <Reveal index={1}>
          <View className="mt-5">
            <SectionHeader title="Route Preferences" className="mb-2.5" />
            {user?.adminAssignedRoute ? (
              <AppCard className="py-3 px-4">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="shield-check" size={20} color={colors.heat} />
                  <Text className="text-ink-0 font-semibold ml-2">Admin Assigned Route:</Text>
                  <Text className="text-heat font-bold ml-2">{user.adminAssignedRoute}</Text>
                </View>
              </AppCard>
            ) : (
              <View>
                <Text className="text-ink-2 text-xs mb-2.5 px-1">Select area preference for automated matching:</Text>
                <View className="flex-row flex-wrap gap-2">
                  {ROUTE_OPTIONS.map((route) => (
                    <Chip
                      key={route}
                      label={route}
                      selected={user?.routePreference === route}
                      onPress={() => updateProfile({ routePreference: route })}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        </Reveal>

        {/* Stats */}
        <Reveal index={2}>
          <View className="flex-row gap-2.5 mt-5">
            <StatCard icon="map-marker-multiple" label="My Stops" value={list.length} color={colors.heat} />
            <StatCard icon="clock-outline" label="Pending" value={pending.length} color={colors.amber} />
            <StatCard icon="hand-pointing-up" label="Available" value={availableList.length} color={colors.info} />
            <StatCard icon="check-decagram" label="Done" value={user?.completedDeliveries ?? 0} color={colors.ok} />
          </View>
        </Reveal>

        {/* Available Deliveries to Claim Feed */}
        {availableList.length > 0 ? (
          <Reveal index={3}>
            <View className="mt-6">
              <View className="flex-row items-center justify-between mb-3">
                <SectionHeader title="Available to Claim" className="mb-0" />
                <Pressable onPress={() => router.push('/(driver)/(tabs)/deliveries')}>
                  <Text className="text-heat font-semibold text-xs">View all ({availableList.length}) →</Text>
                </Pressable>
              </View>
              <View className="gap-3">
                {availableList.slice(0, 2).map((item) => (
                  <AppCard key={item.id} className="p-4" style={{ borderLeftWidth: 4, borderLeftColor: colors.amber }}>
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center gap-2">
                        <View className="px-2 py-0.5 rounded" style={{ backgroundColor: withAlpha(colors.amber, 0.15) }}>
                          <Text className="font-bold text-xs" style={{ color: colors.amber }}>AVAILABLE</Text>
                        </View>
                        <Text className="text-ink-2 text-xs">{item.timeWindow || 'Flexible'}</Text>
                      </View>
                      <Text className="text-ink-2 text-xs font-semibold">{item.distanceMi ? `${item.distanceMi} mi` : ''}</Text>
                    </View>
                    <Text className="text-ink-0 font-extrabold text-base">{item.jobSite || 'Job Site Delivery'}</Text>
                    <Text className="text-ink-2 text-xs mt-1" numberOfLines={1}>
                      📍 {typeof item.address === 'object' && item.address ? `${item.address.line1 || ''}, ${item.address.city || ''}` : typeof item.address === 'string' ? item.address : 'Address details in order'}
                    </Text>
                    {item.notes ? (
                      <Text className="text-ink-3 text-xs mt-1 italic" numberOfLines={1}>
                        Note: {item.notes}
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
                ))}
              </View>
            </View>
          </Reveal>
        ) : null}

        {today.isLoading ? (
          <View className="mt-6">
            <ListSkeleton count={3} />
          </View>
        ) : today.isError ? (
          <ErrorState onRetry={today.refetch} />
        ) : (
          <>
            {active ? (
              <Reveal index={4}>
                <View className="mt-6">
                  <SectionHeader title="Active Delivery in Progress" />
                  <DeliveryCard
                    delivery={active}
                    onPress={() => router.push(`/(driver)/delivery/${active.id}`)}
                    onPrimary={() => router.push(`/(driver)/delivery/${active.id}`)}
                    primaryLabel={primaryLabel(active.status)}
                  />
                </View>
              </Reveal>
            ) : null}

            <Reveal index={5}>
              <View className="mt-6">
                <View className="flex-row items-center justify-between mb-3">
                  <SectionHeader title="Today’s Route" className="mb-0 flex-1" />
                </View>
                <AppCard className="mb-3 flex-row items-center">
                  <MaterialCommunityIcons name="map-marker-path" size={20} color={colors.heat} />
                  <Text className="text-ink-1 text-[14px] ml-2.5">
                    {list.length} stop{list.length === 1 ? '' : 's'} assigned · {totalMiles.toFixed(1)} mi total
                  </Text>
                </AppCard>
                <View className="gap-3">
                  {list.map((d) => (
                    <DeliveryCard
                      key={d.id}
                      delivery={d}
                      onPress={() => router.push(`/(driver)/delivery/${d.id}`)}
                    />
                  ))}
                  {list.length === 0 ? (
                    <AppCard>
                      <View className="items-center py-6 px-4">
                        <MaterialCommunityIcons name="truck-plus-outline" size={40} color={colors.heat} />
                        <Text className="text-ink-0 text-[16px] font-bold mt-3">No Active Route Assigned</Text>
                        <Text className="text-ink-2 text-[13px] mt-1 text-center">
                          Claim available open deliveries above or click "+ Add Delivery" to create one.
                        </Text>
                        <View className="mt-4 flex-row gap-3">
                          <AppButton
                            label="+ Add Delivery"
                            size="sm"
                            onPress={() => router.push('/(driver)/new-order')}
                          />
                          <AppButton
                            label="Claim Open Delivery"
                            size="sm"
                            variant="secondary"
                            onPress={() => router.push('/(driver)/(tabs)/deliveries')}
                          />
                        </View>
                      </View>
                    </AppCard>
                  ) : null}
                </View>
              </View>
            </Reveal>
          </>
        )}
      </ScreenContainer>
    </SafeAreaView>
  );
}
