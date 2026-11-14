import { describe, expect, it } from 'vitest';
import { buildUrl, parseUrl } from './url';

describe('url', () => {
  it('parses every URL component', () => {
    const parsed = parseUrl(
      'https://user:pass@example.com:8080/path?a=1&a=2&b=hello%20world#top'
    );

    expect(parsed).toEqual({
      protocol: 'https:',
      username: 'user',
      password: 'pass',
      hostname: 'example.com',
      port: '8080',
      pathname: '/path',
      hash: '#top',
      params: [
        { key: 'a', value: '1' },
        { key: 'a', value: '2' },
        { key: 'b', value: 'hello world' },
      ],
    });
  });

  it('assumes https when the scheme is missing', () => {
    const parsed = parseUrl('example.com/path');
    expect(parsed?.protocol).toBe('https:');
    expect(parsed?.hostname).toBe('example.com');
    expect(parsed?.pathname).toBe('/path');
  });

  it('keeps host:port input without a scheme', () => {
    const parsed = parseUrl('example.com:8080/path');
    expect(parsed?.protocol).toBe('https:');
    expect(parsed?.hostname).toBe('example.com');
    expect(parsed?.port).toBe('8080');
  });

  it('returns null for invalid input', () => {
    expect(parseUrl('')).toBeNull();
    expect(parseUrl('http://[invalid')).toBeNull();
    expect(parseUrl('mailto:me@example.com')).toBeNull();
  });

  it('rebuilds a URL from its parts', () => {
    const input =
      'https://user:pass@example.com:8080/path?a=1&a=2&b=hello%20world#top';
    expect(buildUrl(parseUrl(input)!)).toBe(input);
  });

  it('adds a root path when the pathname is empty', () => {
    expect(
      buildUrl({
        protocol: 'https:',
        username: '',
        password: '',
        hostname: 'example.com',
        port: '',
        pathname: '',
        hash: '',
        params: [],
      })
    ).toBe('https://example.com/');
  });
});
