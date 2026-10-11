import type { Address, CardBrand, DeliveryStatus, OrderStatus, Role } from '@/types';

/** Query/params & payload shapes for the API service surface. */

export type ProductQuery = {
  search?: string;
  categoryId?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  nextPage: number | null;
  total: number;
};

export type OrderQuery = {
  status?: OrderStatus | 'All';
  search?: string;
  page?: number;
  limit?: number;
};

export type DeliveryScopeQuery = {
  scope?: 'today' | 'history' | 'available' | 'all';
};

export type QuoteQuery = {
  status?: string;
  page?: number;
  limit?: number;
};

export interface CreateOrderItemInput {
  productId: string;
  name: string;
  brand: string;
  model: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  address: Address;
  contactName: string;
  contactPhone: string;
  preferredDate: string;
  timeWindow: string;
  notes?: string;
  liftgate: boolean;
  deliveryOption: string;
  deliveryFee: number;
  /** Optional job-site reference photos captured during checkout. */
  sitePhotos?: string[];
  /** Payment captured at checkout (optional; omitted for quote-only orders). */
  payment?: {
    kind: 'card' | 'invoice';
    methodId?: string;
    brand?: CardBrand;
    last4?: string;
    label: string;
  };
}

export interface AddPaymentMethodInput {
  holder: string;
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  isDefault?: boolean;
}

export interface UpdateDeliveryStatusInput {
  status: DeliveryStatus;
}

export interface ProfileRoleQuery {
  role: Role;
}
