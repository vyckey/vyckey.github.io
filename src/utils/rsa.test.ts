import { describe, expect, it } from 'vitest';
import { toPkcs8PrivateKey } from './rsa';

describe('toPkcs8PrivateKey', () => {
  it('wraps a PKCS#1 PEM in a PKCS#8 structure', () => {
    const der = String.fromCharCode(0x30, 0x00);
    const pkcs1 = `-----BEGIN RSA PRIVATE KEY-----\n${btoa(
      der
    )}\n-----END RSA PRIVATE KEY-----`;

    const pkcs8 = toPkcs8PrivateKey(pkcs1);

    expect(pkcs8).toContain('-----BEGIN PRIVATE KEY-----');
    expect(pkcs8).toContain('-----END PRIVATE KEY-----');
    expect(pkcs8).not.toContain('RSA PRIVATE KEY');
  });

  it('returns non-PKCS#1 input unchanged', () => {
    const key = 'not a private key';

    expect(toPkcs8PrivateKey(key)).toBe(key);
  });
});
