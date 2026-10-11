import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { colors, shadow } from '@/theme';
import type { CardBrand, PaymentMethod } from '@/types';
import { cn, withAlpha } from '@/utils';

export const cardBrandMeta: Record<CardBrand, { label: string; colors: [string, string] }> = {
  visa: { label: 'VISA', colors: ['#1A1F71', '#2E90FA'] },
  mastercard: { label: 'Mastercard', colors: ['#B31217', '#EB6A2E'] },
  amex: { label: 'AMEX', colors: ['#1F6FB2', '#22D3EE'] },
  discover: { label: 'Discover', colors: ['#B45309', '#F5A524'] },
  card: { label: 'Card', colors: ['#1E6FE0', '#22D3EE'] },
};

function expLabel(m: PaymentMethod) {
  return `${String(m.expMonth).padStart(2, '0')}/${String(m.expYear).slice(-2)}`;
}

/* ------------------------------- Hero card -------------------------------- */

export function CreditCardHero({ method }: { method: PaymentMethod }) {
  const meta = cardBrandMeta[method.brand];
  return (
    <LinearGradient
      colors={meta.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: 20, padding: 20, minHeight: 180 }, shadow.card]}
    >
      <View className="flex-row items-start justify-between">
        <View
          style={{
            width: 42,
            height: 30,
            borderRadius: 6,
            backgroundColor: withAlpha(colors.white, 0.85),
          }}
        />
        <Text className="text-white font-extrabold text-base tracking-widest">{meta.label}</Text>
      </View>
      <Text className="text-white text-[22px] font-bold tracking-[3px] mt-7">
        ••••  ••••  ••••  {method.last4}
      </Text>
      <View className="flex-row items-end justify-between mt-6">
        <View>
          <Text className="text-white/70 text-[10px] uppercase tracking-wide">Card holder</Text>
          <Text className="text-white font-semibold text-[13px] mt-0.5" numberOfLines={1}>
            {method.holder}
          </Text>
        </View>
        <View>
          <Text className="text-white/70 text-[10px] uppercase tracking-wide">Expires</Text>
          <Text className="text-white font-semibold text-[13px] mt-0.5">{expLabel(method)}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

/* -------------------------------- Row card -------------------------------- */

export interface PaymentMethodCardProps {
  method: PaymentMethod;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onSetDefault?: () => void;
  onDelete?: () => void;
}

export function PaymentMethodCard({
  method,
  selectable,
  selected,
  onSelect,
  onSetDefault,
  onDelete,
}: PaymentMethodCardProps) {
  const meta = cardBrandMeta[method.brand];

  const Wrapper: React.ComponentType<{ children: React.ReactNode }> = selectable
    ? ({ children }) => (
        <Pressable
          onPress={onSelect}
          className={cn(
            'rounded-card border p-3.5 flex-row items-center bg-card',
            selected ? 'border-heat' : 'border-hair',
          )}
          style={
            selected
              ? { backgroundColor: withAlpha(colors.brandBlue, 0.06) }
              : undefined
          }
        >
          {children}
        </Pressable>
      )
    : ({ children }) => (
        <View className="rounded-card border border-hair p-3.5 flex-row items-center bg-card">
          {children}
        </View>
      );

  return (
    <Wrapper>
      <LinearGradient
        colors={meta.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: 46, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
      >
        <MaterialCommunityIcons name="credit-card" size={18} color={colors.white} />
      </LinearGradient>

      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text className="text-ink-0 text-[14px] font-bold">•••• {method.last4}</Text>
          {method.isDefault ? (
            <View
              className="ml-2 rounded-pill px-2 py-0.5"
              style={{ backgroundColor: withAlpha(colors.brandBlue, 0.16) }}
            >
              <Text className="text-heat text-[10px] font-bold">Default</Text>
            </View>
          ) : null}
        </View>
        <Text className="text-ink-2 text-[12px] mt-0.5" numberOfLines={1}>
          {meta.label} · Exp {expLabel(method)}
        </Text>
      </View>

      {selectable ? (
        <View
          className="w-5 h-5 rounded-full items-center justify-center ml-2"
          style={{
            borderWidth: 2,
            borderColor: selected ? colors.brandBlue : colors.hair,
          }}
        >
          {selected ? (
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brandBlue }} />
          ) : null}
        </View>
      ) : (
        <View className="flex-row items-center ml-2">
          {!method.isDefault && onSetDefault ? (
            <Pressable onPress={onSetDefault} hitSlop={8} className="px-2">
              <MaterialCommunityIcons name="star-outline" size={20} color={colors.ink2} />
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable onPress={onDelete} hitSlop={8} className="px-1">
              <MaterialCommunityIcons name="trash-can-outline" size={19} color={colors.alert} />
            </Pressable>
          ) : null}
        </View>
      )}
    </Wrapper>
  );
}
