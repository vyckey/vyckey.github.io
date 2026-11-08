import CryptoJS from 'crypto-js';

export type HashAlgorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512';

export const HASH_ALGORITHMS: { label: string; value: HashAlgorithm }[] = [
  { label: 'MD5', value: 'MD5' },
  { label: 'SHA-1', value: 'SHA1' },
  { label: 'SHA-256', value: 'SHA256' },
  { label: 'SHA-512', value: 'SHA512' },
];

export function hashText(
  text: string,
  algorithm: HashAlgorithm,
  uppercase = false
): string {
  const hashers = {
    MD5: CryptoJS.MD5,
    SHA1: CryptoJS.SHA1,
    SHA256: CryptoJS.SHA256,
    SHA512: CryptoJS.SHA512,
  };

  const digest = hashers[algorithm](text).toString(CryptoJS.enc.Hex);
  return uppercase ? digest.toUpperCase() : digest;
}
