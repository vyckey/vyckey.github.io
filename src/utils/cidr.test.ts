import { describe, expect, it } from 'vitest';
import { calculateCidr, ipv4ToNumber, isIpInCidr, numberToIpv4 } from './cidr';
import { I18nError } from './errors';

describe('cidr', () => {
  it('converts IPv4 addresses to numbers and back', () => {
    expect(ipv4ToNumber('192.168.1.1')).toBe(3232235777);
    expect(numberToIpv4(3232235777)).toBe('192.168.1.1');
    expect(ipv4ToNumber('256.1.1.1')).toBeNull();
    expect(ipv4ToNumber('1.2.3')).toBeNull();
  });

  it('calculates a /24 subnet', () => {
    const info = calculateCidr('192.168.1.10/24');

    expect(info.network).toBe('192.168.1.0');
    expect(info.broadcast).toBe('192.168.1.255');
    expect(info.netmask).toBe('255.255.255.0');
    expect(info.wildcard).toBe('0.0.0.255');
    expect(info.firstHost).toBe('192.168.1.1');
    expect(info.lastHost).toBe('192.168.1.254');
    expect(info.totalAddresses).toBe(256);
    expect(info.usableHosts).toBe(254);
  });

  it('handles large, point-to-point and host prefixes', () => {
    expect(calculateCidr('10.0.0.0/8').usableHosts).toBe(16777214);
    expect(calculateCidr('10.0.0.0/8').totalAddresses).toBe(16777216);
    expect(calculateCidr('10.0.0.0/31')).toMatchObject({
      totalAddresses: 2,
      usableHosts: 0,
      firstHost: null,
    });
    expect(calculateCidr('10.0.0.1/32')).toMatchObject({
      network: '10.0.0.1',
      broadcast: '10.0.0.1',
      totalAddresses: 1,
      usableHosts: 0,
    });
    expect(calculateCidr('0.0.0.0/0').broadcast).toBe('255.255.255.255');
  });

  it('checks whether an IP is inside a subnet', () => {
    expect(isIpInCidr('192.168.1.255', '192.168.1.0/24')).toBe(true);
    expect(isIpInCidr('192.168.2.1', '192.168.1.0/24')).toBe(false);
  });

  it('rejects malformed input', () => {
    expect(() => calculateCidr('192.168.1.1/33')).toThrow(I18nError);
    expect(() => calculateCidr('192.168.1.1/x')).toThrow(I18nError);
    expect(() => calculateCidr('999.1.1.1/24')).toThrow(I18nError);
    expect(() => calculateCidr('192.168.1.1/24/1')).toThrow(I18nError);
  });
});
