import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import {
  AppButton,
  ControlledInput,
  ControlledSelect,
  Header,
  HeaderIconButton,
  ScreenContainer,
} from '@/components';
import { useUpdateETA } from '@/services/mutations';
import { formatClock } from '@/utils';
import { etaUpdateSchema, type EtaUpdateValues } from '@/validation/schemas';

export default function EtaUpdate() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutate, isPending } = useUpdateETA();

  const options = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getTime() + (i + 1) * 15 * 60_000);
      const label = formatClock(d);
      return { label, value: label, description: `In ${(i + 1) * 15} min` };
    });
  }, []);

  const { control, handleSubmit } = useForm<EtaUpdateValues>({
    resolver: zodResolver(etaUpdateSchema),
    defaultValues: { eta: '', note: '' },
  });

  const onSubmit = (values: EtaUpdateValues) =>
    mutate({ id, input: values }, { onSuccess: () => router.back() });

  return (
    <ScreenContainer scroll keyboardAvoiding>
      <Header
        title="Update ETA"
        subtitle={`Delivery #${id}`}
        showBack={false}
        right={<HeaderIconButton icon="close" onPress={() => router.back()} />}
      />
      <View className="mt-2 gap-1">
        <ControlledSelect
          control={control}
          name="eta"
          label="Estimated arrival"
          icon="clock-outline"
          placeholder="Select an arrival time"
          sheetTitle="Estimated arrival time"
          options={options}
        />
        <ControlledInput
          control={control}
          name="note"
          label="Note for the contractor (optional)"
          placeholder="Running a few minutes behind due to traffic…"
          multiline
        />
      </View>
      <View className="mt-5">
        <AppButton
          label="Submit ETA update"
          icon="send"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScreenContainer>
  );
}
