import CryptoJS from 'crypto-js';
import { I18nError } from './errors';

export type TotpAlgorithm = 'SHA1' | 'SHA256' | 'SHA512';

export const TOTP_ALGORITHMS: TotpAlgorithm[] = ['SHA1', 'SHA256', 'SHA512'];

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** Decode RFC 4648 Base32, ignoring spaces, dashes, padding and case. */
export function decodeBase32(input: string): Uint8Array {
  const value = input.toUpperCase().replace(/[\s=-]/g, '');
  if (!value) {
    throw new I18nError('totp.secretRequired');
  }

  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;

  for (const char of value) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      throw new I18nError('totp.invalidSecret', { char });
    }

    buffer = ((buffer << 5) | index) & 0xffff;
    bits += 5;

    if (bits >= 8) {
      bytes.push((buffer >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

function counterToBytes(counter: number): CryptoJS.lib.WordArray {
  let value = BigInt(Math.max(0, Math.floor(counter)));
  const bytes = new Uint8Array(8);
  for (let index = 7; index >= 0; index -= 1) {
    bytes[index] = Number(value & 0xffn);
    value >>= 8n;
  }
  return CryptoJS.lib.WordArray.create(bytes);
}

/** RFC 4226 HOTP. */
export function generateHotp(
  key: Uint8Array,
  counter: number,
  digits = 6,
  algorithm: TotpAlgorithm = 'SHA1'
): string {
  const keyWords = CryptoJS.lib.WordArray.create(key);
  const message = counterToBytes(counter);
  const hmac =
    algorithm === 'SHA256'
      ? CryptoJS.HmacSHA256(message, keyWords)
      : algorithm === 'SHA512'
        ? CryptoJS.HmacSHA512(message, keyWords)
        : CryptoJS.HmacSHA1(message, keyWords);
  const signature = CryptoJS.enc.Hex.parse(hmac.toString(CryptoJS.enc.Hex));

  const bytes = new Uint8Array(signature.sigBytes);
  for (let index = 0; index < signature.sigBytes; index += 1) {
    bytes[index] =
      (signature.words[index >>> 2] >>> (24 - (index % 4) * 8)) & 0xff;
  }

  const offset = bytes[bytes.length - 1] & 0x0f;
  const binary =
    (((bytes[offset] & 0x7f) << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0;

  return (binary % 10 ** digits).toString().padStart(digits, '0');
}

export interface TotpOptions {
  timestamp?: number;
  digits?: number;
  period?: number;
  algorithm?: TotpAlgorithm;
}

/** RFC 6238 TOTP. */
export function generateTotp(
  secret: string,
  {
    timestamp = Date.now(),
    digits = 6,
    period = 30,
    algorithm = 'SHA1',
  }: TotpOptions = {}
): string {
  if (!Number.isInteger(digits) || digits < 6 || digits > 8) {
    throw new I18nError('totp.invalidDigits');
  }
  if (!Number.isInteger(period) || period <= 0) {
    throw new I18nError('totp.invalidPeriod');
  }

  const counter = Math.floor(timestamp / 1000 / period);
  return generateHotp(decodeBase32(secret), counter, digits, algorithm);
}

/** Seconds until the current TOTP expires; never zero. */
export function totpRemainingSeconds(
  period = 30,
  now: number = Date.now()
): number {
  const elapsed = Math.floor(now / 1000) % period;
  return period - elapsed;
}

export interface OtpAuthOptions {
  secret: string;
  account: string;
  issuer?: string;
  digits?: number;
  period?: number;
  algorithm?: TotpAlgorithm;
}

export function buildOtpAuthUrl({
  secret,
  account,
  issuer,
  digits = 6,
  period = 30,
  algorithm = 'SHA1',
}: OtpAuthOptions): string {
  const label = issuer
    ? `${encodeURIComponent(issuer)}:${encodeURIComponent(account)}`
    : encodeURIComponent(account);
  const params = new URLSearchParams();
  params.set('secret', secret.replace(/[\s=-]/g, '').toUpperCase());
  if (issuer) {
    params.set('issuer', issuer);
  }
  params.set('algorithm', algorithm);
  params.set('digits', String(digits));
  params.set('period', String(period));
  return `otpauth://totp/${label}?${params.toString()}`;
}
