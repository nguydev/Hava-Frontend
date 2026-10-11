import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';

import {
  AppButton,
  AppCard,
  ConfirmDialog,
  CreditCardHero,
  Divider,
  EmptyState,
  ErrorState,
  ListSkeleton,
  PaymentMethodCard,
  ScreenContainer,
  ScreenHeaderCard,
  StatusBadge,
} from '@/components';
import { useRefreshByUser } from '@/hooks';
import {
  useDeletePaymentMethod,
  useSetDefaultPaymentMethod,
} from '@/services/mutations';
import { useInvoices, usePaymentMethods } from '@/services/queries';
import { colors } from '@/theme';
import type { Invoice, InvoiceStatus } from '@/types';
import { formatCurrency, withAlpha } from '@/utils';

const INVOICE_META: Record<InvoiceStatus, { color: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = {
  Paid: { color: colors.ok, icon: 'check-circle-outline' },
  Due: { color: colors.amber, icon: 'clock-outline' },
  Overdue: { color: colors.alert, icon: 'alert-circle-outline' },
};

function InvoiceRow({ invoice, onOpen }: { invoice: Invoice; onOpen: () => void }) {
  const meta = INVOICE_META[invoice.status];
  return (
    <AppCard onPress={onOpen}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-ink-0 text-[14px] font-bold">{invoice.id}</Text>
          <Text className="text-ink-2 text-[12px] mt-0.5" numberOfLines={2}>
            {invoice.description}
          </Text>
          <Text className="text-ink-3 text-[11px] mt-1">
            Issued {invoice.issuedAt} · Due {invoice.dueAt}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-ink-0 text-[15px] font-extrabold">{formatCurrency(invoice.amount)}</Text>
          <View className="mt-1">
            <StatusBadge label={invoice.status} color={meta.color} icon={meta.icon} size="sm" />
          </View>
        </View>
      </View>
      <Divider className="my-3" />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="file-document-outline" size={14} color={colors.heat} />
          <Text className="text-heat text-[13px] font-semibold ml-1.5">View invoice</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.ink3} />
      </View>
    </AppCard>
  );
}

export default function Billing() {
  const methods = usePaymentMethods();
  const invoices = useInvoices();
  const setDefault = useSetDefaultPaymentMethod();
  const deleteMethod = useDeletePaymentMethod();

  const [toDelete, setToDelete] = useState<string | null>(null);

  const { isRefreshing, onRefresh } = useRefreshByUser(() =>
    Promise.all([methods.refetch(), invoices.refetch()]),
  );

  const defaultMethod = methods.data?.find((m) => m.isDefault) ?? methods.data?.[0];
  const outstanding = (invoices.data ?? [])
    .filter((i) => i.status !== 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const isLoading = methods.isLoading || invoices.isLoading;

  return (
    <ScreenContainer
      scroll
      padded={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.heat} />
      }
    >
      <ScreenHeaderCard title="Payment & Billing" subtitle="Manage cards and invoices" />

      <View className="px-5 mt-5">
        {isLoading ? (
          <ListSkeleton count={4} />
        ) : methods.isError || invoices.isError ? (
          <ErrorState onRetry={() => { methods.refetch(); invoices.refetch(); }} />
        ) : (
          <>
            {/* Outstanding balance + default card hero */}
            {defaultMethod ? <CreditCardHero method={defaultMethod} /> : null}

            <View
              className="rounded-card border border-hair p-4 mt-4 flex-row items-center"
              style={{ backgroundColor: withAlpha(outstanding > 0 ? colors.amber : colors.ok, 0.08) }}
            >
              <View
                className="w-11 h-11 rounded-2xl items-center justify-center mr-3.5"
                style={{ backgroundColor: withAlpha(outstanding > 0 ? colors.amber : colors.ok, 0.18) }}
              >
                <MaterialCommunityIcons
                  name={outstanding > 0 ? 'cash-multiple' : 'check-decagram'}
                  size={22}
                  color={outstanding > 0 ? colors.amber : colors.ok}
                />
              </View>
              <View className="flex-1">
                <Text className="text-ink-2 text-[12px]">Outstanding balance</Text>
                <Text className="text-ink-0 text-xl font-extrabold mt-0.5">
                  {formatCurrency(outstanding)}
                </Text>
              </View>
            </View>

            {/* Payment methods */}
            <View className="flex-row items-center justify-between mt-6 mb-2">
              <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide">
                Payment methods
              </Text>
            </View>
            <View className="gap-3">
              {(methods.data ?? []).map((m) => (
                <PaymentMethodCard
                  key={m.id}
                  method={m}
                  onSetDefault={() => setDefault.mutate(m.id)}
                  onDelete={() => setToDelete(m.id)}
                />
              ))}
              <AppButton
                label="Add card"
                variant="outline"
                icon="plus"
                onPress={() => router.push('/(contractor)/add-card')}
              />
            </View>

            {/* Invoices */}
            <Text className="text-ink-2 text-[13px] font-semibold uppercase tracking-wide mt-6 mb-2">
              Invoices
            </Text>
            {(invoices.data ?? []).length === 0 ? (
              <EmptyState icon="file-check-outline" title="No invoices" message="Your invoices will appear here." />
            ) : (
              <View className="gap-3">
                {(invoices.data ?? []).map((inv) => (
                  <InvoiceRow
                    key={inv.id}
                    invoice={inv}
                    onOpen={() => router.push(`/(contractor)/invoice/${inv.id}`)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </View>

      <ConfirmDialog
        visible={!!toDelete}
        title="Remove card?"
        message="This payment method will be removed from your account."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (toDelete) deleteMethod.mutate(toDelete);
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </ScreenContainer>
  );
}
