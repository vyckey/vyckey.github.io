import { Button, Card, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useRef, useState } from 'react';

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
  const [duration, setDuration] = useState<moment.Duration>();
  const timerRef = useRef<NodeJS.Timer>();

  function countDownTime(endTime: moment.Moment) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      const duration = moment.duration(endTime.diff(moment()));
      if (duration.asMilliseconds() < 0) {
        setDuration(moment.duration(0));
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      } else {
        setDuration(duration);
      }
    }, 1000);
  }

  return (
    <Card title="倒计时">
      <Form
        layout="inline"
        initialValues={{
          time: dayjs(),
        }}
        onFinish={values => {
          const endTime = moment(values.time.valueOf());
          countDownTime(endTime);
          return () => {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
          };
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
  const [duration, setDuration] = useState<moment.Duration>();
  const timerRef = useRef<NodeJS.Timer>();

  function countTime(startTime: moment.Moment) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      const duration = moment.duration(moment().diff(startTime));
      if (duration.asMilliseconds() < 0) {
        setDuration(moment.duration(0));
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      } else {
        setDuration(duration);
      }
    }, 1000);
  }

  return (
    <Card title="计时器">
      <Form
        layout="inline"
        initialValues={{
          time: dayjs(),
        }}
        onFinish={values => {
          const startTime = moment(values.time.valueOf());
          countTime(startTime);
          return () => {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
          };
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
    <>
      <CountDownTimer />
      <CountTimer />
    </>
  );
};

export default TimerPanel;
