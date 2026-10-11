import { fireEvent, render, screen } from '@testing-library/react-native';

import { OrderCard } from '@/components/cards/OrderCard';
import type { Order } from '@/types';
import { makeOrderTimeline } from '@/utils/timeline';

const order: Order = {
  id: 'MH-1042',
  createdAt: '2026-07-03T09:12:00',
  status: 'Out for Delivery',
  items: [
    { productId: 'p1', name: 'Goodman 3 Ton Split System', brand: 'Goodman', model: 'GSXH503610', quantity: 2, unitPrice: 3250 },
    { productId: 'p2', name: 'Trane Air Handler', brand: 'Trane', model: 'TAM9A0C36', quantity: 2, unitPrice: 1850 },
  ],
  subtotal: 10200,
  deliveryFee: 120,
  total: 10320,
  address: {
    id: 'addr-1',
    label: 'Maple Ridge Residence',
    line1: '2841 Maple Ridge Dr',
    city: 'Aurora',
    state: 'CO',
    zip: '80013',
    contactName: 'Dave Kohl',
    contactPhone: '(303) 555-0142',
  },
  contactName: 'Dave Kohl',
  contactPhone: '(303) 555-0142',
  preferredDate: 'Jul 4, 2026',
  timeWindow: '12:00 PM – 3:00 PM',
  liftgate: true,
  driver: null,
  eta: 'Today · 2:30 PM',
  timeline: makeOrderTimeline('Out for Delivery'),
};

describe('OrderCard', () => {
  it('renders order number, status, and total', () => {
    render(<OrderCard order={order} onPress={() => {}} />);
    expect(screen.getByText('#MH-1042')).toBeOnTheScreen();
    expect(screen.getByText('Out for Delivery')).toBeOnTheScreen();
    expect(screen.getByText('$10,320')).toBeOnTheScreen();
  });

  it('summarizes the item count', () => {
    render(<OrderCard order={order} onPress={() => {}} />);
    // 4 total units across the two line items
    expect(screen.getByText(/4 units/)).toBeOnTheScreen();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    render(<OrderCard order={order} onPress={onPress} testID="order-card" />);
    fireEvent.press(screen.getByTestId('order-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
