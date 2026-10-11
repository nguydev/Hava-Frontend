import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';
import { qk } from '@/services/queries';
import { useAuthStore, toast } from '@/store/zustand';
import type {
  DeliveryStatus,
  LoginPayload,
  NotificationPreferences,
  RegisterPayload,
  User,
} from '@/types';
import type {
  AddressValues,
  DeliveryIssueValues,
  EtaUpdateValues,
  ProofOfDeliveryValues,
  QuoteRequestValues,
} from '@/validation/schemas';
import type { AddPaymentMethodInput, CreateOrderInput } from '@/services/api';

function errMessage(e: unknown): string {
  if (e instanceof Error && e.message) return e.message;
  return 'Something went wrong. Please try again.';
}

/* ---------------------------------- Auth ---------------------------------- */

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (payload: LoginPayload) => api.auth.login(payload),
    onSuccess: (session) => login(session),
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => api.auth.register(payload),
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => api.auth.forgotPassword(email),
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      api.auth.verifyOtp(email, code),
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }) =>
      api.auth.resetPassword(email, otp, newPassword),
    onSuccess: () => toast.success('Password reset successfully!'),
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      api.auth.changePassword(currentPassword, newPassword),
    onSuccess: () => toast.success('Password updated.'),
    onError: (e) => toast.error(errMessage(e)),
  });
}


/* --------------------------------- Orders --------------------------------- */

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => api.orders.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: qk.notifications() });
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

/* --------------------------------- Quotes --------------------------------- */

export function useSubmitQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, attachments }: { input: QuoteRequestValues; attachments?: string[] }) =>
      api.quotes.submit(input, attachments ?? []),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.quotes() });
      qc.invalidateQueries({ queryKey: qk.notifications() });
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useAcceptQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.quotes.accept(id),
    onSuccess: (quote) => {
      qc.invalidateQueries({ queryKey: qk.quotes() });
      qc.invalidateQueries({ queryKey: qk.quote(quote.id) });
      toast.success('Quote accepted. We’ll be in touch to schedule.');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

/* ------------------------------- Deliveries ------------------------------- */

export function useUpdateDeliveryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DeliveryStatus }) =>
      api.deliveries.updateStatus(id, status),
    onSuccess: (delivery) => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: qk.delivery(delivery.id) });
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success(`Status updated to ${delivery.status}.`);
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useUpdateETA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EtaUpdateValues }) =>
      api.deliveries.updateEta(id, input),
    onSuccess: (delivery) => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: qk.delivery(delivery.id) });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: qk.notifications() });
      toast.success('ETA updated.');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useSubmitProofOfDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProofOfDeliveryValues }) =>
      api.deliveries.submitProof(id, input),
    onSuccess: (delivery) => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: qk.delivery(delivery.id) });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useCreateDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => api.deliveries.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: qk.notifications() });
      toast.success('Delivery created and added to your route!');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useClaimDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deliveries.claim(id),
    onSuccess: (delivery) => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: qk.delivery(delivery.id) });
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success(`Delivery #${delivery.id} claimed! Added to your route.`);
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useReportDeliveryIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DeliveryIssueValues }) =>
      api.deliveries.reportIssue(id, input),
    onSuccess: (delivery) => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: qk.delivery(delivery.id) });
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

/* ----------------------------- Notifications ------------------------------ */

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.notifications.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.notifications() }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.notifications.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.notifications() });
      toast.success('All notifications marked as read.');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

/* -------------------------------- Profile --------------------------------- */

export function useUpdateProfile() {
  const qc = useQueryClient();
  const role = useAuthStore((s) => s.role);
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (patch: Partial<User>) => api.profile.update(role!, patch),
    onSuccess: (user) => {
      updateUser(user);
      qc.invalidateQueries({ queryKey: qk.profile(role) });
      toast.success('Profile updated.');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useSaveAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddressValues & { id?: string }) => api.profile.saveAddress(input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: qk.addresses() });
      toast.success(vars.id ? 'Address updated.' : 'Address saved.');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.profile.deleteAddress(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.addresses() });
      toast.success('Address removed.');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prefs: NotificationPreferences) =>
      api.profile.updateNotificationPreferences(prefs),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.notificationPreferences() }),
    onError: (e) => toast.error(errMessage(e)),
  });
}

/* -------------------------------- Billing --------------------------------- */

export function useAddPaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddPaymentMethodInput) => api.billing.addPaymentMethod(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.paymentMethods() });
      toast.success('Card added.');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.billing.deletePaymentMethod(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.paymentMethods() });
      toast.success('Card removed.');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function useSetDefaultPaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.billing.setDefaultPaymentMethod(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.paymentMethods() });
      toast.success('Default card updated.');
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

export function usePayInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.billing.payInvoice(id),
    onSuccess: (inv) => {
      qc.invalidateQueries({ queryKey: qk.invoices() });
      qc.invalidateQueries({ queryKey: qk.notifications() });
      toast.success(`Invoice ${inv.id} paid.`);
    },
    onError: (e) => toast.error(errMessage(e)),
  });
}

/* -------------------------------- Support --------------------------------- */

export function useSendSupportMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => api.support.sendMessage(text),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.supportThread() }),
    onError: (e) => toast.error(errMessage(e)),
  });
}

/* --------------------------- Delivery messaging --------------------------- */

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, text }: { threadId: string; text: string }) =>
      api.messages.send(threadId, text),
    onSuccess: (thread) =>
      qc.invalidateQueries({ queryKey: qk.messageThread(thread.threadId) }),
    onError: (e) => toast.error(errMessage(e)),
  });
}
