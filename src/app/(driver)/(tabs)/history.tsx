import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  Chip,
  DeliveryCard,
  EmptyState,
  ErrorState,
  ListSkeleton,
} from '@/components';
import { useRefreshByUser } from '@/hooks';
import { useDeliveries } from '@/services/queries';
import { colors } from '@/theme';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'issues', label: 'Issues' },
] as const;

const PAGE_SIZE = 10;

export default function DriverHistory() {
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const { data, isLoading, isError, refetch } = useDeliveries({ scope: 'history' });
  const { isRefreshing, onRefresh } = useRefreshByUser(async () => {
    setPage(1);
    await refetch();
  });

  const filtered = (data ?? []).filter((d) =>
    filter === 'delivered'
      ? d.status === 'Delivered'
      : filter === 'issues'
        ? d.status === 'Issue Reported'
        : true,
  );

  const visibleItems = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visibleItems.length < filtered.length;

  const handleEndReached = () => {
    if (!hasMore || loadingMore || isLoading) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 400);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <View className="px-5 pt-2 pb-3">
        <Text className="text-ink-0 text-2xl font-extrabold">History</Text>
      </View>

      <View className="pb-3">
        <FlatList
          horizontal
          data={FILTERS as unknown as { key: string; label: string }[]}
          keyExtractor={(f) => f.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <Chip
              label={item.label}
              selected={filter === item.key}
              onPress={() => {
                setFilter(item.key);
                setPage(1);
              }}
            />
          )}
        />
      </View>

      {isLoading ? (
        <View className="px-5">
          <ListSkeleton count={4} />
        </View>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={visibleItems}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
          }
          renderItem={({ item }) => (
            <DeliveryCard delivery={item} onPress={() => router.push(`/(driver)/delivery/${item.id}`)} />
          )}
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4 items-center justify-center">
                <ActivityIndicator color={colors.heat} size="small" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="history"
              title="No past deliveries"
              message="Completed deliveries and reported issues will appear here."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
