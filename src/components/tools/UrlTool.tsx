import React, { useState } from 'react';
import { Alert, Button, Flex, Input, Space, Typography } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CopyButton from '../CopyButton';
import { ParsedUrl, buildUrl, parseUrl } from '../../utils/url';

const { Text, Title } = Typography;

export default function UrlTool() {
  const { t } = useTranslation();
  const [raw, setRaw] = useState(
    'https://example.com/search?q=hello%20world&lang=zh#results'
  );
  const [parts, setParts] = useState<ParsedUrl | null>(() =>
    parseUrl('https://example.com/search?q=hello%20world&lang=zh#results')
  );
  const [error, setError] = useState('');

  function parse() {
    const parsed = parseUrl(raw);
    if (!parsed) {
      setParts(null);
      setError(t('url.invalid'));
      return;
    }
    setError('');
    setParts(parsed);
  }

  function updatePart<K extends keyof ParsedUrl>(key: K, value: ParsedUrl[K]) {
    setParts(current => (current ? { ...current, [key]: value } : current));
  }

  function updateParam(index: number, field: 'key' | 'value', value: string) {
    setParts(current => {
      if (!current) {
        return current;
      }
      const params = current.params.map((param, paramIndex) =>
        paramIndex === index ? { ...param, [field]: value } : param
      );
      return { ...current, params };
    });
  }

  const built = parts ? buildUrl(parts) : '';

  return (
    <Flex vertical gap={16} style={{ maxWidth: 980 }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={raw}
          onChange={event => setRaw(event.target.value)}
          onPressEnter={parse}
          placeholder={t('url.placeholder')}
          style={{ fontFamily: 'monospace' }}
        />
        <Button type="primary" onClick={parse}>
          {t('url.parse')}
        </Button>
      </Space.Compact>

      {error && <Alert type="error" showIcon message={error} />}

      {parts && (
        <>
          <div>
            <Title level={5} style={{ marginTop: 0 }}>
              {t('url.parts')}
            </Title>
            <Flex wrap gap={12}>
              <Input
                addonBefore={t('url.protocol')}
                value={parts.protocol}
                onChange={event => updatePart('protocol', event.target.value)}
                style={{ width: 200 }}
              />
              <Input
                addonBefore={t('url.hostname')}
                value={parts.hostname}
                onChange={event => updatePart('hostname', event.target.value)}
                style={{ width: 280 }}
              />
              <Input
                addonBefore={t('url.port')}
                value={parts.port}
                onChange={event => updatePart('port', event.target.value)}
                style={{ width: 180 }}
              />
              <Input
                addonBefore={t('url.username')}
                value={parts.username}
                onChange={event => updatePart('username', event.target.value)}
                style={{ width: 200 }}
              />
              <Input
                addonBefore={t('url.password')}
                value={parts.password}
                onChange={event => updatePart('password', event.target.value)}
                style={{ width: 200 }}
              />
              <Input
                addonBefore={t('url.pathname')}
                value={parts.pathname}
                onChange={event => updatePart('pathname', event.target.value)}
                style={{ width: 320 }}
              />
              <Input
                addonBefore={t('url.hash')}
                value={parts.hash}
                onChange={event => updatePart('hash', event.target.value)}
                style={{ width: 240 }}
              />
            </Flex>
          </div>

          <div>
            <Title level={5} style={{ marginTop: 0 }}>
              {t('url.params')}
            </Title>
            <Flex vertical gap={8}>
              {parts.params.map((param, index) => (
                <Space.Compact
                  key={`${index}-${param.key}`}
                  style={{ width: '100%' }}>
                  <Input
                    value={param.key}
                    onChange={event =>
                      updateParam(index, 'key', event.target.value)
                    }
                    placeholder="key"
                    style={{ width: '40%' }}
                  />
                  <Input
                    value={param.value}
                    onChange={event =>
                      updateParam(index, 'value', event.target.value)
                    }
                    placeholder="value"
                  />
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      setParts(current =>
                        current
                          ? {
                              ...current,
                              params: current.params.filter(
                                (_, paramIndex) => paramIndex !== index
                              ),
                            }
                          : current
                      )
                    }
                  />
                </Space.Compact>
              ))}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() =>
                  setParts(current =>
                    current
                      ? {
                          ...current,
                          params: [...current.params, { key: '', value: '' }],
                        }
                      : current
                  )
                }>
                {t('url.addParam')}
              </Button>
            </Flex>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('url.paramsHint')}
            </Text>
          </div>

          <div>
            <Title level={5} style={{ marginTop: 0 }}>
              {t('url.result')}
            </Title>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={built}
                readOnly
                style={{ fontFamily: 'monospace' }}
              />
              <CopyButton value={built} />
              <Button
                icon={<ExportOutlined />}
                href={built}
                target="_blank"
                rel="noreferrer">
                {t('url.open')}
              </Button>
            </Space.Compact>
          </div>
        </>
      )}
    </Flex>
  );
}
