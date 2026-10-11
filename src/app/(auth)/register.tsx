import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Keyboard, Pressable, Text, View } from 'react-native';

import { AppButton, ControlledCheckbox, ControlledInput, ScreenContainer, ScreenHeaderCard } from '@/components';
import { colors } from '@/theme';
import type { Role } from '@/types';
import { cn } from '@/utils';
import { registerSchema, type RegisterValues } from '@/validation/schemas';
import { useRegister } from '@/services/mutations';

const ROLES: { value: Role; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { value: 'contractor', label: 'Contractor', icon: 'account-hard-hat' },
  { value: 'driver', label: 'Driver', icon: 'truck-outline' },
];

export default function Register() {
  const params = useLocalSearchParams<{ role?: string }>();
  const initialRole: Role = params.role === 'driver' ? 'driver' : 'contractor';

  const { mutate: register, isPending } = useRegister();

  const { control, handleSubmit, watch, setValue } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole,
      company: '',
      vehicle: '',
      contactName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as unknown as true,
    },
  });
  const role = watch('role');

  const onSubmit = (values: RegisterValues) => {
    register(
      {
        role: values.role,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        ...(values.role === 'contractor'
          ? { company: values.company }
          : { vehicle: values.vehicle }),
      },
      { onSuccess: () => router.replace('/(auth)/register-success') },
    );
  };

  return (
    <ScreenContainer scroll keyboardAvoiding padded={false} contentClassName="pb-36">
      <View className="flex-1">
        <ScreenHeaderCard
          title="Create Account"
          subtitle={role === 'driver' ? 'Sign up as a GOODR driver' : 'Apply for a GOODR contractor account'}
        />

        <View className="px-5 mt-5">
          {/* Role selector — matches the login screen */}
          <Text className="text-ink-1 text-[13px] font-semibold mb-2">I am a…</Text>
          <View className="flex-row bg-card rounded-2xl p-1 border border-hair mb-4">
            {ROLES.map((r) => {
              const active = role === r.value;
              return (
                <Pressable
                  key={r.value}
                  onPress={() => setValue('role', r.value)}
                  className={cn('flex-1 flex-row items-center justify-center py-3 rounded-xl', active ? 'bg-heat' : '')}
                >
                  <MaterialCommunityIcons name={r.icon} size={18} color={active ? colors.white : colors.ink2} />
                  <Text className={cn('ml-2 font-semibold', active ? 'text-white' : 'text-ink-2')}>{r.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View className="rounded-card bg-card border border-hair p-4 gap-1">
            {role === 'contractor' ? (
              <ControlledInput control={control} name="company" label="Company name" icon="office-building-outline" placeholder="Summit Comfort Systems" returnKeyType="next" />
            ) : (
              <ControlledInput control={control} name="vehicle" label="Vehicle (optional)" icon="truck-outline" placeholder="Isuzu NPR Box Truck" returnKeyType="next" />
            )}
            <ControlledInput control={control} name="contactName" label={role === 'driver' ? 'Full name' : 'Contact name'} icon="account-outline" placeholder="Full name" returnKeyType="next" />
            <ControlledInput control={control} name="email" label="Email" icon="email-outline" placeholder="you@company.com" keyboardType="email-address" autoCapitalize="none" returnKeyType="next" />
            <ControlledInput control={control} name="phone" label="Phone" icon="phone-outline" placeholder="(303) 555-0100" keyboardType="phone-pad" returnKeyType="next" />
            <ControlledInput control={control} name="password" label="Password" icon="lock-outline" placeholder="At least 8 characters" secureToggle autoCapitalize="none" returnKeyType="next" />
            <ControlledInput control={control} name="confirmPassword" label="Confirm password" icon="lock-check-outline" placeholder="Re-enter your password" secureToggle autoCapitalize="none" returnKeyType="done" onSubmitEditing={handleSubmit(onSubmit)} />

            <View className="mt-3">
              <ControlledCheckbox
                control={control}
                name="acceptTerms"
                label={
                  role === 'driver'
                    ? 'I agree to the GOODR Terms of Service and Privacy Policy.'
                    : 'I agree to the GOODR Terms of Service and Privacy Policy, and confirm I represent a licensed HVAC business.'
                }
              />
            </View>

            <View className="mt-4">
              <AppButton
                label={role === 'driver' ? 'Create driver account' : 'Request account'}
                icon="account-plus-outline"
                loading={isPending}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-ink-2 text-[13px]">Already have an account? </Text>
            <Text
              className="text-heat text-[13px] font-bold"
              onPress={() => router.replace(`/(auth)/login?role=${role}`)}
            >
              Sign in
            </Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
