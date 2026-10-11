import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import {
  AppButton,
  ControlledInput,
  Header,
  PhotoUploadBox,
  ScreenContainer,
} from '@/components';
import { useSubmitProofOfDelivery } from '@/services/mutations';
import { colors } from '@/theme';
import { toast } from '@/store/zustand';
import { withAlpha } from '@/utils';
import { proofOfDeliverySchema, type ProofOfDeliveryValues } from '@/validation/schemas';

export default function ProofOfDelivery() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutate, isPending } = useSubmitProofOfDelivery();
  const [signed, setSigned] = useState(false);

  const { control, handleSubmit } = useForm<ProofOfDeliveryValues>({
    resolver: zodResolver(proofOfDeliverySchema),
    defaultValues: { recipientName: '', notes: '', photos: [] },
  });

  const photos = useController({ control, name: 'photos' });

  const onSubmit = (values: ProofOfDeliveryValues) =>
    mutate(
      { id, input: values },
      {
        onSuccess: () => {
          toast.success('Delivery marked complete');
          router.back();
        },
      },
    );

  return (
    <ScreenContainer
      scroll
      keyboardAvoiding
      padded={false}
      footer={
        <AppButton
          label="Mark as delivered"
          icon="check-decagram"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <Header title="Proof of delivery" subtitle={`Delivery #${id}`} />

      <View className="px-5 gap-1">
        <PhotoUploadBox
          value={photos.field.value}
          onChange={photos.field.onChange}
          label="Delivery photos"
          error={photos.fieldState.error?.message}
          max={4}
        />

        <View className="mt-3">
          <ControlledInput
            control={control}
            name="recipientName"
            label="Received by"
            icon="account-check-outline"
            placeholder="Name of person who received the delivery"
          />
        </View>

        <ControlledInput
          control={control}
          name="notes"
          label="Delivery notes (optional)"
          placeholder="Where items were placed, condition on arrival…"
          multiline
        />

        {/* Signature placeholder */}
        <Text className="text-ink-1 text-[13px] font-semibold mb-1.5 mt-2">Signature</Text>
        <Pressable
          onPress={() => setSigned((s) => !s)}
          className="rounded-2xl border-2 border-dashed items-center justify-center"
          style={{ height: 110, borderColor: signed ? colors.ok : colors.hair, backgroundColor: signed ? withAlpha(colors.ok, 0.08) : 'transparent' }}
        >
          <MaterialCommunityIcons
            name={signed ? 'check-decagram' : 'draw-pen'}
            size={28}
            color={signed ? colors.ok : colors.ink3}
          />
          <Text className={signed ? 'text-ok text-[13px] font-semibold mt-2' : 'text-ink-3 text-[13px] mt-2'}>
            {signed ? 'Signature captured' : 'Tap to capture signature'}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
