import React, { useMemo, useState } from 'react';
import { Button, Flex, Space, Statistic, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import CopyableTextArea from '../CopyableTextArea';
import {
  LineOperation,
  computeTextStats,
  transformLines,
} from '../../utils/textStats';

const { Text } = Typography;

const OPERATIONS: LineOperation[] = [
  'trim',
  'removeEmpty',
  'dedupe',
  'sortAsc',
  'sortDesc',
  'reverse',
  'number',
  'collapseSpaces',
];

export default function TextTools() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const stats = useMemo(() => computeTextStats(input), [input]);

  const items = [
    {
      key: 'characters',
      label: t('textTools.characters'),
      value: stats.characters,
    },
    {
      key: 'charactersNoSpaces',
      label: t('textTools.charactersNoSpaces'),
      value: stats.charactersNoSpaces,
    },
    { key: 'words', label: t('textTools.words'), value: stats.words },
    { key: 'lines', label: t('textTools.lines'), value: stats.lines },
    {
      key: 'nonEmptyLines',
      label: t('textTools.nonEmptyLines'),
      value: stats.nonEmptyLines,
    },
    { key: 'bytes', label: t('textTools.bytes'), value: stats.bytes },
    {
      key: 'reading',
      label: t('textTools.readingTime'),
      value:
        stats.readingMinutes > 0
          ? t('textTools.minutes', { count: stats.readingMinutes })
          : '0',
    },
  ];

  return (
    <Flex vertical gap={16}>
      <CopyableTextArea
        value={input}
        onChange={event => setInput(event.target.value)}
        allowClear
        rows={8}
        placeholder={t('textTools.inputPlaceholder')}
      />

      <Flex wrap gap={8}>
        {items.map(item => (
          <div
            key={item.key}
            style={{
              minWidth: 112,
              padding: '8px 12px',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
            }}>
            <Statistic
              title={item.label}
              value={item.value}
              valueStyle={{ fontSize: 18 }}
            />
          </div>
        ))}
      </Flex>

      <div>
        <Text strong>{t('textTools.operations')}</Text>
        <Flex wrap gap={8} style={{ marginTop: 8 }}>
          {OPERATIONS.map(operation => (
            <Button
              key={operation}
              size="small"
              onClick={() => setOutput(transformLines(input, operation))}>
              {t(`textTools.operation.${operation}`)}
            </Button>
          ))}
          <Button size="small" onClick={() => setOutput(input)}>
            {t('textTools.operation.copy')}
          </Button>
        </Flex>
      </div>

      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <Text type="secondary">{t('textTools.output')}</Text>
        <CopyableTextArea
          value={output}
          onChange={event => setOutput(event.target.value)}
          readOnly={false}
          rows={8}
          allowClear
        />
      </Space>
    </Flex>
  );
}
