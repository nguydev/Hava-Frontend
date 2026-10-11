import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';
import type { Product } from '@/types';
import { availabilityMeta, formatCurrency, haptics, withAlpha } from '@/utils';

import { AppCard } from '../ui/AppCard';
import { ProductThumb } from '../ui/ProductThumb';

export interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAdd?: () => void;
  variant?: 'grid' | 'list';
}

export function ProductCard({ product, onPress, onAdd, variant = 'grid' }: ProductCardProps) {
  const quoteOnly = product.price === null;
  const avail = availabilityMeta(product.availability);

  if (variant === 'list') {
    return (
      <AppCard onPress={onPress} className="flex-row p-3">
        <ProductThumb uri={product.image} style={{ width: 74, height: 74 }} radius={14} />
        <View className="flex-1 ml-3 justify-center">
          <Text className="text-ink-3 text-[11px] font-semibold uppercase tracking-wide">
            {product.brand}
          </Text>
          <Text className="text-ink-0 text-[15px] font-bold mt-0.5" numberOfLines={1}>
            {product.name}
          </Text>
          <Text className="text-ink-2 text-xs mt-0.5">{product.capacity}</Text>
          <Text className="text-heat text-base font-extrabold mt-1">
            {formatCurrency(product.price)}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.ink3} />
      </AppCard>
    );
  }

  return (
    <AppCard onPress={onPress} className="p-0 overflow-hidden">
      <View className="p-2.5">
        <View className="relative">
          <ProductThumb uri={product.image} style={{ width: '100%', height: 118 }} radius={14} iconSize={32} />
          {product.exclusive ? (
            <View
              className="absolute top-2 left-2 flex-row items-center rounded-pill px-2 py-1"
              style={{ backgroundColor: withAlpha(colors.heat, 0.95) }}
            >
              <MaterialCommunityIcons name="star-four-points" size={11} color={colors.white} />
              <Text className="text-white text-[10px] font-bold ml-1">EXCLUSIVE</Text>
            </View>
          ) : null}
        </View>

        <View className="pt-2.5 px-0.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-ink-3 text-[10px] font-semibold uppercase tracking-wide flex-1 pr-2" numberOfLines={1}>
              {product.brand}
            </Text>
            <View className="flex-row items-center">
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: avail.color, marginRight: 4 }} />
              <Text className="text-[10px] font-semibold" style={{ color: avail.color }} numberOfLines={1}>
                {avail.label}
              </Text>
            </View>
          </View>

          <Text className="text-ink-0 text-[14px] font-bold mt-1" numberOfLines={2}>
            {product.name}
          </Text>
          <Text className="text-ink-2 text-[11px] mt-0.5" numberOfLines={1}>
            {product.capacity}
          </Text>

          <View className="flex-row items-center justify-between mt-2.5">
            {quoteOnly ? (
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="file-document-edit-outline" size={14} color={colors.info} />
                <Text className="text-info text-[13px] font-bold ml-1">Request Quote</Text>
              </View>
            ) : (
              <Text className="text-heat text-[17px] font-extrabold">
                {formatCurrency(product.price)}
              </Text>
            )}
            {!quoteOnly && onAdd ? (
              <Pressable
                onPress={() => {
                  haptics.tap();
                  onAdd();
                }}
                className="w-8 h-8 rounded-xl bg-heat items-center justify-center"
                hitSlop={6}
              >
                <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : (
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.ink3} />
            )}
          </View>
        </View>
      </View>
    </AppCard>
  );
}
