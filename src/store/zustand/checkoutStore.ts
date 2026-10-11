import { create } from 'zustand';

import type { DeliveryRequestValues } from '@/validation/schemas';

interface CheckoutState {
  details: DeliveryRequestValues | null;
  sitePhotos: string[];
  setDetails: (details: DeliveryRequestValues, sitePhotos: string[]) => void;
  clear: () => void;
}

/** Holds the in-progress delivery request between the form and the review step. */
export const useCheckoutStore = create<CheckoutState>((set) => ({
  details: null,
  sitePhotos: [],
  setDetails: (details, sitePhotos) => set({ details, sitePhotos }),
  clear: () => set({ details: null, sitePhotos: [] }),
}));
