export interface RegexMatchInfo {
  index: number;
  match: string;
  groups: string[];
}

export interface HighlightSegment {
  text: string;
  matched: boolean;
  matchIndex?: number;
}

/**
 * Collect regex matches without risking an infinite loop.
 *
 * A non-global RegExp always returns the same first match, so it is handled
 * separately. For global expressions, zero-length matches advance lastIndex.
 */
export function findRegexMatches(
  pattern: string,
  flags: string,
  text: string
): RegexMatchInfo[] {
  if (!pattern) {
    return [];
  }

  const regex = new RegExp(pattern, flags);
  const matches: RegexMatchInfo[] = [];

  if (!regex.global) {
    const match = regex.exec(text);
    if (match) {
      matches.push({
        index: match.index,
        match: match[0],
        groups: match.slice(1),
      });
    }
    return matches;
  }

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      match: match[0],
      groups: match.slice(1),
    });

    if (match[0].length === 0) {
      regex.lastIndex += 1;
    }
  }

  return matches;
}

/**
 * Split text into highlighted/unhighlighted segments.
 *
 * Do not wrap the user's pattern in another capture group: that shifts
 * backreference numbers and makes String.split() emit duplicate matches when
 * the pattern already contains groups.
 */
export function highlightRegexMatches(
  pattern: string,
  flags: string,
  text: string
): HighlightSegment[] {
  if (!pattern) {
    return [{ text, matched: false }];
  }

  const normalizedFlags = flags.includes('g')
    ? flags.replace('y', '')
    : `g${flags.replace('y', '')}`;
  const regex = new RegExp(pattern, normalizedFlags);
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  let matchIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      segments.push({ text: text.slice(lastIndex, start), matched: false });
    }

    if (end > start) {
      segments.push({
        text: match[0],
        matched: true,
        matchIndex,
      });
      matchIndex += 1;
    }

    lastIndex = end;

    if (match[0].length === 0) {
      regex.lastIndex += 1;
    }
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), matched: false });
  }

  return segments;
}
