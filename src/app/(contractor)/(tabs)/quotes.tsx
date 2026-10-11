import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  Chip,
  EmptyState,
  ErrorState,
  HeaderIconButton,
  ListSkeleton,
  QuoteCard,
} from '@/components';
import { QUOTE_FILTERS } from '@/constants';
import { useRefreshByUser } from '@/hooks';
import { useQuotes } from '@/services/queries';
import { colors } from '@/theme';

export default function Quotes() {
  const [filterKey, setFilterKey] = useState('all');
  const filter = QUOTE_FILTERS.find((f) => f.key === filterKey) ?? QUOTE_FILTERS[0];
  const { 
    data, 
    isLoading, 
    isError, 
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQuotes({ status: filter.statuses.join(',') });
  const { isRefreshing, onRefresh } = useRefreshByUser(refetch);

  const quotes = useMemo(
    () =>
      Array.isArray(data?.pages)
        ? data.pages.flatMap((page) => (Array.isArray(page?.items) ? page.items : []))
        : [],
    [data],
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <Text className="text-ink-0 text-2xl font-extrabold">Quotes</Text>
        <HeaderIconButton icon="plus" onPress={() => router.push('/(contractor)/quote-request')} />
      </View>

      <View className="pb-3">
        <FlatList
          horizontal
          data={QUOTE_FILTERS}
          keyExtractor={(f) => f.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <Chip
              label={item.label}
              selected={filterKey === item.key}
              onPress={() => setFilterKey(item.key)}
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
          data={quotes}
          keyExtractor={(q) => q?.id || Math.random().toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
          }
          renderItem={({ item }) => (
            <QuoteCard quote={item} onPress={() => router.push(`/(contractor)/quote/${item.id}`)} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="file-document-outline"
              title="No quotes here"
              message="Request pricing on rooftops, boilers, and other specialized equipment."
              actionLabel="Request a quote"
              onAction={() => router.push('/(contractor)/quote-request')}
            />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="large" className="my-4" color={colors.brandBlue} /> : null}
        />
      )}
    </SafeAreaView>
  );
}
