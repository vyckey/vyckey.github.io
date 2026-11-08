import { afterEach, describe, expect, it, vi } from 'vitest';
import { CronSchedulePredictor } from './cronScheduler';

describe('CronSchedulePredictor', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('aligns predicted times to the start of a minute', () => {
    const schedules = CronSchedulePredictor.predictNextSchedules(
      '0 9 * * *',
      2,
      new Date(2026, 10, 8, 8, 59, 30, 500)
    );

    expect(schedules).toHaveLength(2);
    expect(schedules[0].getSeconds()).toBe(0);
    expect(schedules[0].getMilliseconds()).toBe(0);
    expect(schedules[0].getHours()).toBe(9);
  });

  it('treats 7 as Sunday in day-of-week ranges', () => {
    const schedules = CronSchedulePredictor.predictNextSchedules(
      '0 9 * * 1-7',
      8,
      new Date(2026, 10, 8, 0, 0, 0)
    );

    expect(schedules).toHaveLength(8);
    expect(schedules.some(date => date.getDay() === 0)).toBe(true);
  });

  it('uses OR when both day-of-month and day-of-week are restricted', () => {
    const schedules = CronSchedulePredictor.predictNextSchedules(
      '0 0 1 * 1',
      5,
      new Date(2026, 0, 2, 0, 0, 0)
    );

    expect(
      schedules.some(date => date.getDate() !== 1 && date.getDay() === 1)
    ).toBe(true);
  });

  it('supports start/step expressions such as 5/10', () => {
    const schedules = CronSchedulePredictor.predictNextSchedules(
      '5/10 * * * *',
      5,
      new Date(2026, 0, 1, 0, 0, 0)
    );

    expect(schedules.map(date => date.getMinutes())).toEqual([
      5, 15, 25, 35, 45,
    ]);
  });

  it('returns an empty array for an invalid expression', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(
      CronSchedulePredictor.predictNextSchedules('bad * * * *', 5)
    ).toEqual([]);
  });

  it('returns an empty array when count is not positive', () => {
    expect(CronSchedulePredictor.predictNextSchedules('* * * * *', 0)).toEqual(
      []
    );
  });
});
