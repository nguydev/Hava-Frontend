import { Stack } from 'expo-router';

import { colors } from '@/theme';

export default function DriverLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="eta-update" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
