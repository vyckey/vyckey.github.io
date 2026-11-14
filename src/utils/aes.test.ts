import { describe, expect, it } from 'vitest';
import {
  aesDecryptRaw,
  aesDecryptWithPassphrase,
  aesEncryptRaw,
  aesEncryptWithPassphrase,
  generateAesIvHex,
  generateAesKeyHex,
} from './aes';
import { I18nError } from './errors';

describe('aes', () => {
  it('round-trips text in passphrase mode', () => {
    const cipherText = aesEncryptWithPassphrase('hello 世界', 'secret');
    expect(cipherText).not.toContain('hello');
    expect(aesDecryptWithPassphrase(cipherText, 'secret')).toBe('hello 世界');
  });

  it('rejects a wrong passphrase', () => {
    const cipherText = aesEncryptWithPassphrase('hello', 'secret');
    expect(() => aesDecryptWithPassphrase(cipherText, 'wrong')).toThrow(
      I18nError
    );
  });

  it('round-trips text with a raw key and IV', () => {
    const key = '00112233445566778899aabbccddeeff';
    const iv = '000102030405060708090a0b0c0d0e0f';
    const cipherText = aesEncryptRaw('raw mode', key, iv);
    expect(aesDecryptRaw(cipherText, key, iv)).toBe('raw mode');
  });

  it('validates the key and IV lengths', () => {
    expect(() =>
      aesEncryptRaw('text', 'abcd', '000102030405060708090a0b0c0d0e0f')
    ).toThrow(I18nError);
    expect(() =>
      aesEncryptRaw('text', '00112233445566778899aabbccddeeff', 'abcd')
    ).toThrow(I18nError);
  });

  it('generates hex keys and IVs', () => {
    expect(generateAesKeyHex(128)).toMatch(/^[0-9a-f]{32}$/);
    expect(generateAesKeyHex(192)).toMatch(/^[0-9a-f]{48}$/);
    expect(generateAesKeyHex(256)).toMatch(/^[0-9a-f]{64}$/);
    expect(generateAesIvHex()).toMatch(/^[0-9a-f]{32}$/);
  });
});
