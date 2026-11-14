const HEX_DIGITS = '0123456789abcdef';

/** Standard NanoID alphabet (64 URL-safe characters). */
export const NANOID_ALPHABET =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function toHex(bytes: Uint8Array): string {
  let hex = '';
  for (const byte of bytes) {
    hex += HEX_DIGITS[byte >> 4] + HEX_DIGITS[byte & 0x0f];
  }
  return hex;
}

function withHyphens(hex: string): string {
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}

/** RFC 9562 UUID version 4. Uses `crypto.randomUUID` when available. */
export function generateUuidV4(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return withHyphens(toHex(bytes));
}

/** RFC 9562 UUID version 7: 48-bit Unix millisecond timestamp + randomness. */
export function generateUuidV7(timestamp: number = Date.now()): string {
  const bytes = randomBytes(16);
  let value = BigInt(Math.max(0, Math.floor(timestamp)));

  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = Number(value & 0xffn);
    value >>= 8n;
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return withHyphens(toHex(bytes));
}

export function generateNanoId(
  size = 21,
  alphabet: string = NANOID_ALPHABET
): string {
  if (size <= 0 || !alphabet) {
    return '';
  }

  const bytes = randomBytes(size);
  let id = '';
  for (let index = 0; index < size; index += 1) {
    id += alphabet[bytes[index] % alphabet.length];
  }
  return id;
}

export function formatUuid(
  value: string,
  options: { uppercase?: boolean; hyphens?: boolean } = {}
): string {
  let result = options.hyphens === false ? value.replace(/-/g, '') : value;
  if (options.uppercase) {
    result = result.toUpperCase();
  }
  return result;
}
