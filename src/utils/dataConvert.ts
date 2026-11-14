import { dump, load } from 'js-yaml';
import { parse as parseToml, stringify as stringifyToml } from 'smol-toml';
import { I18nError } from './errors';
import { csvToRecords, recordsToCsv } from './csv';

export type DataFormat = 'json' | 'yaml' | 'toml' | 'csv' | 'markdown';

export const DATA_FORMATS: DataFormat[] = [
  'json',
  'yaml',
  'toml',
  'csv',
  'markdown',
];

const ERROR_PREFIX = 'converter.errors';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function splitMarkdownRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split(/(?<!\\)\|/)
    .map(cell => cell.trim().replace(/\\\|/g, '|'));
}

export function markdownToRecords(text: string): Record<string, string>[] {
  const lines = text
    .split(/\r\n|\r|\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new I18nError(`${ERROR_PREFIX}.markdownTable`);
  }

  const header = splitMarkdownRow(lines[0]);
  const separator = splitMarkdownRow(lines[1]);

  if (
    separator.length !== header.length ||
    !separator.every(cell => /^:?-{3,}:?$/.test(cell))
  ) {
    throw new I18nError(`${ERROR_PREFIX}.markdownTable`);
  }

  return lines.slice(2).map(line => {
    const cells = splitMarkdownRow(line);
    return Object.fromEntries(
      header.map((key, index) => [key, cells[index] ?? ''])
    );
  });
}

function escapeMarkdownCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

export function recordsToMarkdown(records: Record<string, unknown>[]): string {
  const columns: string[] = [];
  const seen = new Set<string>();

  for (const record of records) {
    for (const key of Object.keys(record)) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }

  if (columns.length === 0) {
    return '';
  }

  const rows = records.map(record =>
    columns.map(key => {
      const value = record[key];
      if (value === null || value === undefined) {
        return '';
      }
      return escapeMarkdownCell(
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      );
    })
  );

  return [
    `| ${columns.join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.join(' | ')} |`),
  ].join('\n');
}

function toRecords(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    if (value.every(isPlainObject)) {
      return value;
    }
    throw new I18nError(`${ERROR_PREFIX}.recordsRequired`);
  }

  if (isPlainObject(value)) {
    return [value];
  }

  throw new I18nError(`${ERROR_PREFIX}.recordsRequired`);
}

export function parseData(text: string, format: DataFormat): unknown {
  const source = text.trim();
  if (!source) {
    throw new I18nError(`${ERROR_PREFIX}.emptyInput`);
  }

  try {
    switch (format) {
      case 'json':
        return JSON.parse(source);
      case 'yaml':
        return load(source);
      case 'toml':
        return parseToml(source);
      case 'csv':
        return csvToRecords(source);
      case 'markdown':
        return markdownToRecords(source);
    }
  } catch (error) {
    if (error instanceof I18nError) {
      throw error;
    }
    throw new I18nError(`${ERROR_PREFIX}.invalid${format.toUpperCase()}`, {
      message: errorMessage(error),
    });
  }
}

export function stringifyData(value: unknown, format: DataFormat): string {
  try {
    switch (format) {
      case 'json':
        return JSON.stringify(value, null, 2);
      case 'yaml':
        return dump(value, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
          sortKeys: false,
        });
      case 'toml': {
        if (!isPlainObject(value)) {
          throw new I18nError(`${ERROR_PREFIX}.tomlRoot`);
        }
        return stringifyToml(value);
      }
      case 'csv':
        return recordsToCsv(toRecords(value));
      case 'markdown':
        return recordsToMarkdown(toRecords(value));
    }
  } catch (error) {
    if (error instanceof I18nError) {
      throw error;
    }
    throw new I18nError(`${ERROR_PREFIX}.serializeFailed`, {
      format,
      message: errorMessage(error),
    });
  }
}
