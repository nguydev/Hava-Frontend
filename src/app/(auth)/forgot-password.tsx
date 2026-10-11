import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import {
  AppButton,
  ControlledInput,
  Reveal,
  ScreenContainer,
  ScreenHeaderCard,
  SuccessCheck,
} from '@/components';
import { useForgotPassword, useVerifyOtp, useResetPassword } from '@/services/mutations';
import { toast } from '@/store/zustand';
import { colors } from '@/theme';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/validation/schemas';

type Step = 'email' | 'otp' | 'verified' | 'reset' | 'done';

const OTP_LEN = 5;

/* -------------------------------- OTP input ------------------------------- */

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(TextInput | null)[]>([]);
  const digits = Array.from({ length: OTP_LEN }, (_, i) => value[i] ?? '');

  const setAt = (i: number, d: string) => {
    const clean = d.replace(/[^0-9]/g, '').slice(-1);
    const next = digits.slice();
    next[i] = clean;
    onChange(next.join(''));
    if (clean && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, key: string) => {
    if (key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <View className="flex-row justify-between">
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(r) => {
            refs.current[i] = r;
          }}
          value={d}
          onChangeText={(t) => setAt(i, t)}
          onKeyPress={(e) => onKey(i, e.nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          selectionColor={colors.brandBlue}
          className="text-center text-[22px] font-extrabold"
          style={{
            width: 54,
            height: 60,
            borderRadius: 14,
            backgroundColor: colors.white,
            color: colors.black,
            borderWidth: 2,
            borderColor: d ? colors.brandBlue : 'transparent',
          }}
        />
      ))}
    </View>
  );
}

/* -------------------------------- reset form ------------------------------ */

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type ResetValues = z.infer<typeof resetSchema>;

/* --------------------------------- screen --------------------------------- */

export default function ForgotPassword() {
  const { mutate: sendCode, isPending: sending } = useForgotPassword();
  const { mutate: verifyOtpMutation, isPending: verifying } = useVerifyOtp();
  const { mutate: resetPasswordMutation, isPending: resetting } = useResetPassword();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const emailForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const submitEmail = (values: ForgotPasswordValues) =>
    sendCode(values.email, {
      onSuccess: () => {
        setEmail(values.email);
        toast.success('OTP sent successfully! Redirecting…');
        setTimeout(() => setStep('otp'), 900);
      },
    });

  const verifyOtp = () => {
    if (otp.length < OTP_LEN) {
      toast.error(`Enter the ${OTP_LEN}-digit code.`);
      return;
    }
    verifyOtpMutation(
      { email, code: otp },
      { onSuccess: () => setStep('verified') },
    );
  };

  const submitReset = (values: ResetValues) => {
    resetPasswordMutation(
      { email, otp, newPassword: values.password },
      { onSuccess: () => setStep('done') },
    );
  };

  /* ---- done ---- */
  if (step === 'done') {
    return (
      <ScreenContainer padded={false}>
        <ScreenHeaderCard title="All set" subtitle="Password Reset Successful" showBack={false} />
        <View className="flex-1 items-center justify-center px-6">
          <SuccessCheck color={colors.brandCyan} />
          <Reveal index={1}>
            <Text className="text-ink-0 text-2xl font-extrabold text-center mt-6">
              Password Reset Successful
            </Text>
            <Text className="text-ink-2 text-[15px] text-center mt-3 leading-6">
              You can now login with your new password.
            </Text>
          </Reveal>
        </View>
        <View className="px-5">
          <AppButton
            label="Go to Login"
            onPress={() => router.replace('/(auth)/login?role=contractor')}
          />
        </View>
      </ScreenContainer>
    );
  }

  /* ---- verified interstitial ---- */
  if (step === 'verified') {
    return (
      <ScreenContainer padded={false}>
        <ScreenHeaderCard
          title="OTP Verified"
          subtitle="OTP Verification Successful"
          onBack={() => setStep('otp')}
        />
        <View className="flex-1 items-center justify-center px-6">
          <SuccessCheck color={colors.brandCyan} />
          <Reveal index={1}>
            <Text className="text-ink-0 text-2xl font-extrabold text-center mt-6">
              OTP Verification Successful
            </Text>
            <Text className="text-ink-2 text-[15px] text-center mt-3 leading-6">
              You can now reset your password.
            </Text>
          </Reveal>
        </View>
        <View className="px-5">
          <AppButton label="Go to Password Reset" onPress={() => setStep('reset')} />
        </View>
      </ScreenContainer>
    );
  }

  /* ---- reset ---- */
  if (step === 'reset') {
    return (
      <ScreenContainer scroll keyboardAvoiding padded={false} contentClassName="pb-28">
        <ScreenHeaderCard
          title="Reset Password"
          subtitle="Create a new password for your account"
          onBack={() => setStep('verified')}
        />
        <View className="px-5 mt-5">
          <View className="rounded-card bg-card border border-hair p-4">
            <ControlledInput
              control={resetForm.control}
              name="password"
              label="New password"
              icon="lock-outline"
              placeholder="At least 8 characters"
              secureToggle
              autoCapitalize="none"
            />
            <ControlledInput
              control={resetForm.control}
              name="confirmPassword"
              label="Confirm password"
              icon="lock-check-outline"
              placeholder="Re-enter your password"
              secureToggle
              autoCapitalize="none"
            />
            <View className="mt-3">
              <AppButton
                label="Reset Password"
                loading={resetting}
                onPress={resetForm.handleSubmit(submitReset)}
              />
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  /* ---- otp ---- */
  if (step === 'otp') {
    return (
      <ScreenContainer scroll keyboardAvoiding padded={false} contentClassName="pb-28">
        <ScreenHeaderCard
          title="OTP Verification"
          subtitle={`Enter the OTP sent to ${email || 'your email'} to reset your password`}
          onBack={() => setStep('email')}
        />
        <View className="px-5 mt-5">
          <View className="rounded-card bg-card border border-hair p-4">
            <OtpInput value={otp} onChange={setOtp} />
            <View className="mt-5">
              <AppButton label="Verify OTP" loading={verifying} onPress={verifyOtp} />
            </View>
            <Pressable
              onPress={() =>
                sendCode(email, {
                  onSuccess: () => toast.success('A new code has been sent.'),
                })
              }
              hitSlop={8}
              className="items-center mt-4"
            >
              <Text className="text-heat text-[13px] font-semibold">Resend OTP</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace('/(auth)/login?role=contractor')}
              hitSlop={8}
              className="items-center mt-3"
            >
              <Text className="text-heat text-[13px] font-semibold">Back to Login</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center justify-center mt-4">
            <MaterialCommunityIcons name="information-outline" size={14} color={colors.ink3} />
            <Text className="text-ink-3 text-xs ml-1.5">Demo: enter any 5 digits to continue.</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  /* ---- email ---- */
  return (
    <ScreenContainer scroll keyboardAvoiding padded={false} contentClassName="pb-28">
      <ScreenHeaderCard
        title="Forget Password"
        subtitle="Enter your email address and we’ll send you a code to reset your password"
      />
      <View className="px-5 mt-5">
        <View className="rounded-card bg-card border border-hair p-4">
          <ControlledInput
            control={emailForm.control}
            name="email"
            label="Email"
            icon="email-outline"
            placeholder="you@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View className="mt-3">
            <AppButton
              label="Send OTP"
              icon="email-fast-outline"
              loading={sending}
              onPress={emailForm.handleSubmit(submitEmail)}
            />
          </View>
          <Pressable
            onPress={() => router.replace('/(auth)/login?role=contractor')}
            hitSlop={8}
            className="items-center mt-4"
          >
            <Text className="text-heat text-[13px] font-semibold">Back to Login</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
