import React, { useEffect, useState } from 'react';
import { Button, Flex, Input, message, Space, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import CopyButton from '../CopyButton';
import CopyableTextArea from '../CopyableTextArea';

const IPv4_REGEX =
  /^((?!00)\d{1,3}|0{0,2}\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])(\.((?!00)\d{1,3}|0{0,2}\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])){3}$/;
const IPv6_REGEX =
  /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

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

  useEffect(() => {
    queryIPInfo('');
  }, []);

  async function queryIPInfo(ip: string) {
    ip = (ip || '').trim();
    if (ip && !IPv4_REGEX.test(ip) && !IPv6_REGEX.test(ip)) {
      message.error('IP地址格式错误');
      return;
    }
    fetch('http://ip-api.com/json/' + ip, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        setIPInfo(data);
      })
      .catch(err => {
        console.error(err);
        message.error('IP地址查询失败');
      });
  }

  return (
    <>
      <Flex gap={30} justify="center" wrap={true}>
        <Space direction="vertical" style={{ width: 400 }}>
          <Title level={4}>IP地址信息</Title>
          <Flex gap={10} style={{ marginBottom: 10 }}>
            <Input
              allowClear={true}
              placeholder="请输入IPv4或IPv6地址"
              onChange={e => setIP(e.target.value)}
            />
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => queryIPInfo(ip)}>
              查询
            </Button>
          </Flex>
          <Table<Record<string, unknown>>
            bordered={true}
            size="small"
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
