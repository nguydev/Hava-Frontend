import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  AppButton,
  ControlledDateField,
  ControlledInput,
  ControlledSelect,
  ControlledSwitch,
  Header,
  PhotoUploadBox,
  ScreenContainer,
} from '@/components';
import { DELIVERY_OPTIONS, TIME_WINDOWS } from '@/constants';
import { useAddresses } from '@/services/queries';
import { useCheckoutStore } from '@/store/zustand';
import { colors } from '@/theme';
import type { Address } from '@/types';
import { formatCurrency } from '@/utils';
import { deliveryRequestSchema, type DeliveryRequestValues } from '@/validation/schemas';

export default function DeliveryRequest() {
  const { data: addresses } = useAddresses();
  const setDetails = useCheckoutStore((s) => s.setDetails);
  const [sitePhotos, setSitePhotos] = useState<string[]>([]);

  const { control, handleSubmit, setValue } = useForm<DeliveryRequestValues>({
    resolver: zodResolver(deliveryRequestSchema),
    defaultValues: {
      jobSiteLabel: '',
      line1: '',
      city: '',
      state: '',
      zip: '',
      contactName: '',
      contactPhone: '',
      preferredDate: '',
      timeWindow: '',
      deliveryOption: 'standard',
      liftgate: false,
      notes: '',
    },
  });

  const applyPreset = (a: Address) => {
    setValue('jobSiteLabel', a.label);
    setValue('line1', a.line1);
    setValue('city', a.city);
    setValue('state', a.state);
    setValue('zip', a.zip);
    setValue('contactName', a.contactName);
    setValue('contactPhone', a.contactPhone);
  };

  const onSubmit = (values: DeliveryRequestValues) => {
    setDetails(values, sitePhotos);
    router.push('/(contractor)/order-review');
  };

  return (
    <ScreenContainer
      scroll
      keyboardAvoiding
      padded={false}
      footer={
        <AppButton label="Review request" iconRight="arrow-right" onPress={handleSubmit(onSubmit)} />
      }
    >
      <Header title="Delivery request" subtitle="Where should we deliver?" />

      <View className="px-5">
        {addresses && addresses.length > 0 ? (
          <View className="mb-4">
            <Text className="text-ink-1 text-[13px] font-semibold mb-2">Use a saved job site</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {addresses.map((a) => (
                <Pressable
                  key={a.id}
                  onPress={() => applyPreset(a)}
                  className="rounded-2xl bg-card border border-hair px-3.5 py-2.5 max-w-[220px]"
                >
                  <Text className="text-ink-0 text-[13px] font-semibold" numberOfLines={1}>
                    {a.label}
                  </Text>
                  <Text className="text-ink-2 text-[11px] mt-0.5" numberOfLines={1}>
                    {a.line1}, {a.city}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mb-2">
          Job site
        </Text>
        <ControlledInput control={control} name="jobSiteLabel" label="Site name" icon="tag-outline" placeholder="Maple Ridge Residence" />
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

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mb-2 mt-3">
          On-site contact
        </Text>
        <ControlledInput control={control} name="contactName" label="Contact name" icon="account-outline" placeholder="Full name" />
        <ControlledInput control={control} name="contactPhone" label="Phone number" icon="phone-outline" placeholder="(303) 555-0100" keyboardType="phone-pad" />

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mb-2 mt-3">
          Schedule
        </Text>
        <ControlledDateField control={control} name="preferredDate" label="Preferred delivery date" />
        <ControlledSelect
          control={control}
          name="timeWindow"
          label="Preferred time window"
          icon="clock-outline"
          placeholder="Select a window"
          options={TIME_WINDOWS.map((w) => ({ label: w, value: w }))}
        />
        <ControlledSelect
          control={control}
          name="deliveryOption"
          label="Delivery option"
          icon="truck-fast-outline"
          options={DELIVERY_OPTIONS.map((o) => ({
            label: `${o.label} · ${o.fee === 0 ? 'Free' : formatCurrency(o.fee)}`,
            value: o.id,
            description: o.hint,
          }))}
        />

        <View className="rounded-2xl bg-card border border-hair px-3.5 mt-2 mb-2">
          <ControlledSwitch
            control={control}
            name="liftgate"
            label="Liftgate required"
            description="Needed for curbside unloading of heavy equipment"
            icon="forklift"
          />
        </View>

        <View className="mt-1">
          <ControlledInput
            control={control}
            name="notes"
            label="Delivery notes (optional)"
            placeholder="Gate codes, access instructions, where to unload…"
            multiline
          />
        </View>

        <View className="mt-3">
          <PhotoUploadBox value={sitePhotos} onChange={setSitePhotos} label="Site photos (optional)" max={3} />
        </View>

        <View className="flex-row items-center mt-3 mb-2">
          <Text className="text-ink-3 text-xs" style={{ color: colors.ink3 }}>
            You’ll review everything before submitting.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
