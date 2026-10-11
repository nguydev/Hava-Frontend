import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { AppButton, Reveal, ScreenContainer, SuccessCheck } from '@/components';
import { useOrderDetails } from '@/services/queries';
import { colors } from '@/theme';
import { formatCurrency } from '@/utils';

export default function OrderConfirmation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order } = useOrderDetails(id);
  const paid = order?.payment?.status === 'Paid';

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center px-4">
        <SuccessCheck color={colors.brandCyan} />
        <Reveal index={1}>
          <Text className="text-ink-0 text-2xl font-extrabold text-center mt-6">
            {paid ? 'Order placed & paid' : 'Order placed'}
          </Text>
          <Text className="text-ink-2 text-[15px] text-center mt-2 leading-6">
            {paid
              ? 'Payment received. We’ll confirm and schedule your delivery shortly.'
              : 'Your order was received. We’ll confirm and schedule it shortly.'}
          </Text>
        </Reveal>

        <Reveal index={2}>
          <View className="bg-card border border-hair rounded-card px-6 py-4 mt-6 items-center">
            <Text className="text-ink-3 text-xs uppercase tracking-wide">Order number</Text>
            <Text className="text-2xl font-extrabold mt-1" style={{ color: colors.brandCyan }}>
              #{id}
            </Text>
          </View>

          {order?.payment ? (
            <View className="flex-row items-center justify-center mt-4">
              <MaterialCommunityIcons
                name={paid ? 'credit-card-check-outline' : 'file-document-outline'}
                size={15}
                color={colors.ink2}
              />
              <Text className="text-ink-2 text-[13px] ml-1.5">
                {order.payment.method}
                {order.total ? ` · ${formatCurrency(order.total)}` : ''}
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center justify-center mt-4">
              <Text className="text-ink-2 text-[13px]">Estimated confirmation: </Text>
              <Text className="text-ink-0 text-[13px] font-semibold">within 1 hour</Text>
            </View>
          )}
        </Reveal>
      </View>

      <Reveal index={3}>
        <View className="gap-3 pb-2">
          <AppButton
            label="Track order"
            icon="map-marker-path"
            onPress={() => router.replace(`/(contractor)/track/${id}`)}
          />
          <AppButton
            label="Back to home"
            variant="outline"
            onPress={() => router.replace('/(contractor)/(tabs)/home')}
          />
        </View>
      </Reveal>
    </ScreenContainer>
  );
}
