import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Text } from 'react-native';

import { AppCard, ControlledSwitch, Divider, Header, ScreenContainer } from '@/components';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { useUpdateNotificationPreferences } from '@/services/mutations';
import { useNotificationPreferences } from '@/services/queries';
import type { NotificationPreferences } from '@/types';

/** Local defaults shown only until the server value loads. */
const DEFAULT_PREFERENCES: NotificationPreferences = {
  orderUpdates: true,
  quoteUpdates: true,
  deliveryUpdates: true,
  etaUpdates: true,
  promotions: false,
  channelPush: true,
  channelEmail: true,
  channelSms: false,
};

export function PreferencesView() {
  const saved =
    storage.getObject<NotificationPreferences>(STORAGE_KEYS.notificationPrefs) ??
    DEFAULT_PREFERENCES;

  const { data: serverPrefs } = useNotificationPreferences();
  const { mutate: syncPrefs } = useUpdateNotificationPreferences();

  const { control, watch, reset } = useForm<NotificationPreferences>({ defaultValues: saved });

  // Seed the form from the server once preferences arrive (local defaults show meanwhile).
  useEffect(() => {
    if (serverPrefs) {
      reset(serverPrefs);
      storage.setObject(STORAGE_KEYS.notificationPrefs, serverPrefs);
    }
  }, [serverPrefs, reset]);

  useEffect(() => {
    const sub = watch((values, { type }) => {
      // Only react to real user toggles, not programmatic resets from the server seed.
      if (type !== 'change') return;
      const prefs = values as NotificationPreferences;
      storage.setObject(STORAGE_KEYS.notificationPrefs, prefs); // offline cache
      syncPrefs(prefs); // persist server-side
    });
    return () => sub.unsubscribe();
  }, [watch, syncPrefs]);

  return (
    <ScreenContainer scroll contentClassName="pb-10">
      <Header title="Notifications" subtitle="Choose what you want to hear about" />

      <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-3 mb-2 px-1">
        Alerts
      </Text>
      <AppCard className="py-1">
        <ControlledSwitch control={control} name="orderUpdates" label="Order updates" description="Status changes on your orders" icon="package-variant" />
        <Divider />
        <ControlledSwitch control={control} name="quoteUpdates" label="Quote updates" description="Responses to your quote requests" icon="file-document-outline" />
        <Divider />
        <ControlledSwitch control={control} name="deliveryUpdates" label="Delivery updates" description="Assignments & delivery progress" icon="truck-delivery-outline" />
        <Divider />
        <ControlledSwitch control={control} name="etaUpdates" label="ETA updates" description="Live driver ETA changes" icon="clock-fast" />
        <Divider />
        <ControlledSwitch control={control} name="promotions" label="Promotions" description="Exclusive pricing & product news" icon="tag-outline" />
      </AppCard>

      <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-6 mb-2 px-1">
        Channels
      </Text>
      <AppCard className="py-1">
        <ControlledSwitch control={control} name="channelPush" label="Push notifications" icon="cellphone" />
        <Divider />
        <ControlledSwitch control={control} name="channelEmail" label="Email" icon="email-outline" />
        <Divider />
        <ControlledSwitch control={control} name="channelSms" label="SMS" icon="message-text-outline" />
      </AppCard>

      <Text className="text-ink-3 text-xs text-center mt-6">
        Preferences are saved automatically on this device.
      </Text>
    </ScreenContainer>
  );
}
