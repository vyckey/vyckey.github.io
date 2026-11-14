import React, { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Descriptions,
  Divider,
  Flex,
  Input,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import CopyButton from '../CopyButton';
import { calculateCidr, isIpInCidr } from '../../utils/cidr';
import { translateError } from '../../i18n/translateError';

const { Text } = Typography;

export default function CidrTool() {
  const { t } = useTranslation();
  const [input, setInput] = useState('192.168.1.10/24');
  const [checkIp, setCheckIp] = useState('');

  const parsed = useMemo(() => {
    try {
      return { info: calculateCidr(input), error: null };
    } catch (error) {
      return { info: null, error: translateError(t, error) };
    }
  }, [input, t]);

  const checkResult = useMemo(() => {
    if (!parsed.info || !checkIp.trim()) {
      return null;
    }
    try {
      return { inRange: isIpInCidr(checkIp, input), error: null };
    } catch (error) {
      return { inRange: null, error: translateError(t, error) };
    }
  }, [checkIp, input, parsed.info, t]);

  const copyable = (value: string) => (
    <Space size={4}>
      <Text code>{value}</Text>
      <CopyButton value={value} size="small" />
    </Space>
  );

  return (
    <Flex vertical gap={16} style={{ maxWidth: 900 }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="192.168.1.10/24"
          style={{ fontFamily: 'monospace' }}
        />
        <Button type="primary" onClick={() => setInput(input.trim())}>
          {t('cidr.calculate')}
        </Button>
      </Space.Compact>

      {parsed.error && <Alert type="error" showIcon message={parsed.error} />}

      {parsed.info && (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label={t('cidr.network')}>
            {copyable(parsed.info.network)}
          </Descriptions.Item>
          <Descriptions.Item label={t('cidr.broadcast')}>
            {copyable(parsed.info.broadcast)}
          </Descriptions.Item>
          <Descriptions.Item label={t('cidr.netmask')}>
            {copyable(parsed.info.netmask)}
          </Descriptions.Item>
          <Descriptions.Item label={t('cidr.wildcard')}>
            {copyable(parsed.info.wildcard)}
          </Descriptions.Item>
          <Descriptions.Item label={t('cidr.hostRange')} span={2}>
            {parsed.info.firstHost && parsed.info.lastHost ? (
              copyable(`${parsed.info.firstHost} - ${parsed.info.lastHost}`)
            ) : (
              <Text type="secondary">{t('cidr.noHost')}</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('cidr.usableHosts')}>
            <Text>{parsed.info.usableHosts.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('cidr.totalAddresses')}>
            <Text>{parsed.info.totalAddresses.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('cidr.prefix')}>
            <Text>/{parsed.info.prefix}</Text>
          </Descriptions.Item>
        </Descriptions>
      )}

      <Divider style={{ margin: '4px 0' }} />

      <Text strong>{t('cidr.containsTitle')}</Text>
      <Space.Compact style={{ width: '100%', maxWidth: 520 }}>
        <Input
          value={checkIp}
          onChange={event => setCheckIp(event.target.value)}
          placeholder={t('cidr.ipPlaceholder')}
          style={{ fontFamily: 'monospace' }}
        />
      </Space.Compact>
      {checkResult?.error && (
        <Alert type="error" showIcon message={checkResult.error} />
      )}
      {checkResult?.inRange !== null && checkResult?.inRange !== undefined && (
        <Tag color={checkResult.inRange ? 'success' : 'error'}>
          {checkResult.inRange
            ? t('cidr.inRange', { ip: checkIp.trim(), cidr: input.trim() })
            : t('cidr.notInRange', { ip: checkIp.trim(), cidr: input.trim() })}
        </Tag>
      )}

      <Text type="secondary" style={{ fontSize: 12 }}>
        {t('cidr.ipv4Only')}
      </Text>
    </Flex>
  );
}
