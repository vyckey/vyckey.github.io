import React, { useState } from 'react';
import {
  Button,
  Flex,
  InputNumber,
  Segmented,
  Space,
  Switch,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import CopyableTextArea from '../CopyableTextArea';
import {
  formatUuid,
  generateNanoId,
  generateUuidV4,
  generateUuidV7,
} from '../../utils/uuid';

const { Text } = Typography;

type UuidVersion = 'v4' | 'v7' | 'nano';

function buildIds(
  version: UuidVersion,
  count: number,
  uppercase: boolean,
  hyphens: boolean
): string {
  return Array.from({ length: count }, () => {
    if (version === 'v4') {
      return formatUuid(generateUuidV4(), { uppercase, hyphens });
    }
    if (version === 'v7') {
      return formatUuid(generateUuidV7(), { uppercase, hyphens });
    }
    return generateNanoId(21);
  }).join('\n');
}

export default function UuidGenerator() {
  const { t } = useTranslation();
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [output, setOutput] = useState(() => buildIds('v4', 5, false, true));

  return (
    <Flex vertical gap={16}>
      <Flex wrap gap={12} align="center">
        <Segmented
          value={version}
          onChange={value => setVersion(value as UuidVersion)}
          options={[
            { label: 'UUID v4', value: 'v4' },
            { label: 'UUID v7', value: 'v7' },
            { label: 'NanoID', value: 'nano' },
          ]}
        />
        <Space size={6}>
          <Text type="secondary">{t('uuid.count')}</Text>
          <InputNumber
            min={1}
            max={100}
            value={count}
            onChange={value => setCount(Number(value) || 1)}
          />
        </Space>
        {version !== 'nano' && (
          <>
            <Space size={6}>
              <Text type="secondary">{t('uuid.uppercase')}</Text>
              <Switch
                size="small"
                checked={uppercase}
                onChange={setUppercase}
              />
            </Space>
            <Space size={6}>
              <Text type="secondary">{t('uuid.hyphens')}</Text>
              <Switch size="small" checked={hyphens} onChange={setHyphens} />
            </Space>
          </>
        )}
        <Button
          type="primary"
          onClick={() =>
            setOutput(buildIds(version, count, uppercase, hyphens))
          }>
          {t('uuid.generate')}
        </Button>
      </Flex>

      <CopyableTextArea
        value={output}
        readOnly
        rows={12}
        style={{ fontFamily: 'monospace' }}
      />

      <Text type="secondary" style={{ fontSize: 12 }}>
        {t(`uuid.hint.${version}`)}
      </Text>
    </Flex>
  );
}
