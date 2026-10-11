import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Haptic helpers that no-op safely on web / unsupported platforms. */
function safe(fn: () => void) {
  if (Platform.OS === 'web') return;
  try {
    fn();
  } catch {
    // Haptics unavailable — ignore.
  }
}

export const haptics = {
  tap: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  medium: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  select: () => safe(() => Haptics.selectionAsync()),
};
