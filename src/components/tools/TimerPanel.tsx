import { Button, Card, DatePicker, Form, Space } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

interface DurationTextProps {
  duration: moment.Duration;
}

const DurationText: React.FC<DurationTextProps> = ({ duration }) => {
  return (
    <div>
      <span>
        <span style={{ fontSize: 20 }}>{duration.years()}</span>年{' '}
      </span>
      <span>
        <span style={{ fontSize: 20 }}>{duration.months()}</span>月{' '}
      </span>
      <span>
        <span style={{ fontSize: 20 }}>{duration.days()}</span>日{' '}
      </span>
      <span> </span>
      <span>
        <span style={{ fontSize: 20 }}>{duration.hours()}</span> 时
      </span>
      <span>
        <span style={{ fontSize: 20 }}>{duration.minutes()}</span> 分{' '}
      </span>
      <span>
        <span style={{ fontSize: 24, color: 'red' }}>{duration.seconds()}</span>{' '}
        秒
      </span>
    </div>
  );
};

const CountDownTimer = () => {
  const [duration, setDuration] = useState<moment.Duration | undefined>(
    undefined
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  function countDownTime(endTime: moment.Moment) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const tick = () => {
      const remaining = endTime.diff(moment());
      if (remaining <= 0) {
        setDuration(moment.duration(0));
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setDuration(moment.duration(remaining));
      }
    };

    // Render the initial value immediately instead of showing “已结束”
    // during the first second.
    tick();

    if (endTime.diff(moment()) > 0) {
      timerRef.current = setInterval(tick, 1000);
    }
  }

  return (
    <Card title="倒计时">
      <Form
        layout="inline"
        initialValues={{
          time: dayjs(),
        }}
        onFinish={values => {
          countDownTime(moment(values.time.valueOf()));
        }}>
        <Form.Item name="time" label="设定时间" required={true}>
          <DatePicker showTime={true} allowClear={false} />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{
              backgroundColor: 'green',
              color: '#fff',
            }}>
            ▷ 开始
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            color="danger"
            variant="solid"
            onClick={() => {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
            }}>
            □ 暂停
          </Button>
        </Form.Item>
        <Form.Item>
          {!duration || duration.asMilliseconds() <= 0 ? (
            '已结束！'
          ) : (
            <DurationText duration={duration} />
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};

const CountTimer = () => {
  const [duration, setDuration] = useState<moment.Duration | undefined>(
    undefined
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  function countTime(startTime: moment.Moment) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const tick = () => {
      const elapsed = moment().diff(startTime);
      setDuration(elapsed > 0 ? moment.duration(elapsed) : moment.duration(0));
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
  }

  return (
    <Card title="计时器">
      <Form
        layout="inline"
        initialValues={{
          time: dayjs(),
        }}
        onFinish={values => {
          countTime(moment(values.time.valueOf()));
        }}>
        <Form.Item name="time" label="设定时间" required={true}>
          <DatePicker showTime={true} allowClear={false} />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{
              backgroundColor: 'green',
              color: '#fff',
            }}>
            ▷ 开始
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            color="danger"
            variant="solid"
            onClick={() => {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
            }}>
            □ 暂停
          </Button>
        </Form.Item>
        <Form.Item>
          {duration && <DurationText duration={duration} />}
        </Form.Item>
      </Form>
    </Card>
  );
};

const TimerPanel = () => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <CountDownTimer />
      <CountTimer />
    </Space>
  );
};

export default TimerPanel;
