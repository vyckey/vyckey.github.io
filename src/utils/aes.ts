import CryptoJS from 'crypto-js';
import { I18nError } from './errors';

const HEX_PATTERN = /^[0-9a-f]+$/i;

function requirePassphrase(passphrase: string): string {
  if (!passphrase) {
    throw new I18nError('encryption.aes.passphraseRequired');
  }
  return passphrase;
}

function parseKeyHex(keyHex: string): CryptoJS.lib.WordArray {
  const value = keyHex.trim();
  if (!HEX_PATTERN.test(value) || ![32, 48, 64].includes(value.length)) {
    throw new I18nError('encryption.aes.invalidKey');
  }
  return CryptoJS.enc.Hex.parse(value);
}

function parseIvHex(ivHex: string): CryptoJS.lib.WordArray {
  const value = ivHex.trim();
  if (!HEX_PATTERN.test(value) || value.length !== 32) {
    throw new I18nError('encryption.aes.invalidIv');
  }
  return CryptoJS.enc.Hex.parse(value);
}

function decryptToString(
  cipherText: string,
  key: string | CryptoJS.lib.WordArray,
  options?: { iv: CryptoJS.lib.WordArray }
): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(cipherText.trim(), key, {
      ...options,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const plainText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!plainText) {
      throw new I18nError('encryption.aes.decryptFailed');
    }
    return plainText;
  } catch (error) {
    if (error instanceof I18nError) {
      throw error;
    }
    throw new I18nError('encryption.aes.decryptFailed');
  }
}

/** AES-256-CBC with an OpenSSL-compatible passphrase (random salt). */
export function aesEncryptWithPassphrase(
  plainText: string,
  passphrase: string
): string {
  return CryptoJS.AES.encrypt(plainText, requirePassphrase(passphrase), {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

export function aesDecryptWithPassphrase(
  cipherText: string,
  passphrase: string
): string {
  return decryptToString(cipherText, requirePassphrase(passphrase));
}

/** AES-CBC with a raw hex key (32/48/64 chars) and a 32-char hex IV. */
export function aesEncryptRaw(
  plainText: string,
  keyHex: string,
  ivHex: string
): string {
  return CryptoJS.AES.encrypt(plainText, parseKeyHex(keyHex), {
    iv: parseIvHex(ivHex),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

export function aesDecryptRaw(
  cipherText: string,
  keyHex: string,
  ivHex: string
): string {
  return decryptToString(cipherText, parseKeyHex(keyHex), {
    iv: parseIvHex(ivHex),
  });
}

function randomHex(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function generateAesKeyHex(bits: 128 | 192 | 256): string {
  return randomHex(bits / 8);
}

export function generateAesIvHex(): string {
  return randomHex(16);
}
