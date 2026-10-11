import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { colors } from '@/theme';
import { useUIStore, type SnackType } from '@/store/zustand';

const CONFIG: Record<SnackType, { bg: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = {
  success: { bg: colors.ok, icon: 'check-circle' },
  error: { bg: colors.alert, icon: 'alert-circle' },
  warning: { bg: colors.amber, icon: 'alert' },
  info: { bg: colors.card2, icon: 'information' },
};

/** Global snackbar host — mount once at the app root. */
export function SnackbarHost() {
  const snackbar = useUIStore((s) => s.snackbar);
  const hide = useUIStore((s) => s.hideSnackbar);
  const cfg = CONFIG[snackbar?.type ?? 'info'];

  return (
    <Snackbar
      key={snackbar?.id}
      visible={!!snackbar}
      onDismiss={hide}
      duration={2800}
      style={{ backgroundColor: cfg.bg, borderRadius: 14, marginBottom: 8 }}
    >
      <View className="flex-row items-center">
        <MaterialCommunityIcons name={cfg.icon} size={18} color={colors.white} />
        <Text className="text-white font-medium ml-2 flex-1">{snackbar?.message}</Text>
      </View>
    </Snackbar>
  );
}
