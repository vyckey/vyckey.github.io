import dayjs, { Dayjs } from 'dayjs';

export type DateUnit = 'day' | 'week' | 'month' | 'year';

export interface DateDiffResult {
  /** Signed difference in days (end - start). */
  totalDays: number;
  absoluteDays: number;
  weeks: number;
  weekDays: number;
  /** Calendar breakdown, always positive. */
  years: number;
  months: number;
  days: number;
  isNegative: boolean;
}

/**
 * Difference between two dates, both as total days and as a calendar
 * year/month/day breakdown.
 */
export function diffDates(start: Dayjs, end: Dayjs): DateDiffResult {
  const totalDays = end.startOf('day').diff(start.startOf('day'), 'day');
  const isNegative = totalDays < 0;
  const absoluteDays = Math.abs(totalDays);
  const earlier = isNegative ? end : start;
  const later = isNegative ? start : end;

  let cursor = earlier;
  const years = later.diff(cursor, 'year');
  cursor = cursor.add(years, 'year');
  const months = later.diff(cursor, 'month');
  cursor = cursor.add(months, 'month');
  const days = later.diff(cursor, 'day');

  return {
    totalDays,
    absoluteDays,
    weeks: Math.floor(absoluteDays / 7),
    weekDays: absoluteDays % 7,
    years,
    months,
    days,
    isNegative,
  };
}

export function addToDate(base: Dayjs, amount: number, unit: DateUnit): Dayjs {
  return dayjs(base).add(amount, unit);
}
