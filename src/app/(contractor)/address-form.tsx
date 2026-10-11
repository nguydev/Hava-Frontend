import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import {
  AppButton,
  ControlledInput,
  ControlledSwitch,
  Header,
  ScreenContainer,
} from '@/components';
import { useSaveAddress } from '@/services/mutations';
import { useAddresses } from '@/services/queries';
import { addressSchema, type AddressValues } from '@/validation/schemas';

export default function AddressForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: addresses } = useAddresses();
  const editing = addresses?.find((a) => a.id === id);
  const { mutate, isPending } = useSaveAddress();

  const { control, handleSubmit } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: editing?.label ?? '',
      line1: editing?.line1 ?? '',
      city: editing?.city ?? '',
      state: editing?.state ?? '',
      zip: editing?.zip ?? '',
      contactName: editing?.contactName ?? '',
      contactPhone: editing?.contactPhone ?? '',
      isDefault: editing?.isDefault ?? false,
    },
  });

  const onSubmit = (values: AddressValues) =>
    mutate({ ...values, id: editing?.id }, { onSuccess: () => router.back() });

  return (
    <ScreenContainer
      scroll
      keyboardAvoiding
      padded={false}
      footer={
        <AppButton
          label={editing ? 'Save changes' : 'Add job site'}
          icon="content-save-outline"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <Header title={editing ? 'Edit job site' : 'Add job site'} />

      <View className="px-5 gap-1">
        <ControlledInput control={control} name="label" label="Site name" icon="tag-outline" placeholder="Maple Ridge Residence" />
        <ControlledInput control={control} name="line1" label="Street address" icon="map-marker-outline" placeholder="2841 Maple Ridge Dr" />
        <View className="flex-row gap-3">
          <View className="flex-[2]">
            <ControlledInput control={control} name="city" label="City" placeholder="Aurora" />
          </View>
          <View className="flex-1">
            <ControlledInput control={control} name="state" label="State" placeholder="CO" autoCapitalize="characters" maxLength={2} />
          </View>
          <View className="flex-1">
            <ControlledInput control={control} name="zip" label="ZIP" placeholder="80013" keyboardType="number-pad" maxLength={5} />
          </View>
        </View>
        <ControlledInput control={control} name="contactName" label="Contact name" icon="account-outline" placeholder="Full name" />
        <ControlledInput control={control} name="contactPhone" label="Contact phone" icon="phone-outline" placeholder="(303) 555-0100" keyboardType="phone-pad" />

        <View className="rounded-2xl bg-card border border-hair px-3.5 mt-2">
          <ControlledSwitch
            control={control}
            name="isDefault"
            label="Set as default job site"
            icon="star-outline"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
