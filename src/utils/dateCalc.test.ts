import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { addToDate, diffDates } from './dateCalc';

describe('dateCalc', () => {
  it('computes total days and a calendar breakdown', () => {
    const diff = diffDates(dayjs('2024-01-01'), dayjs('2024-03-15'));

    expect(diff.totalDays).toBe(74);
    expect(diff.weeks).toBe(10);
    expect(diff.weekDays).toBe(4);
    expect(diff.years).toBe(0);
    expect(diff.months).toBe(2);
    expect(diff.days).toBe(14);
    expect(diff.isNegative).toBe(false);
  });

  it('handles negative differences', () => {
    const diff = diffDates(dayjs('2024-03-15'), dayjs('2024-01-01'));
    expect(diff.totalDays).toBe(-74);
    expect(diff.absoluteDays).toBe(74);
    expect(diff.isNegative).toBe(true);
    expect(diff.months).toBe(2);
    expect(diff.days).toBe(14);
  });

  it('clamps months at the end of shorter months', () => {
    const diff = diffDates(dayjs('2024-01-31'), dayjs('2024-03-01'));
    expect(diff.years).toBe(0);
    expect(diff.months).toBe(1);
    expect(diff.days).toBe(1);
  });

  it('adds and subtracts date units', () => {
    expect(
      addToDate(dayjs('2024-01-31'), 1, 'month').format('YYYY-MM-DD')
    ).toBe('2024-02-29');
    expect(addToDate(dayjs('2024-02-29'), 1, 'year').format('YYYY-MM-DD')).toBe(
      '2025-02-28'
    );
    expect(addToDate(dayjs('2024-01-01'), 10, 'day').format('YYYY-MM-DD')).toBe(
      '2024-01-11'
    );
  });
});
