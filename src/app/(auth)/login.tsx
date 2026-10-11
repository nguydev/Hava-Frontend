import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, Pressable, Text, View } from 'react-native';

import { AppButton, ControlledInput, Reveal, ScreenContainer, ScreenHeaderCard } from '@/components';
import { colors } from '@/theme';
import { toast } from '@/store/zustand';
import type { Role } from '@/types';
import { cn, withAlpha } from '@/utils';
import { loginSchema, type LoginValues } from '@/validation/schemas';
import { useLogin } from '@/services/mutations';

const ROLES: { value: Role; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { value: 'contractor', label: 'Contractor', icon: 'account-hard-hat' },
  { value: 'driver', label: 'Driver', icon: 'truck-outline' },
];

const SOCIALS: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; color: string }[] = [
  { icon: 'google', label: 'Google', color: '#EA4335' },
  { icon: 'apple', label: 'Apple', color: colors.ink0 },
  { icon: 'instagram', label: 'Instagram', color: '#E1306C' },
];

export default function Login() {
  const params = useLocalSearchParams<{ role?: string }>();
  const initialRole: Role = params.role === 'driver' ? 'driver' : 'contractor';
  
  const { mutate: login, isPending } = useLogin();

  const [remember, setRemember] = useState(true);

  const { control, handleSubmit, watch, setValue } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', role: initialRole },
  });
  const role = watch('role');

  const onSubmit = (values: LoginValues) => {
    // On success the auth store is populated and the root guard redirects home.
    login(values);
  };

  return (
    <ScreenContainer scroll keyboardAvoiding padded={false} contentClassName="pb-28">
      <View className="flex-1">
        <ScreenHeaderCard title="Welcome Back!" subtitle="Sign in to your GOODR account" />

        <View className="px-5">
          <Reveal index={1}>
            <View className="mt-5">
              <Text className="text-ink-1 text-[13px] font-semibold mb-2">I am a…</Text>
              <View className="flex-row bg-card rounded-2xl p-1 border border-hair">
                {ROLES.map((r) => {
                  const active = role === r.value;
                  return (
                    <Pressable
                      key={r.value}
                      onPress={() => setValue('role', r.value)}
                      className={cn(
                        'flex-1 flex-row items-center justify-center py-3 rounded-xl',
                        active ? 'bg-heat' : '',
                      )}
                    >
                      <MaterialCommunityIcons
                        name={r.icon}
                        size={18}
                        color={active ? colors.white : colors.ink2}
                      />
                      <Text className={cn('ml-2 font-semibold', active ? 'text-white' : 'text-ink-2')}>
                        {r.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Reveal>

          <Reveal index={2}>
            <View className="mt-5 rounded-card bg-card border border-hair p-4">
              <ControlledInput
                control={control}
                name="email"
                label="Email"
                icon="email-outline"
                placeholder="you@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
              <ControlledInput
                control={control}
                name="password"
                label="Password"
                icon="lock-outline"
                placeholder="Enter your password"
                secureToggle
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />

              <View className="flex-row items-center justify-between mt-1 mb-4">
                <Pressable
                  onPress={() => setRemember((v) => !v)}
                  hitSlop={8}
                  className="flex-row items-center"
                >
                  <View
                    className="w-5 h-5 rounded-md items-center justify-center mr-2"
                    style={{
                      backgroundColor: remember ? colors.heat : 'transparent',
                      borderWidth: 1.5,
                      borderColor: remember ? colors.heat : colors.hair,
                    }}
                  >
                    {remember ? (
                      <MaterialCommunityIcons name="check-bold" size={12} color={colors.white} />
                    ) : null}
                  </View>
                  <Text className="text-ink-2 text-[13px]">Remember me</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/(auth)/forgot-password')} hitSlop={8}>
                  <Text className="text-heat text-[13px] font-semibold">Forgot Password?</Text>
                </Pressable>
              </View>

              <AppButton label="Login" loading={isPending} onPress={handleSubmit(onSubmit)} />

              <View className="flex-row items-center justify-center mt-4">
                <Text className="text-ink-2 text-[13px]">Don’t have an account? </Text>
                <Pressable onPress={() => router.push('/(auth)/register')} hitSlop={8}>
                  <Text className="text-heat text-[13px] font-bold">Register</Text>
                </Pressable>
              </View>
            </View>
          </Reveal>

          <Reveal index={3}>
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-hair" />
              <Text className="text-ink-3 text-xs mx-3">Or continue with</Text>
              <View className="flex-1 h-px bg-hair" />
            </View>

            <View className="flex-row gap-3">
              {SOCIALS.map((s) => (
                <Pressable
                  key={s.label}
                  onPress={() => toast.info(`${s.label} sign-in arrives in the full release.`)}
                  className="flex-1 items-center justify-center rounded-2xl bg-card border border-hair py-3.5"
                  style={{ backgroundColor: withAlpha(s.color, 0.08) }}
                >
                  <MaterialCommunityIcons name={s.icon} size={24} color={s.color} />
                </Pressable>
              ))}
            </View>
          </Reveal>

          <View className="flex-row items-center justify-center mt-6 bg-card rounded-xl border border-hair px-3 py-2.5">
            <MaterialCommunityIcons name="information-outline" size={15} color={colors.ink3} />
            <Text className="text-ink-3 text-xs ml-2">Demo: use any email & password to sign in.</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
