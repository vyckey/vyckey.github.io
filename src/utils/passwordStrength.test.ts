import { describe, expect, it } from 'vitest';
import { calculatePasswordStrength } from './passwordStrength';

describe('calculatePasswordStrength', () => {
  it('returns 0 for an empty password', () => {
    expect(calculatePasswordStrength('')).toBe(0);
  });

  it('gives a stronger score to longer, mixed passwords', () => {
    const weak = calculatePasswordStrength('abcdefgh');
    const strong = calculatePasswordStrength('Abcdefgh123!@#$%^&');

    expect(weak).toBeLessThan(50);
    expect(strong).toBeGreaterThanOrEqual(80);
    expect(strong).toBeLessThanOrEqual(100);
  });
});
