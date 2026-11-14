import { describe, expect, it } from 'vitest';
import {
  buildOtpAuthUrl,
  decodeBase32,
  generateHotp,
  generateTotp,
  totpRemainingSeconds,
} from './totp';
import { I18nError } from './errors';

const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'; // 12345678901234567890

function text(bytes: Uint8Array): string {
  return String.fromCharCode(...bytes);
}

describe('totp', () => {
  it('decodes Base32 secrets', () => {
    expect(text(decodeBase32('GEZDGNBVGY3TQOJQ'))).toBe('1234567890');
    expect(text(decodeBase32('gezd gnbv-gy3t qojq==='))).toBe('1234567890');
  });

  it('rejects invalid secrets', () => {
    expect(() => decodeBase32('')).toThrow(I18nError);
    expect(() => decodeBase32('ABC1')).toThrow(I18nError);
  });

  it('matches RFC 6238 SHA-1 test vectors', () => {
    const options = { digits: 8, period: 30 };
    expect(generateTotp(RFC_SECRET, { ...options, timestamp: 59 * 1000 })).toBe(
      '94287082'
    );
    expect(
      generateTotp(RFC_SECRET, { ...options, timestamp: 1111111109 * 1000 })
    ).toBe('07081804');
    expect(
      generateTotp(RFC_SECRET, { ...options, timestamp: 2000000000 * 1000 })
    ).toBe('69279037');
  });

  it('supports SHA-256 secrets', () => {
    const sha256Secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZA';
    expect(
      generateTotp(sha256Secret, {
        timestamp: 59 * 1000,
        digits: 8,
        period: 30,
        algorithm: 'SHA256',
      })
    ).toBe('46119246');
  });

  it('generates HOTP codes for a counter', () => {
    // RFC 4226 test vector: counter 0 -> 755224, counter 1 -> 287082
    const key = decodeBase32(RFC_SECRET);
    expect(generateHotp(key, 0)).toBe('755224');
    expect(generateHotp(key, 1)).toBe('287082');
  });

  it('computes the remaining seconds without returning zero', () => {
    expect(totpRemainingSeconds(30, 30_000)).toBe(30);
    expect(totpRemainingSeconds(30, 31_000)).toBe(29);
    expect(totpRemainingSeconds(30, 59_999)).toBe(1);
  });

  it('builds an otpauth URL', () => {
    const url = buildOtpAuthUrl({
      secret: RFC_SECRET,
      issuer: 'Example App',
      account: 'me@example.com',
      digits: 8,
      period: 60,
      algorithm: 'SHA256',
    });

    expect(
      url.startsWith('otpauth://totp/Example%20App:me%40example.com?')
    ).toBe(true);
    expect(url).toContain(`secret=${RFC_SECRET}`);
    expect(url).toContain('algorithm=SHA256');
    expect(url).toContain('digits=8');
    expect(url).toContain('period=60');
  });
});
