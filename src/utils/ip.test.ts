import { describe, expect, it } from 'vitest';
import { isValidIP, isValidIPv4, isValidIPv6 } from './ip';

describe('isValidIPv4', () => {
  it('accepts valid dotted-decimal addresses', () => {
    expect(isValidIPv4('192.168.1.1')).toBe(true);
    expect(isValidIPv4('0.0.0.0')).toBe(true);
    expect(isValidIPv4('255.255.255.255')).toBe(true);
  });

  it('rejects octets outside 0-255', () => {
    expect(isValidIPv4('256.1.1.1')).toBe(false);
    expect(isValidIPv4('999.999.999.999')).toBe(false);
  });

  it('rejects leading zeros and incomplete addresses', () => {
    expect(isValidIPv4('01.2.3.4')).toBe(false);
    expect(isValidIPv4('001.2.3.4')).toBe(false);
    expect(isValidIPv4('1.2.3')).toBe(false);
    expect(isValidIPv4('1.2.3.4.5')).toBe(false);
  });
});

describe('isValidIPv6', () => {
  it('accepts common IPv6 forms', () => {
    expect(isValidIPv6('::1')).toBe(true);
    expect(isValidIPv6('2001:db8::1')).toBe(true);
  });

  it('rejects non-IPv6 input', () => {
    expect(isValidIPv6('not-an-ip')).toBe(false);
  });
});

describe('isValidIP', () => {
  it('accepts either address family', () => {
    expect(isValidIP('1.2.3.4')).toBe(true);
    expect(isValidIP('::1')).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isValidIP('999.1.1.1')).toBe(false);
    expect(isValidIP('')).toBe(false);
  });
});
