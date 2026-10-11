import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  AppButton,
  AppCard,
  cardBrandMeta,
  Header,
  PaymentMethodCard,
  PriceSummary,
  ScreenContainer,
  Skeleton,
  StepIndicator,
} from '@/components';
import { DELIVERY_OPTIONS } from '@/constants';
import { usePaymentMethods } from '@/services/queries';
import { useCreateOrder } from '@/services/mutations';
import type { CreateOrderInput } from '@/services/api';
import { useCartStore, useCheckoutStore } from '@/store/zustand';
import { colors } from '@/theme';
import { formatCurrency, withAlpha } from '@/utils';

const INVOICE = 'invoice';

export default function Payment() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const details = useCheckoutStore((s) => s.details);
  const sitePhotos = useCheckoutStore((s) => s.sitePhotos);
  const clearCheckout = useCheckoutStore((s) => s.clear);

  const { data: methods, isLoading } = usePaymentMethods();
  const { mutate, isPending } = useCreateOrder();

  const [selected, setSelected] = useState<string | null>(null);

  if (!details || items.length === 0) {
    return <Redirect href="/(contractor)/cart" />;
  }

  const option = DELIVERY_OPTIONS.find((o) => o.id === details.deliveryOption) ?? DELIVERY_OPTIONS[0];
  const priced = items.filter((i) => i.unitPrice != null);
  const subtotal = priced.reduce((sum, i) => sum + (i.unitPrice ?? 0) * i.quantity, 0);
  const total = subtotal + option.fee;

  // Resolve the effective selection: explicit choice → default card → invoice.
  const defaultMethod = methods?.find((m) => m.isDefault) ?? methods?.[0];
  const activeId = selected ?? defaultMethod?.id ?? INVOICE;
  const payingByCard = activeId !== INVOICE;
  const activeCard = methods?.find((m) => m.id === activeId);

  const pay = () => {
    const payment: CreateOrderInput['payment'] = payingByCard
      ? {
          kind: 'card',
          methodId: activeCard?.id,
          brand: activeCard?.brand,
          last4: activeCard?.last4,
          label: activeCard
            ? `${cardBrandMeta[activeCard.brand].label} •••• ${activeCard.last4}`
            : 'Card',
        }
      : { kind: 'invoice', label: 'Net-30 Invoice' };

    const input: CreateOrderInput = {
      items: priced.map((i) => ({
        productId: i.productId,
        name: i.name,
        brand: i.brand,
        model: i.model,
        quantity: i.quantity,
        unitPrice: i.unitPrice as number,
        image: i.image ?? undefined,
      })),
      address: {
        id: 'addr-order',
        label: details.jobSiteLabel,
        line1: details.line1,
        city: details.city,
        state: details.state,
        zip: details.zip,
        contactName: details.contactName,
        contactPhone: details.contactPhone,
      },
      contactName: details.contactName,
      contactPhone: details.contactPhone,
      preferredDate: details.preferredDate,
      timeWindow: details.timeWindow,
      notes: details.notes,
      liftgate: details.liftgate,
      deliveryOption: option.label,
      deliveryFee: option.fee,
      sitePhotos: sitePhotos.length ? sitePhotos : undefined,
      payment,
    };

    mutate(input, {
      onSuccess: (order) => {
        clearCart();
        clearCheckout();
        router.replace(`/(contractor)/order-confirmation?id=${order.id}`);
      },
    });
  };

  return (
    <ScreenContainer
      scroll
      padded={false}
      footer={
        <AppButton
          label={payingByCard ? `Pay ${formatCurrency(total)}` : 'Place order · Net-30 Invoice'}
          icon={payingByCard ? 'lock-check-outline' : 'file-document-outline'}
          loading={isPending}
          onPress={pay}
        />
      }
    >
      <Header title="Payment" />

      <View className="px-5">
        <View className="my-2">
          <StepIndicator steps={['Cart', 'Details', 'Review', 'Pay']} current={3} />
        </View>

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-4 mb-2">
          Payment method
        </Text>

        {isLoading ? (
          <View className="gap-3">
            <Skeleton height={64} radius={20} />
            <Skeleton height={64} radius={20} />
          </View>
        ) : (
          <View className="gap-3">
            {(methods ?? []).map((m) => (
              <PaymentMethodCard
                key={m.id}
                method={m}
                selectable
                selected={activeId === m.id}
                onSelect={() => setSelected(m.id)}
              />
            ))}

            {/* Net-30 invoice option */}
            <Pressable
              onPress={() => setSelected(INVOICE)}
              className="rounded-card border p-3.5 flex-row items-center bg-card"
              style={{
                borderColor: activeId === INVOICE ? colors.brandBlue : colors.hair,
                backgroundColor:
                  activeId === INVOICE ? withAlpha(colors.brandBlue, 0.06) : undefined,
              }}
            >
              <View
                className="w-11 h-8 rounded-lg items-center justify-center"
                style={{ backgroundColor: withAlpha(colors.info, 0.16) }}
              >
                <MaterialCommunityIcons name="file-document-outline" size={18} color={colors.info} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-ink-0 text-[14px] font-bold">Pay on invoice</Text>
                <Text className="text-ink-2 text-[12px] mt-0.5">Net-30 terms · approved accounts</Text>
              </View>
              <View
                className="w-5 h-5 rounded-full items-center justify-center ml-2"
                style={{
                  borderWidth: 2,
                  borderColor: activeId === INVOICE ? colors.brandBlue : colors.hair,
                }}
              >
                {activeId === INVOICE ? (
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brandBlue }} />
                ) : null}
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push('/(contractor)/add-card')}
              className="rounded-card border border-dashed border-hair p-3.5 flex-row items-center justify-center"
            >
              <MaterialCommunityIcons name="plus" size={18} color={colors.heat} />
              <Text className="text-heat text-[13px] font-bold ml-1.5">Add new card</Text>
            </Pressable>
          </View>
        )}

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-6 mb-2">
          Order summary
        </Text>
        <AppCard>
          <PriceSummary
            subtotal={subtotal}
            deliveryFee={option.fee}
            total={total}
            note={payingByCard ? 'Your card will be charged when the order is confirmed.' : undefined}
          />
        </AppCard>

        <View className="flex-row items-center justify-center mt-4 mb-2">
          <MaterialCommunityIcons name="shield-check-outline" size={14} color={colors.ok} />
          <Text className="text-ink-3 text-xs ml-1.5">
            Secured checkout · demo mode, no real charge.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
