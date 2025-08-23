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

const Timestamp: React.FC = () => {
  const [nowTime, setNowTime] = useState(moment());
  const [isRunning, setIsRunning] = useState(true);
  const [isSeconds, setIsSeconds] = useState(false);
  const timerRef = useRef<NodeJS.Timer | null>(null);

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

  return (
    <Card title='当前时间戳' bordered={false} style={{ textAlign: 'center' }}>
      <Button
        color='default'
        variant='link'
        style={{ fontSize: 38 }}
        onClick={() => {
          const ts = isSeconds
            ? Math.ceil(nowTime.valueOf() / 1000)
            : nowTime.valueOf();
          navigator.clipboard.writeText(ts + '');
          message.success('复制成功');
        }}>
        {isSeconds ? Math.ceil(nowTime.valueOf() / 1000) : nowTime.valueOf()}
      </Button>
      {isSeconds ? '秒' : '毫秒'}
      <p style={{ fontSize: 20 }}>{nowTime.format('YYYY-MM-DD HH:mm:ss')}</p>
      <Space>
        <Button onClick={() => setIsSeconds(!isSeconds)}>
          ↺切换{isSeconds ? '毫秒' : '秒'}
        </Button>
        <Button
          variant='solid'
          style={{
            backgroundColor: isRunning ? 'red' : 'green',
            color: '#fff',
          }}
          onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? '□ 暂停' : '▷ 开始'}
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
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState<number | null>(null);
  const timeOptions = [
    {
      value: 'millis',
      label: '毫秒(ms)',
    },
    {
      value: 'second',
      label: '秒(s)',
    },
  ];

  function convertTimeToDate(data: TimeConvertFormData) {
    const ts = data.type === 'millis' ? data.timestamp : data.timestamp * 1000;
    const date = moment.tz(ts, data.timezone).format('YYYY-MM-DD HH:mm:ss');
    setDateValue(date);
  }

  function convertDateToTime(data: DateConvertFormData) {
    const date = moment.tz(data.date, 'YYYY-MM-DD HH:mm:ss', data.timezone);
    setTimeValue(
      data.type === 'millis' ? date.valueOf() : Math.ceil(date.valueOf() / 1000)
    );
  }

  return (
    <>
      <Card>
        <h3>
          <ClockCircleOutlined /> 时间戳转日期时间
        </h3>
        <Form<TimeConvertFormData>
          layout='inline'
          initialValues={{
            timestamp: moment.tz('Asia/Shanghai').valueOf(),
            type: 'millis',
            timezone: 'Asia/Shanghai',
          }}
          onFinish={convertTimeToDate}>
          <Form.Item
            name='timestamp'
            rules={[
              {
                required: true,
                message: '请输入时间戳',
              },
            ]}>
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name='type' required={true}>
            <Select options={timeOptions} />
          </Form.Item>
          <Form.Item name='timezone' required={true}>
            <Select
              showSearch
              options={moment.tz.names().map(name => ({
                label: name,
                value: name,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              转换
            </Button>
          </Form.Item>
          <Form.Item>
            <Input value={dateValue} />
          </Form.Item>
        </Form>

        <h3>
          <CalendarOutlined /> 日期时间转时间戳
        </h3>
        <Form<DateConvertFormData>
          layout='inline'
          initialValues={{
            date: moment.tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'),
            type: 'millis',
            timezone: 'Asia/Shanghai',
          }}
          onFinish={convertDateToTime}>
          <Form.Item
            name='date'
            rules={[
              {
                required: true,
                message: '请输入YYYY-MM-DD HH:mm:ss格式日期',
              },
            ]}>
            <Input style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name='type' required={true}>
            <Select options={timeOptions} />
          </Form.Item>
          <Form.Item name='timezone' required={true}>
            <Select
              showSearch
              options={moment.tz.names().map(name => ({
                label: name,
                value: name,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              转换
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
    <Space direction='vertical' style={{ width: '100%' }}>
      <Timestamp />
      <TimeConverter />
    </Space>
  );
};

export default TimestampPanel;
