import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/zustand';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  if (!isAuthenticated) return <Redirect href="/(auth)/welcome" />;
  return (
    <Redirect href={role === 'driver' ? '/(driver)/(tabs)/today' : '/(contractor)/(tabs)/home'} />
  );
}
