import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground, AppCard, Avatar, ConfirmDialog, Divider, MenuRow, StatusBadge } from '@/components';
import { APP } from '@/constants';
import { useAuthStore } from '@/store/zustand';
import { colors } from '@/theme';

export default function ContractorProfile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text className="text-ink-0 text-2xl font-extrabold pt-2 pb-4">Profile</Text>

        <AppCard>
          <View className="flex-row items-center">
            <Avatar name={user?.name ?? 'Contractor'} uri={user?.avatar} size={60} />
            <View className="flex-1 ml-4">
              <Text className="text-ink-0 text-lg font-bold">{user?.name}</Text>
              <Text className="text-ink-2 text-[13px]">{user?.company}</Text>
              {user?.approval ? (
                <View className="mt-1.5">
                  <StatusBadge
                    label={`${user.approval} account`}
                    color={user.approval === 'Approved' ? colors.ok : colors.amber}
                    icon="shield-check-outline"
                    size="sm"
                  />
                </View>
              ) : null}
            </View>
          </View>
          <Divider className="my-3" />
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="email-outline" size={15} color={colors.ink3} />
            <Text className="text-ink-2 text-[13px] ml-2">{user?.email}</Text>
          </View>
          <View className="flex-row items-center mt-1.5">
            <MaterialCommunityIcons name="phone-outline" size={15} color={colors.ink3} />
            <Text className="text-ink-2 text-[13px] ml-2">{user?.phone}</Text>
          </View>
          {user?.businessType ? (
            <View className="flex-row items-center mt-1.5">
              <MaterialCommunityIcons name="briefcase-outline" size={15} color={colors.ink3} />
              <Text className="text-ink-2 text-[13px] ml-2">{user.businessType}</Text>
            </View>
          ) : null}
        </AppCard>

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-6 mb-2 px-1">
          Account
        </Text>
        <AppCard className="py-1">
          <MenuRow icon="account-edit-outline" label="Edit profile" onPress={() => router.push('/(contractor)/edit-profile')} />
          <Divider />
          <MenuRow icon="map-marker-multiple-outline" label="Saved job sites" onPress={() => router.push('/(contractor)/addresses')} />
          <Divider />
          <MenuRow icon="lock-reset" label="Change password" onPress={() => router.push('/(contractor)/change-password')} />
        </AppCard>

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-6 mb-2 px-1">
          Preferences & help
        </Text>
        <AppCard className="py-1">
          <MenuRow icon="bell-outline" label="Notification settings" onPress={() => router.push('/(contractor)/notification-preferences')} />
          <Divider />
          <MenuRow icon="headset" label="Help & support" onPress={() => router.push('/(contractor)/support')} />
        </AppCard>

        <View className="mt-6">
          <AppCard className="py-1">
            <MenuRow icon="logout" label="Log out" danger onPress={() => setConfirmLogout(true)} />
          </AppCard>
        </View>

        <Text className="text-ink-3 text-xs text-center mt-6">
          {APP.name} · v{'1.0.0'}
        </Text>
      </ScrollView>

      <ConfirmDialog
        visible={confirmLogout}
        title="Log out?"
        message="You’ll need to sign in again to place orders and track deliveries."
        confirmLabel="Log out"
        destructive
        onConfirm={() => {
          setConfirmLogout(false);
          logout();
        }}
        onCancel={() => setConfirmLogout(false)}
      />
    </SafeAreaView>
  );
}
