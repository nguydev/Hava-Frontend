import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  EmptyState,
  ErrorState,
  Header,
  ListSkeleton,
  ProductCard,
} from '@/components';
import { CATEGORY_MAP } from '@/constants';
import { useProducts } from '@/services/queries';
import { toast, useCartStore } from '@/store/zustand';
import type { Product } from '@/types';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = CATEGORY_MAP[slug];
  const { data, isLoading, isError, refetch } = useProducts({ categoryId: slug });
  const addToCart = useCartStore((s) => s.add);

  const gridData = useMemo(() => {
    const productsData = data?.pages.flatMap((page) => page.items) ?? [];
    const items: (Product | null)[] = [...productsData];
    if (items.length % 2 === 1) items.push(null);
    return items;
  }, [data]);

  const handleAdd = (p: Product) => {
    addToCart({
      productId: p.id,
      name: p.name,
      brand: p.brand,
      model: p.model,
      image: p.image,
      unitPrice: p.price,
      quoteOnly: p.price === null,
    });
    toast.success(`${p.brand} added to cart`);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <Header title={category?.name ?? 'Category'} subtitle={category?.blurb} />

      {isLoading ? (
        <View className="px-5">
          <ListSkeleton count={4} />
        </View>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={gridData}
          numColumns={2}
          keyExtractor={(item, i) => item?.id ?? `spacer-${i}`}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
          contentContainerStyle={{ gap: 12, paddingBottom: 32, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            item ? (
              <View className="flex-1">
                <ProductCard
                  product={item}
                  onPress={() => router.push(`/(contractor)/product/${item.id}`)}
                  onAdd={() => handleAdd(item)}
                />
              </View>
            ) : (
              <View className="flex-1" />
            )
          }
          ListEmptyComponent={
            <EmptyState
              icon="package-variant"
              title="No products in this category"
              message="Check back soon — we’re always adding equipment."
              actionLabel="Browse all"
              onAction={() => router.push('/(contractor)/(tabs)/catalog')}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
