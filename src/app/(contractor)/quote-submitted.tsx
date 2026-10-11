import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { AppButton, Reveal, ScreenContainer, SuccessCheck } from '@/components';
import { colors } from '@/theme';

export default function QuoteSubmitted() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center px-4">
        <SuccessCheck color={colors.info} />
        <Reveal index={1}>
          <Text className="text-ink-0 text-2xl font-extrabold text-center mt-6">Quote requested</Text>
          <Text className="text-ink-2 text-[15px] text-center mt-2 leading-6">
            Our team is reviewing your request. We typically respond with pricing within one business
            day.
          </Text>
        </Reveal>

        <Reveal index={2}>
          <View className="bg-card border border-hair rounded-card px-6 py-4 mt-6 items-center">
            <Text className="text-ink-3 text-xs uppercase tracking-wide">Quote reference</Text>
            <Text className="text-info text-2xl font-extrabold mt-1">{id}</Text>
          </View>
        </Reveal>
      </View>

      <Reveal index={3}>
        <View className="gap-3 pb-2">
          <AppButton
            label="View quote"
            icon="file-document-outline"
            onPress={() => router.replace(`/(contractor)/quote/${id}`)}
          />
          <AppButton
            label="Back to quotes"
            variant="outline"
            onPress={() => router.replace('/(contractor)/(tabs)/quotes')}
          />
        </View>
      </Reveal>
    </ScreenContainer>
  );
}
