import type {
  Category,
  DeliveryStatus,
  OrderStatus,
  ProjectType,
  QuoteStatus,
} from '@/types';

export const APP = {
  name: 'GOODR',
  legalName: 'GOODR HVAC Supply',
  tagline: 'Order HVAC equipment. Track every delivery.',
  supportEmail: 'support@goodr.com',
  supportPhone: '(800) 555-4663',
  supportHours: 'Mon–Fri · 6:00 AM – 8:00 PM MT',
} as const;

/** HVAC catalog categories (also drive the Category screen grid). */
export const CATEGORIES: Category[] = [
  { id: 'ac-systems', name: 'AC Systems', icon: 'air-conditioner', blurb: 'Split & packaged cooling systems' },
  { id: 'furnaces', name: 'Furnaces', icon: 'fire', blurb: 'Gas & electric heating furnaces' },
  { id: 'heat-pumps', name: 'Heat Pumps', icon: 'sun-snowflake', blurb: 'All-season heating & cooling' },
  { id: 'air-handlers', name: 'Air Handlers', icon: 'fan', blurb: 'Variable-speed indoor air movers' },
  { id: 'mini-splits', name: 'Ductless Mini Splits', icon: 'air-filter', blurb: 'Zoned ductless comfort' },
  { id: 'thermostats', name: 'Thermostats', icon: 'thermostat', blurb: 'Smart & programmable controls' },
  { id: 'rooftop-units', name: 'Rooftop Units', icon: 'home-roof', blurb: 'Commercial packaged RTUs' },
  { id: 'accessories', name: 'Accessories', icon: 'tools', blurb: 'Parts, pads, line sets & more' },
];

/** The only equipment brands GOODR carries. */
export const BRANDS = ['Goodman', 'Daikin', 'Amana'] as const;

/* ------------------------------- Quote form ------------------------------- */

export const QUOTE_SYSTEM_TYPES = [
  'Straight AC',
  'Heat Pump',
  'Mini Split',
  'Rooftop Unit',
  'Other / Special Quote',
] as const;

export const QUOTE_TONNAGES = ['1.5 Ton', '2 Ton', '2.5 Ton', '3 Ton', '3.5 Ton', '4 Ton', '5 Ton'] as const;

export const QUOTE_FURNACE_BTU = [
  '40,000 BTU',
  '60,000 BTU',
  '80,000 BTU',
  '100,000 BTU',
  '120,000 BTU',
] as const;

export const QUOTE_COIL_WIDTHS = ['14"', '17.5"', '21"', '24.5"'] as const;

export const QUOTE_EFFICIENCY_FUEL = [
  '80% Gas Furnace',
  '92% Gas Furnace',
  '96% Gas Furnace',
  'Electric',
  'Natural Gas',
  'Propane',
] as const;

export const QUOTE_DELIVERY_TYPES = [
  'Curbside',
  'Jobsite',
  'Rooftop Lift Needed',
  'Inside Drop-Off',
] as const;

export const QUOTE_URGENCY = ['Same Day', 'Next Day', 'Scheduled Date'] as const;

export const CATEGORY_MAP: Record<string, Category> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {},
);

export const PROJECT_TYPES: ProjectType[] = ['Residential', 'Commercial'];

export const TIME_WINDOWS: string[] = [
  '8:00 AM – 11:00 AM',
  '11:00 AM – 2:00 PM',
  '2:00 PM – 5:00 PM',
  'Anytime (Business Hours)',
];

export const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', hint: '2–4 business days', fee: 0 },
  { id: 'scheduled', label: 'Scheduled Delivery', hint: 'Pick a date & window', fee: 45 },
  { id: 'priority', label: 'Priority Delivery', hint: 'Next business day', fee: 120 },
] as const;

export const DELIVERY_ISSUE_TYPES = [
  'Customer unavailable',
  'Wrong address',
  'Damaged equipment',
  'Access blocked',
  'Other',
] as const;

export const EQUIPMENT_TYPES = [
  'Commercial Rooftop Unit',
  'Condensing Boiler',
  'Custom HVAC System',
  'Chiller',
  'Make-Up Air Unit',
  'VRF / VRV System',
  'Other',
] as const;

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

export const DELIVERY_STATUS_FLOW: DeliveryStatus[] = [
  'Assigned',
  'Accepted',
  'En Route',
  'Arrived',
  'Delivered',
];

export const ORDER_FILTERS: (OrderStatus | 'All')[] = [
  'All',
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const QUOTE_FILTERS: { key: string; label: string; statuses: QuoteStatus[] }[] = [
  { key: 'all', label: 'All', statuses: ['Pending', 'Approved', 'Accepted', 'Rejected', 'Expired'] },
  { key: 'pending', label: 'Pending', statuses: ['Pending'] },
  { key: 'approved', label: 'Approved', statuses: ['Approved', 'Accepted'] },
  { key: 'closed', label: 'Rejected / Expired', statuses: ['Rejected', 'Expired'] },
];

export const CATALOG_SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'name', label: 'Name (A–Z)' },
] as const;

export type CatalogSort = (typeof CATALOG_SORTS)[number]['key'];
