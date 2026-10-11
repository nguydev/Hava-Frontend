import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AppButton,
  AppCard,
  EmptyState,
  QuantityStepper,
  ScreenHeaderCard,
} from '@/components';
import { selectCartSubtotal, useCartStore } from '@/store/zustand';
import { colors } from '@/theme';
import { formatCurrency } from '@/utils';
import type { CartItem } from '@/types';

function CartRow({ item }: { item: CartItem }) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  return (
    <AppCard className="flex-row p-3">
      <Image
        source={{ uri: item.image }}
        style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: colors.card2 }}
        contentFit="cover"
      />
      <View className="flex-1 ml-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-ink-3 text-[10px] font-semibold uppercase">{item.brand}</Text>
            <Text className="text-ink-0 text-[14px] font-bold" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-ink-2 text-[11px] mt-0.5">{item.model}</Text>
          </View>
          <Pressable onPress={() => remove(item.productId)} hitSlop={8}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.alert} />
          </Pressable>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => setQty(item.productId, q)}
            size="sm"
          />
          <Text className="text-heat text-base font-extrabold">
            {formatCurrency((item.unitPrice ?? 0) * item.quantity)}
          </Text>
        </View>
      </View>
    </AppCard>
  );
}

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);

  if (items.length === 0) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
        <ScreenHeaderCard title="Basket" subtitle="Check all your cart information here" />
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          message="Browse the catalog and add HVAC equipment to request a delivery."
          actionLabel="Browse catalog"
          onAction={() => router.replace('/(contractor)/(tabs)/catalog')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <ScreenHeaderCard
        title="Basket"
        subtitle={`${items.length} item${items.length > 1 ? 's' : ''} · check your cart information`}
      />

      <ScrollView
        className="px-5 mt-4"
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <CartRow key={item.productId} item={item} />
        ))}
      </ScrollView>

      <View className="border-t border-hair bg-surface px-5 pt-4 pb-6">
        <View className="flex-row items-center justify-between rounded-card bg-card-2 border border-hair px-4 py-3 mb-3">
          <Text className="text-ink-0 text-lg font-extrabold">Total</Text>
          <Text className="text-xl font-extrabold" style={{ color: colors.brandCyan }}>
            {formatCurrency(subtotal)}
          </Text>
        </View>
        <View className="flex-row items-center mb-3">
          <MaterialCommunityIcons name="information-outline" size={13} color={colors.ink3} />
          <Text className="text-ink-3 text-xs ml-1.5">
            Delivery options & fees are selected in the next step.
          </Text>
        </View>
        <AppButton
          label="Proceed to Checkout"
          iconRight="arrow-right"
          onPress={() => router.push('/(contractor)/delivery-request')}
        />
      </View>
    </SafeAreaView>
  );
}
