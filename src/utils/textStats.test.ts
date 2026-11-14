import { describe, expect, it } from 'vitest';
import { computeTextStats, transformLines } from './textStats';

describe('textStats', () => {
  it('counts characters, words, lines and bytes', () => {
    const stats = computeTextStats('Hello world\n你好世界');

    expect(stats.characters).toBe(16);
    expect(stats.charactersNoSpaces).toBe(14);
    expect(stats.words).toBe(6);
    expect(stats.lines).toBe(2);
    expect(stats.nonEmptyLines).toBe(2);
    expect(stats.bytes).toBe(24);
    expect(stats.readingMinutes).toBe(1);
  });

  it('handles empty and whitespace-only text', () => {
    expect(computeTextStats('')).toMatchObject({
      characters: 0,
      words: 0,
      nonEmptyLines: 0,
      bytes: 0,
      readingMinutes: 0,
    });
    expect(computeTextStats('   ').words).toBe(0);
  });

  it('transforms lines', () => {
    expect(transformLines('a\n\nb\n', 'trim')).toBe('a\n\nb\n');
    expect(transformLines('a\n\nb\n', 'removeEmpty')).toBe('a\nb');
    expect(transformLines('a\nb\na', 'dedupe')).toBe('a\nb');
    expect(transformLines('b\na', 'sortAsc')).toBe('a\nb');
    expect(transformLines('a\nb', 'sortDesc')).toBe('b\na');
    expect(transformLines('a\nb', 'reverse')).toBe('b\na');
    expect(transformLines('a\nb', 'number')).toBe('1. a\n2. b');
    expect(transformLines('a   b\n  c', 'collapseSpaces')).toBe('a b\nc');
  });
});
