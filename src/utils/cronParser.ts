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

export class CronExpressionParser {
  /**
   * Parse and validate a standard 5-field cron expression.
   *
   * Supported tokens per field: `*`, single numbers, lists (`1,3,5`),
   * ranges (`1-5`) and steps (`0/5`, `1-10/2`, `5/10`).
   */
  static parse(expression: string): CronParseResult {
    const fields = this.parseFields(expression);
    return {
      ...fields,
      description: this.describeCron(fields),
    };
  }

  static parseFields(expression: string): CronFields {
    const parts = expression.trim().split(/\s+/);

    if (parts.length !== 5) {
      throw new Error('Cron 表达式必须包含 5 个字段（分 时 日 月 周）');
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    this.assertField(minute, 0, 59, '分钟');
    this.assertField(hour, 0, 23, '小时');
    this.assertField(dayOfMonth, 1, 31, '日期');
    this.assertField(month, 1, 12, '月份');
    this.assertField(dayOfWeek, 0, 7, '星期');

    return { minute, hour, dayOfMonth, month, dayOfWeek };
  }

  private static assertField(
    field: string,
    min: number,
    max: number,
    label: string
  ): void {
    if (!field) {
      throw new Error(`Cron 表达式的${label}字段为空`);
    }

    for (const part of field.split(',')) {
      if (!part) {
        throw new Error(`Cron 表达式的${label}字段包含空的列表项`);
      }

      const segments = part.split('/');
      if (segments.length > 2) {
        throw new Error(`Cron 表达式的${label}字段格式错误：${part}`);
      }

      const [range, stepText] = segments;
      if (!range) {
        throw new Error(`Cron 表达式的${label}字段格式错误：${part}`);
      }

      if (stepText !== undefined) {
        const step = Number(stepText);
        if (!Number.isInteger(step) || step <= 0) {
          throw new Error(`Cron 表达式的${label}字段步长必须为正整数：${part}`);
        }
      }

      if (range === '*') {
        continue;
      }

      if (range === '?') {
        throw new Error(`Cron 表达式的${label}字段暂不支持 ?`);
      }

      if (range.includes('-')) {
        const rangeParts = range.split('-');
        if (rangeParts.length !== 2 || !rangeParts[0] || !rangeParts[1]) {
          throw new Error(`Cron 表达式的${label}字段范围格式错误：${part}`);
        }

        const start = Number(rangeParts[0]);
        const end = Number(rangeParts[1]);

        this.assertNumber(start, min, max, label);
        this.assertNumber(end, min, max, label);

        if (start > end) {
          throw new Error(
            `Cron 表达式的${label}字段范围起始值不能大于结束值：${part}`
          );
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
      throw new Error(
        `Cron 表达式的${label}字段值必须在 ${min}-${max} 之间：${value}`
      );
    }
  }

  private static describeCron(fields: CronFields): string {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = fields;
    let description = '在';

    if (minute === '*') {
      description += '每分钟';
    } else if (minute.includes('/')) {
      const [, interval] = minute.split('/');
      description += `每隔${interval}分钟`;
    } else if (minute.includes('-')) {
      description += `${minute}分钟`;
    } else {
      description += `${minute}分钟`;
    }

    if (hour === '*') {
      description += '的每小时';
    } else if (hour.includes('/')) {
      const [, interval] = hour.split('/');
      description += `的每隔${interval}小时`;
    } else if (hour.includes('-')) {
      description += `的${hour}点`;
    } else {
      description += `的${hour}点`;
    }

    if (dayOfMonth !== '*' && dayOfWeek !== '*') {
      description += `，每月${dayOfMonth}日或${this.getDayOfWeekName(dayOfWeek)}`;
    } else if (dayOfMonth !== '*') {
      description += `，每月${dayOfMonth}日`;
    } else if (dayOfWeek !== '*') {
      description += `，${this.getDayOfWeekName(dayOfWeek)}`;
    } else {
      description += '，每天';
    }

    if (month !== '*') {
      description += `，${month}月`;
    }

    return description;
  }

  private static getDayOfWeekName(dayOfWeek: string): string {
    const dayNames = ['日', '一', '二', '三', '四', '五', '六', '日'];

    if (dayOfWeek === '*') {
      return '每天';
    }

    if (dayOfWeek.includes('-')) {
      return `周${dayOfWeek}`;
    }

    if (dayOfWeek.includes('/')) {
      return `每隔${dayOfWeek.split('/')[1]}天`;
    }

    const dayIndex = parseInt(dayOfWeek, 10);
    if (!isNaN(dayIndex) && dayIndex >= 0 && dayIndex <= 7) {
      return `周${dayNames[dayIndex]}`;
    }

    return dayOfWeek;
  }
}
