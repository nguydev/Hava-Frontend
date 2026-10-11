import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, Pressable, Text, View } from 'react-native';

import { AnnouncementCard, AppCard, Divider, Header, ScreenContainer } from '@/components';
import { APP } from '@/constants';
import { colors } from '@/theme';
import { useAuthStore } from '@/store/zustand';
import { withAlpha } from '@/utils';

import { useFAQs } from '@/services/queries';
function ContactRow({
  icon,
  label,
  value,
  color,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3.5">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: withAlpha(color, 0.16) }}
      >
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-ink-0 text-[15px] font-semibold">{label}</Text>
        <Text className="text-ink-2 text-[13px] mt-0.5">{value}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.ink3} />
    </Pressable>
  );
}

export function SupportView() {
  const role = useAuthStore((s) => s.role);
  const chatHref = role === 'driver' ? '/(driver)/chat' : '/(contractor)/chat';
  
  const { data: faqs = [] } = useFAQs();

  return (
    <ScreenContainer scroll contentClassName="pb-10">
      <Header title="Help & Support" />

      <View className="mt-2">
        <AnnouncementCard
          icon="message-text-outline"
          title="Live chat — we’re online"
          message="Chat with our support team in real time. Typical reply in about a minute."
          actionLabel="Start a chat"
          onAction={() => router.push(chatHref)}
        />
      </View>

      <AppCard className="mt-4 py-1">
        <ContactRow
          icon="phone"
          color={colors.ok}
          label="Call support"
          value={APP.supportPhone}
          onPress={() => Linking.openURL(`tel:${APP.supportPhone.replace(/[^0-9]/g, '')}`)}
        />
        <Divider />
        <ContactRow
          icon="email-outline"
          color={colors.info}
          label="Email us"
          value={APP.supportEmail}
          onPress={() => Linking.openURL(`mailto:${APP.supportEmail}`)}
        />
        <Divider />
        <View className="flex-row items-center py-3.5">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: withAlpha(colors.amber, 0.16) }}
          >
            <MaterialCommunityIcons name="clock-outline" size={20} color={colors.amber} />
          </View>
          <View className="flex-1">
            <Text className="text-ink-0 text-[15px] font-semibold">Support hours</Text>
            <Text className="text-ink-2 text-[13px] mt-0.5">{APP.supportHours}</Text>
          </View>
        </View>
      </AppCard>

      <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-6 mb-2 px-1">
        Frequently asked
      </Text>
      <View className="gap-3">
        {faqs.map((f) => (
          <AppCard key={f.id}>
            <View className="flex-row items-start">
              <MaterialCommunityIcons name="help-circle-outline" size={18} color={colors.heat} />
              <View className="flex-1 ml-2.5">
                <Text className="text-ink-0 text-[14px] font-semibold">{f.q}</Text>
                <Text className="text-ink-2 text-[13px] mt-1 leading-5">{f.a}</Text>
              </View>
            </View>
          </AppCard>
        ))}
      </View>
    </ScreenContainer>
  );
}
