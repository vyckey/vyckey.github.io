import type { TFunction } from 'i18next';
import { describe, expect, it } from 'vitest';
import i18n from '../i18n';
import { CronExpressionParser } from './cronParser';
import { I18nError } from './errors';

// `setupTests.js` pins the language to zh-CN before each test run.
const t = i18n.t.bind(i18n) as unknown as TFunction;

function errorOf(expression: string): I18nError {
  try {
    CronExpressionParser.parse(expression, t);
  } catch (error) {
    if (error instanceof I18nError) {
      return error;
    }
    throw error;
  }
  throw new Error('Expected the cron expression to be rejected');
}

describe('CronExpressionParser', () => {
  it('parses a standard expression without recursion', () => {
    const result = CronExpressionParser.parse('0 9 * * 1', t);

    expect(result).toMatchObject({
      minute: '0',
      hour: '9',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '1',
    });
    expect(result.description).toContain('9点');
  });

  it('accepts lists, ranges and steps', () => {
    expect(() =>
      CronExpressionParser.parse('1,3,5 9-17/2 * * 1-5', t)
    ).not.toThrow();
    expect(() => CronExpressionParser.parse('5/10 * * * *', t)).not.toThrow();
  });

  it('rejects the wrong number of fields', () => {
    expect(() => CronExpressionParser.parse('* * * *', t)).toThrow(
      'cron.errors.fieldCount'
    );
  });

  it('rejects out-of-range values', () => {
    expect(errorOf('99 * * * *')).toMatchObject({
      key: 'cron.errors.valueRange',
      params: { min: 0, max: 59, value: 99 },
    });
    expect(errorOf('0 24 * * *')).toMatchObject({
      key: 'cron.errors.valueRange',
      params: { min: 0, max: 23, value: 24 },
    });
    expect(errorOf('0 0 0 * *')).toMatchObject({
      key: 'cron.errors.valueRange',
      params: { min: 1, max: 31, value: 0 },
    });
    expect(errorOf('0 0 1 13 *')).toMatchObject({
      key: 'cron.errors.valueRange',
      params: { min: 1, max: 12, value: 13 },
    });
    expect(errorOf('0 0 1 * 8')).toMatchObject({
      key: 'cron.errors.valueRange',
      params: { min: 0, max: 7, value: 8 },
    });
  });

  it('rejects malformed ranges and steps', () => {
    expect(() => CronExpressionParser.parse('0 0 1 * 1-0', t)).toThrow();
    expect(() => CronExpressionParser.parse('*/0 * * * *', t)).toThrow();
    expect(() => CronExpressionParser.parse('1-5/0 * * * *', t)).toThrow();
    expect(() => CronExpressionParser.parse('bad * * * *', t)).toThrow();
  });
});
