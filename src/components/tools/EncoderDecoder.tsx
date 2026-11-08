import React from 'react';
import { Tabs } from 'antd';
import CaseConvertPanel from './encoder/CaseConvertPanel';
import Base64Panel from './encoder/Base64Panel';
import UrlPanel from './encoder/UrlPanel';
import HtmlPanel from './encoder/HtmlPanel';
import HexPanel from './encoder/HexPanel';
import RadixPanel from './encoder/RadixPanel';
import JwtPanel from './encoder/JwtPanel';
import HashPanel from './encoder/HashPanel';

export default function EncoderDecoderTabs() {
  return (
    <Tabs
      type="card"
      defaultActiveKey="case_convert"
      items={[
        {
          key: 'case_convert',
          label: '大小写转换',
          children: <CaseConvertPanel />,
        },
        {
          key: 'base64',
          label: 'Base64',
          children: <Base64Panel />,
        },
        {
          key: 'url',
          label: 'URL 编解码',
          children: <UrlPanel />,
        },
        {
          key: 'html',
          label: 'HTML 实体',
          children: <HtmlPanel />,
        },
        {
          key: 'hex',
          label: 'Hex / Unicode',
          children: <HexPanel />,
        },
        {
          key: 'radix',
          label: '进制转换',
          children: <RadixPanel />,
        },
        {
          key: 'jwt',
          label: 'JWT 解析',
          children: <JwtPanel />,
        },
        {
          key: 'hash',
          label: '哈希计算',
          children: <HashPanel />,
        },
      ]}
    />
  );
}
