import { formatCompactCurrency, formatCurrency, initials, pluralize, truncate } from '@/utils/format';

describe('formatCurrency', () => {
  it('formats numbers as USD without cents by default', () => {
    expect(formatCurrency(3250)).toBe('$3,250');
  });

  it('returns the fallback for null (quote-only)', () => {
    expect(formatCurrency(null)).toBe('Request Quote');
    expect(formatCurrency(undefined, { fallback: 'TBD' })).toBe('TBD');
  });

  it('includes cents when requested', () => {
    expect(formatCurrency(19.5, { withCents: true })).toBe('$19.50');
  });
});

describe('formatCompactCurrency', () => {
  it('compacts thousands', () => {
    expect(formatCompactCurrency(48200)).toBe('$48.2k');
    expect(formatCompactCurrency(10000)).toBe('$10k');
    expect(formatCompactCurrency(450)).toBe('$450');
  });
});

describe('initials', () => {
  it('takes up to two initials', () => {
    expect(initials('Michael Reyes')).toBe('MR');
    expect(initials('Carlos')).toBe('C');
  });
});

describe('pluralize', () => {
  it('pluralizes based on count', () => {
    expect(pluralize(1, 'unit')).toBe('unit');
    expect(pluralize(3, 'unit')).toBe('units');
    expect(pluralize(2, 'box', 'boxes')).toBe('boxes');
  });
});

describe('truncate', () => {
  it('truncates long strings with an ellipsis', () => {
    expect(truncate('Hello world', 6)).toBe('Hello…');
    expect(truncate('Short', 20)).toBe('Short');
  });
});
