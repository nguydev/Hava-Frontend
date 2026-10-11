import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';
import type { Quote } from '@/types';
import { formatCurrency, pluralize, quoteStatusMeta } from '@/utils';

import { AppCard } from '../ui/AppCard';
import { Divider } from '../ui/Divider';
import { ProductThumb } from '../ui/ProductThumb';
import { StatusBadge } from '../ui/StatusBadge';

export interface QuoteCardProps {
  quote: Quote;
  onPress: () => void;
}

export function QuoteCard({ quote, onPress }: QuoteCardProps) {
  const meta = quoteStatusMeta(quote?.status || 'Pending');
  const hasPrice = quote?.quotedPrice != null;
  const qty = quote?.quantity ?? 1;
  const attachments = Array.isArray(quote?.attachmentUrls) ? quote.attachmentUrls : [];

  return (
    <AppCard onPress={onPress}>
      <View className="flex-row items-center justify-between">
        <Text className="text-ink-0 text-base font-bold">{quote?.id || ''}</Text>
        <StatusBadge label={meta.label} color={meta.color} icon={meta.icon} />
      </View>

      <Text className="text-ink-0 text-[15px] font-semibold mt-2">{quote?.equipmentType || quote?.systemType || 'HVAC System Quote'}</Text>

      <View className="flex-row items-center mt-1.5">
        <MaterialCommunityIcons name="map-marker-outline" size={15} color={colors.ink3} />
        <Text className="text-ink-2 text-[13px] ml-2 flex-1" numberOfLines={1}>
          {quote?.jobSite || 'Job Site Location'}
        </Text>
      </View>
      <View className="flex-row items-center mt-1.5">
        <MaterialCommunityIcons name="cube-outline" size={15} color={colors.ink3} />
        <Text className="text-ink-2 text-[13px] ml-2" numberOfLines={1}>
          {qty} {pluralize(qty, 'unit')}
          {quote?.tonnage ? ` · ${quote.tonnage}` : ''}
          {quote?.brandPreference ? ` · ${quote.brandPreference}` : ''}
        </Text>
      </View>

      {attachments.length > 0 ? (
        <View className="flex-row items-center mt-3 gap-2">
          {attachments.slice(0, 3).map((uri, i) => (
            <ProductThumb key={i} uri={uri} style={{ width: 52, height: 52 }} radius={10} icon="image-outline" iconSize={18} />
          ))}
          {(quote?.attachments ?? attachments.length) > 3 ? (
            <View className="w-[52px] h-[52px] rounded-[10px] bg-card-2 border border-hair items-center justify-center">
              <Text className="text-ink-1 text-[13px] font-bold">+{(quote?.attachments ?? attachments.length) - 3}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <Divider className="my-3" />
      <View className="flex-row items-center justify-between">
        <Text className="text-ink-3 text-xs">Updated {quote?.updatedAt || ''}</Text>
        {hasPrice ? (
          <Text className="text-ink-0 text-base font-extrabold">
            {formatCurrency(quote.quotedPrice)}
          </Text>
        ) : (
          <Text className="text-ink-3 text-[13px] italic">Awaiting quote</Text>
        )}
      </View>
    </AppCard>
  );
}
