import { router } from 'expo-router';
import { RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AnnouncementCard,
  Avatar,
  BrandBanner,
  BrandMark,
  ErrorState,
  HeaderIconButton,
  ListSkeleton,
  OrderCard,
  QuickActionCard,
  QuoteCard,
  Reveal,
  ScreenContainer,
  SectionHeader,
  StatCard,
} from '@/components';
import { BRAND_IMAGES } from '@/lib/brandImages';
import { useRefreshByUser } from '@/hooks';
import { useNotifications, useOrders, useQuotes } from '@/services/queries';
import { useAuthStore } from '@/store/zustand';
import { colors } from '@/theme';

const ACTIVE_STATUSES = ['Confirmed', 'Preparing', 'Out for Delivery'] as const;

export default function ContractorHome() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrders();
  const quotes = useQuotes();
  const notifications = useNotifications();

  const { isRefreshing, onRefresh } = useRefreshByUser(() =>
    Promise.all([orders.refetch(), quotes.refetch(), notifications.refetch()]),
  );

  const unreadData = Array.isArray(notifications.data) ? notifications.data : [];
  const unread = unreadData.filter((n) => !n?.read).length;
  const ordersData = Array.isArray(orders.data?.pages)
    ? orders.data.pages.flatMap((page) => (Array.isArray(page?.items) ? page.items : []))
    : [];
  const activeDeliveries = ordersData.filter((o) =>
    o?.status && (ACTIVE_STATUSES as readonly string[]).includes(o.status),
  );
  const recentOrders = ordersData.slice(0, 3);

  const quotesData = Array.isArray(quotes.data?.pages)
    ? quotes.data.pages.flatMap((page) => (Array.isArray(page?.items) ? page.items : []))
    : [];
  const pendingQuotes = quotesData.filter(
    (q) => q?.status === 'Pending' || q?.status === 'Approved',
  );

  const isLoading = orders.isLoading || quotes.isLoading;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      {/* Greeting bar */}
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <Avatar name={user?.name ?? 'Contractor'} size={46} />
        <View className="flex-1 ml-3">
          <Text className="text-ink-2 text-[13px]">Welcome back,</Text>
          <Text className="text-ink-0 text-lg font-bold" numberOfLines={1}>
            {user?.name ?? 'Contractor'}
          </Text>
        </View>
        <HeaderIconButton
          icon="bell-outline"
          badge={unread}
          onPress={() => router.push('/(contractor)/notifications')}
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
        {/* Brand promo banner */}
        <Reveal>
          <BrandBanner
            source={BRAND_IMAGES.delivery}
            className="mt-1 mb-1"
            onPress={() => router.push('/(contractor)/(tabs)/catalog')}
          />
        </Reveal>

        {/* Quick actions */}
        <Reveal index={1}>
          <View className="flex-row gap-3 mt-4">
            <QuickActionCard icon="view-grid-outline" label="Browse Equipment" onPress={() => router.push('/(contractor)/(tabs)/catalog')} />
            <QuickActionCard icon="file-document-edit-outline" label="Request Quote" color={colors.info} onPress={() => router.push('/(contractor)/quote-request')} />
          </View>
          <View className="flex-row gap-3 mt-3">
            <QuickActionCard icon="truck-fast-outline" label="Schedule Delivery" color={colors.amber} onPress={() => router.push('/(contractor)/cart')} />
            <QuickActionCard icon="map-marker-path" label="Track Orders" color={colors.ok} onPress={() => router.push('/(contractor)/(tabs)/orders')} />
          </View>
        </Reveal>

        {/* Stats */}
        <Reveal index={1}>
          <View className="flex-row gap-3 mt-4">
            <StatCard icon="truck-delivery-outline" label="Active deliveries" value={activeDeliveries.length} color={colors.heat} />
            <StatCard icon="file-document-outline" label="Pending quotes" value={pendingQuotes.length} color={colors.info} />
          </View>
        </Reveal>

        {isLoading ? (
          <View className="mt-6">
            <ListSkeleton count={3} />
          </View>
        ) : orders.isError ? (
          <ErrorState onRetry={orders.refetch} />
        ) : (
          <>
            {activeDeliveries.length > 0 ? (
              <Reveal index={2}>
                <View className="mt-6">
                  <SectionHeader
                    title="Active deliveries"
                    actionLabel="View all"
                    onAction={() => router.push('/(contractor)/(tabs)/orders')}
                  />
                  <View className="gap-3">
                    {activeDeliveries.slice(0, 2).map((o) => (
                      <OrderCard key={o.id} order={o} onPress={() => router.push(`/(contractor)/track/${o.id}`)} />
                    ))}
                  </View>
                </View>
              </Reveal>
            ) : null}

            {pendingQuotes.length > 0 ? (
              <Reveal index={3}>
                <View className="mt-6">
                  <SectionHeader
                    title="Pending quotes"
                    actionLabel="View all"
                    onAction={() => router.push('/(contractor)/(tabs)/quotes')}
                  />
                  <View className="gap-3">
                    {pendingQuotes.slice(0, 2).map((q) => (
                      <QuoteCard key={q.id} quote={q} onPress={() => router.push(`/(contractor)/quote/${q.id}`)} />
                    ))}
                  </View>
                </View>
              </Reveal>
            ) : null}

            <Reveal index={4}>
              <View className="mt-6">
                <SectionHeader
                  title="Recent orders"
                  actionLabel="View all"
                  onAction={() => router.push('/(contractor)/(tabs)/orders')}
                />
                <View className="gap-3">
                  {recentOrders.map((o) => (
                    <OrderCard key={o.id} order={o} onPress={() => router.push(`/(contractor)/order/${o.id}`)} />
                  ))}
                </View>
              </View>
            </Reveal>
          </>
        )}

        <Reveal index={5}>
          <View className="mt-6">
            <AnnouncementCard
              icon="message-text-outline"
              title="Questions? Chat with us live"
              message="Our team can help spec systems and expedite special orders in real time."
              actionLabel="Start live chat"
              onAction={() => router.push('/(contractor)/chat')}
            />
          </View>
        </Reveal>

        <View className="flex-row items-center justify-center mt-8 mb-2">
          <BrandMark size={18} />
          <Text className="text-ink-3 text-xs ml-2 font-semibold tracking-[3px]">GOODR</Text>
        </View>
      </ScreenContainer>
    </SafeAreaView>
  );
}
