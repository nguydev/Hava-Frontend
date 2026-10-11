import { Text, View } from 'react-native';

import { formatCurrency } from '@/utils';

import { Divider } from './Divider';

export interface PriceRow {
  label: string;
  value: string;
  muted?: boolean;
}

export interface PriceSummaryProps {
  subtotal: number;
  deliveryFee?: number;
  extraRows?: PriceRow[];
  total: number;
  note?: string;
}

export function PriceSummary({
  subtotal,
  deliveryFee = 0,
  extraRows = [],
  total,
  note,
}: PriceSummaryProps) {
  const Row = ({ label, value, muted }: PriceRow) => (
    <View className="flex-row items-center justify-between py-1.5">
      <Text className={muted ? 'text-ink-2 text-[13px]' : 'text-ink-1 text-sm'}>{label}</Text>
      <Text className={muted ? 'text-ink-2 text-[13px]' : 'text-ink-0 text-sm font-semibold'}>
        {value}
      </Text>
    </View>
  );

  return (
    <View>
      <Row label="Subtotal" value={formatCurrency(subtotal)} muted />
      <Row
        label="Delivery"
        value={deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
        muted
      />
      {extraRows.map((r) => (
        <Row key={r.label} {...r} muted />
      ))}
      <Divider className="my-2" />
      <View className="flex-row items-center justify-between py-1">
        <Text className="text-ink-0 text-base font-bold">Total</Text>
        <Text className="text-heat text-xl font-extrabold">{formatCurrency(total)}</Text>
      </View>
      {note ? <Text className="text-ink-3 text-xs mt-1">{note}</Text> : null}
    </View>
  );
}
