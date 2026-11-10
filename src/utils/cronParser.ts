import type { TFunction } from 'i18next';
import { I18nError } from './errors';

export interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface CronParseResult extends CronFields {
  description: string;
}

type CronFieldKey = keyof CronFields;

const FIELD_LIMITS: Record<
  CronFieldKey,
  { min: number; max: number; labelKey: string }
> = {
  minute: { min: 0, max: 59, labelKey: 'cron.fields.minute' },
  hour: { min: 0, max: 23, labelKey: 'cron.fields.hour' },
  dayOfMonth: { min: 1, max: 31, labelKey: 'cron.fields.dayOfMonth' },
  month: { min: 1, max: 12, labelKey: 'cron.fields.month' },
  dayOfWeek: { min: 0, max: 7, labelKey: 'cron.fields.dayOfWeek' },
};

export class CronExpressionParser {
  /**
   * Parse and validate a standard 5-field cron expression.
   *
   * Supported tokens per field: `*`, single numbers, lists (`1,3,5`),
   * ranges (`1-5`) and steps (`0/5`, `1-10/2`, `5/10`).
   */
  static parse(expression: string, t: TFunction): CronParseResult {
    const fields = this.parseFields(expression, t);
    return {
      ...fields,
      description: this.describeCron(fields, t),
    };
  }

  static parseFields(expression: string, t?: TFunction): CronFields {
    const parts = expression.trim().split(/\s+/);

    if (parts.length !== 5) {
      throw new I18nError('cron.errors.fieldCount');
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    this.assertField(minute, 'minute', t);
    this.assertField(hour, 'hour', t);
    this.assertField(dayOfMonth, 'dayOfMonth', t);
    this.assertField(month, 'month', t);
    this.assertField(dayOfWeek, 'dayOfWeek', t);

    return { minute, hour, dayOfMonth, month, dayOfWeek };
  }

  private static translate(t: TFunction, key: string): string {
    return (t as unknown as (key: string) => string)(key);
  }

  private static assertField(
    field: string,
    fieldKey: CronFieldKey,
    t?: TFunction
  ): void {
    const { min, max, labelKey } = FIELD_LIMITS[fieldKey];
    // Callers that only need the parsed fields (e.g. the scheduler) can omit
    // `t`; the raw key is then stored instead of a localized label.
    const label = t ? this.translate(t, labelKey) : labelKey;

    if (!field) {
      throw new I18nError('cron.errors.fieldEmpty', { label });
    }

    for (const part of field.split(',')) {
      if (!part) {
        throw new I18nError('cron.errors.listItemEmpty', { label });
      }

      const segments = part.split('/');
      if (segments.length > 2) {
        throw new I18nError('cron.errors.format', { label, part });
      }

      const [range, stepText] = segments;
      if (!range) {
        throw new I18nError('cron.errors.format', { label, part });
      }

      if (stepText !== undefined) {
        const step = Number(stepText);
        if (!Number.isInteger(step) || step <= 0) {
          throw new I18nError('cron.errors.step', { label, part });
        }
      }

      if (range === '*') {
        continue;
      }

      if (range === '?') {
        throw new I18nError('cron.errors.question', { label });
      }

      if (range.includes('-')) {
        const rangeParts = range.split('-');
        if (rangeParts.length !== 2 || !rangeParts[0] || !rangeParts[1]) {
          throw new I18nError('cron.errors.rangeFormat', { label, part });
        }

        const start = Number(rangeParts[0]);
        const end = Number(rangeParts[1]);

        this.assertNumber(start, min, max, label);
        this.assertNumber(end, min, max, label);

        if (start > end) {
          throw new I18nError('cron.errors.rangeOrder', { label, part });
        }
      } else {
        this.assertNumber(Number(range), min, max, label);
      }
    }
  }

  private static assertNumber(
    value: number,
    min: number,
    max: number,
    label: string
  ): void {
    if (!Number.isInteger(value) || value < min || value > max) {
      throw new I18nError('cron.errors.valueRange', {
        label,
        min,
        max,
        value,
      });
    }
  }

  private static describeCron(fields: CronFields, t: TFunction): string {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = fields;

    let minuteText: string;
    if (minute === '*') {
      minuteText = t('cron.describe.everyMinute');
    } else if (minute.includes('/')) {
      const [, interval] = minute.split('/');
      minuteText = t('cron.describe.everyNMinutes', { count: interval });
    } else {
      minuteText = t('cron.describe.atMinute', { minute });
    }

    let hourText: string;
    if (hour === '*') {
      hourText = t('cron.describe.everyHour');
    } else if (hour.includes('/')) {
      const [, interval] = hour.split('/');
      hourText = t('cron.describe.everyNHours', { count: interval });
    } else {
      hourText = t('cron.describe.atHour', { hour });
    }

    let dayText: string;
    if (dayOfMonth !== '*' && dayOfWeek !== '*') {
      dayText = t('cron.describe.andWeekday', {
        day: dayOfMonth,
        weekday: this.getDayOfWeekName(dayOfWeek, t),
      });
    } else if (dayOfMonth !== '*') {
      dayText = t('cron.describe.dayOfMonth', { day: dayOfMonth });
    } else if (dayOfWeek !== '*') {
      dayText = this.getDayOfWeekName(dayOfWeek, t);
    } else {
      dayText = t('cron.describe.everyDay');
    }

    const monthText = month !== '*' ? t('cron.describe.month', { month }) : '';

    return t('cron.describe.template', {
      minute: minuteText,
      hour: hourText,
      day: dayText,
      month: monthText,
    });
  }

  private static getDayOfWeekName(dayOfWeek: string, t: TFunction): string {
    if (dayOfWeek === '*') {
      return t('cron.describe.everyDay');
    }

    if (dayOfWeek.includes('-')) {
      return t('cron.describe.weekdayRange', { range: dayOfWeek });
    }

    if (dayOfWeek.includes('/')) {
      return t('cron.describe.everyNDays', {
        count: dayOfWeek.split('/')[1],
      });
    }

    const dayIndex = parseInt(dayOfWeek, 10);
    if (!isNaN(dayIndex) && dayIndex >= 0 && dayIndex <= 7) {
      const dayNames = t('cron.weekdays', {
        returnObjects: true,
      }) as unknown as string[];
      return t('cron.describe.weekdayName', { name: dayNames[dayIndex] });
    }

    return dayOfWeek;
  }
}
