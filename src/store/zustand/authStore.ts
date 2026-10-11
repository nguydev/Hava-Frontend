import { create } from 'zustand';

import { storage, STORAGE_KEYS } from '@/lib/storage';
import { setSentryUser } from '@/lib/sentry';
import type { AuthSession, Role, User } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  /** Re-read the session from storage (called after async hydrateStorage()). */
  rehydrate: () => void;
}

// Initial read (empty until hydrateStorage() runs; rehydrate() fills it in).
const savedToken = storage.getString(STORAGE_KEYS.authToken);
const savedUser = storage.getObject<User>(STORAGE_KEYS.authUser);
const savedRole = storage.getString(STORAGE_KEYS.role) as Role | null;

export const useAuthStore = create<AuthState>((set, get) => ({
  token: savedToken,
  user: savedUser,
  role: savedRole,
  isAuthenticated: Boolean(savedToken && savedUser),

  rehydrate: () => {
    const token = storage.getString(STORAGE_KEYS.authToken);
    const user = storage.getObject<User>(STORAGE_KEYS.authUser);
    const role = storage.getString(STORAGE_KEYS.role) as Role | null;
    if (token && user) setSentryUser({ id: user.id, email: user.email });
    set({ token, user, role, isAuthenticated: Boolean(token && user) });
  },

  login: ({ token, user }) => {
    storage.set(STORAGE_KEYS.authToken, token);
    storage.setObject(STORAGE_KEYS.authUser, user);
    storage.set(STORAGE_KEYS.role, user.role);
    setSentryUser({ id: user.id, email: user.email });
    set({ token, user, role: user.role, isAuthenticated: true });
  },

  logout: () => {
    storage.delete(STORAGE_KEYS.authToken);
    storage.delete(STORAGE_KEYS.authUser);
    storage.delete(STORAGE_KEYS.role);
    setSentryUser(null);
    set({ token: null, user: null, role: null, isAuthenticated: false });
  },

  updateUser: (patch) => {
    const current = get().user;
    if (!current) return;
    const next = { ...current, ...patch };
    storage.setObject(STORAGE_KEYS.authUser, next);
    set({ user: next });
  },
}));
