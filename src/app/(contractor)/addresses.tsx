import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AddressCard,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Header,
  HeaderIconButton,
  ListSkeleton,
} from '@/components';
import { useRefreshByUser } from '@/hooks';
import { useDeleteAddress } from '@/services/mutations';
import { useAddresses } from '@/services/queries';
import { colors } from '@/theme';

export default function Addresses() {
  const { data, isLoading, isError, refetch } = useAddresses();
  const del = useDeleteAddress();
  const { isRefreshing, onRefresh } = useRefreshByUser(refetch);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <Header
        title="Saved job sites"
        right={<HeaderIconButton icon="plus" onPress={() => router.push('/(contractor)/address-form')} />}
      />

      {isLoading ? (
        <View className="px-5">
          <ListSkeleton count={3} />
        </View>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(a) => a.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
          }
          renderItem={({ item }) => (
            <AddressCard
              address={item}
              onEdit={() => router.push(`/(contractor)/address-form?id=${item.id}`)}
              onDelete={() => setPendingDelete(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="map-marker-plus-outline"
              title="No saved job sites"
              message="Save job site addresses to speed up delivery requests."
              actionLabel="Add job site"
              onAction={() => router.push('/(contractor)/address-form')}
            />
          }
        />
      )}

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Remove job site?"
        message="This saved address will be removed from your account."
        confirmLabel="Remove"
        destructive
        loading={del.isPending}
        onConfirm={() => {
          if (pendingDelete) del.mutate(pendingDelete, { onSuccess: () => setPendingDelete(null) });
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </SafeAreaView>
  );
}
