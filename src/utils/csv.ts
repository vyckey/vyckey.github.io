/** Minimal RFC 4180 CSV parser: quotes, escaped quotes and CRLF. */
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (quoted) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[index + 1] === '\n') {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  // Drop the single empty row produced by a trailing newline.
  return rows.filter(
    (item, index) =>
      !(index === rows.length - 1 && item.length === 1 && item[0] === '')
  );
}

function escapeCsvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function serializeCsv(rows: string[][]): string {
  return rows.map(row => row.map(escapeCsvCell).join(',')).join('\n');
}

function isEmptyRow(row: string[]): boolean {
  return row.every(cell => cell.trim() === '');
}

/** Parse CSV with a header row into plain records. */
export function csvToRecords(text: string): Record<string, string>[] {
  const rows = parseCsv(text);
  if (rows.length === 0) {
    return [];
  }

  const header = rows[0].map(
    (cell, index) => cell.trim() || `column${index + 1}`
  );

  return rows
    .slice(1)
    .filter(row => !isEmptyRow(row))
    .map(row =>
      Object.fromEntries(header.map((key, index) => [key, row[index] ?? '']))
    );
}

/** Serialize records using the union of every key, in first-seen order. */
export function recordsToCsv(records: Record<string, unknown>[]): string {
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

  const rows = [
    columns,
    ...records.map(record =>
      columns.map(key => {
        const value = record[key];
        if (value === null || value === undefined) {
          return '';
        }
        return typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);
      })
    ),
  ];

  return serializeCsv(rows);
}
