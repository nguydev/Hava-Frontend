import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';
import type { Address } from '@/types';
import { cn } from '@/utils';

import { AppCard } from '../ui/AppCard';

export interface AddressCardProps {
  address: Address;
  selectable?: boolean;
  selected?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AddressCard({
  address,
  selectable,
  selected,
  onPress,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <AppCard
      onPress={onPress}
      className={cn(selected ? 'border-heat' : '')}
    >
      <View className="flex-row items-start">
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-ink-0 text-[15px] font-bold">{address.label}</Text>
            {address.isDefault ? (
              <View className="ml-2 rounded-pill bg-card-2 px-2 py-0.5">
                <Text className="text-ink-2 text-[10px] font-semibold">DEFAULT</Text>
              </View>
            ) : null}
          </View>
          <Text className="text-ink-2 text-[13px] mt-1">{address.line1}</Text>
          <Text className="text-ink-2 text-[13px]">
            {address.city}, {address.state} {address.zip}
          </Text>
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons name="account-outline" size={14} color={colors.ink3} />
            <Text className="text-ink-3 text-xs ml-1.5">
              {address.contactName} · {address.contactPhone}
            </Text>
          </View>
        </View>

        {selectable ? (
          <View
            className="w-5 h-5 rounded-full border-2 items-center justify-center mt-1"
            style={{ borderColor: selected ? colors.heat : colors.hair }}
          >
            {selected ? <View className="w-2.5 h-2.5 rounded-full bg-heat" /> : null}
          </View>
        ) : (
          <View className="flex-row">
            {onEdit ? (
              <Pressable onPress={onEdit} hitSlop={8} className="p-1.5">
                <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.ink2} />
              </Pressable>
            ) : null}
            {onDelete ? (
              <Pressable onPress={onDelete} hitSlop={8} className="p-1.5 ml-1">
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.alert} />
              </Pressable>
            ) : null}
          </View>
        )}
      </View>
    </AppCard>
  );
}
