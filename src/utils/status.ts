import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/theme';
import type {
  Availability,
  DeliveryStatus,
  OrderStatus,
  QuoteStatus,
} from '@/types';

export interface StatusDescriptor {
  label: string;
  color: string; // hex
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export function orderStatusMeta(status: OrderStatus): StatusDescriptor {
  switch (status) {
    case 'Pending':
      return { label: 'Pending', color: colors.steel, icon: 'clock-outline' };
    case 'Confirmed':
      return { label: 'Confirmed', color: colors.info, icon: 'check-circle-outline' };
    case 'Preparing':
      return { label: 'Preparing', color: colors.amber, icon: 'package-variant-closed' };
    case 'Out for Delivery':
      return { label: 'Out for Delivery', color: colors.heat, icon: 'truck-fast-outline' };
    case 'Delivered':
      return { label: 'Delivered', color: colors.ok, icon: 'check-decagram' };
    case 'Cancelled':
      return { label: 'Cancelled', color: colors.alert, icon: 'close-circle-outline' };
    default:
      return { label: status, color: colors.ink2, icon: 'information-outline' };
  }
}

export function quoteStatusMeta(status: QuoteStatus): StatusDescriptor {
  switch (status) {
    case 'Pending':
      return { label: 'Pending', color: colors.steel, icon: 'clock-outline' };
    case 'Approved':
      return { label: 'Approved', color: colors.info, icon: 'file-check-outline' };
    case 'Accepted':
      return { label: 'Accepted', color: colors.ok, icon: 'check-decagram' };
    case 'Rejected':
      return { label: 'Rejected', color: colors.alert, icon: 'close-circle-outline' };
    case 'Expired':
      return { label: 'Expired', color: colors.ink3, icon: 'timer-off-outline' };
    default:
      return { label: status, color: colors.ink2, icon: 'information-outline' };
  }
}

export function deliveryStatusMeta(status: DeliveryStatus): StatusDescriptor {
  switch (status) {
    case 'Assigned':
      return { label: 'Assigned', color: colors.steel, icon: 'clipboard-text-outline' };
    case 'Accepted':
      return { label: 'Accepted', color: colors.info, icon: 'thumb-up-outline' };
    case 'En Route':
      return { label: 'En Route', color: colors.heat, icon: 'truck-fast-outline' };
    case 'Arrived':
      return { label: 'Arrived', color: colors.amber, icon: 'map-marker-check-outline' };
    case 'Delivered':
      return { label: 'Delivered', color: colors.ok, icon: 'check-decagram' };
    case 'Issue Reported':
      return { label: 'Issue Reported', color: colors.alert, icon: 'alert-outline' };
    default:
      return { label: status, color: colors.ink2, icon: 'information-outline' };
  }
}

export function availabilityMeta(a: Availability): StatusDescriptor {
  switch (a) {
    case 'In Stock':
      return { label: 'In Stock', color: colors.ok, icon: 'check-circle' };
    case 'Limited Stock':
      return { label: 'Limited Stock', color: colors.amber, icon: 'alert-circle-outline' };
    case 'Special Order':
      return { label: 'Special Order', color: colors.info, icon: 'calendar-clock' };
    case 'Out of Stock':
      return { label: 'Out of Stock', color: colors.ink3, icon: 'close-circle-outline' };
    default:
      return { label: a, color: colors.ink2, icon: 'information-outline' };
  }
}
