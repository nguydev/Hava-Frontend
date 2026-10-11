import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AppTextInput,
  Chip,
  EmptyState,
  ErrorState,
  ListSkeleton,
  OrderCard,
} from '@/components';
import { ORDER_FILTERS } from '@/constants';
import { useDebounce, useRefreshByUser } from '@/hooks';
import { useOrders } from '@/services/queries';
import { colors } from '@/theme';
import type { OrderStatus } from '@/types';

export default function Orders() {
  const [status, setStatus] = useState<OrderStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrders({ status, search: debounced });
  const { isRefreshing, onRefresh } = useRefreshByUser(refetch);

  const flatData = Array.isArray(data?.pages)
    ? data.pages.flatMap((page) => (Array.isArray(page?.items) ? page.items : []))
    : [];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <View className="px-5 pt-2 pb-3">
        <Text className="text-ink-0 text-2xl font-extrabold mb-3">Orders</Text>
        <AppTextInput
          icon="magnify"
          placeholder="Search order # or job site"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          containerClassName="mb-0"
          rightSlot={
            search ? (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.ink3} />
              </Pressable>
            ) : undefined
          }
        />
      </View>

      <View className="pb-3">
        <FlatList
          horizontal
          data={ORDER_FILTERS}
          keyExtractor={(f) => f}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <Chip label={item} selected={status === item} onPress={() => setStatus(item)} />
          )}
        />
      </View>

      {isLoading ? (
        <View className="px-5">
          <ListSkeleton count={5} />
        </View>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(o) => o?.id || Math.random().toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => router.push(`/(contractor)/order/${item.id}`)} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="package-variant-closed"
              title="No orders found"
              message="Orders you place will appear here. Browse the catalog to get started."
              actionLabel="Browse catalog"
              onAction={() => router.push('/(contractor)/(tabs)/catalog')}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
