function base64ToBytes(base64: string): number[] {
  const binary = atob(base64);
  return Array.from(binary, char => char.charCodeAt(0));
}

function bytesToBase64(bytes: number[]): string {
  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
  }

  return btoa(binary);
}

function derLength(length: number): number[] {
  if (length < 0x80) {
    return [length];
  }

  const bytes: number[] = [];
  let remaining = length;
  while (remaining > 0) {
    bytes.unshift(remaining & 0xff);
    remaining = Math.floor(remaining / 256);
  }

  return [0x80 | bytes.length, ...bytes];
}

function wrapBase64(base64: string): string {
  return base64.match(/.{1,64}/g)?.join('\n') ?? base64;
}

/**
 * Convert a PKCS#1 RSA private key PEM to PKCS#8.
 *
 * JSEncrypt only emits PKCS#1, so wrap the existing DER in a PKCS#8
 * PrivateKeyInfo structure instead of pulling in another crypto library.
 */
export function toPkcs8PrivateKey(pkcs1Pem: string): string {
  const match =
    /-----BEGIN RSA PRIVATE KEY-----([\s\S]+?)-----END RSA PRIVATE KEY-----/.exec(
      pkcs1Pem
    );

  if (!match) {
    return pkcs1Pem;
  }

  const pkcs1Der = base64ToBytes(match[1].replace(/\s+/g, ''));

  // version + rsaEncryption AlgorithmIdentifier + OCTET STRING(privateKey)
  const version = [0x02, 0x01, 0x00];
  const algorithmIdentifier = [
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01,
    0x01, 0x05, 0x00,
  ];
  const privateKey = [0x04, ...derLength(pkcs1Der.length), ...pkcs1Der];
  const body = [...version, ...algorithmIdentifier, ...privateKey];
  const der = [0x30, ...derLength(body.length), ...body];

  return `-----BEGIN PRIVATE KEY-----\n${wrapBase64(
    bytesToBase64(der)
  )}\n-----END PRIVATE KEY-----`;
}
