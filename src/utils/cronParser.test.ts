import { describe, expect, it } from 'vitest';
import { CronExpressionParser } from './cronParser';

describe('CronExpressionParser', () => {
  it('parses a standard expression without recursion', () => {
    const result = CronExpressionParser.parse('0 9 * * 1');

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
      CronExpressionParser.parse('1,3,5 9-17/2 * * 1-5')
    ).not.toThrow();
    expect(() => CronExpressionParser.parse('5/10 * * * *')).not.toThrow();
  });

  it('rejects the wrong number of fields', () => {
    expect(() => CronExpressionParser.parse('* * * *')).toThrow('5 个字段');
  });

  it('rejects out-of-range values', () => {
    expect(() => CronExpressionParser.parse('99 * * * *')).toThrow('0-59');
    expect(() => CronExpressionParser.parse('0 24 * * *')).toThrow('0-23');
    expect(() => CronExpressionParser.parse('0 0 0 * *')).toThrow('1-31');
    expect(() => CronExpressionParser.parse('0 0 1 13 *')).toThrow('1-12');
    expect(() => CronExpressionParser.parse('0 0 1 * 8')).toThrow('0-7');
  });

  it('rejects malformed ranges and steps', () => {
    expect(() => CronExpressionParser.parse('0 0 1 * 1-0')).toThrow();
    expect(() => CronExpressionParser.parse('*/0 * * * *')).toThrow();
    expect(() => CronExpressionParser.parse('1-5/0 * * * *')).toThrow();
    expect(() => CronExpressionParser.parse('bad * * * *')).toThrow();
  });
});
