import { router } from 'expo-router';
import { FlatList, RefreshControl, View } from 'react-native';

import {
  EmptyState,
  ErrorState,
  Header,
  HeaderIconButton,
  ListSkeleton,
  NotificationItem,
  ScreenContainer,
} from '@/components';
import { useRefreshByUser } from '@/hooks';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '@/services/mutations';
import { useNotifications } from '@/services/queries';
import { useAuthStore } from '@/store/zustand';
import { colors } from '@/theme';
import type { AppNotification } from '@/types';

export function NotificationsView() {
  const role = useAuthStore((s) => s.role);
  const { data, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const { isRefreshing, onRefresh } = useRefreshByUser(refetch);

  const unread = (data ?? []).filter((n) => !n.read).length;

  const openTarget = (n: AppNotification) => {
    if (!n.read) markRead.mutate(n.id);
    if (!n.targetId) return;
    // Only navigate to screens that exist for the current role.
    switch (n.targetType) {
      case 'order':
        if (role !== 'driver') router.push(`/(contractor)/order/${n.targetId}`);
        break;
      case 'quote':
        if (role !== 'driver') router.push(`/(contractor)/quote/${n.targetId}`);
        break;
      case 'delivery':
        router.push(
          role === 'driver'
            ? `/(driver)/delivery/${n.targetId}`
            : `/(contractor)/track/${n.targetId}`,
        );
        break;
    }
  };

  return (
    <ScreenContainer padded={false}>
      <Header
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : 'All caught up'}
        right={
          unread > 0 ? (
            <HeaderIconButton icon="check-all" onPress={() => markAll.mutate()} />
          ) : undefined
        }
      />

      {isLoading ? (
        <View className="px-5">
          <ListSkeleton count={6} />
        </View>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(n) => n.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 10 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
          }
          renderItem={({ item }) => (
            <NotificationItem notification={item} onPress={() => openTarget(item)} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="bell-outline"
              title="No notifications yet"
              message="Order, quote, and delivery updates will show up here."
            />
          }
        />
      )}
    </ScreenContainer>
  );
}
