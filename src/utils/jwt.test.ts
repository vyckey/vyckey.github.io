import {
  decodeJwt,
  formatJwtTime,
  getJwtTimeClaims,
  verifyJwtHs256,
} from './jwt';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJwt', () => {
  it('decodes header and payload', () => {
    const decoded = decodeJwt(TOKEN);
    expect(decoded.header.alg).toBe('HS256');
    expect(decoded.payload.name).toBe('John Doe');
    expect(decoded.payload.iat).toBe(1516239022);
    expect(decoded.headerText).toContain('\n');
    expect(decoded.signingInput.split('.')).toHaveLength(2);
  });

  it('accepts a Bearer prefix', () => {
    expect(decodeJwt(`Bearer ${TOKEN}`).payload.sub).toBe('1234567890');
  });

  it('rejects malformed tokens', () => {
    expect(() => decodeJwt('abc')).toThrow('JWT 格式错误');
    expect(() => decodeJwt('a.b.c')).toThrow('Header');
  });
});

describe('verifyJwtHs256', () => {
  it('accepts the correct secret', () => {
    expect(verifyJwtHs256(TOKEN, 'your-256-bit-secret')).toBe(true);
  });

  it('rejects a wrong secret', () => {
    expect(verifyJwtHs256(TOKEN, 'wrong-secret')).toBe(false);
  });

  it('rejects non-HS256 algorithms', () => {
    const unsigned = 'eyJhbGciOiJub25lIn0.e30.';
    expect(() => verifyJwtHs256(unsigned, 'secret')).toThrow('HS256');
  });
});

describe('JWT time claims', () => {
  it('marks expired and future claims', () => {
    const now = 1_700_000_000_000;
    const claims = getJwtTimeClaims(
      { exp: 1_600_000_000, nbf: 1_800_000_000, iat: 1_650_000_000 },
      now
    );

    const byClaim = Object.fromEntries(claims.map(c => [c.claim, c]));
    expect(byClaim.exp.status).toBe('expired');
    expect(byClaim.nbf.status).toBe('notYetValid');
    expect(byClaim.iat.status).toBe('info');
    expect(byClaim.exp.date).toContain('UTC');
  });

  it('ignores non-numeric claims', () => {
    expect(getJwtTimeClaims({ exp: 'soon' })).toHaveLength(0);
  });

  it('formats timestamps in UTC', () => {
    expect(formatJwtTime(0)).toBe('1970-01-01 00:00:00 UTC');
  });
});
