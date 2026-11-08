import React from 'react';
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

export type ToolCategory =
  '时间日期' | '文本处理' | '编码与加密' | '数据格式' | '网络工具' | '生成器';

export interface ToolMeta {
  /** Route segment and menu key. Must match the last segment of `path`. */
  key: string;
  path: string;
  label: string;
  description: string;
  category: ToolCategory;
  icon: React.ReactNode;
  /** Extra terms used by the tools index search. */
  keywords: string[];
  /** Set to false for tools that stay outside the top menu. */
  inMenu?: boolean;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  '时间日期',
  '文本处理',
  '编码与加密',
  '数据格式',
  '网络工具',
  '生成器',
];

export const tools: ToolMeta[] = [
  {
    key: 'timestamp',
    path: '/tools/timestamp',
    label: '时间戳',
    description: 'Unix 时间戳与日期互转，支持多时区',
    category: '时间日期',
    icon: <ClockCircleOutlined />,
    keywords: ['unix', 'timestamp', '时间', '日期', '时区', '毫秒'],
  },
  {
    key: 'timer',
    path: '/tools/timer',
    label: '计时器',
    description: '倒计时与正计时，支持暂停和重置',
    category: '时间日期',
    icon: <FieldTimeOutlined />,
    keywords: ['timer', 'countdown', '秒表', '倒计时', '番茄钟'],
  },
  {
    key: 'cron',
    path: '/tools/cron',
    label: 'Cron 表达式',
    description: 'Cron 表达式解析与下次执行时间预测',
    category: '时间日期',
    icon: <ScheduleOutlined />,
    keywords: ['cron', 'crontab', '定时任务', '调度'],
  },
  {
    key: 'textdiff',
    path: '/tools/textdiff',
    label: '文本对比',
    description: '逐行对比两段文本，高亮增删差异',
    category: '文本处理',
    icon: <DiffOutlined />,
    keywords: ['diff', 'compare', '对比', '差异', 'merge'],
  },
  {
    key: 'regex',
    path: '/tools/regex',
    label: '正则表达式',
    description: '正则匹配、高亮、替换与语法速查',
    category: '文本处理',
    icon: <FontSizeOutlined />,
    keywords: ['regex', 'regexp', '正则', '匹配', '替换'],
  },
  {
    key: 'markdown',
    path: '/tools/markdown',
    label: 'Markdown 预览',
    description: '实时预览 Markdown，支持 GFM 表格与导出 HTML',
    category: '文本处理',
    icon: <FileMarkdownOutlined />,
    keywords: ['markdown', 'md', '预览', '文档', 'gfm', '导出'],
  },
  {
    key: 'encoder_decoder',
    path: '/tools/encoder_decoder',
    label: '编码/解码',
    description: 'Base64、URL、HTML 实体、JWT、哈希、进制转换',
    category: '编码与加密',
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
      '进制',
      '编码',
      '解码',
      '转义',
    ],
  },
  {
    key: 'encryption',
    path: '/tools/encryption',
    label: '加密/解密',
    description: 'MD5、Base64、RSA 加解密',
    category: '编码与加密',
    icon: <LockOutlined />,
    keywords: ['rsa', 'aes', 'md5', 'base64', '加密', '解密', '密钥'],
  },
  {
    key: 'json',
    path: '/tools/json',
    label: 'JSON',
    description: 'JSON 格式化、校验、排序与可视化编辑',
    category: '数据格式',
    icon: <FileTextOutlined />,
    keywords: ['json', '格式化', '压缩', '校验', '排序', '导出'],
  },
  {
    key: 'ipaddress',
    path: '/tools/ipaddress',
    label: 'IP 地址查询',
    description: 'IPv4/IPv6 校验与公网 IP 归属地查询',
    category: '网络工具',
    icon: <GlobalOutlined />,
    keywords: ['ip', 'ipv4', 'ipv6', '归属地', '查询', '网络'],
  },
  {
    key: 'qrcode',
    path: '/tools/qrcode',
    label: '二维码生成',
    description: '生成带颜色和 Logo 的二维码，支持下载',
    category: '生成器',
    icon: <QrcodeOutlined />,
    keywords: ['qrcode', 'qr', '二维码', '扫码', '图片'],
  },
  {
    key: 'password',
    path: '/tools/password',
    label: '密码生成',
    description: '生成高强度随机密码并评估密码强度',
    category: '生成器',
    icon: <KeyOutlined />,
    keywords: ['password', '密码', '随机', '强度', 'hash'],
    inMenu: false,
  },
];

/** Tools shown in the horizontal menu, in registry order. */
export const menuTools = tools.filter(tool => tool.inMenu !== false);

export function groupTools(
  items: ToolMeta[] = tools
): { category: ToolCategory; items: ToolMeta[] }[] {
  return TOOL_CATEGORIES.map(category => ({
    category,
    items: items.filter(tool => tool.category === category),
  })).filter(group => group.items.length > 0);
}
