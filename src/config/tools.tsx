import React, { useMemo } from 'react';
import {
  ClockCircleOutlined,
  CodeOutlined,
  DiffOutlined,
  FieldTimeOutlined,
  FileMarkdownOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  GlobalOutlined,
  KeyOutlined,
  LockOutlined,
  QrcodeOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export type ToolCategory =
  'time' | 'text' | 'code' | 'data' | 'network' | 'generator';

export type ToolKey =
  | 'timestamp'
  | 'timer'
  | 'cron'
  | 'textdiff'
  | 'regex'
  | 'markdown'
  | 'encoder_decoder'
  | 'encryption'
  | 'json'
  | 'ipaddress'
  | 'qrcode'
  | 'password';

export interface ToolMeta {
  /** Route segment and menu key. Must match the last segment of `path`. */
  key: ToolKey;
  path: string;
  /** Translation key for the label lives in `tool.registry.<key>`. */
  category: ToolCategory;
  icon: React.ReactNode;
  /** Extra terms used by the tools index search, in both languages. */
  keywords: string[];
  /** Set to false for tools that stay outside the top menu. */
  inMenu?: boolean;
}

export interface LocalizedToolMeta extends ToolMeta {
  label: string;
  description: string;
  categoryLabel: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  'time',
  'text',
  'code',
  'data',
  'network',
  'generator',
];

export const tools: ToolMeta[] = [
  {
    key: 'timestamp',
    path: '/tools/timestamp',
    category: 'time',
    icon: <ClockCircleOutlined />,
    keywords: [
      'unix',
      'timestamp',
      'date',
      'timezone',
      '时间',
      '日期',
      '时区',
      '毫秒',
    ],
  },
  {
    key: 'timer',
    path: '/tools/timer',
    category: 'time',
    icon: <FieldTimeOutlined />,
    keywords: ['timer', 'countdown', 'stopwatch', '秒表', '倒计时', '番茄钟'],
  },
  {
    key: 'cron',
    path: '/tools/cron',
    category: 'time',
    icon: <ScheduleOutlined />,
    keywords: ['cron', 'crontab', 'schedule', '定时任务', '调度'],
  },
  {
    key: 'textdiff',
    path: '/tools/textdiff',
    category: 'text',
    icon: <DiffOutlined />,
    keywords: ['diff', 'compare', '对比', '差异', 'merge'],
  },
  {
    key: 'regex',
    path: '/tools/regex',
    category: 'text',
    icon: <FontSizeOutlined />,
    keywords: ['regex', 'regexp', 'match', 'replace', '正则', '匹配', '替换'],
  },
  {
    key: 'markdown',
    path: '/tools/markdown',
    category: 'text',
    icon: <FileMarkdownOutlined />,
    keywords: ['markdown', 'md', 'preview', 'gfm', '预览', '文档', '导出'],
  },
  {
    key: 'encoder_decoder',
    path: '/tools/encoder_decoder',
    category: 'code',
    icon: <CodeOutlined />,
    keywords: [
      'base64',
      'url',
      'jwt',
      'hash',
      'md5',
      'sha256',
      'hex',
      'unicode',
      'encode',
      'decode',
      '进制',
      '编码',
      '解码',
      '转义',
    ],
  },
  {
    key: 'encryption',
    path: '/tools/encryption',
    category: 'code',
    icon: <LockOutlined />,
    keywords: [
      'rsa',
      'aes',
      'md5',
      'sha256',
      'sha-256',
      'hash',
      'base64',
      'encrypt',
      'decrypt',
      '加密',
      '解密',
      '密钥',
    ],
  },
  {
    key: 'json',
    path: '/tools/json',
    category: 'data',
    icon: <FileTextOutlined />,
    keywords: ['json', 'format', 'validate', '格式化', '压缩', '校验', '排序'],
  },
  {
    key: 'ipaddress',
    path: '/tools/ipaddress',
    category: 'network',
    icon: <GlobalOutlined />,
    keywords: ['ip', 'ipv4', 'ipv6', 'lookup', '归属地', '查询', '网络'],
  },
  {
    key: 'qrcode',
    path: '/tools/qrcode',
    category: 'generator',
    icon: <QrcodeOutlined />,
    keywords: ['qrcode', 'qr', 'logo', 'download', '二维码', '扫码', '图片'],
  },
  {
    key: 'password',
    path: '/tools/password',
    category: 'generator',
    icon: <KeyOutlined />,
    keywords: [
      'password',
      'random',
      'strength',
      'hash',
      '密码',
      '随机',
      '强度',
    ],
    inMenu: false,
  },
];

/** Tools shown in the horizontal menu, in registry order. */
export const menuTools = tools.filter(tool => tool.inMenu !== false);

/** Tool registry with labels and descriptions translated for the active language. */
export function useTools() {
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    const registry = t('tool.registry', { returnObjects: true });
    const categories = t('tool.categories', { returnObjects: true });

    const localized: LocalizedToolMeta[] = tools.map(tool => ({
      ...tool,
      label: registry[tool.key].label,
      description: registry[tool.key].description,
      categoryLabel: categories[tool.category],
    }));

    return {
      tools: localized,
      menuTools: localized.filter(tool => tool.inMenu !== false),
      groupTools: (items: LocalizedToolMeta[] = localized) =>
        TOOL_CATEGORIES.map(category => ({
          category,
          categoryLabel: categories[category],
          items: items.filter(tool => tool.category === category),
        })).filter(group => group.items.length > 0),
    };
    // `t` is recreated when the language changes.
  }, [t, i18n.language]);
}
