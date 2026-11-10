import CryptoJS from 'crypto-js';
import { decodeBase64UrlBytes, decodeUtf8, toBase64Url } from './encoding';
import { I18nError } from './errors';

export interface JwtDecoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  headerText: string;
  payloadText: string;
  signature: string;
  /** The `header.payload` string covered by the signature. */
  signingInput: string;
}

function decodeSegment(
  segment: string,
  label: string
): Record<string, unknown> {
  if (!segment) {
    throw new I18nError('encoder.errors.jwtSegmentEmpty', { label });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeUtf8(decodeBase64UrlBytes(segment)));
  } catch {
    throw new I18nError('encoder.errors.jwtSegmentInvalidJson', { label });
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new I18nError('encoder.errors.jwtSegmentNotObject', { label });
  }

  return parsed as Record<string, unknown>;
}

export function decodeJwt(token: string): JwtDecoded {
  const normalized = token.trim().replace(/^bearer\s+/i, '');
  const parts = normalized.split('.');

  if (parts.length !== 3) {
    throw new I18nError('encoder.errors.jwtFormat');
  }

  const [headerPart, payloadPart, signature] = parts;
  const header = decodeSegment(headerPart, 'Header');
  const payload = decodeSegment(payloadPart, 'Payload');

  return {
    header,
    payload,
    headerText: JSON.stringify(header, null, 2),
    payloadText: JSON.stringify(payload, null, 2),
    signature,
    signingInput: `${headerPart}.${payloadPart}`,
  };
}

export function verifyJwtHs256(token: string, secret: string): boolean {
  if (!secret) {
    throw new I18nError('encoder.errors.jwtSecretRequired');
  }

  const decoded = decodeJwt(token);
  if (decoded.header.alg !== 'HS256') {
    throw new I18nError('encoder.errors.jwtHs256Only');
  }

  const expected = toBase64Url(
    CryptoJS.HmacSHA256(decoded.signingInput, secret).toString(
      CryptoJS.enc.Base64
    )
  );

  return expected === toBase64Url(decoded.signature);
}

export interface JwtTimeClaim {
  claim: 'exp' | 'iat' | 'nbf';
  value: number;
  /** UTC timestamp in `YYYY-MM-DD HH:mm:ss UTC` form. */
  date: string;
  status: 'expired' | 'active' | 'notYetValid' | 'info';
}

export function formatJwtTime(value: number): string {
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return `${date.toISOString().replace('T', ' ').slice(0, 19)} UTC`;
}

export function getJwtTimeClaims(
  payload: Record<string, unknown>,
  now = Date.now()
): JwtTimeClaim[] {
  const definitions: Array<'exp' | 'nbf' | 'iat'> = ['exp', 'nbf', 'iat'];

  const claims: JwtTimeClaim[] = [];

  for (const claim of definitions) {
    const value = payload[claim];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      continue;
    }

    let status: JwtTimeClaim['status'] = 'info';
    if (claim === 'exp') {
      status = value * 1000 <= now ? 'expired' : 'active';
    } else if (claim === 'nbf') {
      status = value * 1000 > now ? 'notYetValid' : 'active';
    }

    claims.push({
      claim,
      value,
      date: formatJwtTime(value),
      status,
    });
  }

  return claims;
}
