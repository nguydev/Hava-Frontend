import '../../global.css';
import '@/lib/nativewind-interop';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { SnackbarHost } from '@/components';
import { queryClient } from '@/lib/queryClient';
import { registerForPushNotificationsAsync } from '@/lib/push';
import { initSentry } from '@/lib/sentry';
import { hydrateStorage } from '@/lib/storage';
import { store } from '@/store';
import { useAuthStore, useCartStore } from '@/store/zustand';
import { colors, paperTheme } from '@/theme';

initSentry();

/**
 * Loads persisted storage (AsyncStorage → in-memory cache) and rehydrates the
 * auth/cart stores BEFORE the app renders, so the auth guard sees the restored
 * session (no logged-out flash on launch).
 */
function useStorageHydration(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    (async () => {
      await hydrateStorage();
      useAuthStore.getState().rehydrate();
      useCartStore.getState().rehydrate();
      if (active) setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);
  return ready;
}

/** Register this device for push once the user is authenticated. */
function usePushRegistration() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) registerForPushNotificationsAsync().catch(() => {});
  }, [isAuthenticated]);
}

/** Redirects users to the correct area based on auth state & role. */
function useAuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    const group = segments[0] as string | undefined;
    const inAuth = group === '(auth)';
    const home = role === 'driver' ? '/(driver)/(tabs)/today' : '/(contractor)/(tabs)/home';

    if (!isAuthenticated) {
      if (group && group !== '(auth)') router.replace('/(auth)/welcome');
      return;
    }

    if (inAuth || !group) {
      if (home) router.replace(home);
      return;
    }
    if (role === 'contractor' && group === '(driver)') router.replace(home);
    if (role === 'driver' && group === '(contractor)') router.replace(home);
  }, [isAuthenticated, role, segments, router]);
}

function RootNavigator() {
  useAuthGuard();
  usePushRegistration();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(contractor)" />
      <Stack.Screen name="(driver)" />
      <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const ready = useStorageHydration();

  // Keep the (dark) splash background until persisted state is loaded.
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <PaperProvider
              theme={paperTheme}
              settings={{
                icon: (props) => (
                  <MaterialCommunityIcons
                    name={props.name as keyof typeof MaterialCommunityIcons.glyphMap}
                    color={props.color}
                    size={props.size}
                  />
                ),
              }}
            >
              <StatusBar style="light" />
              <RootNavigator />
              <SnackbarHost />
            </PaperProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
