import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type Glyph = keyof typeof MaterialCommunityIcons.glyphMap;

const icon = (active: Glyph, inactive: Glyph) => {
  const TabIcon = ({ color, size, focused }: { color: any; size: number; focused: boolean }) => (
    <MaterialCommunityIcons name={focused ? active : inactive} size={size} color={color} />
  );
  TabIcon.displayName = `TabIcon(${active})`;
  return TabIcon;
};

export default function DriverTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        sceneStyle: { backgroundColor: colors.bg },
        headerShown: false,
        tabBarActiveTintColor: colors.heat,
        tabBarInactiveTintColor: colors.ink3,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.hair,
          borderTopWidth: 1,
          height: 62 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon: icon('view-dashboard', 'view-dashboard-outline') }} />
      <Tabs.Screen name="deliveries" options={{ title: 'Deliveries', tabBarIcon: icon('truck', 'truck-outline') }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: icon('history', 'history') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('account', 'account-outline') }} />
    </Tabs>
  );
}
