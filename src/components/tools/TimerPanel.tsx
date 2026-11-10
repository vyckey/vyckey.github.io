import { Button, Card, DatePicker, Form, Space } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DurationTextProps {
  duration: moment.Duration;
}

const DurationText: React.FC<DurationTextProps> = ({ duration }) => {
  const { t } = useTranslation();

  return (
    <div>
      <span>
        <span style={{ fontSize: 20 }}>{duration.years()}</span>
        {t('timer.units.year')}{' '}
      </span>
      <span>
        <span style={{ fontSize: 20 }}>{duration.months()}</span>
        {t('timer.units.month')}{' '}
      </span>
      <span>
        <span style={{ fontSize: 20 }}>{duration.days()}</span>
        {t('timer.units.day')}{' '}
      </span>
      <span> </span>
      <span>
        <span style={{ fontSize: 20 }}>{duration.hours()}</span>{' '}
        {t('timer.units.hour')}
      </span>
      <span>
        <span style={{ fontSize: 20 }}>{duration.minutes()}</span>{' '}
        {t('timer.units.minute')}{' '}
      </span>
      <span>
        <span style={{ fontSize: 24, color: 'red' }}>{duration.seconds()}</span>{' '}
        {t('timer.units.second')}
      </span>
    </div>
  );
};

const CountDownTimer = () => {
  const { t } = useTranslation();
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
    <Card title={t('timer.countdownTitle')}>
      <Form
        layout="inline"
        initialValues={{
          time: dayjs(),
        }}
        onFinish={values => {
          countDownTime(moment(values.time.valueOf()));
        }}>
        <Form.Item name="time" label={t('timer.targetTime')} required={true}>
          <DatePicker showTime={true} allowClear={false} />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{
              backgroundColor: 'green',
              color: '#fff',
            }}>
            {t('common.start')}
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
            {t('common.pause')}
          </Button>
        </Form.Item>
        <Form.Item>
          {!duration || duration.asMilliseconds() <= 0 ? (
            t('timer.finished')
          ) : (
            <DurationText duration={duration} />
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};

const CountTimer = () => {
  const { t } = useTranslation();
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
    <Card title={t('timer.stopwatchTitle')}>
      <Form
        layout="inline"
        initialValues={{
          time: dayjs(),
        }}
        onFinish={values => {
          countTime(moment(values.time.valueOf()));
        }}>
        <Form.Item name="time" label={t('timer.targetTime')} required={true}>
          <DatePicker showTime={true} allowClear={false} />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{
              backgroundColor: 'green',
              color: '#fff',
            }}>
            {t('common.start')}
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
            {t('common.pause')}
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
