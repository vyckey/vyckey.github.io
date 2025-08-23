import { Card, Form, Input, Button, List, Typography, Flex } from 'antd';
import React, { useState } from 'react';
import { CronExpressionParser } from '../../utils/cronParser';
import { CronSchedulePredictor } from '../../utils/cronScheduler';

const { Title, Text } = Typography;

const CronTool: React.FC = () => {
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

  const handleParse = (values: { expression: string }) => {
    try {
      const result = CronExpressionParser.parse(values.expression);
      setParsedResult(result);
      setError(null);

      // 预测接下来的5个调度时间
      const nextSchedules = CronSchedulePredictor.predictNextSchedules(values.expression, 5);
      setSchedules(nextSchedules);
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析失败');
      setParsedResult(null);
      setSchedules([]);
    }
  };

  return (
    <Flex align='start' justify='space-between' gap={16}>
      <Card title='Cron表达式解析器' style={{ flex: 1, minWidth: 300 }}>
        <Form
          layout='inline'
          onFinish={handleParse}
          initialValues={{ expression: '* * * * *' }}
        >
          <Form.Item
            name='expression'
            label='Cron表达式'
            rules={[{ required: true, message: '请输入Cron表达式' }]}
          >
            <Input placeholder='例如: 0 9 * * 1 (每周一上午9点)' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              解析
            </Button>
          </Form.Item>
        </Form>

        {error && (
          <Card size='small' style={{ marginTop: 16 }} danger>
            <Text type='danger'>{error}</Text>
          </Card>
        )}

        {parsedResult && (
          <Card size='small' style={{ marginTop: 16 }}>
            <Title level={5}>解析结果</Title>
            <Text>分钟: {parsedResult.minute}</Text><br />
            <Text>小时: {parsedResult.hour}</Text><br />
            <Text>日期: {parsedResult.dayOfMonth}</Text><br />
            <Text>月份: {parsedResult.month}</Text><br />
            <Text>星期: {parsedResult.dayOfWeek}</Text><br />
            <Text strong>描述: {parsedResult.description}</Text>
          </Card>
        )}

        {schedules.length > 0 && (
          <Card size='small' style={{ marginTop: 16 }}>
            <Title level={5}>预测未来调度时间</Title>
            <List
              dataSource={schedules}
              renderItem={(date) => (
                <List.Item>
                  <Text>{date.toLocaleString('zh-CN')}</Text>
                </List.Item>
              )}
            />
          </Card>
        )}
      </Card>

      <Card title='Cron表达式语法说明'>
        <Text>
          <p>Cron表达式由5个字段组成，用空格分隔：</p>
          <ul>
            <li>分钟 (0-59)</li>
            <li>小时 (0-23)</li>
            <li>日期 (1-31)</li>
            <li>月份 (1-12)</li>
            <li>星期 (0-7, 0和7都表示周日)</li>
          </ul>
          <p>特殊字符说明：</p>
          <ul>
            <li>* 表示匹配该字段的所有值</li>
            <li>- 表示范围，如1-5表示1到5</li>
            <li>, 表示列表，如1,3,5表示1、3、5</li>
            <li>/ 表示步长，如*/5表示每隔5个单位</li>
          </ul>
          <p>示例：</p>
          <ul>
            <li>* * * * * - 每分钟执行</li>
            <li>0 9 * * * - 每天上午9点执行</li>
            <li>0 9 * * 1 - 每周一上午9点执行</li>
            <li>0 */2 * * * - 每隔2小时执行</li>
          </ul>
        </Text>
      </Card>
    </Flex>
  );
};

export default CronTool;