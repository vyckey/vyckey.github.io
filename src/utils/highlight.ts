import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import less from 'highlight.js/lib/languages/less';
import lua from 'highlight.js/lib/languages/lua';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import objectivec from 'highlight.js/lib/languages/objectivec';
import perl from 'highlight.js/lib/languages/perl';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

/**
 * Register only the languages the Markdown preview is likely to meet.
 * Importing `highlight.js` directly pulls in every bundled grammar (~850 kB).
 */
const LANGUAGES: Array<[string, Parameters<typeof hljs.registerLanguage>[1]]> =
  [
    ['bash', bash],
    ['c', c],
    ['cpp', cpp],
    ['csharp', csharp],
    ['css', css],
    ['diff', diff],
    ['dockerfile', dockerfile],
    ['go', go],
    ['ini', ini],
    ['java', java],
    ['javascript', javascript],
    ['json', json],
    ['kotlin', kotlin],
    ['less', less],
    ['lua', lua],
    ['markdown', markdown],
    ['nginx', nginx],
    ['objectivec', objectivec],
    ['perl', perl],
    ['php', php],
    ['plaintext', plaintext],
    ['python', python],
    ['ruby', ruby],
    ['rust', rust],
    ['scss', scss],
    ['shell', shell],
    ['sql', sql],
    ['swift', swift],
    ['typescript', typescript],
    ['xml', xml],
    ['yaml', yaml],
  ];

for (const [name, language] of LANGUAGES) {
  hljs.registerLanguage(name, language);
}

/**
 * Highlight a fenced code block. Unknown languages are left as plain text
 * instead of throwing.
 */
export function highlightCode(source: string, language: string): string | null {
  if (!hljs.getLanguage(language)) {
    return null;
  }

  try {
    return hljs.highlight(source, { language, ignoreIllegals: true }).value;
  } catch {
    return null;
  }
}

export default hljs;
