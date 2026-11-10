import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
} from 'antd';
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { copyText } from '../../utils/clipboard';

const Timestamp: React.FC = () => {
  const { t } = useTranslation();
  const [nowTime, setNowTime] = useState(moment());
  const [isRunning, setIsRunning] = useState(true);
  const [isSeconds, setIsSeconds] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setNowTime(moment());
      }, 1000);
      timerRef.current = timer;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  const displayTimestamp = isSeconds
    ? Math.floor(nowTime.valueOf() / 1000)
    : nowTime.valueOf();

  async function copyTimestamp() {
    try {
      await copyText(String(displayTimestamp));
      message.success(t('common.copySuccess'));
    } catch (err) {
      console.error('copy timestamp fail', err);
      message.error(t('common.copyFailed'));
    }
  }

  const unit = isSeconds
    ? t('timestamp.unitSecond')
    : t('timestamp.unitMillisecond');

  return (
    <Card
      title={t('timestamp.currentTitle')}
      bordered={false}
      style={{ textAlign: 'center' }}>
      <Button
        color="default"
        variant="link"
        style={{ fontSize: 38 }}
        onClick={copyTimestamp}>
        {displayTimestamp}
      </Button>
      {unit}
      <p style={{ fontSize: 20 }}>{nowTime.format('YYYY-MM-DD HH:mm:ss')}</p>
      <Space>
        <Button onClick={() => setIsSeconds(!isSeconds)}>
          {t('timestamp.switchTo', {
            unit: isSeconds
              ? t('timestamp.unitMillisecond')
              : t('timestamp.unitSecond'),
          })}
        </Button>
        <Button
          variant="solid"
          style={{
            backgroundColor: isRunning ? 'red' : 'green',
            color: '#fff',
          }}
          onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? t('common.pause') : t('common.start')}
        </Button>
      </Space>
    </Card>
  );
};

interface TimeConvertFormData {
  timestamp: number;
  type: string;
  timezone: string;
}

interface DateConvertFormData {
  date: string;
  type: string;
  timezone: string;
}

const TimeConverter: React.FC = () => {
  const { t } = useTranslation();
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState<number | null>(null);
  const timeOptions = [
    {
      value: 'millis',
      label: t('timestamp.units.millis'),
    },
    {
      value: 'second',
      label: t('timestamp.units.seconds'),
    },
  ];

  function convertTimeToDate(data: TimeConvertFormData) {
    const ts = data.type === 'millis' ? data.timestamp : data.timestamp * 1000;
    const date = moment.tz(ts, data.timezone);
    if (!date.isValid()) {
      setDateValue('');
      message.error(t('timestamp.invalidTimestamp'));
      return;
    }
    setDateValue(date.format('YYYY-MM-DD HH:mm:ss'));
  }

  function convertDateToTime(data: DateConvertFormData) {
    const date = moment.tz(data.date, 'YYYY-MM-DD HH:mm:ss', data.timezone);
    if (!date.isValid()) {
      setTimeValue(null);
      message.error(t('timestamp.invalidDate'));
      return;
    }
    setTimeValue(
      data.type === 'millis'
        ? date.valueOf()
        : Math.floor(date.valueOf() / 1000)
    );
  }

  return (
    <>
      <Card>
        <h3>
          <ClockCircleOutlined /> {t('timestamp.timestampToDate')}
        </h3>
        <Form<TimeConvertFormData>
          layout="inline"
          initialValues={{
            timestamp: moment.tz('Asia/Shanghai').valueOf(),
            type: 'millis',
            timezone: 'Asia/Shanghai',
          }}
          onFinish={convertTimeToDate}>
          <Form.Item
            name="timestamp"
            rules={[
              {
                required: true,
                message: t('timestamp.timestampRequired'),
              },
            ]}>
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="type" required={true}>
            <Select options={timeOptions} />
          </Form.Item>
          <Form.Item name="timezone" required={true}>
            <Select
              showSearch
              options={moment.tz.names().map(name => ({
                label: name,
                value: name,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t('timestamp.convert')}
            </Button>
          </Form.Item>
          <Form.Item>
            <Input value={dateValue} />
          </Form.Item>
        </Form>

        <h3>
          <CalendarOutlined /> {t('timestamp.dateToTimestamp')}
        </h3>
        <Form<DateConvertFormData>
          layout="inline"
          initialValues={{
            date: moment.tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'),
            type: 'millis',
            timezone: 'Asia/Shanghai',
          }}
          onFinish={convertDateToTime}>
          <Form.Item
            name="date"
            rules={[
              {
                required: true,
                message: t('timestamp.dateRequired'),
              },
            ]}>
            <Input style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="type" required={true}>
            <Select options={timeOptions} />
          </Form.Item>
          <Form.Item name="timezone" required={true}>
            <Select
              showSearch
              options={moment.tz.names().map(name => ({
                label: name,
                value: name,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t('timestamp.convert')}
            </Button>
          </Form.Item>
          <Form.Item>
            <InputNumber value={timeValue} style={{ width: 160 }} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

const TimestampPanel: React.FC = () => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Timestamp />
      <TimeConverter />
    </Space>
  );
};

export default TimestampPanel;
