import { DELIVERY_STATUS_FLOW, ORDER_STATUS_FLOW } from '@/constants';
import type {
  DeliveryStatus,
  OrderStatus,
  TimelineEntry,
} from '@/types';

const ORDER_STEP_DESC: Record<OrderStatus, string> = {
  Pending: 'Delivery request received',
  Confirmed: 'Order confirmed & scheduled',
  Preparing: 'Items being pulled from the warehouse',
  'Out for Delivery': 'Driver en route to the job site',
  Delivered: 'Delivered with photo proof',
  Cancelled: 'Order was cancelled',
};

const DELIVERY_STEP_DESC: Record<DeliveryStatus, string> = {
  Assigned: 'Delivery assigned to you',
  Accepted: 'You accepted this delivery',
  'En Route': 'Driving to the job site',
  Arrived: 'Arrived at the job site',
  Delivered: 'Proof of delivery captured',
  'Issue Reported': 'An issue was reported',
};

export function makeOrderTimeline(
  status: OrderStatus,
  stamps?: Partial<Record<OrderStatus, string>>,
): TimelineEntry[] {
  if (status === 'Cancelled') {
    return [
      {
        key: 'Pending',
        label: 'Pending',
        description: ORDER_STEP_DESC.Pending,
        timestamp: stamps?.Pending,
        done: true,
      },
      {
        key: 'Cancelled',
        label: 'Cancelled',
        description: ORDER_STEP_DESC.Cancelled,
        timestamp: stamps?.Cancelled,
        done: true,
        current: true,
      },
    ];
  }
  const idx = ORDER_STATUS_FLOW.indexOf(status);
  return ORDER_STATUS_FLOW.map((s, i) => ({
    key: s,
    label: s,
    description: ORDER_STEP_DESC[s],
    timestamp: i <= idx ? stamps?.[s] : undefined,
    done: i <= idx,
    current: i === idx,
  }));
}

export function makeDeliveryTimeline(
  status: DeliveryStatus,
  stamps?: Partial<Record<DeliveryStatus, string>>,
): TimelineEntry[] {
  if (status === 'Issue Reported') {
    const upto = DELIVERY_STATUS_FLOW.indexOf('En Route');
    const base = DELIVERY_STATUS_FLOW.slice(0, upto + 1).map((s, i) => ({
      key: s,
      label: s,
      description: DELIVERY_STEP_DESC[s],
      timestamp: stamps?.[s],
      done: true,
      current: false,
    }));
    return [
      ...base,
      {
        key: 'Issue Reported',
        label: 'Issue Reported',
        description: DELIVERY_STEP_DESC['Issue Reported'],
        timestamp: stamps?.['Issue Reported'],
        done: true,
        current: true,
      },
    ];
  }
  const idx = DELIVERY_STATUS_FLOW.indexOf(status);
  return DELIVERY_STATUS_FLOW.map((s, i) => ({
    key: s,
    label: s,
    description: DELIVERY_STEP_DESC[s],
    timestamp: i <= idx ? stamps?.[s] : undefined,
    done: i <= idx,
    current: i === idx,
  }));
}
