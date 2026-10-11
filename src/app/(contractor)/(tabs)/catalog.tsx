import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AppTextInput,
  BottomSheet,
  Chip,
  EmptyState,
  ErrorState,
  HeaderIconButton,
  ListSkeleton,
  ProductCard,
  ProductThumb,
  SheetOption,
} from '@/components';
import { CATALOG_SORTS, type CatalogSort } from '@/constants';
import { useDebounce } from '@/hooks';
import { useProducts, useCategories } from '@/services/queries';
import { selectCartCount, useCartStore } from '@/store/zustand';
import { toast } from '@/store/zustand';
import { colors } from '@/theme';
import type { Product } from '@/types';
import { formatCurrency, withAlpha } from '@/utils';

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<CatalogSort>('featured');
  const [sortOpen, setSortOpen] = useState(false);

  const debounced = useDebounce(search);

  // Search, category filter and sort are all applied server-side.
  const { 
    data, 
    isLoading, 
    isError, 
    isFetching, 
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    categoryId,
    search: debounced || undefined,
    sort,
  });

  const { data: categoriesData } = useCategories();
  const categories = categoriesData ?? [];

  const addToCart = useCartStore((s) => s.add);
  const cartCount = useCartStore(selectCartCount);
  const sortLabel = CATALOG_SORTS.find((s) => s.key === sort)?.label ?? 'Featured';

  const products = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const fitProducts = useMemo(() => products.filter((p) => p.exclusive), [products]);
  const showFit = !categoryId && !debounced && fitProducts.length > 0;

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

  // Pad to an even number so the 2-column grid stays aligned.
  const gridData = useMemo(() => {
    const items: (Product | null)[] = [...products];
    if (items.length % 2 === 1) items.push(null);
    return items;
  }, [products]);

  const Chips = (
    <View className="mb-3">
      <FlatList
        horizontal
        data={[{ id: undefined, name: 'All' }, ...categories]}
        keyExtractor={(c) => c.id ?? 'all'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <Chip
            label={item.name}
            selected={categoryId === item.id}
            onPress={() => setCategoryId(item.id)}
          />
        )}
      />
    </View>
  );

  const ListHeader = (
    <View className="px-5">
      <View className="flex-row items-center justify-between pt-2 pb-3">
        <Text className="text-ink-0 text-2xl font-extrabold">Catalog</Text>
        <HeaderIconButton
          icon="cart-outline"
          badge={cartCount}
          onPress={() => router.push('/(contractor)/cart')}
        />
      </View>

      <AppTextInput
        icon="magnify"
        placeholder="Search brand, model, or name"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        containerClassName="mb-3"
        rightSlot={
          search ? (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.ink3} />
            </Pressable>
          ) : undefined
        }
      />

      {showFit ? (
        <View className="mb-4">
          <View className="flex-row items-center mb-2.5">
            <MaterialCommunityIcons name="star-four-points" size={16} color={colors.brandCyan} />
            <Text className="text-ink-0 text-[15px] font-extrabold ml-1.5">Daikin FIT</Text>
            <View
              className="rounded-pill px-2 py-0.5 ml-2"
              style={{ backgroundColor: withAlpha(colors.brandCyan, 0.16) }}
            >
              <Text className="text-[10px] font-bold" style={{ color: colors.brandCyan }}>
                EXCLUSIVE
              </Text>
            </View>
          </View>
          <FlatList
            horizontal
            data={fitProducts}
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <Pressable style={{ width: 210 }} onPress={() => router.push(`/(contractor)/product/${item.id}`)}>
                <LinearGradient
                  colors={[colors.brandBlue, colors.brandCyan]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 18, padding: 1.5 }}
                >
                  <View className="rounded-[16px] bg-card overflow-hidden">
                    <View className="relative">
                      <ProductThumb uri={item.image} style={{ width: '100%', height: 104 }} radius={0} iconSize={30} />
                      <View
                        className="absolute top-2 left-2 rounded-pill px-2 py-0.5"
                        style={{ backgroundColor: withAlpha(colors.black, 0.55) }}
                      >
                        <Text className="text-white text-[9px] font-bold tracking-wide">DAIKIN FIT</Text>
                      </View>
                    </View>
                    <View className="p-3">
                      <Text className="text-ink-0 text-[13px] font-bold" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-ink-2 text-[11px] mt-0.5" numberOfLines={1}>
                        {item.capacity}
                      </Text>
                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-heat text-[15px] font-extrabold">
                          {formatCurrency(item.price)}
                        </Text>
                        <Pressable
                          onPress={() => handleAdd(item)}
                          className="w-8 h-8 rounded-xl bg-heat items-center justify-center"
                          hitSlop={6}
                        >
                          <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            )}
          />
        </View>
      ) : null}

      {Chips}

      <Pressable
        onPress={() => setSortOpen(true)}
        className="flex-row items-center self-start mb-3"
        hitSlop={6}
      >
        <MaterialCommunityIcons name="swap-vertical" size={16} color={colors.ink2} />
        <Text className="text-ink-2 text-[13px] font-semibold ml-1">Sort: {sortLabel}</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      {isLoading ? (
        <View>
          {ListHeader}
          <View className="px-5">
            <ListSkeleton count={4} />
          </View>
        </View>
      ) : isError ? (
        <>
          {ListHeader}
          <ErrorState onRetry={refetch} />
        </>
      ) : (
        <FlatList
          data={gridData}
          key="catalog-grid"
          numColumns={2}
          keyExtractor={(item, i) => item?.id ?? `spacer-${i}`}
          ListHeaderComponent={ListHeader}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
          contentContainerStyle={{ gap: 12, paddingBottom: 32 }}
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
              icon="magnify-close"
              title="No products found"
              message="Try a different search or clear your filters."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch('');
                setCategoryId(undefined);
              }}
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

      {isFetching && !isLoading ? (
        <View className="absolute top-2 right-5">
          <MaterialCommunityIcons name="sync" size={16} color={colors.ink3} />
        </View>
      ) : null}

      <BottomSheet visible={sortOpen} onClose={() => setSortOpen(false)} title="Sort by">
        {CATALOG_SORTS.map((s) => (
          <SheetOption
            key={s.key}
            label={s.label}
            selected={s.key === sort}
            onPress={() => {
              setSort(s.key);
              setSortOpen(false);
            }}
          />
        ))}
      </BottomSheet>
    </SafeAreaView>
  );
}
