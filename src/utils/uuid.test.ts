import { describe, expect, it } from 'vitest';
import {
  formatUuid,
  generateNanoId,
  generateUuidV4,
  generateUuidV7,
} from './uuid';

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const UUID_V7 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('uuid', () => {
  it('generates RFC 9562 version 4 UUIDs', () => {
    const value = generateUuidV4();
    expect(value).toMatch(UUID_V4);
    expect(generateUuidV4()).not.toBe(value);
  });

  it('generates version 7 UUIDs with a timestamp prefix', () => {
    const value = generateUuidV7(0x0123456789ab);
    expect(value).toMatch(UUID_V7);
    expect(value.replace(/-/g, '').startsWith('0123456789ab')).toBe(true);
  });

  it('generates NanoID values with the requested alphabet and size', () => {
    const value = generateNanoId(21);
    expect(value).toHaveLength(21);
    expect(value).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(generateNanoId(10, 'ab')).toMatch(/^[ab]{10}$/);
  });

  it('formats UUID case and hyphens', () => {
    expect(
      formatUuid('00112233-4455-6677-8899-aabbccddeeff', {
        uppercase: true,
        hyphens: false,
      })
    ).toBe('00112233445566778899AABBCCDDEEFF');
  });
});
