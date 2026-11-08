import { describe, expect, it } from 'vitest';
import { findRegexMatches, highlightRegexMatches } from './regex';

describe('findRegexMatches', () => {
  it('returns one match for a non-global expression', () => {
    const matches = findRegexMatches('b', '', 'abc');

    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      index: 1,
      match: 'b',
    });
  });

  it('returns every match for a global expression', () => {
    const matches = findRegexMatches('a', 'g', 'banana');

    expect(matches.map(match => match.index)).toEqual([1, 3, 5]);
  });

  it('advances over zero-length matches without hanging', () => {
    const matches = findRegexMatches('(?=a)', 'g', 'aa');

    expect(matches).toHaveLength(2);
  });

  it('returns no matches for an empty pattern', () => {
    expect(findRegexMatches('', 'g', 'abc')).toEqual([]);
  });

  it('throws for an invalid expression', () => {
    expect(() => findRegexMatches('(', 'g', 'abc')).toThrow();
  });
});

describe('highlightRegexMatches', () => {
  it('does not duplicate matches when the pattern has capture groups', () => {
    const segments = highlightRegexMatches('(\\d+)', 'g', 'a12b34');

    expect(segments.map(segment => segment.text)).toEqual([
      'a',
      '12',
      'b',
      '34',
    ]);
    expect(segments.filter(segment => segment.matched)).toHaveLength(2);
  });

  it('highlights all matches when the global flag is absent', () => {
    const segments = highlightRegexMatches('a', '', 'aba');

    expect(segments.filter(segment => segment.matched)).toHaveLength(2);
    expect(segments.map(segment => segment.text)).toEqual(['a', 'b', 'a']);
  });

  it('returns the original text for an empty pattern', () => {
    expect(highlightRegexMatches('', 'g', 'abc')).toEqual([
      { text: 'abc', matched: false },
    ]);
  });
});
