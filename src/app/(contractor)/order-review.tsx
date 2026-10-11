import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { Text, View } from 'react-native';

import {
  AppButton,
  AppCard,
  Divider,
  Header,
  PriceSummary,
  ProductThumb,
  ScreenContainer,
  StepIndicator,
} from '@/components';
import { DELIVERY_OPTIONS } from '@/constants';
import { useCartStore, useCheckoutStore } from '@/store/zustand';
import { colors } from '@/theme';
import { formatCurrency, pluralize } from '@/utils';

export default function OrderReview() {
  const items = useCartStore((s) => s.items);
  const details = useCheckoutStore((s) => s.details);

  if (!details || items.length === 0) {
    return <Redirect href="/(contractor)/cart" />;
  }

  const option = DELIVERY_OPTIONS.find((o) => o.id === details.deliveryOption) ?? DELIVERY_OPTIONS[0];
  const priced = items.filter((i) => i.unitPrice != null);
  const subtotal = priced.reduce((sum, i) => sum + (i.unitPrice ?? 0) * i.quantity, 0);
  const total = subtotal + option.fee;

  return (
    <ScreenContainer
      scroll
      padded={false}
      footer={
        <AppButton
          label="Continue to payment"
          iconRight="arrow-right"
          onPress={() => router.push('/(contractor)/payment')}
        />
      }
    >
      <Header title="Review request" />

      <View className="px-5">
        <View className="my-2">
          <StepIndicator steps={['Cart', 'Details', 'Review', 'Pay']} current={2} />
        </View>

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-4 mb-2">
          Items ({priced.length})
        </Text>
        <AppCard>
          {priced.map((i, idx) => (
            <View key={i.productId}>
              <View className="flex-row items-center py-1.5">
                <ProductThumb uri={i.image} style={{ width: 46, height: 46 }} radius={10} iconSize={18} />
                <View className="flex-1 px-3">
                  <Text className="text-ink-0 text-[14px] font-semibold" numberOfLines={1}>
                    {i.name}
                  </Text>
                  <Text className="text-ink-3 text-xs mt-0.5">
                    {i.quantity} × {formatCurrency(i.unitPrice)}
                  </Text>
                </View>
                <Text className="text-ink-0 text-[14px] font-bold">
                  {formatCurrency((i.unitPrice ?? 0) * i.quantity)}
                </Text>
              </View>
              {idx < priced.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </AppCard>

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-5 mb-2">
          Delivery
        </Text>
        <AppCard>
          <View className="flex-row items-start">
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.heat} />
            <View className="ml-2.5 flex-1">
              <Text className="text-ink-0 text-[15px] font-bold">{details.jobSiteLabel}</Text>
              <Text className="text-ink-2 text-[13px] mt-0.5">
                {details.line1}, {details.city}, {details.state} {details.zip}
              </Text>
              <Text className="text-ink-3 text-xs mt-1">
                {details.contactName} · {details.contactPhone}
              </Text>
            </View>
          </View>
          <Divider className="my-3" />
          <View className="flex-row items-center justify-between py-0.5">
            <Text className="text-ink-2 text-[13px]">Date</Text>
            <Text className="text-ink-0 text-[13px] font-semibold">{details.preferredDate}</Text>
          </View>
          <View className="flex-row items-center justify-between py-0.5">
            <Text className="text-ink-2 text-[13px]">Time window</Text>
            <Text className="text-ink-0 text-[13px] font-semibold">{details.timeWindow}</Text>
          </View>
          <View className="flex-row items-center justify-between py-0.5">
            <Text className="text-ink-2 text-[13px]">Delivery option</Text>
            <Text className="text-ink-0 text-[13px] font-semibold">{option.label}</Text>
          </View>
          <View className="flex-row items-center justify-between py-0.5">
            <Text className="text-ink-2 text-[13px]">Liftgate</Text>
            <Text className="text-ink-0 text-[13px] font-semibold">
              {details.liftgate ? 'Required' : 'Not needed'}
            </Text>
          </View>
          {details.notes ? (
            <>
              <Divider className="my-3" />
              <Text className="text-ink-2 text-[13px] mb-1">Notes</Text>
              <Text className="text-ink-1 text-[13px] leading-5">{details.notes}</Text>
            </>
          ) : null}
        </AppCard>

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-5 mb-2">
          Summary · {priced.reduce((n, i) => n + i.quantity, 0)}{' '}
          {pluralize(priced.reduce((n, i) => n + i.quantity, 0), 'unit')}
        </Text>
        <AppCard>
          <PriceSummary subtotal={subtotal} deliveryFee={option.fee} total={total} />
        </AppCard>
      </View>
    </ScreenContainer>
  );
}
