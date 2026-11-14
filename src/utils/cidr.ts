import { I18nError } from './errors';

export interface CidrInfo {
  /** Network address, host bits zeroed. */
  network: string;
  broadcast: string;
  netmask: string;
  wildcard: string;
  firstHost: string | null;
  lastHost: string | null;
  totalAddresses: number;
  usableHosts: number;
  prefix: number;
}

const IPV4_PATTERN = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

export function ipv4ToNumber(ip: string): number | null {
  const match = IPV4_PATTERN.exec(ip.trim());
  if (!match) {
    return null;
  }

  const octets = match.slice(1).map(Number);
  if (octets.some(octet => octet < 0 || octet > 255)) {
    return null;
  }

  return (
    ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
  );
}

export function numberToIpv4(value: number): string {
  const normalized = value >>> 0;
  return [
    (normalized >>> 24) & 0xff,
    (normalized >>> 16) & 0xff,
    (normalized >>> 8) & 0xff,
    normalized & 0xff,
  ].join('.');
}

export function calculateCidr(input: string): CidrInfo {
  const [addressPart, prefixPart, ...rest] = input.trim().split('/');
  if (rest.length > 0 || !addressPart) {
    throw new I18nError('cidr.invalidCidr');
  }

  const address = ipv4ToNumber(addressPart);
  if (address === null) {
    throw new I18nError('cidr.invalidIp');
  }

  const prefix = prefixPart === undefined ? 32 : Number(prefixPart);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    throw new I18nError('cidr.invalidPrefix');
  }

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (address & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);
  const usableHosts = prefix >= 31 ? 0 : Math.max(0, totalAddresses - 2);

  return {
    network: numberToIpv4(network),
    broadcast: numberToIpv4(broadcast),
    netmask: numberToIpv4(mask),
    wildcard: numberToIpv4(~mask >>> 0),
    firstHost: prefix >= 31 ? null : numberToIpv4(network + 1),
    lastHost: prefix >= 31 ? null : numberToIpv4(broadcast - 1),
    totalAddresses,
    usableHosts,
    prefix,
  };
}

export function isIpInCidr(ip: string, cidr: string): boolean {
  const address = ipv4ToNumber(ip);
  if (address === null) {
    throw new I18nError('cidr.invalidIp');
  }

  const info = calculateCidr(cidr);
  const network = ipv4ToNumber(info.network);
  const broadcast = ipv4ToNumber(info.broadcast);
  if (network === null || broadcast === null) {
    return false;
  }

  return address >= network && address <= broadcast;
}
