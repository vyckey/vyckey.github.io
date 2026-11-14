import React, { useMemo } from 'react';
import {
  AlignLeftOutlined,
  BgColorsOutlined,
  BlockOutlined,
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  DiffOutlined,
  FieldTimeOutlined,
  FileMarkdownOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  GlobalOutlined,
  KeyOutlined,
  LinkOutlined,
  LockOutlined,
  NumberOutlined,
  QrcodeOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export type ToolCategory =
  | 'time'
  | 'text'
  | 'code'
  | 'data'
  | 'network'
  | 'generator'
  | 'design'
  | 'reference';

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
  | 'password'
  | 'uuid'
  | 'color'
  | 'cidr'
  | 'url'
  | 'filehash'
  | 'datecalc'
  | 'totp'
  | 'texttools'
  | 'reference';

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
  'design',
  'reference',
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
  {
    key: 'uuid',
    path: '/tools/uuid',
    category: 'generator',
    icon: <NumberOutlined />,
    keywords: [
      'uuid',
      'nanoid',
      'guid',
      'random',
      'id',
      '唯一',
      '随机',
      '标识',
    ],
  },
  {
    key: 'color',
    path: '/tools/color',
    category: 'design',
    icon: <BgColorsOutlined />,
    keywords: [
      'color',
      'colour',
      'hex',
      'rgb',
      'hsl',
      'contrast',
      'palette',
      '颜色',
      '配色',
      '对比度',
      '调色板',
    ],
  },
  {
    key: 'cidr',
    path: '/tools/cidr',
    category: 'network',
    icon: <BlockOutlined />,
    keywords: [
      'cidr',
      'subnet',
      'netmask',
      'ip',
      'network',
      '子网',
      '掩码',
      '网段',
      '主机',
    ],
  },
  {
    key: 'url',
    path: '/tools/url',
    category: 'network',
    icon: <LinkOutlined />,
    keywords: [
      'url',
      'uri',
      'query',
      'params',
      'link',
      '链接',
      '参数',
      '解析',
      '查询串',
    ],
  },
  {
    key: 'filehash',
    path: '/tools/filehash',
    category: 'code',
    icon: <FileProtectOutlined />,
    keywords: [
      'hash',
      'md5',
      'sha1',
      'sha256',
      'checksum',
      'file',
      '文件',
      '校验',
      '摘要',
    ],
  },
  {
    key: 'datecalc',
    path: '/tools/datecalc',
    category: 'time',
    icon: <CalendarOutlined />,
    keywords: [
      'date',
      'duration',
      'days',
      'age',
      '日期',
      '计算',
      '间隔',
      '相差',
      '天数',
    ],
  },
  {
    key: 'totp',
    path: '/tools/totp',
    category: 'code',
    icon: <SafetyCertificateOutlined />,
    keywords: [
      'totp',
      'otp',
      '2fa',
      'authenticator',
      'verification',
      '动态口令',
      '验证码',
      '两步验证',
    ],
  },
  {
    key: 'texttools',
    path: '/tools/texttools',
    category: 'text',
    icon: <AlignLeftOutlined />,
    keywords: [
      'text',
      'count',
      'words',
      'dedupe',
      'sort',
      '统计',
      '字数',
      '去重',
      '排序',
      '行',
    ],
  },
  {
    key: 'reference',
    path: '/tools/reference',
    category: 'reference',
    icon: <BookOutlined />,
    keywords: [
      'http',
      'status',
      'mime',
      'ascii',
      'chmod',
      'git',
      '状态码',
      '速查',
      '权限',
      '命令',
    ],
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
