import React, { useEffect, useRef, useState } from 'react';
import { Button, Flex, Input, message, Space, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import CopyButton from '../CopyButton';
import CopyableTextArea from '../CopyableTextArea';
import { isValidIP } from '../../utils/ip';

export default function IPAddressView() {
  const columns = [
    {
      key: 'ip',
      title: 'IP地址',
      dataIndex: 'query',
    },
    {
      key: 'country',
      title: '国家',
      dataIndex: 'country',
    },
    {
      key: 'countryCode',
      title: '国家码',
      dataIndex: 'countryCode',
    },
    {
      key: 'region',
      title: '地区',
      dataIndex: 'region',
    },
    {
      key: 'regionName',
      title: '地区名',
      dataIndex: 'regionName',
    },
    {
      key: 'city',
      title: '城市',
      dataIndex: 'city',
    },
    {
      key: 'timezone',
      title: '时区',
      dataIndex: 'timezone',
    },
    {
      key: 'latitude',
      title: '纬度',
      dataIndex: 'lat',
    },
    {
      key: 'longitude',
      title: '经度',
      dataIndex: 'lon',
    },
    {
      key: 'isp',
      title: 'ISP',
      dataIndex: 'isp',
    },
    {
      key: 'org',
      title: '组织',
      dataIndex: 'org',
    },
    {
      key: 'as',
      title: 'AS',
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
      message.error('IP地址格式错误');
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
          typeof data.message === 'string' ? data.message : 'IP地址查询失败'
        );
        return;
      }

      setIPInfo(data);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      console.error(err);
      message.error('IP地址查询失败');
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
          <Title level={4}>IP地址信息</Title>
          <Flex gap={10} style={{ marginBottom: 10 }}>
            <Input
              allowClear={true}
              value={ip}
              placeholder="请输入IPv4或IPv6地址"
              onChange={e => setIP(e.target.value)}
              onPressEnter={() => void queryIPInfo(ip)}
            />
            <Button
              type="primary"
              htmlType="button"
              loading={loading}
              onClick={() => void queryIPInfo(ip)}>
              查询
            </Button>
          </Flex>
          <Table<Record<string, unknown>>
            bordered={true}
            size="small"
            loading={loading}
            columns={[
              {
                key: 'key',
                title: '属性',
                dataIndex: 'key',
              },
              {
                key: 'value',
                title: '属性值',
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
            以上IP信息来源于
            <a href="http://ip-api.com" target="_blank" rel="noreferrer">
              http://ip-api.com
            </a>
            网站。
          </p>
        </Space>
        <Space direction="vertical" style={{ width: 400 }}>
          <Title level={4}>CURL命令</Title>
          <Input
            prefix="$"
            value={'curl http://ip-api.com/json/' + ip}
            suffix={<CopyButton value={'curl http://ip-api.com/json/' + ip} />}
          />
          JSON格式结果
          <CopyableTextArea rows={18} value={JSON.stringify(ipInfo, null, 2)} />
        </Space>
      </Flex>
    </>
  );
}
