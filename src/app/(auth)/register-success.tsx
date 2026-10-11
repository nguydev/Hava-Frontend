import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { AppButton, Reveal, ScreenContainer, SuccessCheck } from '@/components';
import { APP } from '@/constants';

export default function RegisterSuccess() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center px-4">
        <SuccessCheck />
        <Reveal index={1}>
          <Text className="text-ink-0 text-2xl font-extrabold text-center mt-6">
            Account requested
          </Text>
          <Text className="text-ink-2 text-[15px] text-center mt-3 leading-6">
            Thanks for signing up. Our team reviews new contractor accounts within one business day.
            You’ll get an email once you’re approved and can start ordering.
          </Text>
        </Reveal>
      </View>
      <Reveal index={2}>
        <View className="gap-3 pb-2">
          <AppButton
            label="Back to sign in"
            icon="login"
            onPress={() => router.replace('/(auth)/login?role=contractor')}
          />
          <Text className="text-ink-3 text-xs text-center">
            Questions? Email {APP.supportEmail}
          </Text>
        </View>
      </Reveal>
    </ScreenContainer>
  );
}
