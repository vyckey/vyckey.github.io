import { Card, Form, Input, Button, List, Typography, Flex } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translateError } from '../../i18n/translateError';
import { CronExpressionParser } from '../../utils/cronParser';
import { CronSchedulePredictor } from '../../utils/cronScheduler';

const { Title, Text } = Typography;

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(item => String(item)) : [];
}

const CronTool: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [parsedResult, setParsedResult] = useState<{
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
    description: string;
  } | null>(null);

  const [schedules, setSchedules] = useState<Date[]>([]);
  const [error, setError] = useState<string | null>(null);

  const syntaxFields = toStringArray(
    t('cron.syntax.fields', { returnObjects: true })
  );
  const syntaxSpecials = toStringArray(
    t('cron.syntax.specials', { returnObjects: true })
  );
  const syntaxExamples = toStringArray(
    t('cron.syntax.exampleList', { returnObjects: true })
  );

  const handleParse = (values: { expression: string }) => {
    try {
      const result = CronExpressionParser.parse(values.expression, t);
      setParsedResult(result);
      setError(null);

      // Predict the next 5 scheduled runs.
      const nextSchedules = CronSchedulePredictor.predictNextSchedules(
        values.expression,
        5
      );
      setSchedules(nextSchedules);
    } catch (err) {
      setError(translateError(t, err));
      setParsedResult(null);
      setSchedules([]);
    }
  };

  return (
    <Flex align="start" justify="space-between" gap={16} wrap>
      <Card title={t('cron.title')} style={{ flex: 1, minWidth: 300 }}>
        <Form
          layout="inline"
          onFinish={handleParse}
          initialValues={{ expression: '* * * * *' }}>
          <Form.Item
            name="expression"
            label={t('cron.expression')}
            rules={[{ required: true, message: t('cron.required') }]}>
            <Input placeholder={t('cron.placeholder')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t('cron.parse')}
            </Button>
          </Form.Item>
        </Form>

        {error && (
          <Card size="small" style={{ marginTop: 16 }}>
            <Text type="danger">{error}</Text>
          </Card>
        )}

        {parsedResult && (
          <Card size="small" style={{ marginTop: 16 }}>
            <Title level={5}>{t('cron.result')}</Title>
            <Text>
              {t('cron.fields.minute')}: {parsedResult.minute}
            </Text>
            <br />
            <Text>
              {t('cron.fields.hour')}: {parsedResult.hour}
            </Text>
            <br />
            <Text>
              {t('cron.fields.dayOfMonth')}: {parsedResult.dayOfMonth}
            </Text>
            <br />
            <Text>
              {t('cron.fields.month')}: {parsedResult.month}
            </Text>
            <br />
            <Text>
              {t('cron.fields.dayOfWeek')}: {parsedResult.dayOfWeek}
            </Text>
            <br />
            <Text strong>
              {t('cron.description')}: {parsedResult.description}
            </Text>
          </Card>
        )}

        {schedules.length > 0 && (
          <Card size="small" style={{ marginTop: 16 }}>
            <Title level={5}>{t('cron.nextRuns')}</Title>
            <List
              dataSource={schedules}
              renderItem={date => (
                <List.Item>
                  <Text>{date.toLocaleString(i18n.language)}</Text>
                </List.Item>
              )}
            />
          </Card>
        )}
      </Card>

      <Card title={t('cron.syntax.title')} style={{ minWidth: 300 }}>
        <div>
          <p>{t('cron.syntax.intro')}</p>
          <ul>
            {syntaxFields.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{t('cron.syntax.special')}</p>
          <ul>
            {syntaxSpecials.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{t('cron.syntax.examples')}</p>
          <ul>
            {syntaxExamples.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Card>
    </Flex>
  );
};

export default CronTool;
