import React from 'react';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import CaseConvertPanel from './encoder/CaseConvertPanel';
import Base64Panel from './encoder/Base64Panel';
import UrlPanel from './encoder/UrlPanel';
import HtmlPanel from './encoder/HtmlPanel';
import HexPanel from './encoder/HexPanel';
import RadixPanel from './encoder/RadixPanel';
import JwtPanel from './encoder/JwtPanel';
import HashPanel from './encoder/HashPanel';

export default function EncoderDecoderTabs() {
  const { t } = useTranslation();

  return (
    <Tabs
      type="card"
      defaultActiveKey="case_convert"
      items={[
        {
          key: 'case_convert',
          label: t('encoder.tabs.case'),
          children: <CaseConvertPanel />,
        },
        {
          key: 'base64',
          label: 'Base64',
          children: <Base64Panel />,
        },
        {
          key: 'url',
          label: t('encoder.tabs.url'),
          children: <UrlPanel />,
        },
        {
          key: 'html',
          label: t('encoder.tabs.html'),
          children: <HtmlPanel />,
        },
        {
          key: 'hex',
          label: 'Hex / Unicode',
          children: <HexPanel />,
        },
        {
          key: 'radix',
          label: t('encoder.tabs.radix'),
          children: <RadixPanel />,
        },
        {
          key: 'jwt',
          label: t('encoder.tabs.jwt'),
          children: <JwtPanel />,
        },
        {
          key: 'hash',
          label: t('encoder.tabs.hash'),
          children: <HashPanel />,
        },
      ]}
    />
  );
}
