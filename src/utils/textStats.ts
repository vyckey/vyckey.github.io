export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  nonEmptyLines: number;
  bytes: number;
  readingMinutes: number;
}

export type LineOperation =
  | 'trim'
  | 'removeEmpty'
  | 'dedupe'
  | 'sortAsc'
  | 'sortDesc'
  | 'reverse'
  | 'number'
  | 'collapseSpaces';

const CJK_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;
const LATIN_WORD_PATTERN = /[A-Za-z0-9_'-]+/g;

export function computeTextStats(text: string): TextStats {
  const lines = text.split(/\r\n|\r|\n/);
  const cjkMatches = text.match(CJK_PATTERN) ?? [];
  const latinWords =
    text.replace(CJK_PATTERN, ' ').match(LATIN_WORD_PATTERN) ?? [];
  const words = cjkMatches.length + latinWords.length;
  const bytes = new TextEncoder().encode(text).length;
  const readingMinutes =
    words === 0
      ? 0
      : Math.max(
          1,
          Math.ceil(cjkMatches.length / 400 + latinWords.length / 300)
        );

  return {
    characters: Array.from(text).length,
    charactersNoSpaces: Array.from(text.replace(/\s/g, '')).length,
    words,
    lines: lines.length,
    nonEmptyLines: lines.filter(line => line.trim() !== '').length,
    bytes,
    readingMinutes,
  };
}

export function transformLines(text: string, operation: LineOperation): string {
  const lines = text.split(/\r\n|\r|\n/);

  switch (operation) {
    case 'trim':
      return lines.map(line => line.trim()).join('\n');
    case 'removeEmpty':
      return lines.filter(line => line.trim() !== '').join('\n');
    case 'dedupe': {
      const seen = new Set<string>();
      return lines
        .filter(line => {
          if (seen.has(line)) {
            return false;
          }
          seen.add(line);
          return true;
        })
        .join('\n');
    }
    case 'sortAsc':
      return [...lines].sort((a, b) => a.localeCompare(b)).join('\n');
    case 'sortDesc':
      return [...lines].sort((a, b) => b.localeCompare(a)).join('\n');
    case 'reverse':
      return [...lines].reverse().join('\n');
    case 'number':
      return lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
    case 'collapseSpaces':
      return text
        .replace(/[ \t]+/g, ' ')
        .split(/\r\n|\r|\n/)
        .map(line => line.trim())
        .join('\n');
  }
}
