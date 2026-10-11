import { useAuthStore } from '@/store/zustand/authStore';
import type { AuthSession } from '@/types';

const session: AuthSession = {
  token: 'test-token',
  user: {
    id: 'u-1',
    role: 'contractor',
    name: 'Test Contractor',
    email: 'test@contractor.co',
    phone: '(303) 555-0100',
    company: 'Test Co',
  },
};

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('starts logged out', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('logs a user in', () => {
    useAuthStore.getState().login(session);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.role).toBe('contractor');
    expect(state.user?.email).toBe('test@contractor.co');
  });

  it('updates the current user', () => {
    useAuthStore.getState().login(session);
    useAuthStore.getState().updateUser({ phone: '(720) 555-0000' });
    expect(useAuthStore.getState().user?.phone).toBe('(720) 555-0000');
  });

  it('logs a user out', () => {
    useAuthStore.getState().login(session);
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });
});
