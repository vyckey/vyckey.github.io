import React, { useMemo, useState } from 'react';
import {
  DatePicker,
  Descriptions,
  Flex,
  InputNumber,
  Segmented,
  Select,
  Tabs,
  Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { DateUnit, addToDate, diffDates } from '../../utils/dateCalc';

const { Text } = Typography;

const WEEKDAY_KEYS = [
  'dateCalc.weekdays.sun',
  'dateCalc.weekdays.mon',
  'dateCalc.weekdays.tue',
  'dateCalc.weekdays.wed',
  'dateCalc.weekdays.thu',
  'dateCalc.weekdays.fri',
  'dateCalc.weekdays.sat',
] as const;

function IntervalTab() {
  const { t } = useTranslation();
  const [start, setStart] = useState<Dayjs>(() => dayjs().startOf('day'));
  const [end, setEnd] = useState<Dayjs>(() =>
    dayjs().add(30, 'day').startOf('day')
  );

  const diff = useMemo(() => diffDates(start, end), [start, end]);

  return (
    <Flex vertical gap={16}>
      <Flex wrap gap={16} align="center">
        <Text>{t('dateCalc.start')}</Text>
        <DatePicker
          value={start}
          allowClear={false}
          onChange={value => value && setStart(value)}
        />
        <Text>{t('dateCalc.end')}</Text>
        <DatePicker
          value={end}
          allowClear={false}
          onChange={value => value && setEnd(value)}
        />
      </Flex>

      <Descriptions bordered size="small" column={2}>
        <Descriptions.Item label={t('dateCalc.totalDays')}>
          {t('dateCalc.dayCount', { count: diff.absoluteDays })}
        </Descriptions.Item>
        <Descriptions.Item label={t('dateCalc.weeks')}>
          {t('dateCalc.weekDayCount', {
            weeks: diff.weeks,
            days: diff.weekDays,
          })}
        </Descriptions.Item>
        <Descriptions.Item label={t('dateCalc.calendar')}>
          {t('dateCalc.yearMonthDayCount', {
            years: diff.years,
            months: diff.months,
            days: diff.days,
          })}
        </Descriptions.Item>
        <Descriptions.Item label={t('dateCalc.hours')}>
          {t('dateCalc.hourCount', { count: diff.absoluteDays * 24 })}
        </Descriptions.Item>
      </Descriptions>

      {diff.isNegative && (
        <Text type="warning">{t('dateCalc.negativeHint')}</Text>
      )}
    </Flex>
  );
}

function AddTab() {
  const { t } = useTranslation();
  const [base, setBase] = useState<Dayjs>(() => dayjs().startOf('day'));
  const [amount, setAmount] = useState(7);
  const [unit, setUnit] = useState<DateUnit>('day');
  const [direction, setDirection] = useState<'after' | 'before'>('after');

  const result = useMemo(
    () => addToDate(base, direction === 'before' ? -amount : amount, unit),
    [base, amount, unit, direction]
  );

  const weekdayKey = WEEKDAY_KEYS[result.day()];

  return (
    <Flex vertical gap={16}>
      <Flex wrap gap={16} align="center">
        <DatePicker
          value={base}
          allowClear={false}
          onChange={value => value && setBase(value)}
        />
        <Segmented
          value={direction}
          onChange={value => setDirection(value as 'after' | 'before')}
          options={[
            { label: t('dateCalc.after'), value: 'after' },
            { label: t('dateCalc.before'), value: 'before' },
          ]}
        />
        <InputNumber
          min={0}
          max={100000}
          value={amount}
          onChange={value => setAmount(Number(value) || 0)}
        />
        <Select<DateUnit>
          value={unit}
          onChange={setUnit}
          style={{ width: 120 }}
          options={[
            { value: 'day', label: t('dateCalc.unit.day') },
            { value: 'week', label: t('dateCalc.unit.week') },
            { value: 'month', label: t('dateCalc.unit.month') },
            { value: 'year', label: t('dateCalc.unit.year') },
          ]}
        />
      </Flex>

      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label={t('dateCalc.result')}>
          <Text strong style={{ fontSize: 18 }}>
            {result.format('YYYY-MM-DD')}
          </Text>
          <Text type="secondary" style={{ marginLeft: 12 }}>
            {t(weekdayKey)}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </Flex>
  );
}

export default function DateCalcTool() {
  const { t } = useTranslation();

  return (
    <Tabs
      type="card"
      items={[
        {
          key: 'interval',
          label: t('dateCalc.tabs.interval'),
          children: <IntervalTab />,
        },
        {
          key: 'add',
          label: t('dateCalc.tabs.add'),
          children: <AddTab />,
        },
      ]}
    />
  );
}
