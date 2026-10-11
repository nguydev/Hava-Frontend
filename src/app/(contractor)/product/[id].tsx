import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground,
  AppButton,
  AppCard,
  DetailRow,
  Divider,
  ErrorState,
  QuantityStepper,
  Rating,
  Reveal,
  Skeleton,
  StatusBadge,
} from '@/components';
import { CATEGORY_MAP } from '@/constants';
import { useProductDetails } from '@/services/queries';
import { toast, useCartStore } from '@/store/zustand';
import { colors } from '@/theme';
import { availabilityMeta, formatCurrency, withAlpha } from '@/utils';

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((s) => s.add);

  const { data: product, isLoading, isError, refetch } = useProductDetails(id as string);

  const BackButton = (
    <Pressable
      onPress={() => router.back()}
      className="absolute w-10 h-10 rounded-xl items-center justify-center"
      style={{ top: insets.top + 8, left: 20, backgroundColor: withAlpha(colors.bg, 0.6) }}
    >
      <MaterialCommunityIcons name="chevron-left" size={26} color={colors.ink0} />
    </Pressable>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-transparent">
        <AppBackground />
        <Skeleton width="100%" height={300} radius={0} />
        <View className="px-5 mt-4 gap-3">
          <Skeleton width="60%" height={22} />
          <Skeleton width="40%" height={16} />
          <Skeleton width="100%" height={120} />
        </View>
        {BackButton}
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 bg-transparent pt-16">
        <AppBackground />
        <ErrorState onRetry={refetch} />
        {BackButton}
      </View>
    );
  }

  const quoteOnly = product.price === null;
  const avail = availabilityMeta(product.availability);
  const category = CATEGORY_MAP[product.categoryId];

  const facts = [
    { label: 'Brand', value: product.brand },
    { label: 'Model', value: product.model },
    { label: 'Capacity', value: product.capacity },
    product.efficiency ? { label: 'Efficiency', value: product.efficiency } : null,
    product.fuelType ? { label: 'Fuel type', value: product.fuelType } : null,
    product.warranty ? { label: 'Warranty', value: product.warranty } : null,
    product.dimensions ? { label: 'Dimensions', value: product.dimensions } : null,
    product.weight ? { label: 'Weight', value: product.weight } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const handleAdd = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        model: product.model,
        image: product.image,
        unitPrice: product.price,
        quoteOnly,
      },
      qty,
    );
    toast.success(`${qty} × ${product.brand} added to cart`);
  };

  const goToQuote = () =>
    router.push(
      `/(contractor)/quote-request?equipmentType=${encodeURIComponent(category?.name ?? product.name)}&brand=${encodeURIComponent(product.brand)}&model=${encodeURIComponent(product.model)}`,
    );

  return (
    <View className="flex-1 bg-transparent">
      <AppBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View>
          <Image
            source={{ uri: product.image }}
            style={{ width: '100%', height: 300, backgroundColor: colors.card2 }}
            contentFit="cover"
            transition={180}
          />
          <LinearGradient
            colors={['transparent', colors.bg]}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 90 }}
          />
          {product.exclusive ? (
            <View
              className="absolute top-14 right-5 flex-row items-center rounded-pill px-2.5 py-1"
              style={{ backgroundColor: colors.heat }}
            >
              <MaterialCommunityIcons name="star-four-points" size={12} color={colors.white} />
              <Text className="text-white text-[11px] font-bold ml-1">EXCLUSIVE</Text>
            </View>
          ) : null}
        </View>

        <View className="px-5 -mt-4">
          <Reveal>
            <View className="flex-row items-center justify-between">
              <Text className="text-ink-3 text-xs font-semibold uppercase tracking-wide">
                {product.brand}
              </Text>
              <StatusBadge label={avail.label} color={avail.color} icon={avail.icon} size="sm" />
            </View>
            <Text className="text-ink-0 text-2xl font-extrabold mt-1">{product.name}</Text>
            <View className="flex-row items-center mt-2">
              {product.rating ? <Rating value={product.rating} reviews={product.reviews} /> : null}
              {category ? (
                <Pressable
                  onPress={() => router.push(`/(contractor)/category/${product.categoryId}`)}
                  className="flex-row items-center ml-3 rounded-pill bg-card-2 px-2.5 py-1"
                >
                  <MaterialCommunityIcons
                    name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={12}
                    color={colors.ink2}
                  />
                  <Text className="text-ink-2 text-[11px] font-semibold ml-1">{category.name}</Text>
                </Pressable>
              ) : null}
            </View>
          </Reveal>

          <Reveal index={1}>
            <AppCard className="mt-4">
              <Text className="text-ink-1 text-sm font-bold mb-1">Overview</Text>
              <Text className="text-ink-2 text-[14px] leading-6">{product.description}</Text>
            </AppCard>
          </Reveal>

          <Reveal index={2}>
            <AppCard className="mt-4">
              <Text className="text-ink-1 text-sm font-bold mb-1">Key details</Text>
              {facts.map((f, i) => (
                <View key={f.label}>
                  <DetailRow label={f.label} value={f.value} />
                  {i < facts.length - 1 ? <Divider /> : null}
                </View>
              ))}
            </AppCard>
          </Reveal>

          <Reveal index={3}>
            <AppCard className="mt-4">
              <Text className="text-ink-1 text-sm font-bold mb-1">Specifications</Text>
              {product.specs.map((s, i) => (
                <View key={s.label}>
                  <DetailRow label={s.label} value={s.value} />
                  {i < product.specs.length - 1 ? <Divider /> : null}
                </View>
              ))}
            </AppCard>
          </Reveal>
        </View>
      </ScrollView>

      {/* Sticky action footer */}
      <View
        className="border-t border-hair bg-surface px-5 pt-3"
        style={{ paddingBottom: insets.bottom + 10 }}
      >
        {quoteOnly ? (
          <>
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons name="information-outline" size={16} color={colors.info} />
              <Text className="text-ink-2 text-[13px] ml-2 flex-1">
                Special-order equipment — pricing is provided by quote.
              </Text>
            </View>
            <AppButton label="Request special quote" icon="file-document-edit-outline" onPress={goToQuote} />
          </>
        ) : (
          <>
            <View className="flex-row items-center justify-between mb-3">
              <QuantityStepper value={qty} onChange={setQty} />
              <Text className="text-heat text-xl font-extrabold">
                {formatCurrency((product.price ?? 0) * qty)}
              </Text>
            </View>
            <AppButton label="Add to cart" icon="cart-plus" onPress={handleAdd} />
            <View className="flex-row gap-3 mt-3">
              <AppButton
                label="Request delivery"
                variant="secondary"
                fullWidth={false}
                className="flex-1"
                onPress={() => {
                  handleAdd();
                  router.push('/(contractor)/cart');
                }}
              />
              <AppButton
                label="Request quote"
                variant="outline"
                fullWidth={false}
                className="flex-1"
                onPress={goToQuote}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}
