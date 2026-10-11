import type {
  Address,
  AppNotification,
  AuthSession,
  Category,
  Delivery,
  DeliveryStatus,
  Invoice,
  LoginPayload,
  MessageThread,
  NotificationPreferences,
  Order,
  PaymentMethod,
  Product,
  Quote,
  RegisterPayload,
  Role,
  SupportThread,
  User,
  FAQ,
} from '@/types';
import type {
  AddressValues,
  DeliveryIssueValues,
  EtaUpdateValues,
  ProofOfDeliveryValues,
  QuoteRequestValues,
} from '@/validation/schemas';

import { ENDPOINTS } from './endpoints';
import { http } from './httpClient';
import type {
  AddPaymentMethodInput,
  CreateOrderInput,
  DeliveryScopeQuery,
  OrderQuery,
  PaginatedResponse,
  ProductQuery,
  QuoteQuery,
} from './dto';

/**
 * Single API surface consumed by the TanStack Query hooks.
 */
export const api = {
  auth: {
    login: (payload: LoginPayload): Promise<AuthSession> =>
      http(ENDPOINTS.login, { method: 'POST', body: payload }),
    register: (payload: RegisterPayload): Promise<{ requestId: string }> =>
      http(ENDPOINTS.register, { method: 'POST', body: payload }),
    forgotPassword: (email: string): Promise<{ ok: true }> =>
      http(ENDPOINTS.forgotPassword, { method: 'POST', body: { email } }),
    verifyOtp: (email: string, code: string): Promise<{ valid: true }> =>
      http(ENDPOINTS.verifyOtp, { method: 'POST', body: { email, code } }),
    resetPassword: (email: string, otp: string, newPassword: string): Promise<{ ok: true }> =>
      http(ENDPOINTS.resetPassword, { method: 'POST', body: { email, otp, newPassword } }),
    changePassword: (currentPassword: string, newPassword: string): Promise<{ ok: true }> =>
      http(ENDPOINTS.changePassword, {
        method: 'POST',
        body: { currentPassword, newPassword },
      }),
  },

  catalog: {
    listProducts: (q: ProductQuery = {}): Promise<PaginatedResponse<Product>> =>
      http(ENDPOINTS.products, { query: q }),
    getProduct: (id: string): Promise<Product> =>
      http(ENDPOINTS.product(id)),
    listCategories: (): Promise<Category[]> =>
      http(ENDPOINTS.categories),
  },

  orders: {
    list: (q: OrderQuery = {}): Promise<PaginatedResponse<Order>> =>
      http(ENDPOINTS.orders, { query: q }),
    get: (id: string): Promise<Order> =>
      http(ENDPOINTS.order(id)),
    create: (input: CreateOrderInput): Promise<Order> =>
      http(ENDPOINTS.orders, { method: 'POST', body: input }),
  },

  quotes: {
    list: (q: QuoteQuery = {}): Promise<PaginatedResponse<Quote>> => 
      http(ENDPOINTS.quotes, { query: q }),
    get: (id: string): Promise<Quote> =>
      http(ENDPOINTS.quote(id)),
    submit: (input: QuoteRequestValues, attachments: string[] = []): Promise<Quote> =>
      http(ENDPOINTS.quotes, { method: 'POST', body: { ...input, attachments } }),
    accept: (id: string): Promise<Quote> =>
      http(ENDPOINTS.quoteAccept(id), { method: 'POST' }),
  },

  deliveries: {
    list: (q: DeliveryScopeQuery = {}): Promise<Delivery[]> =>
      http(ENDPOINTS.deliveries, { query: q }),
    get: (id: string): Promise<Delivery> =>
      http(ENDPOINTS.delivery(id)),
    create: (input: any): Promise<Delivery> =>
      http(ENDPOINTS.deliveries, { method: 'POST', body: input }),
    claim: (id: string): Promise<Delivery> =>
      http(ENDPOINTS.deliveryClaim(id), { method: 'POST' }),
    updateStatus: (id: string, status: DeliveryStatus): Promise<Delivery> =>
      http(ENDPOINTS.deliveryStatus(id), { method: 'PATCH', body: { status } }),
    updateEta: (id: string, input: EtaUpdateValues): Promise<Delivery> =>
      http(ENDPOINTS.deliveryEta(id), { method: 'PATCH', body: input }),
    submitProof: (id: string, input: ProofOfDeliveryValues): Promise<Delivery> =>
      http(ENDPOINTS.deliveryProof(id), { method: 'POST', body: input }),
    reportIssue: (id: string, input: DeliveryIssueValues): Promise<Delivery> =>
      http(ENDPOINTS.deliveryIssue(id), { method: 'POST', body: input }),
  },

  notifications: {
    list: (): Promise<AppNotification[]> =>
      http(ENDPOINTS.notifications),
    markRead: (id: string): Promise<AppNotification> =>
      http(ENDPOINTS.notificationRead(id), { method: 'PATCH' }),
    markAllRead: (): Promise<AppNotification[]> =>
      http(ENDPOINTS.notificationsReadAll, { method: 'PATCH' }),
  },

  profile: {
    get: (role: Role): Promise<User> =>
      http(ENDPOINTS.profile, { query: { role } }),
    update: (role: Role, patch: Partial<User>): Promise<User> =>
      http(ENDPOINTS.profile, { method: 'PUT', body: { role, ...patch } }),
    listAddresses: (): Promise<Address[]> =>
      http(ENDPOINTS.addresses),
    saveAddress: (input: AddressValues & { id?: string }): Promise<Address> =>
      http(input.id ? ENDPOINTS.address(input.id) : ENDPOINTS.addresses, {
        method: input.id ? 'PUT' : 'POST',
        body: input,
      }),
    deleteAddress: (id: string): Promise<{ id: string }> =>
      http(ENDPOINTS.address(id), { method: 'DELETE' }),
    getNotificationPreferences: (): Promise<NotificationPreferences> =>
      http(ENDPOINTS.notificationPreferences),
    updateNotificationPreferences: (
      prefs: NotificationPreferences,
    ): Promise<NotificationPreferences> =>
      http(ENDPOINTS.notificationPreferences, { method: 'PUT', body: prefs }),
  },

  billing: {
    listPaymentMethods: (): Promise<PaymentMethod[]> =>
      http(ENDPOINTS.paymentMethods),
    addPaymentMethod: (input: AddPaymentMethodInput): Promise<PaymentMethod> =>
      http(ENDPOINTS.paymentMethods, { method: 'POST', body: input }),
    deletePaymentMethod: (id: string): Promise<{ id: string }> =>
      http(ENDPOINTS.paymentMethod(id), { method: 'DELETE' }),
    setDefaultPaymentMethod: (id: string): Promise<PaymentMethod[]> =>
      http(ENDPOINTS.paymentMethodDefault(id), { method: 'PATCH' }),
    listInvoices: (): Promise<Invoice[]> =>
      http(ENDPOINTS.invoices),
    payInvoice: (id: string): Promise<Invoice> =>
      http(ENDPOINTS.invoicePay(id), { method: 'POST' }),
  },

  uploads: {
    uploadImage: (dataUri: string): Promise<{ url: string }> =>
      http(ENDPOINTS.uploadBase64, { method: 'POST', body: { image: dataUri } }),
  },

  support: {
    listFAQs: (): Promise<FAQ[]> =>
      http(ENDPOINTS.supportFaqs),
    getThread: (): Promise<SupportThread> =>
      http(ENDPOINTS.supportThread),
    sendMessage: (text: string): Promise<SupportThread> =>
      http(ENDPOINTS.supportMessages, { method: 'POST', body: { text } }),
  },

  messages: {
    getThread: (threadId: string, peer?: string): Promise<MessageThread> =>
      http(ENDPOINTS.messageThread(threadId), { query: { peer } }),
    send: (threadId: string, text: string): Promise<MessageThread> =>
      http(ENDPOINTS.messageThread(threadId), { method: 'POST', body: { text } }),
  },
};

export { ApiError, httpStream } from './httpClient';
export type {
  AddPaymentMethodInput,
  CreateOrderInput,
  DeliveryScopeQuery,
  OrderQuery,
  ProductQuery,
  QuoteQuery,
} from './dto';
