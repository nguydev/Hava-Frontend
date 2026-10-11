import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import {
  AppButton,
  ControlledInput,
  ControlledSwitch,
  ScreenContainer,
  ScreenHeaderCard,
} from '@/components';
import { useAddPaymentMethod } from '@/services/mutations';
import { colors } from '@/theme';
import { addCardSchema, type AddCardValues } from '@/validation/schemas';

const formatCardNumber = (v: string) =>
  v
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

export default function AddCard() {
  const { mutate, isPending } = useAddPaymentMethod();

  const { control, handleSubmit, setValue } = useForm<AddCardValues>({
    resolver: zodResolver(addCardSchema),
    defaultValues: { holder: '', number: '', expiry: '', cvc: '', isDefault: false },
  });

  const onSubmit = (values: AddCardValues) => {
    const [mm, yy] = values.expiry.split('/').map((s) => s.trim());
    mutate(
      {
        holder: values.holder,
        number: values.number,
        expMonth: Number(mm),
        expYear: 2000 + Number(yy),
        cvc: values.cvc,
        isDefault: values.isDefault,
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <ScreenContainer
      scroll
      keyboardAvoiding
      padded={false}
      footer={
        <AppButton
          label="Save card"
          icon="lock-check-outline"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <ScreenHeaderCard title="Add Card" subtitle="Securely save a payment method" />

      <View className="px-5 mt-5">
        <View className="rounded-card bg-card border border-hair p-4">
          <ControlledInput
            control={control}
            name="holder"
            label="Cardholder name"
            icon="account-outline"
            placeholder="Name on card"
            autoCapitalize="words"
          />
          <ControlledInput
            control={control}
            name="number"
            label="Card number"
            icon="credit-card-outline"
            placeholder="1234 5678 9012 3456"
            keyboardType="number-pad"
            maxLength={23}
            onChangeText={(t) => setValue('number', formatCardNumber(t))}
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <ControlledInput
                control={control}
                name="expiry"
                label="Expiry"
                icon="calendar-month-outline"
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
                onChangeText={(t) => setValue('expiry', formatExpiry(t))}
              />
            </View>
            <View className="flex-1">
              <ControlledInput
                control={control}
                name="cvc"
                label="CVC"
                icon="shield-lock-outline"
                placeholder="123"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <View className="rounded-2xl bg-card-2 border border-hair px-3.5 mt-2">
            <ControlledSwitch
              control={control}
              name="isDefault"
              label="Set as default"
              description="Use this card for future checkouts"
              icon="star-outline"
            />
          </View>
        </View>

        <View className="flex-row items-center justify-center mt-4">
          <MaterialCommunityIcons name="lock-outline" size={14} color={colors.ink3} />
          <Text className="text-ink-3 text-xs ml-1.5">
            Demo only — no real card is stored or charged.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
