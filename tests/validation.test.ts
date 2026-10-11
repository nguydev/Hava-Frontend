import {
  loginSchema,
  quoteRequestSchema,
  registerSchema,
} from '@/validation/schemas';

describe('loginSchema', () => {
  it('accepts a valid login', () => {
    const result = loginSchema.safeParse({
      email: 'michael@summitcomfort.co',
      password: 'secret123',
      role: 'contractor',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'nope', password: 'x', role: 'contractor' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'email')).toBe(true);
    }
  });

  it('requires a role', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'x' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      company: 'Acme HVAC',
      contactName: 'Jane Doe',
      email: 'jane@acme.co',
      phone: '(303) 555-0100',
      password: 'password1',
      confirmPassword: 'password2',
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'confirmPassword')).toBe(true);
    }
  });

  it('requires accepting the terms', () => {
    const result = registerSchema.safeParse({
      company: 'Acme HVAC',
      contactName: 'Jane Doe',
      email: 'jane@acme.co',
      phone: '(303) 555-0100',
      password: 'password1',
      confirmPassword: 'password1',
      acceptTerms: false,
    });
    expect(result.success).toBe(false);
  });
});

describe('quoteRequestSchema', () => {
  it('accepts a valid equipment request and coerces quantity', () => {
    const result = quoteRequestSchema.safeParse({
      systemType: 'Rooftop Unit',
      quantity: '4',
      jobSite: '1200 Corporate Blvd, Denver, CO',
      needDelivery: 'Yes',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.quantity).toBe(4);
    }
  });

  it('rejects a missing system type', () => {
    const result = quoteRequestSchema.safeParse({
      systemType: '',
      quantity: 1,
      jobSite: 'Somewhere',
      needDelivery: 'Yes',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a quantity below 1', () => {
    const result = quoteRequestSchema.safeParse({
      systemType: 'Heat Pump',
      quantity: 0,
      jobSite: 'Somewhere',
      needDelivery: 'Yes',
    });
    expect(result.success).toBe(false);
  });
});
