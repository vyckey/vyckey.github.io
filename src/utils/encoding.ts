import { I18nError } from './errors';

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

function bytesToBinary(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return binary;
}

function binaryToBytes(binary: string): Uint8Array {
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

/** Convert standard Base64 into its URL-safe variant without padding. */
export function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Normalize Base64/Base64URL input (whitespace, missing padding, -/_). */
export function normalizeBase64(input: string): string {
  const cleaned = input
    .replace(/\s+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  if (!cleaned) {
    return '';
  }
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
    throw new I18nError('encoder.errors.base64InvalidChar');
  }

  const withoutPadding = cleaned.replace(/=+$/, '');
  if (withoutPadding.length % 4 === 1) {
    throw new I18nError('encoder.errors.base64InvalidLength');
  }

  const padding = (4 - (withoutPadding.length % 4)) % 4;
  return withoutPadding + '='.repeat(padding);
}

export function encodeBase64(text: string, urlSafe = false): string {
  const base64 = btoa(bytesToBinary(utf8Encoder.encode(text)));
  return urlSafe ? toBase64Url(base64) : base64;
}

export function decodeBase64(input: string): string {
  const normalized = normalizeBase64(input);
  if (!normalized) {
    return '';
  }

  try {
    return utf8Decoder.decode(binaryToBytes(atob(normalized)));
  } catch {
    throw new I18nError('encoder.errors.base64DecodeFailed');
  }
}

export function decodeBase64UrlBytes(input: string): Uint8Array {
  return binaryToBytes(atob(normalizeBase64(input)));
}

export function decodeUtf8(bytes: Uint8Array): string {
  return utf8Decoder.decode(bytes);
}

export function encodeUrl(text: string, formMode = false): string {
  try {
    const encoded = encodeURIComponent(text);
    return formMode ? encoded.replace(/%20/g, '+') : encoded;
  } catch {
    throw new I18nError('encoder.errors.urlEncodeFailed');
  }
}

export function decodeUrl(text: string, formMode = false): string {
  const source = formMode ? text.replace(/\+/g, ' ') : text;
  try {
    return decodeURIComponent(source);
  } catch {
    throw new I18nError('encoder.errors.urlDecodeFailed');
  }
}

const HTML_NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
};

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, char => HTML_ESCAPE_MAP[char]);
}

export function unescapeHtml(text: string): string {
  return text.replace(
    /&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,
    (match, body: string) => {
      if (body.startsWith('#')) {
        const isHex = body[1] === 'x' || body[1] === 'X';
        const codePoint = parseInt(
          isHex ? body.slice(2) : body.slice(1),
          isHex ? 16 : 10
        );
        if (
          !Number.isFinite(codePoint) ||
          codePoint < 0 ||
          codePoint > 0x10ffff
        ) {
          return match;
        }
        return String.fromCodePoint(codePoint);
      }

      return HTML_NAMED_ENTITIES[body.toLowerCase()] ?? match;
    }
  );
}

export interface HexOptions {
  separator?: string;
  uppercase?: boolean;
}

export function textToHex(text: string, options: HexOptions = {}): string {
  const { separator = ' ', uppercase = true } = options;
  const hex = Array.from(utf8Encoder.encode(text), byte =>
    byte.toString(16).padStart(2, '0')
  ).join(separator);
  return uppercase ? hex.toUpperCase() : hex;
}

export function hexToText(input: string): string {
  const cleaned = input.replace(/0x/gi, '').replace(/[\s,;]+/g, '');
  if (!cleaned) {
    return '';
  }
  if (cleaned.length % 2 !== 0) {
    throw new I18nError('encoder.errors.hexOddLength');
  }
  if (!/^[0-9a-f]+$/i.test(cleaned)) {
    throw new I18nError('encoder.errors.hexInvalid');
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.slice(i, i + 2), 16);
  }

  try {
    return decodeUtf8(bytes);
  } catch {
    throw new I18nError('encoder.errors.hexDecodeFailed');
  }
}

/** Escape every UTF-16 code unit as `\uXXXX` (JavaScript style). */
export function textToUnicodeEscape(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += `\\u${text
      .charCodeAt(i)
      .toString(16)
      .padStart(4, '0')
      .toUpperCase()}`;
  }
  return result;
}

export function unicodeEscapeToText(input: string): string {
  return input.replace(
    /\\u\{([0-9a-fA-F]{1,6})\}|\\u([0-9a-fA-F]{4})|\\x([0-9a-fA-F]{2})/g,
    (match, braced?: string, unit?: string, byte?: string) => {
      const codePoint = parseInt(braced ?? unit ?? byte ?? '', 16);
      if (!Number.isFinite(codePoint) || codePoint > 0x10ffff) {
        return match;
      }
      return String.fromCodePoint(codePoint);
    }
  );
}

export const RADIXES = [2, 8, 10, 16, 36] as const;

export function parseBigInt(value: string, radix: number): bigint {
  if (radix < 2 || radix > 36) {
    throw new I18nError('encoder.errors.radixRange');
  }

  let text = value.trim().replace(/[\s_,]/g, '');
  if (!text) {
    throw new I18nError('encoder.errors.numberRequired');
  }

  let negative = false;
  if (text.startsWith('-')) {
    negative = true;
    text = text.slice(1);
  } else if (text.startsWith('+')) {
    text = text.slice(1);
  }

  const lower = text.toLowerCase();
  if (radix === 16 && lower.startsWith('0x')) {
    text = text.slice(2);
  } else if (radix === 2 && lower.startsWith('0b')) {
    text = text.slice(2);
  } else if (radix === 8 && lower.startsWith('0o')) {
    text = text.slice(2);
  }

  if (!text) {
    throw new I18nError('encoder.errors.numberRequired');
  }

  const base = BigInt(radix);
  let result = 0n;
  for (const char of text.toLowerCase()) {
    const digit = parseInt(char, 36);
    if (!Number.isInteger(digit) || digit >= radix) {
      throw new I18nError('encoder.errors.digitInvalid', { char, radix });
    }
    result = result * base + BigInt(digit);
  }

  return negative ? -result : result;
}

/**
 * Convert a number into every supported radix. The caller supplies the
 * formatter so this pure helper stays free of user-facing copy.
 */
export function convertRadixText(
  value: string,
  fromRadix: number,
  format: (radix: number, value: string) => string
): string {
  const parsed = parseBigInt(value, fromRadix);
  return RADIXES.map(radix => format(radix, parsed.toString(radix))).join('\n');
}
