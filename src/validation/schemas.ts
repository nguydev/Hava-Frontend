import { z } from 'zod';

import { DELIVERY_ISSUE_TYPES } from '@/constants';

/* -------------------------------------------------------------------------- */
/* Reusable field primitives                                                  */
/* -------------------------------------------------------------------------- */

const email = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

const phone = z
  .string()
  .min(1, 'Phone number is required')
  .refine((v) => (v.match(/\d/g) ?? []).length >= 10, 'Enter a valid phone number');

const password = z.string().min(8, 'Password must be at least 8 characters');

const zip = z
  .string()
  .min(1, 'ZIP is required')
  .regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code');

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['contractor', 'driver']),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    role: z.enum(['contractor', 'driver']),
    company: z.string().optional(), // required for contractors (checked below)
    vehicle: z.string().optional(), // drivers only
    contactName: requiredString('Contact name'),
    email,
    phone,
    password,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms to continue' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .superRefine((d, ctx) => {
    if (d.role === 'contractor' && !d.company?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['company'], message: 'Company name is required' });
    }
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/* -------------------------------------------------------------------------- */
/* Quote request                                                              */
/* -------------------------------------------------------------------------- */

export const quoteRequestSchema = z.object({
  systemType: requiredString('System type'),
  brandPreference: z.string().optional(),
  tonnage: z.string().optional(),
  furnaceBtu: z.string().optional(),
  coilWidth: z.string().optional(),
  efficiencyFuel: z.string().optional(),
  quantity: z.coerce
    .number({ invalid_type_error: 'Enter a quantity' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  jobSite: requiredString('Job site address'),
  needDelivery: z.enum(['Yes', 'No']),
  deliveryType: z.string().optional(),
  urgency: z.string().optional(),
  neededBy: z.string().optional(),
  notes: z.string().max(600, 'Keep notes under 600 characters').optional(),
});
export type QuoteRequestValues = z.infer<typeof quoteRequestSchema>;

/* -------------------------------------------------------------------------- */
/* Delivery request                                                           */
/* -------------------------------------------------------------------------- */

export const deliveryRequestSchema = z.object({
  jobSiteLabel: requiredString('Job site name'),
  line1: requiredString('Street address'),
  city: requiredString('City'),
  state: requiredString('State').max(20),
  zip,
  contactName: requiredString('Contact name'),
  contactPhone: phone,
  preferredDate: requiredString('Preferred date'),
  timeWindow: requiredString('Time window'),
  deliveryOption: z.enum(['standard', 'scheduled', 'priority']),
  liftgate: z.boolean(),
  notes: z.string().max(600, 'Keep notes under 600 characters').optional(),
});
export type DeliveryRequestValues = z.infer<typeof deliveryRequestSchema>;

/* -------------------------------------------------------------------------- */
/* Driver: ETA / Proof of delivery / Issue                                    */
/* -------------------------------------------------------------------------- */

export const etaUpdateSchema = z.object({
  eta: requiredString('Estimated arrival time'),
  note: z.string().max(300, 'Keep the note under 300 characters').optional(),
});
export type EtaUpdateValues = z.infer<typeof etaUpdateSchema>;

export const proofOfDeliverySchema = z.object({
  recipientName: requiredString('Recipient name'),
  notes: z.string().max(400, 'Keep notes under 400 characters').optional(),
  photos: z.array(z.string()).min(1, 'Add at least one delivery photo'),
});
export type ProofOfDeliveryValues = z.infer<typeof proofOfDeliverySchema>;

export const deliveryIssueSchema = z.object({
  type: z.enum(DELIVERY_ISSUE_TYPES, {
    errorMap: () => ({ message: 'Select an issue type' }),
  }),
  notes: z
    .string()
    .trim()
    .min(10, 'Please describe the issue (at least 10 characters)')
    .max(600, 'Keep notes under 600 characters'),
  photos: z.array(z.string()).optional(),
});
export type DeliveryIssueValues = z.infer<typeof deliveryIssueSchema>;

/* -------------------------------------------------------------------------- */
/* Profile / Address                                                          */
/* -------------------------------------------------------------------------- */

export const editProfileSchema = z.object({
  name: requiredString('Name'),
  email,
  phone,
  company: z.string().optional(),
  businessType: z.string().optional(),
  address: z.string().optional(),
  vehicle: z.string().optional(),
});
export type EditProfileValues = z.infer<typeof editProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: password,
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: 'New password must be different',
    path: ['newPassword'],
  });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

/* -------------------------------------------------------------------------- */
/* Payment                                                                    */
/* -------------------------------------------------------------------------- */

export const addCardSchema = z.object({
  holder: requiredString('Cardholder name'),
  number: z
    .string()
    .min(1, 'Card number is required')
    .refine((v) => {
      const d = v.replace(/\D/g, '');
      return d.length >= 13 && d.length <= 19;
    }, 'Enter a valid card number'),
  expiry: z
    .string()
    .min(1, 'Expiry is required')
    .regex(/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/, 'Use MM/YY'),
  cvc: z
    .string()
    .min(1, 'CVC is required')
    .regex(/^\d{3,4}$/, 'Enter a valid CVC'),
  isDefault: z.boolean().optional(),
});
export type AddCardValues = z.infer<typeof addCardSchema>;

export const addressSchema = z.object({
  label: requiredString('Site name'),
  line1: requiredString('Street address'),
  city: requiredString('City'),
  state: requiredString('State').max(20),
  zip,
  contactName: requiredString('Contact name'),
  contactPhone: phone,
  isDefault: z.boolean().optional(),
});
export type AddressValues = z.infer<typeof addressSchema>;
