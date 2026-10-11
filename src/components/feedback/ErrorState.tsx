import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';
import { withAlpha } from '@/utils';

import { AppButton } from '../ui/AppButton';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load this right now. Check your connection and try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View
        className="items-center justify-center rounded-full mb-5"
        style={{ width: 92, height: 92, backgroundColor: withAlpha(colors.alert, 0.12) }}
      >
        <MaterialCommunityIcons name="alert-circle-outline" size={44} color={colors.alert} />
      </View>
      <Text className="text-ink-0 text-lg font-bold text-center">{title}</Text>
      <Text className="text-ink-2 text-sm text-center mt-2 leading-5">{message}</Text>
      {onRetry ? (
        <View className="mt-6 w-full max-w-[240px]">
          <AppButton label={retryLabel} icon="refresh" variant="outline" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}
