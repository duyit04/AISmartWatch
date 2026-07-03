import { describe, it, expect } from 'vitest';
import {
  cn,
  formatPrice,
  validateEmail,
  validatePhone,
} from './utils';

describe('cn', () => {
  it('joins truthy class strings with spaces', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values (boolean, null, undefined)', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('returns empty string when no truthy inputs', () => {
    expect(cn(false, null, undefined)).toBe('');
  });
});

describe('formatPrice', () => {
  it('formats USD by default', () => {
    expect(formatPrice(399)).toBe('$399.00');
  });

  it('handles fractional cents without showing them', () => {
    expect(formatPrice(12.5)).toBe('$12.50');
  });

  it('respects a custom currency code', () => {
    const result = formatPrice(1000, 'EUR');
    // Locale-formatted EUR; just assert currency symbol and presence of digits
    expect(result).toMatch(/€/);
    expect(result).toMatch(/1.000|1000/);
  });
});

describe('validateEmail', () => {
  it.each([
    ['user@example.com', true],
    ['user.name+tag@sub.example.co', true],
    ['plainstring', false],
    ['missing@dot', false],
    ['@nope.com', false],
    ['spaces in@email.com', false],
    ['', false],
  ])('validateEmail(%j) === %s', (input, expected) => {
    expect(validateEmail(input)).toBe(expected);
  });
});

describe('validatePhone', () => {
  it.each([
    ['+1 555 123 4567', true],
    ['(555) 123-4567', true],
    ['5551234567', true],
    ['12345', false],
    ['abc', false],
  ])('validatePhone(%j) === %s', (input, expected) => {
    expect(validatePhone(input)).toBe(expected);
  });
});
