/** REST endpoint paths for the real backend (used when EXPO_PUBLIC_API_URL is set). */
export const ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  verifyOtp: '/auth/verify-otp',
  resetPassword: '/auth/reset-password',
  changePassword: '/auth/change-password',
  me: '/auth/me',

  products: '/products',
  product: (id: string) => `/products/${id}`,
  categories: '/categories',

  orders: '/orders',
  order: (id: string) => `/orders/${id}`,

  quotes: '/quotes',
  quote: (id: string) => `/quotes/${id}`,
  quoteAccept: (id: string) => `/quotes/${id}/accept`,

  deliveries: '/deliveries',
  delivery: (id: string) => `/deliveries/${id}`,
  deliveryClaim: (id: string) => `/deliveries/${id}/claim`,
  deliveryStatus: (id: string) => `/deliveries/${id}/status`,
  deliveryEta: (id: string) => `/deliveries/${id}/eta`,
  deliveryProof: (id: string) => `/deliveries/${id}/proof`,
  deliveryIssue: (id: string) => `/deliveries/${id}/issue`,

  notifications: '/notifications',
  notificationRead: (id: string) => `/notifications/${id}/read`,
  notificationsReadAll: '/notifications/read-all',

  profile: '/profile',
  notificationPreferences: '/profile/notification-preferences',
  addresses: '/addresses',
  address: (id: string) => `/addresses/${id}`,

  paymentMethods: '/billing/payment-methods',
  paymentMethod: (id: string) => `/billing/payment-methods/${id}`,
  paymentMethodDefault: (id: string) => `/billing/payment-methods/${id}/default`,
  invoices: '/billing/invoices',
  invoicePay: (id: string) => `/billing/invoices/${id}/pay`,

  uploadBase64: '/uploads/base64',

  supportThread: '/support/thread',
  supportMessages: '/support/messages',
  supportFaqs: '/support/faqs',

  messageThread: (threadId: string) => `/messages/${threadId}`,
} as const;
