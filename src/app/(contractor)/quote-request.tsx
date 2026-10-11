import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import {
  AppButton,
  ControlledChips,
  ControlledDateField,
  ControlledInput,
  PhotoUploadBox,
  ScreenContainer,
  ScreenHeaderCard,
} from '@/components';
import {
  BRANDS,
  QUOTE_COIL_WIDTHS,
  QUOTE_DELIVERY_TYPES,
  QUOTE_EFFICIENCY_FUEL,
  QUOTE_FURNACE_BTU,
  QUOTE_SYSTEM_TYPES,
  QUOTE_TONNAGES,
  QUOTE_URGENCY,
} from '@/constants';
import { useSubmitQuote } from '@/services/mutations';
import { quoteRequestSchema, type QuoteRequestValues } from '@/validation/schemas';

const opts = (arr: readonly string[]) => arr.map((v) => ({ label: v, value: v }));

function GroupLabel({ title, hint }: { title: string; hint?: string }) {
  return (
    <View className="mt-4 mb-2">
      <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide">{title}</Text>
      {hint ? <Text className="text-ink-3 text-[11px] mt-0.5">{hint}</Text> : null}
    </View>
  );
}

export default function QuoteRequest() {
  const params = useLocalSearchParams<{ systemType?: string; brand?: string }>();
  const { mutate, isPending } = useSubmitQuote();
  const [attachments, setAttachments] = useState<string[]>([]);

  const { control, handleSubmit, watch } = useForm<QuoteRequestValues>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      systemType: params.systemType ?? '',
      brandPreference: params.brand ?? '',
      tonnage: '',
      furnaceBtu: '',
      coilWidth: '',
      efficiencyFuel: '',
      quantity: 1,
      jobSite: '',
      needDelivery: 'Yes',
      deliveryType: '',
      urgency: '',
      neededBy: '',
      notes: '',
    },
  });

  const needDelivery = watch('needDelivery');
  const urgency = watch('urgency');

  const onSubmit = (values: QuoteRequestValues) =>
    mutate(
      { input: values, attachments },
      { onSuccess: (quote) => router.replace(`/(contractor)/quote-submitted?id=${quote.id}`) },
    );

  return (
    <ScreenContainer
      scroll
      keyboardAvoiding
      padded={false}
      footer={
        <AppButton
          label="Submit equipment request"
          icon="file-send-outline"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <ScreenHeaderCard
        title="Equipment Request"
        subtitle="Tell us what you need — we’ll quote Goodman, Daikin & Amana"
      />

      <View className="px-5">
        <GroupLabel title="System Type" />
        <ControlledChips control={control} name="systemType" options={opts(QUOTE_SYSTEM_TYPES)} />

        <GroupLabel title="Preferred Brand" hint="We carry Goodman, Daikin & Amana only" />
        <ControlledChips control={control} name="brandPreference" options={opts(BRANDS)} />

        <GroupLabel title="Size / Tonnage" hint="Condenser / Heat Pump" />
        <ControlledChips control={control} name="tonnage" options={opts(QUOTE_TONNAGES)} />

        <GroupLabel title="Furnace BTU" />
        <ControlledChips control={control} name="furnaceBtu" options={opts(QUOTE_FURNACE_BTU)} />

        <GroupLabel title="Coil Width" />
        <ControlledChips control={control} name="coilWidth" options={opts(QUOTE_COIL_WIDTHS)} />

        <GroupLabel title="Efficiency / Fuel" />
        <ControlledChips control={control} name="efficiencyFuel" options={opts(QUOTE_EFFICIENCY_FUEL)} />

        <View className="h-px bg-hair my-5" />

        <ControlledInput
          control={control}
          name="quantity"
          label="Quantity"
          icon="numeric"
          placeholder="1"
          keyboardType="number-pad"
        />
        <ControlledInput
          control={control}
          name="jobSite"
          label="Job site address"
          icon="map-marker-outline"
          placeholder="1200 Corporate Blvd, Denver, CO"
        />

        <GroupLabel title="Delivery Info" />
        <Text className="text-ink-1 text-[13px] font-semibold mb-2">Need delivery?</Text>
        <ControlledChips
          control={control}
          name="needDelivery"
          options={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]}
        />

        {needDelivery === 'Yes' ? (
          <>
            <Text className="text-ink-1 text-[13px] font-semibold mb-2 mt-3">Delivery type</Text>
            <ControlledChips control={control} name="deliveryType" options={opts(QUOTE_DELIVERY_TYPES)} />

            <Text className="text-ink-1 text-[13px] font-semibold mb-2 mt-3">Urgency</Text>
            <ControlledChips control={control} name="urgency" options={opts(QUOTE_URGENCY)} />

            {urgency === 'Scheduled Date' ? (
              <View className="mt-2">
                <ControlledDateField control={control} name="neededBy" label="Scheduled date" />
              </View>
            ) : null}
          </>
        ) : null}

        <GroupLabel title="Notes / Special Request" />
        <ControlledInput
          control={control}
          name="notes"
          placeholder="e.g. Need 3-ton heat pump with matching air handler, 10kW heat kit, delivered to Cherry Hill tomorrow morning."
          multiline
        />

        <View className="mt-3 mb-2">
          <PhotoUploadBox value={attachments} onChange={setAttachments} label="Attachments (optional)" max={3} />
        </View>
      </View>
    </ScreenContainer>
  );
}
