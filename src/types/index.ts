/**
 * GOODR — domain types.
 * These describe the shape of every entity flowing through the app.
 */

export type Role = 'contractor' | 'driver';

export type Availability =
  | 'In Stock'
  | 'Limited Stock'
  | 'Special Order'
  | 'Out of Stock';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type QuoteStatus =
  | 'Pending'
  | 'Approved'
  | 'Accepted'
  | 'Rejected'
  | 'Expired';

export type DeliveryStatus =
  | 'Assigned'
  | 'Accepted'
  | 'En Route'
  | 'Arrived'
  | 'Delivered'
  | 'Issue Reported';

export type ProjectType = 'Residential' | 'Commercial';

export type DeliveryPriority = 'Standard' | 'Priority' | 'Urgent';

export type DriverAvailability = 'Available' | 'On Delivery' | 'Offline';

export interface Spec {
  label: string;
  value: string;
}

export interface Category {
  id: string; // slug
  name: string;
  icon: string; // MaterialCommunityIcons glyph name
  blurb: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  model: string;
  capacity: string;
  seerRating?: string;
  fuelType?: string;
  efficiency?: string;
  warranty?: string;
  dimensions?: string;
  weight?: string;
  price: number | null; // null => quote-only equipment
  availability: Availability;
  image: string;
  exclusive?: boolean;
  rating?: number;
  reviews?: number;
  description: string;
  specs: Spec[];
}

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  model: string;
  image: string;
  unitPrice: number | null;
  quantity: number;
  quoteOnly: boolean;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  contactName: string;
  contactPhone: string;
  isDefault?: boolean;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicle?: string;
  rating?: number;
  avatar?: string;
}

export interface TimelineEntry {
  key: string;
  label: string;
  description?: string;
  timestamp?: string;
  done: boolean;
  current?: boolean;
}

export interface ProofOfDelivery {
  photos: string[];
  recipientName: string;
  notes?: string;
  signedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  model: string;
  quantity: number;
  unitPrice: number | null;
  image?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: Address;
  contactName: string;
  contactPhone: string;
  preferredDate: string;
  timeWindow: string;
  notes?: string;
  liftgate: boolean;
  driver?: DriverInfo | null;
  eta?: string | null;
  timeline: TimelineEntry[];
  proofOfDelivery?: ProofOfDelivery | null;
  payment?: OrderPayment | null;
}

export interface Quote {
  id: string;
  equipmentType: string;
  brandPreference?: string;
  model?: string;
  capacity?: string;
  projectType?: ProjectType;
  quantity: number;
  jobSite: string;
  neededBy: string;
  notes?: string;
  attachments: number;
  attachmentUrls?: string[];
  submittedAt: string;
  updatedAt: string;
  status: QuoteStatus;
  quotedPrice?: number | null;
  supplierResponse?: string | null;
  expiresAt?: string | null;
  // Structured equipment-request fields
  systemType?: string;
  tonnage?: string;
  furnaceBtu?: string;
  coilWidth?: string;
  efficiencyFuel?: string;
  needDelivery?: 'Yes' | 'No';
  deliveryType?: string;
  urgency?: string;
}

export interface DeliveryLine {
  name: string;
  model: string;
  quantity: number;
}

export interface DeliveryIssue {
  type: string;
  notes: string;
  photos: string[];
  reportedAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  company: string;
  contractorName: string;
  contactPhone: string;
  jobSite: string;
  address: Address;
  timeWindow: string;
  scheduledDate: string;
  eta?: string | null;
  distanceMi?: number;
  instructions?: string;
  items: DeliveryLine[];
  notes?: string;
  timeline: TimelineEntry[];
  proofOfDelivery?: ProofOfDelivery | null;
  issue?: DeliveryIssue | null;
  completedAt?: string | null;
}

export type NotificationCategory =
  | 'Order'
  | 'Quote'
  | 'Delivery'
  | 'ETA'
  | 'Driver'
  | 'System';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  time: string;
  read: boolean;
  targetType?: 'order' | 'quote' | 'delivery';
  targetId?: string;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  quoteUpdates: boolean;
  deliveryUpdates: boolean;
  etaUpdates: boolean;
  promotions: boolean;
  channelPush: boolean;
  channelEmail: boolean;
  channelSms: boolean;
}

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  // contractor fields
  company?: string;
  businessType?: string;
  approval?: 'Approved' | 'Pending' | 'Rejected';
  address?: string;
  // driver fields
  vehicle?: string;
  driverStatus?: DriverAvailability;
  completedDeliveries?: number;
  rating?: number;
  routePreference?: string;
  adminAssignedRoute?: string;
}

/* ----------------------------- Payment & billing --------------------------- */

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'card';

export interface PaymentMethod {
  id: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  isDefault?: boolean;
}

export type InvoiceStatus = 'Paid' | 'Due' | 'Overdue';

export interface Invoice {
  id: string;
  orderId?: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  paidAt?: string | null;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Unpaid';

export interface OrderPayment {
  status: PaymentStatus;
  brand?: CardBrand;
  last4?: string;
  method?: string; // e.g. "Visa •••• 4242" or "Net-30 Invoice"
  paidAt?: string | null;
}

/* --------------------------------- Live chat ------------------------------- */

export type ChatSender = 'user' | 'agent' | 'system';

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  /** ISO timestamp */
  at: string;
  status?: 'sending' | 'sent' | 'read';
}

export interface ChatAgent {
  name: string;
  title: string;
  online: boolean;
}

/** Support live-chat thread returned by the backend. */
export interface SupportThread {
  id: string;
  messages: ChatMessage[];
  agent?: ChatAgent;
}

/* ----------------------------- Delivery messaging -------------------------- */

export type MessageSender = 'user' | 'peer' | 'system';

export interface DeliveryMessage {
  id: string;
  sender: MessageSender;
  text: string;
  /** ISO timestamp */
  at: string;
}

export interface MessageThread {
  threadId: string;
  peer: string;
  messages: DeliveryMessage[];
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: Role;
}

export interface RegisterPayload {
  role: Role;
  contactName: string;
  email: string;
  phone: string;
  password: string;
  company?: string; // contractors
  vehicle?: string; // drivers
}

export interface FAQ {
  id: string;
  q: string;
  a: string;
  order: number;
}
