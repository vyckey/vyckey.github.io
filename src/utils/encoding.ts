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
    throw new Error('Base64 内容不合法：包含无效字符');
  }

  const withoutPadding = cleaned.replace(/=+$/, '');
  if (withoutPadding.length % 4 === 1) {
    throw new Error('Base64 内容不合法：长度错误');
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
    throw new Error('Base64 解码失败：内容不是有效的 Base64 或 UTF-8 文本');
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
    throw new Error('URL 编码失败：文本包含无效的 Unicode 字符');
  }
}

export function decodeUrl(text: string, formMode = false): string {
  const source = formMode ? text.replace(/\+/g, ' ') : text;
  try {
    return decodeURIComponent(source);
  } catch {
    throw new Error('URL 解码失败：包含无效的百分号转义序列');
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
    throw new Error('Hex 长度必须为偶数：每个字节由两个十六进制字符组成');
  }
  if (!/^[0-9a-f]+$/i.test(cleaned)) {
    throw new Error('Hex 内容不合法：只能包含 0-9 和 a-f');
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.slice(i, i + 2), 16);
  }

  try {
    return decodeUtf8(bytes);
  } catch {
    throw new Error('Hex 解码失败：字节序列不是有效的 UTF-8 文本');
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
    throw new Error('进制必须在 2 到 36 之间');
  }

  let text = value.trim().replace(/[\s_,]/g, '');
  if (!text) {
    throw new Error('请输入需要转换的数值');
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
    throw new Error('请输入需要转换的数值');
  }

  const base = BigInt(radix);
  let result = 0n;
  for (const char of text.toLowerCase()) {
    const digit = parseInt(char, 36);
    if (!Number.isInteger(digit) || digit >= radix) {
      throw new Error(`字符「${char}」不是 ${radix} 进制的有效数字`);
    }
    result = result * base + BigInt(digit);
  }

  return negative ? -result : result;
}

export function convertRadixText(value: string, fromRadix: number): string {
  const parsed = parseBigInt(value, fromRadix);
  const labels: Record<number, string> = {
    2: '二进制',
    8: '八进制',
    10: '十进制',
    16: '十六进制',
    36: '三十六进制',
  };

  return RADIXES.map(
    radix => `${labels[radix]} (${radix})：${parsed.toString(radix)}`
  ).join('\n');
}
