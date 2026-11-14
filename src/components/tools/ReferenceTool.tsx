import React, { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Flex,
  Input,
  Space,
  Table,
  Tabs,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  ASCII_TABLE,
  AsciiEntry,
  GIT_COMMANDS,
  HTTP_STATUS_CODES,
  MIME_TYPES,
  ReferenceEntry,
} from '../../data/reference';
import CopyButton from '../CopyButton';

const { Text } = Typography;

interface ReferenceRow {
  key: string;
  code: string;
  name: string;
  description: string;
}

interface ReferenceTableProps {
  entries: ReferenceEntry[];
  showName?: boolean;
  pageSize?: number;
}

function ReferenceTable({
  entries,
  showName = true,
  pageSize,
}: ReferenceTableProps) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const zh = i18n.language.startsWith('zh');

  const rows = useMemo<ReferenceRow[]>(() => {
    const keyword = query.trim().toLowerCase();
    return entries
      .map((entry, index) => ({
        key: `${entry.code}-${index}`,
        code: entry.code,
        name: entry.name,
        description: zh ? entry.zh : entry.en,
      }))
      .filter(row =>
        keyword
          ? `${row.code} ${row.name} ${row.description}`
              .toLowerCase()
              .includes(keyword)
          : true
      );
  }, [entries, query, zh]);

  const codeColumn: ColumnsType<ReferenceRow>[number] = {
    title: t('reference.code'),
    dataIndex: 'code',
    width: showName ? 250 : 300,
    render: value => <Text code>{value}</Text>,
  };
  const nameColumn: ColumnsType<ReferenceRow>[number] = {
    title: t('reference.name'),
    dataIndex: 'name',
    width: 180,
  };
  const descriptionColumn: ColumnsType<ReferenceRow>[number] = {
    title: t('reference.description'),
    dataIndex: 'description',
  };

  const columns: ColumnsType<ReferenceRow> = [
    codeColumn,
    ...(showName ? [nameColumn] : []),
    descriptionColumn,
  ];

  return (
    <Flex vertical gap={12}>
      <Input
        allowClear
        value={query}
        onChange={event => setQuery(event.target.value)}
        prefix={<SearchOutlined />}
        placeholder={t('reference.search')}
        style={{ maxWidth: 360 }}
      />
      <Table<ReferenceRow>
        size="small"
        bordered
        columns={columns}
        dataSource={rows}
        scroll={{ x: 560 }}
        pagination={
          pageSize ? { pageSize, size: 'small', showSizeChanger: false } : false
        }
      />
    </Flex>
  );
}

function AsciiTable() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return ASCII_TABLE;
    }
    return ASCII_TABLE.filter(row =>
      `${row.decimal} ${row.hex} ${row.binary} ${row.char}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [query]);

  const columns: ColumnsType<AsciiEntry> = [
    { title: t('reference.ascii.decimal'), dataIndex: 'decimal', width: 100 },
    { title: t('reference.ascii.hex'), dataIndex: 'hex', width: 100 },
    { title: t('reference.ascii.binary'), dataIndex: 'binary', width: 140 },
    {
      title: t('reference.ascii.char'),
      dataIndex: 'char',
      width: 100,
      render: value => <Text code>{value === ' ' ? '␠' : value}</Text>,
    },
    {
      title: t('reference.ascii.entity'),
      dataIndex: 'entity',
      render: value => <Text code>{value || '—'}</Text>,
    },
  ];

  return (
    <Flex vertical gap={12}>
      <Input
        allowClear
        value={query}
        onChange={event => setQuery(event.target.value)}
        prefix={<SearchOutlined />}
        placeholder={t('reference.search')}
        style={{ maxWidth: 360 }}
      />
      <Table<AsciiEntry>
        size="small"
        bordered
        columns={columns}
        dataSource={rows}
        rowKey="decimal"
        scroll={{ x: 560 }}
        pagination={{ pageSize: 20, size: 'small', showSizeChanger: false }}
      />
    </Flex>
  );
}

const PRESET_MODES = [644, 755, 600, 777];

function ChmodCalculator() {
  const { t } = useTranslation();
  const [bits, setBits] = useState<[number, number, number]>([7, 5, 5]);
  const [octalText, setOctalText] = useState('755');
  const [fileName, setFileName] = useState('file.sh');

  function updateRole(role: number, value: number) {
    const next: [number, number, number] = [...bits];
    next[role] = value;
    setBits(next);
    setOctalText(next.join(''));
  }

  function setFromOctal(value: string) {
    const clean = value.replace(/[^0-7]/g, '').slice(0, 3);
    setOctalText(clean);
    if (clean.length === 3) {
      setBits(clean.split('').map(Number) as [number, number, number]);
    }
  }

  const symbolic = `-${bits
    .map(
      value =>
        `${value & 4 ? 'r' : '-'}${value & 2 ? 'w' : '-'}${
          value & 1 ? 'x' : '-'
        }`
    )
    .join('')}`;
  const command = `chmod ${bits.join('')} ${fileName || 'file'}`;

  return (
    <Flex vertical gap={16} style={{ maxWidth: 720 }}>
      <Flex wrap gap={24}>
        {(
          [
            t('reference.chmod.owner'),
            t('reference.chmod.group'),
            t('reference.chmod.other'),
          ] as const
        ).map((label, role) => (
          <Flex key={label} vertical gap={6}>
            <Text strong>{label}</Text>
            <Checkbox.Group
              value={[4, 2, 1].filter(bit => (bits[role] & bit) !== 0)}
              onChange={values =>
                updateRole(
                  role,
                  (values as number[]).reduce((sum, bit) => sum + bit, 0)
                )
              }
              options={[
                { label: 'r', value: 4 },
                { label: 'w', value: 2 },
                { label: 'x', value: 1 },
              ]}
            />
          </Flex>
        ))}
      </Flex>

      <Space wrap>
        <Input
          addonBefore={t('reference.chmod.octal')}
          value={octalText}
          onChange={event => setFromOctal(event.target.value)}
          style={{ width: 180, fontFamily: 'monospace' }}
        />
        <Space size={4}>
          <Text type="secondary">{t('reference.chmod.symbolic')}</Text>
          <Text code>{symbolic}</Text>
          <CopyButton value={symbolic} size="small" />
        </Space>
      </Space>

      <Space wrap>
        {PRESET_MODES.map(mode => (
          <Button
            key={mode}
            size="small"
            onClick={() => setFromOctal(String(mode))}>
            {mode}
          </Button>
        ))}
      </Space>

      <Space.Compact style={{ width: '100%' }}>
        <Input
          addonBefore={t('reference.chmod.file')}
          value={fileName}
          onChange={event => setFileName(event.target.value)}
          style={{ maxWidth: 220 }}
        />
        <Input value={command} readOnly style={{ fontFamily: 'monospace' }} />
        <CopyButton value={command} />
      </Space.Compact>
    </Flex>
  );
}

export default function ReferenceTool() {
  const { t } = useTranslation();

  return (
    <Tabs
      type="card"
      items={[
        {
          key: 'http',
          label: t('reference.tabs.http'),
          children: (
            <ReferenceTable entries={HTTP_STATUS_CODES} pageSize={25} />
          ),
        },
        {
          key: 'mime',
          label: t('reference.tabs.mime'),
          children: <ReferenceTable entries={MIME_TYPES} pageSize={20} />,
        },
        {
          key: 'ascii',
          label: t('reference.tabs.ascii'),
          children: <AsciiTable />,
        },
        {
          key: 'chmod',
          label: t('reference.tabs.chmod'),
          children: <ChmodCalculator />,
        },
        {
          key: 'git',
          label: t('reference.tabs.git'),
          children: (
            <ReferenceTable
              entries={GIT_COMMANDS}
              showName={false}
              pageSize={20}
            />
          ),
        },
      ]}
    />
  );
}
