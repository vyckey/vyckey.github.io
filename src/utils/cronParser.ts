export class CronExpressionParser {
  private static readonly cronParts = [
    'minute',
    'hour',
    'dayOfMonth',
    'month',
    'dayOfWeek',
  ];

  /**
   * Parse a cron expression
   * @param expression cron expression
   * @returns parse result
   */
  static parse(expression: string): {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
    description: string;
  } {
    // Remove whitespace and split the expression
    const parts = expression.trim().split(/\s+/);

    // Standard cron expression should have 5 parts
    if (parts.length !== 5) {
      throw new Error('Invalid cron expression: must have 5 parts');
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    return {
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
      description: this.describeCron(expression),
    };
  }

  /**
   * Describe a cron expression in human-readable form
   * @param expression cron expression
   * @returns human-readable description
   */
  private static describeCron(expression: string): string {
    try {
      const { minute, hour, dayOfMonth, month, dayOfWeek } = this.parse(expression);
      
      let description = '在';
      
      // 解析分钟
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
      
      // 解析小时
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
      
      // 解析日期
      if (dayOfMonth !== '*' && dayOfWeek !== '*') {
        description += `，每月${dayOfMonth}日或每周${this.getDayOfWeekName(dayOfWeek)}`;
      } else if (dayOfMonth !== '*') {
        description += `，每月${dayOfMonth}日`;
      } else if (dayOfWeek !== '*') {
        description += `，每周${this.getDayOfWeekName(dayOfWeek)}`;
      } else {
        description += '，每天';
      }
      
      // 解析月份
      if (month !== '*') {
        if (month.includes('-')) {
          description += `，${month}月`;
        } else {
          description += `，${month}月`;
        }
      }
      
      return description;
    } catch (error) {
      console.error('Error describing cron expression:', error);
      return '无法解析的表达式';
    }
  }

  /**
   * Get the name of the day of the week
   * @param dayOfWeek day of week expression
   * @returns day of week name
   */
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