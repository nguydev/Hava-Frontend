import { router } from 'expo-router';

import { AppButton, EmptyState, ScreenContainer } from '@/components';

export default function NotFound() {
  return (
    <ScreenContainer>
      <EmptyState
        icon="compass-off-outline"
        title="Screen not found"
        message="The page you’re looking for doesn’t exist or has moved."
      />
      <AppButton label="Go home" icon="home-outline" onPress={() => router.replace('/')} />
    </ScreenContainer>
  );
}
