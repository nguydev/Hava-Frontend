import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useController, useForm } from 'react-hook-form';
import { View } from 'react-native';

import {
  AppButton,
  ControlledInput,
  ControlledSelect,
  Header,
  PhotoUploadBox,
  ScreenContainer,
} from '@/components';
import { DELIVERY_ISSUE_TYPES } from '@/constants';
import { useReportDeliveryIssue } from '@/services/mutations';
import { toast } from '@/store/zustand';
import { deliveryIssueSchema, type DeliveryIssueValues } from '@/validation/schemas';

export default function DeliveryIssue() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutate, isPending } = useReportDeliveryIssue();

  const { control, handleSubmit } = useForm<DeliveryIssueValues>({
    resolver: zodResolver(deliveryIssueSchema),
    defaultValues: { type: undefined as unknown as DeliveryIssueValues['type'], notes: '', photos: [] },
  });

  const photos = useController({ control, name: 'photos' });

  const onSubmit = (values: DeliveryIssueValues) =>
    mutate(
      { id, input: values },
      {
        onSuccess: () => {
          toast.success('Issue reported to dispatch');
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
          label="Submit issue report"
          icon="alert-outline"
          variant="danger"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <Header title="Report an issue" subtitle={`Delivery #${id}`} />

      <View className="px-5 gap-1">
        <ControlledSelect
          control={control}
          name="type"
          label="Issue type"
          icon="alert-circle-outline"
          placeholder="Select an issue"
          sheetTitle="What went wrong?"
          options={DELIVERY_ISSUE_TYPES.map((t) => ({ label: t, value: t }))}
        />
        <ControlledInput
          control={control}
          name="notes"
          label="What happened?"
          placeholder="Describe the issue so dispatch can help (at least 10 characters)…"
          multiline
        />
        <View className="mt-2">
          <PhotoUploadBox
            value={photos.field.value ?? []}
            onChange={photos.field.onChange}
            label="Photos (optional)"
            max={3}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
