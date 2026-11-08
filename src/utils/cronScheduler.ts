import { CronExpressionParser } from './cronParser';
import type { CronFields } from './cronParser';

export class CronSchedulePredictor {
  /**
   * Forecast the next N schedule times based on a cron expression.
   *
   * Times are aligned to the start of a minute and evaluated in the local
   * timezone, matching how the rest of the application displays dates.
   */
  static predictNextSchedules(
    expression: string,
    count: number = 5,
    startDate: Date = new Date()
  ): Date[] {
    if (count <= 0) {
      return [];
    }

    try {
      const fields = CronExpressionParser.parseFields(expression);
      const schedules: Date[] = [];
      const currentDate = new Date(startDate.getTime());

      // Cron runs at second 0. Move to the next whole minute so predictions
      // never inherit the seconds/milliseconds of the current clock.
      currentDate.setSeconds(0, 0);
      currentDate.setMinutes(currentDate.getMinutes() + 1);

      const maxDate = startDate.getTime() + 5 * 366 * 24 * 60 * 60 * 1000;

      while (schedules.length < count && currentDate.getTime() <= maxDate) {
        if (this.matchesCron(currentDate, fields)) {
          schedules.push(new Date(currentDate.getTime()));
        }
        currentDate.setMinutes(currentDate.getMinutes() + 1);
      }

      return schedules;
    } catch (error) {
      console.error('Error predicting schedules:', error);
      return [];
    }
  }

  private static matchesCron(date: Date, fields: CronFields): boolean {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = fields;

    const dayOfMonthMatches = this.matchesField(date.getDate(), dayOfMonth, 1);
    const dayOfWeekMatches = this.matchesDayOfWeek(date.getDay(), dayOfWeek);

    // Standard cron uses OR when both day-of-month and day-of-week are
    // restricted; a wildcard in either field falls back to AND.
    const dayMatches =
      dayOfMonth !== '*' && dayOfWeek !== '*'
        ? dayOfMonthMatches || dayOfWeekMatches
        : dayOfMonthMatches && dayOfWeekMatches;

    return (
      this.matchesField(date.getMinutes(), minute, 0) &&
      this.matchesField(date.getHours(), hour, 0) &&
      dayMatches &&
      this.matchesField(date.getMonth() + 1, month, 1)
    );
  }

  private static matchesDayOfWeek(value: number, expression: string): boolean {
    if (expression === '*') {
      return true;
    }

    if (this.matchesField(value, expression, 0)) {
      return true;
    }

    // Sunday can be written as 0 or 7.
    return value === 0 && this.matchesField(7, expression, 0);
  }

  /**
   * Check if a field value matches the cron field expression.
   *
   * `min` is the first valid value for the field (0 for minute/hour/weekday,
   * 1 for day-of-month/month); step expressions start at that value.
   */
  private static matchesField(
    value: number,
    expression: string,
    min: number = 0
  ): boolean {
    if (expression === '*') {
      return true;
    }

    if (expression.includes(',')) {
      return expression
        .split(',')
        .some(part => this.matchesField(value, part, min));
    }

    if (expression.includes('/')) {
      const [range, step] = expression.split('/');
      const stepNum = parseInt(step, 10);

      if (range === '*') {
        return value >= min && (value - min) % stepNum === 0;
      }

      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        return (
          value >= start && value <= end && (value - start) % stepNum === 0
        );
      }

      const start = parseInt(range, 10);
      return value >= start && (value - start) % stepNum === 0;
    }

    if (expression.includes('-')) {
      const [start, end] = expression.split('-').map(Number);
      return value >= start && value <= end;
    }

    return value === parseInt(expression, 10);
  }
}
