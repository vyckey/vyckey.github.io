import { describe, expect, it } from 'vitest';
import { parseCsv, recordsToCsv } from './csv';
import {
  markdownToRecords,
  parseData,
  recordsToMarkdown,
  stringifyData,
} from './dataConvert';
import { I18nError } from './errors';

describe('csv', () => {
  it('parses quoted cells, escaped quotes and CRLF', () => {
    expect(parseCsv('a,b\r\n"x,y","he said ""hi"""')).toEqual([
      ['a', 'b'],
      ['x,y', 'he said "hi"'],
    ]);
  });

  it('serializes records with a stable column union', () => {
    expect(
      recordsToCsv([
        { a: 1, b: 'x' },
        { a: 2, c: true },
      ])
    ).toBe('a,b,c\n1,x,\n2,,true');
  });

  it('escapes separators and quotes', () => {
    expect(recordsToCsv([{ text: 'a,"b"' }])).toBe('text\n"a,""b"""');
  });
});

describe('dataConvert', () => {
  const value = {
    id: 1,
    name: 'Ada',
    active: true,
    roles: ['admin', 'developer'],
    profile: { email: 'ada@example.com', age: 36 },
  };

  it('round-trips JSON and YAML', () => {
    const json = stringifyData(value, 'json');
    expect(parseData(json, 'json')).toEqual(value);

    const yaml = stringifyData(value, 'yaml');
    expect(parseData(yaml, 'yaml')).toEqual(value);
  });

  it('round-trips TOML', () => {
    const toml = stringifyData(value, 'toml');
    expect(parseData(toml, 'toml')).toEqual(value);
  });

  it('converts records to CSV and back', () => {
    const records = [
      { id: 1, name: 'Ada', note: 'hello, world' },
      { id: 2, name: 'Grace' },
    ];
    const csv = stringifyData(records, 'csv');

    expect(csv).toContain('"hello, world"');
    expect(parseData(csv, 'csv')).toEqual([
      { id: '1', name: 'Ada', note: 'hello, world' },
      { id: '2', name: 'Grace', note: '' },
    ]);
  });

  it('converts records to a Markdown table and back', () => {
    const markdown = recordsToMarkdown([
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Grace' },
    ]);

    expect(markdown).toContain('| id | name |');
    expect(markdownToRecords(markdown)).toEqual([
      { id: '1', name: 'Ada' },
      { id: '2', name: 'Grace' },
    ]);
  });

  it('escapes pipes and newlines in Markdown cells', () => {
    const markdown = recordsToMarkdown([{ text: 'a|b\nc' }]);
    expect(markdown).toContain('a\\|b<br>c');
    expect(markdownToRecords(markdown)).toEqual([{ text: 'a|b<br>c' }]);
  });

  it('rejects scalar CSV / Markdown output', () => {
    expect(() => stringifyData(42, 'csv')).toThrow(I18nError);
    expect(() => stringifyData([1, 2], 'markdown')).toThrow(I18nError);
  });

  it('reports parse errors with translation keys', () => {
    expect(() => parseData('{', 'json')).toThrow(I18nError);
    expect(() => parseData('a: [', 'yaml')).toThrow(I18nError);
    expect(() => parseData('a = ', 'toml')).toThrow(I18nError);
    expect(() => parseData('', 'json')).toThrow(I18nError);
  });
});
