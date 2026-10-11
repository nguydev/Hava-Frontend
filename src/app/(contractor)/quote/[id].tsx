import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground,
  AppButton,
  AppCard,
  DetailRow,
  Divider,
  ErrorState,
  Header,
  ListSkeleton,
  ProductThumb,
  StatusBadge,
} from '@/components';
import { useAcceptQuote } from '@/services/mutations';
import { useQuoteDetails } from '@/services/queries';
import { colors } from '@/theme';
import { formatCurrency, quoteStatusMeta, withAlpha } from '@/utils';

export default function QuoteDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: quote, isLoading, isError, refetch } = useQuoteDetails(id);
  const accept = useAcceptQuote();

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
        <Header title="Quote" />
        <View className="px-5">
          <ListSkeleton count={3} />
        </View>
      </SafeAreaView>
    );
  }
  if (isError || !quote) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
        <Header title="Quote" />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const meta = quoteStatusMeta(quote.status);
  const facts = [
    { label: 'System type', value: quote.systemType ?? quote.equipmentType },
    quote.brandPreference ? { label: 'Preferred brand', value: quote.brandPreference } : null,
    quote.tonnage ? { label: 'Size / Tonnage', value: quote.tonnage } : null,
    quote.furnaceBtu ? { label: 'Furnace BTU', value: quote.furnaceBtu } : null,
    quote.coilWidth ? { label: 'Coil width', value: quote.coilWidth } : null,
    quote.efficiencyFuel ? { label: 'Efficiency / Fuel', value: quote.efficiencyFuel } : null,
    { label: 'Quantity', value: String(quote.quantity) },
    { label: 'Job site', value: quote.jobSite },
    quote.needDelivery
      ? {
          label: 'Delivery',
          value:
            quote.needDelivery === 'No'
              ? 'No delivery needed'
              : quote.deliveryType || 'Delivery requested',
        }
      : null,
    quote.urgency ? { label: 'Urgency', value: quote.urgency } : null,
    quote.neededBy && quote.neededBy !== quote.urgency
      ? { label: 'Needed by', value: quote.neededBy }
      : null,
    { label: 'Submitted', value: quote.submittedAt },
  ].filter(Boolean) as { label: string; value: string }[];

  const resubmit = () =>
    router.push(
      `/(contractor)/quote-request?systemType=${encodeURIComponent(quote.systemType ?? quote.equipmentType)}&brand=${encodeURIComponent(quote.brandPreference ?? '')}`,
    );

  const renderFooter = () => {
    switch (quote.status) {
      case 'Approved':
        return (
          <View className="gap-3">
            <AppButton
              label="Accept quote"
              icon="check-decagram"
              loading={accept.isPending}
              onPress={() => accept.mutate(quote.id)}
            />
            <AppButton label="Request changes" variant="outline" onPress={resubmit} />
          </View>
        );
      case 'Accepted':
        return (
          <View className="flex-row items-center justify-center py-2">
            <MaterialCommunityIcons name="check-decagram" size={18} color={colors.ok} />
            <Text className="text-ok text-sm font-semibold ml-2">
              Accepted — we’ll schedule your order.
            </Text>
          </View>
        );
      case 'Pending':
        return (
          <View className="flex-row items-center justify-center py-2">
            <MaterialCommunityIcons name="clock-outline" size={18} color={colors.steel} />
            <Text className="text-ink-2 text-sm ml-2">Awaiting supplier response…</Text>
          </View>
        );
      default:
        return <AppButton label="Resubmit request" icon="refresh" variant="secondary" onPress={resubmit} />;
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <Header title={quote.id} subtitle={quote.equipmentType} />

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {quote.attachmentUrls && quote.attachmentUrls.length > 0 ? (
          <View className="rounded-card overflow-hidden mb-4" style={{ height: 150 }}>
            <ProductThumb
              uri={quote.attachmentUrls[0]}
              style={{ width: '100%', height: 150 }}
              radius={18}
              icon="image-outline"
              iconSize={36}
            />
            <View
              className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{ backgroundColor: withAlpha(colors.black, 0.5) }}
            >
              <Text className="text-white text-[15px] font-bold" numberOfLines={1}>
                {quote.equipmentType}
              </Text>
              <Text className="text-ink-1 text-[12px]">{quote.brandPreference ?? 'Any brand'}</Text>
            </View>
          </View>
        ) : null}

        <View className="flex-row items-center justify-between">
          <StatusBadge label={meta.label} color={meta.color} icon={meta.icon} />
          {quote.expiresAt ? (
            <Text className="text-ink-3 text-xs">Expires {quote.expiresAt}</Text>
          ) : null}
        </View>

        {quote.supplierResponse ? (
          <View
            className="rounded-card mt-4 p-4 border"
            style={{ backgroundColor: withAlpha(meta.color, 0.08), borderColor: withAlpha(meta.color, 0.3) }}
          >
            <Text className="text-ink-2 text-xs font-semibold uppercase tracking-wide">
              Supplier response
            </Text>
            {quote.quotedPrice != null ? (
              <Text className="text-ink-0 text-3xl font-extrabold mt-1">
                {formatCurrency(quote.quotedPrice)}
              </Text>
            ) : null}
            <Text className="text-ink-1 text-[14px] mt-2 leading-6">{quote.supplierResponse}</Text>
          </View>
        ) : null}

        <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-5 mb-2">
          Your request
        </Text>
        <AppCard>
          {facts.map((f, i) => (
            <View key={f.label}>
              <DetailRow label={f.label} value={f.value} />
              {i < facts.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </AppCard>

        {quote.notes ? (
          <AppCard className="mt-4">
            <Text className="text-ink-2 text-[13px] mb-1">Notes</Text>
            <Text className="text-ink-1 text-[14px] leading-6">{quote.notes}</Text>
          </AppCard>
        ) : null}

        {quote.attachmentUrls && quote.attachmentUrls.length > 0 ? (
          <>
            <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-5 mb-2">
              Attachments ({quote.attachmentUrls.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {quote.attachmentUrls.map((uri, i) => (
                <ProductThumb key={i} uri={uri} style={{ width: 110, height: 110 }} radius={14} icon="image-outline" iconSize={26} />
              ))}
            </ScrollView>
          </>
        ) : null}
      </ScrollView>

      <View className="border-t border-hair bg-surface px-5 pt-3 pb-6">{renderFooter()}</View>
    </SafeAreaView>
  );
}
