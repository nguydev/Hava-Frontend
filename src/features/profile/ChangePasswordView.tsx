import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import {
  AppButton,
  ControlledInput,
  ScreenContainer,
  ScreenHeaderCard,
} from '@/components';
import { useChangePassword } from '@/services/mutations';
import { colors } from '@/theme';
import { changePasswordSchema, type ChangePasswordValues } from '@/validation/schemas';

export function ChangePasswordView() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const { control, handleSubmit, reset } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = (values: ChangePasswordValues) => {
    changePassword(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          reset();
          router.back();
        },
      },
    );
  };

  return (
    <ScreenContainer
      scroll
      keyboardAvoiding
      padded={false}
      footer={
        <AppButton
          label="Update password"
          icon="lock-check-outline"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <ScreenHeaderCard title="Change Password" subtitle="Keep your account secure" />

      <View className="px-5 mt-5">
        <View className="rounded-card bg-card border border-hair p-4">
          <ControlledInput
            control={control}
            name="currentPassword"
            label="Current password"
            icon="lock-outline"
            placeholder="Enter current password"
            secureToggle
            autoCapitalize="none"
          />
          <ControlledInput
            control={control}
            name="newPassword"
            label="New password"
            icon="lock-reset"
            placeholder="At least 8 characters"
            secureToggle
            autoCapitalize="none"
          />
          <ControlledInput
            control={control}
            name="confirmPassword"
            label="Confirm new password"
            icon="lock-check-outline"
            placeholder="Re-enter new password"
            secureToggle
            autoCapitalize="none"
          />
        </View>

        <View className="flex-row items-center mt-4">
          <MaterialCommunityIcons name="shield-check-outline" size={14} color={colors.ok} />
          <Text className="text-ink-3 text-xs ml-1.5">
            Use at least 8 characters with a mix of letters and numbers.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
