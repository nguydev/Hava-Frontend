/**
 * Registers the device for push notifications and sends the Expo push token to
 * the backend (POST /push/register). The backend then delivers via Expo's push
 * service (FCM/APNs under the hood — configured via google-services.json + EAS).
 *
 * expo-notifications / expo-device are imported dynamically so the app still
 * runs if they aren't installed yet; the function simply no-ops in that case
 * (and on simulators / in mock-API mode).
 */
import { Platform } from 'react-native';

import { ENV } from '@/lib/env';
import { http } from '@/services/api/httpClient';

let handlerSet = false;

export async function registerForPushNotificationsAsync(): Promise<string | null> {

  let Notifications: any;
  let Device: any;
  let Constants: any;
  try {
    // @ts-ignore — optional native deps, may not be installed in this workspace yet
    Notifications = await import('expo-notifications');
    // @ts-ignore
    Device = await import('expo-device');
    Constants = (await import('expo-constants')).default;
  } catch {
    return null; // native module not installed yet
  }

  try {
    if (!handlerSet) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      handlerSet = true;
    }

    if (Device?.isDevice === false) return null; // emulators/simulators can't get a token

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') return null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance?.DEFAULT ?? 3,
      });
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );

    await http('/push/register', { method: 'POST', body: { token, platform: Platform.OS } });
    return token;
  } catch {
    return null; // best-effort — never block the app
  }
}
