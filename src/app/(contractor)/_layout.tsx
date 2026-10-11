import { Stack } from 'expo-router';

import { colors } from '@/theme';

export default function ContractorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="cart" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
