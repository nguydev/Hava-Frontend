import type { Role } from '@/types';
import type { DeliveryScopeQuery, OrderQuery, ProductQuery, QuoteQuery } from '@/services/api';

/** Central registry of TanStack Query keys. */
export const qk = {
  products: (q: ProductQuery = {}) => ['products', q] as const,
  product: (id: string) => ['product', id] as const,
  categories: () => ['categories'] as const,

  orders: (q: OrderQuery = {}) => ['orders', q] as const,
  order: (id: string) => ['order', id] as const,

  quotes: (q: QuoteQuery = {}) => ['quotes', q] as const,
  quote: (id: string) => ['quote', id] as const,

  deliveries: (q: DeliveryScopeQuery = {}) => ['deliveries', q] as const,
  delivery: (id: string) => ['delivery', id] as const,

  notifications: () => ['notifications'] as const,

  profile: (role: Role | null) => ['profile', role] as const,
  notificationPreferences: () => ['notification-preferences'] as const,
  addresses: () => ['addresses'] as const,

  paymentMethods: () => ['payment-methods'] as const,
  invoices: () => ['invoices'] as const,

  supportThread: () => ['support-thread'] as const,
  faqs: () => ['faqs'] as const,
  messageThread: (threadId: string) => ['message-thread', threadId] as const,
};
