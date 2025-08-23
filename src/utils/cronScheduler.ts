export class CronSchedulePredictor {
  /**
   * Forecast the next N schedule times based on a cron expression
   * @param expression cron expression
   * @param count number of predictions
   * @param startDate start date (default is current time)
   * @returns array of scheduled times
   */
  static predictNextSchedules(
    expression: string,
    count: number = 5,
    startDate: Date = new Date()
  ): Date[] {
    try {
      const parts = expression.trim().split(/\s+/);
      if (parts.length !== 5) {
        throw new Error('Invalid cron expression');
      }

      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
      const schedules: Date[] = [];
      const currentDate = new Date(startDate.getTime());

      while (schedules.length < count) {
        currentDate.setMinutes(currentDate.getMinutes() + 1);

        // check if current date matches the cron expression
        if (this.matchesCron(currentDate, minute, hour, dayOfMonth, month, dayOfWeek)) {
          schedules.push(new Date(currentDate.getTime()));
        }

        // prevent infinite loop
        if (currentDate.getTime() - startDate.getTime() > 365 * 24 * 60 * 60 * 1000) {
          break;
        }
      }

      return schedules;
    } catch (error) {
      console.error('Error predicting schedules:', error);
      return [];
    }
  }

  /**
   * Check if a date matches the cron expression
   * @param date date to check
   * @param minute minute expression
   * @param hour hour expression
   * @param dayOfMonth day of month expression
   * @param month month expression
   * @param dayOfWeek day of week expression
   * @returns whether it matches
   */
  private static matchesCron(
    date: Date,
    minute: string,
    hour: string,
    dayOfMonth: string,
    month: string,
    dayOfWeek: string
  ): boolean {
    return (
      this.matchesField(date.getMinutes(), minute) &&
      this.matchesField(date.getHours(), hour) &&
      this.matchesField(date.getDate(), dayOfMonth) &&
      this.matchesField(date.getMonth() + 1, month) &&
      this.matchesField(date.getDay(), dayOfWeek === '0' || dayOfWeek === '7' ? '0,7' : dayOfWeek)
    );
  }

  /**
   * Check if a field value matches the cron field expression
   * @param value field value
   * @param expression field expression
   * @returns whether it matches
   */
  private static matchesField(value: number, expression: string): boolean {
    // Handle wildcard
    if (expression === '*') {
      return true;
    }

    // handle list (e.g., 1,2,3)
    if (expression.includes(',')) {
      return expression.split(',').some(part => this.matchesField(value, part));
    }

    // handle range (e.g., 1-5)
    if (expression.includes('-') && !expression.includes('/')) {
      const [start, end] = expression.split('-').map(Number);
      return value >= start && value <= end;
    }

    // handle step (e.g., */5, 1-5/2)
    if (expression.includes('/')) {
      const [range, step] = expression.split('/');
      const stepNum = parseInt(step, 10);

      if (range === '*') {
        return value % stepNum === 0;
      } else if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        return value >= start && value <= end && (value - start) % stepNum === 0;
      }
    }

    // handle single value
    return value === parseInt(expression, 10);
  }
}