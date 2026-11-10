import React, { useEffect, useRef, useState } from 'react';
import { Button, Flex, Input, message, Space, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import CopyButton from '../CopyButton';
import CopyableTextArea from '../CopyableTextArea';
import { useTranslation } from 'react-i18next';
import { isValidIP } from '../../utils/ip';

export default function IPAddressView() {
  const { t } = useTranslation();
  const columns = [
    {
      key: 'ip',
      title: t('ip.columns.ip'),
      dataIndex: 'query',
    },
    {
      key: 'country',
      title: t('ip.columns.country'),
      dataIndex: 'country',
    },
    {
      key: 'countryCode',
      title: t('ip.columns.countryCode'),
      dataIndex: 'countryCode',
    },
    {
      key: 'region',
      title: t('ip.columns.region'),
      dataIndex: 'region',
    },
    {
      key: 'regionName',
      title: t('ip.columns.regionName'),
      dataIndex: 'regionName',
    },
    {
      key: 'city',
      title: t('ip.columns.city'),
      dataIndex: 'city',
    },
    {
      key: 'timezone',
      title: t('ip.columns.timezone'),
      dataIndex: 'timezone',
    },
    {
      key: 'latitude',
      title: t('ip.columns.latitude'),
      dataIndex: 'lat',
    },
    {
      key: 'longitude',
      title: t('ip.columns.longitude'),
      dataIndex: 'lon',
    },
    {
      key: 'isp',
      title: t('ip.columns.isp'),
      dataIndex: 'isp',
    },
    {
      key: 'org',
      title: t('ip.columns.org'),
      dataIndex: 'org',
    },
    {
      key: 'as',
      title: t('ip.columns.as'),
      dataIndex: 'as',
    },
  ];

  const [ip, setIP] = useState('');
  const [ipInfo, setIPInfo] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    void queryIPInfo('');

    return () => {
      // Ignore any in-flight response after unmount.
      requestIdRef.current += 1;
    };
  }, []);

  async function queryIPInfo(value: string) {
    const normalizedIP = value.trim();
    if (normalizedIP && !isValidIP(normalizedIP)) {
      message.error(t('ip.invalid'));
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoading(true);

    try {
      const res = await fetch('http://ip-api.com/json/' + normalizedIP, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as Record<string, unknown>;
      if (requestId !== requestIdRef.current) {
        return;
      }

      if (data.status === 'fail') {
        setIPInfo(data);
        message.error(
          typeof data.message === 'string' ? data.message : t('ip.queryFailed')
        );
        return;
      }

      setIPInfo(data);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      console.error(err);
      message.error(t('ip.queryFailed'));
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <Flex gap={30} justify="center" wrap={true}>
        <Space direction="vertical" style={{ width: 400 }}>
          <Title level={4}>{t('ip.title')}</Title>
          <Flex gap={10} style={{ marginBottom: 10 }}>
            <Input
              allowClear={true}
              value={ip}
              placeholder={t('ip.placeholder')}
              onChange={e => setIP(e.target.value)}
              onPressEnter={() => void queryIPInfo(ip)}
            />
            <Button
              type="primary"
              htmlType="button"
              loading={loading}
              onClick={() => void queryIPInfo(ip)}>
              {t('ip.query')}
            </Button>
          </Flex>
          <Table<Record<string, unknown>>
            bordered={true}
            size="small"
            loading={loading}
            columns={[
              {
                key: 'key',
                title: t('ip.attribute'),
                dataIndex: 'key',
              },
              {
                key: 'value',
                title: t('ip.attributeValue'),
                dataIndex: 'value',
              },
            ]}
            dataSource={columns.map(col => ({
              key: col.title,
              value: ipInfo[col.dataIndex],
            }))}
            pagination={false}
          />
          <p>
            {t('ip.sourcePrefix')}
            <a href="http://ip-api.com" target="_blank" rel="noreferrer">
              http://ip-api.com
            </a>
            {t('ip.sourceSuffix')}
          </p>
        </Space>
        <Space direction="vertical" style={{ width: 400 }}>
          <Title level={4}>{t('ip.curl')}</Title>
          <Input
            prefix="$"
            value={'curl http://ip-api.com/json/' + ip}
            suffix={<CopyButton value={'curl http://ip-api.com/json/' + ip} />}
          />
          {t('ip.jsonResult')}
          <CopyableTextArea rows={18} value={JSON.stringify(ipInfo, null, 2)} />
        </Space>
      </Flex>
    </>
  );
}
