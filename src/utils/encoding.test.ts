import {
  convertRadixText,
  decodeBase64,
  decodeUrl,
  encodeBase64,
  encodeUrl,
  escapeHtml,
  hexToText,
  parseBigInt,
  textToHex,
  textToUnicodeEscape,
  unicodeEscapeToText,
  unescapeHtml,
} from './encoding';

describe('Base64', () => {
  it('encodes UTF-8 text', () => {
    expect(encodeBase64('你好')).toBe('5L2g5aW9');
  });

  it('round-trips emoji', () => {
    expect(decodeBase64(encodeBase64('😀 你好'))).toBe('😀 你好');
  });

  it('supports the URL-safe alphabet', () => {
    const encoded = encodeBase64('~~~???>>>', true);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(decodeBase64(encoded)).toBe('~~~???>>>');
  });

  it('tolerates whitespace and missing padding', () => {
    expect(decodeBase64('5L2g 5aW9')).toBe('你好');
    expect(decodeBase64('5L2g5aW9')).toBe('你好');
  });

  it('rejects invalid input', () => {
    expect(() => decodeBase64('abcde')).toThrow(
      'encoder.errors.base64InvalidLength'
    );
    expect(() => decodeBase64('@@@@')).toThrow(
      'encoder.errors.base64InvalidChar'
    );
  });
});

describe('URL encoding', () => {
  it('encodes and decodes components', () => {
    expect(encodeUrl('a b')).toBe('a%20b');
    expect(decodeUrl('%E4%BD%A0%E5%A5%BD')).toBe('你好');
  });

  it('supports form mode', () => {
    expect(encodeUrl('a b', true)).toBe('a+b');
    expect(decodeUrl('a+b', true)).toBe('a b');
  });

  it('rejects malformed escapes', () => {
    expect(() => decodeUrl('%E4')).toThrow('encoder.errors.urlDecodeFailed');
  });
});

describe('HTML entities', () => {
  it('escapes special characters', () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;'
    );
  });

  it('decodes named and numeric entities', () => {
    expect(unescapeHtml('&lt;b&gt;&amp;&#39;&#x4F60;')).toBe("<b>&'你");
  });

  it('keeps unknown entities untouched', () => {
    expect(unescapeHtml('&unknown; &amp;')).toBe('&unknown; &');
  });
});

describe('Hex and Unicode escapes', () => {
  it('converts text to UTF-8 hex', () => {
    expect(textToHex('你')).toBe('E4 BD A0');
    expect(textToHex('你', { separator: '', uppercase: false })).toBe('e4bda0');
    expect(hexToText('E4BDA0')).toBe('你');
  });

  it('rejects malformed hex', () => {
    expect(() => hexToText('E4B')).toThrow('encoder.errors.hexOddLength');
    expect(() => hexToText('ZZ')).toThrow('encoder.errors.hexInvalid');
  });

  it('escapes and restores unicode', () => {
    expect(textToUnicodeEscape('A😀')).toBe('\\u0041\\uD83D\\uDE00');
    expect(unicodeEscapeToText('\\u0041\\uD83D\\uDE00')).toBe('A😀');
    expect(unicodeEscapeToText('\\u{1F600}')).toBe('😀');
  });
});

describe('Radix conversion', () => {
  const format = (radix: number, value: string) => `${radix}:${value}`;

  it('converts between bases', () => {
    expect(convertRadixText('255', 10, format)).toContain('16:ff');
    expect(convertRadixText('0xFF', 16, format)).toContain('10:255');
    expect(convertRadixText('-1010', 2, format)).toContain('10:-10');
  });

  it('handles integers beyond Number.MAX_SAFE_INTEGER', () => {
    const value = '123456789012345678901234567890';
    expect(parseBigInt(value, 10).toString(10)).toBe(value);
  });

  it('rejects digits outside the radix', () => {
    expect(() => parseBigInt('102', 2)).toThrow('encoder.errors.digitInvalid');
    expect(() => parseBigInt('', 10)).toThrow('encoder.errors.numberRequired');
  });
});
