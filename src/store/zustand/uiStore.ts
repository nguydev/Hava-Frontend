import { create } from 'zustand';

export type SnackType = 'success' | 'error' | 'info' | 'warning';

export interface SnackItem {
  id: number;
  message: string;
  type: SnackType;
}

interface UIState {
  snackbar: SnackItem | null;
  showSnackbar: (message: string, type?: SnackType) => void;
  hideSnackbar: () => void;
}

let seq = 0;

export const useUIStore = create<UIState>((set) => ({
  snackbar: null,
  showSnackbar: (message, type = 'info') =>
    set({ snackbar: { id: ++seq, message, type } }),
  hideSnackbar: () => set({ snackbar: null }),
}));

/** Imperative helper for use outside React (e.g. mutation callbacks). */
export const toast = {
  success: (m: string) => useUIStore.getState().showSnackbar(m, 'success'),
  error: (m: string) => useUIStore.getState().showSnackbar(m, 'error'),
  info: (m: string) => useUIStore.getState().showSnackbar(m, 'info'),
  warning: (m: string) => useUIStore.getState().showSnackbar(m, 'warning'),
};
