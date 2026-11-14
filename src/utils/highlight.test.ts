import { describe, expect, it } from 'vitest';
import { highlightCode } from './highlight';

describe('highlightCode', () => {
  it('highlights registered languages', () => {
    const result = highlightCode('const answer = 42;', 'javascript');

    expect(result).not.toBeNull();
    expect(result).toContain('hljs-keyword');
  });

  it('resolves language aliases', () => {
    const result = highlightCode('const answer: number = 42;', 'ts');

    expect(result).not.toBeNull();
    expect(result).toContain('hljs-keyword');
  });

  it('returns null for unknown languages', () => {
    expect(highlightCode('anything', 'not-a-language')).toBeNull();
  });

  it('returns null instead of throwing on illegal input', () => {
    expect(highlightCode('const = ;', 'javascript')).not.toBeNull();
    expect(highlightCode('<<<', 'not-a-language')).toBeNull();
  });
});
