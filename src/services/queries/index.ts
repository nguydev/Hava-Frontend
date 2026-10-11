import { keepPreviousData, useQuery, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { DeliveryScopeQuery, OrderQuery, ProductQuery, QuoteQuery } from '@/services/api';
import { useAuthStore } from '@/store/zustand';

import { qk } from './queryKeys';

export { qk } from './queryKeys';

/* -------------------------------- Catalog --------------------------------- */

export function useProducts(query: ProductQuery = {}) {
  return useInfiniteQuery({
    queryKey: qk.products(query),
    queryFn: ({ pageParam }) => api.catalog.listProducts({ ...query, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    placeholderData: keepPreviousData,
  });
}

export function useProductDetails(id: string) {
  return useQuery({
    queryKey: qk.product(id),
    queryFn: () => api.catalog.getProduct(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: qk.categories(),
    queryFn: () => api.catalog.listCategories(),
    staleTime: 10 * 60_000,
  });
}

/* --------------------------------- Orders --------------------------------- */

export function useOrders(query: OrderQuery = {}) {
  return useInfiniteQuery({
    queryKey: qk.orders(query),
    queryFn: ({ pageParam }) => api.orders.list({ ...query, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    placeholderData: keepPreviousData,
  });
}

export function useOrderDetails(id: string) {
  return useQuery({
    queryKey: qk.order(id),
    queryFn: () => api.orders.get(id),
    enabled: !!id,
  });
}

/* --------------------------------- Quotes --------------------------------- */

export function useQuotes(query: QuoteQuery = {}) {
  return useInfiniteQuery({
    queryKey: qk.quotes(query),
    queryFn: ({ pageParam }) => api.quotes.list({ ...query, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    placeholderData: keepPreviousData,
  });
}

export function useQuoteDetails(id: string) {
  return useQuery({
    queryKey: qk.quote(id),
    queryFn: () => api.quotes.get(id),
    enabled: !!id,
  });
}

/* ------------------------------- Deliveries ------------------------------- */

export function useDeliveries(query: DeliveryScopeQuery = {}) {
  return useQuery({
    queryKey: qk.deliveries(query),
    queryFn: () => api.deliveries.list(query),
  });
}

export function useDeliveryDetails(id: string) {
  return useQuery({
    queryKey: qk.delivery(id),
    queryFn: () => api.deliveries.get(id),
    enabled: !!id,
  });
}

/* ----------------------------- Notifications ------------------------------ */

export function useNotifications() {
  return useQuery({
    queryKey: qk.notifications(),
    queryFn: () => api.notifications.list(),
  });
}

/* ------------------------------ Profile ----------------------------------- */

export function useProfile() {
  const role = useAuthStore((s) => s.role);
  return useQuery({
    queryKey: qk.profile(role),
    queryFn: () => api.profile.get(role!),
    enabled: !!role,
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: qk.addresses(),
    queryFn: () => api.profile.listAddresses(),
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: qk.notificationPreferences(),
    queryFn: () => api.profile.getNotificationPreferences(),
  });
}

/* ------------------------------ Billing ----------------------------------- */

export function usePaymentMethods() {
  return useQuery({
    queryKey: qk.paymentMethods(),
    queryFn: () => api.billing.listPaymentMethods(),
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: qk.invoices(),
    queryFn: () => api.billing.listInvoices(),
  });
}

/* -------------------------------- Support --------------------------------- */

export function useFAQs() {
  return useQuery({
    queryKey: qk.faqs(),
    queryFn: () => api.support.listFAQs(),
  });
}

export function useSupportThread() {
  return useQuery({
    queryKey: qk.supportThread(),
    queryFn: () => api.support.getThread(),
    refetchInterval: 5000,
  });
}

/* --------------------------- Delivery messaging --------------------------- */

export function useMessageThread(threadId: string, peer?: string) {
  return useQuery({
    queryKey: qk.messageThread(threadId),
    queryFn: () => api.messages.getThread(threadId, peer),
    enabled: !!threadId,
    refetchInterval: 5000,
  });
}
