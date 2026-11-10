import React, { useMemo, useState } from 'react';
import {
  Button,
  Flex,
  Input,
  Table,
  Tabs,
  Tag,
  Typography,
  Card,
  Space,
  Dropdown,
  Modal,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { CaretDownFilled, CheckOutlined, FlagFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CopyableTextArea from '../CopyableTextArea';
import { findRegexMatches, highlightRegexMatches } from '../../utils/regex';

const { Text } = Typography;

interface MatchResult {
  key: number;
  index: number;
  match: string;
  groups: string[];
}

interface SyntaxItem {
  code: string;
  text: string;
}

interface SyntaxSection {
  title: string;
  items: SyntaxItem[];
}

const highlightColors = [
  '#ffecb3',
  '#b3e5fc',
  '#c8e6c9',
  '#ffcdd2',
  '#e1bee7',
  '#fff9c4',
  '#b2ebf2',
  '#d7ccc8',
];

const syntaxSectionKeys = [
  'characters',
  'positions',
  'quantifiers',
  'groups',
] as const;

const HighlightedText: React.FC<{
  text: string;
  pattern: string;
  flags: string;
}> = ({ text, pattern, flags }) => {
  const segments = useMemo(() => {
    try {
      return highlightRegexMatches(pattern, flags, text);
    } catch {
      // Invalid patterns fall back to the plain text.
      return [{ text, matched: false }];
    }
  }, [text, pattern, flags]);

  return (
    <div style={{ whiteSpace: 'pre-wrap', minHeight: '20px' }}>
      {segments.map((segment, index) =>
        segment.matched ? (
          <span
            key={index}
            style={{
              backgroundColor:
                highlightColors[
                  (segment.matchIndex ?? 0) % highlightColors.length
                ],
              padding: '0 2px',
            }}>
            {segment.text}
          </span>
        ) : (
          <React.Fragment key={index}>{segment.text}</React.Fragment>
        )
      )}
    </div>
  );
};

const SyntaxReference: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      {syntaxSectionKeys.map(sectionKey => {
        const section = t(`regex.syntax.${sectionKey}`, {
          returnObjects: true,
        }) as unknown as SyntaxSection;

        return (
          <div
            key={sectionKey}
            style={{ marginBottom: sectionKey === 'groups' ? 0 : '16px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              {section.title}
            </div>
            {section.items.map(item => (
              <div key={item.code} style={{ padding: '4px 0' }}>
                <Text code>{item.code}</Text> - {item.text}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const commonPatternKeys = [
  'alphanumeric',
  'letters',
  'lettersAndDigits',
  'wordCharacters',
  'chinese',
  'email',
  'domain',
  'url',
  'date',
  'phoneWithArea',
  'chinaPhone',
  'idCard',
  'postalCode',
  'webUrl',
  'ipv4Strict',
  'ip',
] as const;

const commonPatternSources: Record<(typeof commonPatternKeys)[number], string> =
  {
    alphanumeric: '^[A-Za-z0-9]+$',
    letters: '^[A-Za-z]+$',
    lettersAndDigits: '^[A-Za-z0-9]+$',
    wordCharacters: '^\\w+$',
    chinese: '^[\\u4e00-\\u9fa5]+$',
    email: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
    domain:
      '[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\\.?',
    url: '^[a-zA-Z]+://[^\\s]+$',
    date: '\\d{4}-\\d{2}-\\d{2}',
    phoneWithArea: '^(\\d{3,4}-)?\\d{7,8}$',
    chinaPhone: '\\d{3}-\\d{8}|\\d{4}-\\d{7}',
    idCard: '(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}[\\dXx]$)',
    postalCode: '[1-9]\\d{5}(?!\\d)',
    webUrl:
      'https?://(?:[-\\w.])+(?:\\:[0-9]+)?(?:/(?:[\\w/_.])*(?:\\?(?:[\\w&=%.])*)?(?:#(?:[\\w.])*)?)?',
    ipv4Strict:
      '((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}',
    ip: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
  };

const CommonExpressionsDropdown: React.FC<{
  setPattern: (pattern: string) => void;
}> = ({ setPattern }) => {
  const { t } = useTranslation();
  const { Text } = Typography;

  const commonPatternsMenuItems: MenuProps['items'] = commonPatternKeys.map(
    key => ({
      key,
      label: (
        <div>
          <div>
            <strong>{t(`regex.patterns.${key}.name`)}</strong>
          </div>
          <div>
            <Text code>{commonPatternSources[key]}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {t(`regex.patterns.${key}.description`)}
          </div>
        </div>
      ),
      onClick: () => setPattern(commonPatternSources[key]),
    })
  );

  return (
    <Dropdown menu={{ items: commonPatternsMenuItems }} trigger={['click']}>
      <Button>{t('regex.commonExpressions')}</Button>
    </Dropdown>
  );
};

const RegexTool: React.FC = () => {
  const { t } = useTranslation();
  const [pattern, setPattern] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [replacedText, setReplacedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [flags, setFlags] = useState<string>('g');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleMatch = () => {
    setError('');
    try {
      if (!pattern) {
        setMatchResults([]);
        setReplacedText(text);
        return;
      }

      const matches = findRegexMatches(pattern, flags, text).map(
        (match, index) => ({
          key: index,
          ...match,
        })
      );

      setMatchResults(matches);
      setReplacedText(text.replace(new RegExp(pattern, flags), replaceText));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('regex.invalidPattern'));
      setMatchResults([]);
      setReplacedText('');
    }
  };

  const handleReplace = () => {
    setError('');
    try {
      if (!pattern) {
        setReplacedText(text);
        return;
      }
      const regex = new RegExp(pattern, flags);
      const result = text.replace(regex, replaceText);
      setReplacedText(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('regex.invalidPattern'));
    }
  };

  const handleClear = () => {
    setPattern('');
    setText('');
    setReplaceText('');
    setMatchResults([]);
    setReplacedText('');
    setError('');
  };

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const matchColumns: ColumnsType<MatchResult> = [
    {
      title: t('regex.columns.index'),
      dataIndex: 'key',
      key: 'key',
      render: (_, __, index) => index + 1,
    },
    {
      title: t('regex.columns.position'),
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: t('regex.columns.content'),
      dataIndex: 'match',
      key: 'match',
    },
    {
      title: t('regex.columns.groups'),
      dataIndex: 'groups',
      key: 'groups',
      render: (groups: string[]) => (
        <Space wrap>
          {groups.map((group, i) => (
            <Tag key={i} color="blue">
              {group || t('regex.emptyGroup')}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  const flagMenuItems: MenuProps['items'] = (['g', 'i', 'm', 's'] as const).map(
    flag => ({
      key: flag,
      label: (
        <Flex gap="small" align="center">
          {flags.includes(flag) ? (
            <CheckOutlined style={{ color: '#1677ff' }} />
          ) : (
            <span style={{ display: 'inline-block', width: 14 }} />
          )}
          <span>{t(`regex.flags.${flag}`)}</span>
        </Flex>
      ),
      onClick: () => toggleFlag(flag),
    })
  ) as MenuProps['items'];

  return (
    <>
      <Flex vertical gap="middle" style={{ flex: 1, minWidth: 300 }}>
        <Card
          size="small"
          title={t('regex.title')}
          extra={
            <Button
              type="link"
              onClick={() => setIsModalVisible(true)}
              style={{ padding: 0 }}>
              {t('regex.syntaxLink')}
            </Button>
          }>
          <Flex vertical gap="small">
            <Flex gap="small" align="center">
              <Text strong>{t('regex.pattern')}</Text>
              <Input
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                addonBefore="/"
                addonAfter={flags}
                placeholder={t('regex.patternPlaceholder')}
                style={{ flex: 1 }}
              />
              <Dropdown menu={{ items: flagMenuItems }} trigger={['click']}>
                <Button icon={<FlagFilled />}>
                  {t('regex.flags.label')}
                  <CaretDownFilled />
                </Button>
              </Dropdown>
              <CommonExpressionsDropdown setPattern={setPattern} />
            </Flex>

            <Flex gap="small" align="center">
              <Text strong>{t('regex.replacement')}</Text>
              <Input
                value={replaceText}
                onChange={e => setReplaceText(e.target.value)}
                placeholder={t('regex.replacementPlaceholder')}
                style={{ flex: 1 }}
              />
            </Flex>

            <Flex gap="small">
              <Button type="primary" onClick={handleMatch}>
                {t('regex.match')}
              </Button>
              <Button onClick={handleReplace}>{t('regex.replace')}</Button>
              <Button onClick={handleClear}>{t('common.clear')}</Button>
            </Flex>

            {error && <Text type="danger">{error}</Text>}
          </Flex>
        </Card>

        <Card size="small" title={t('regex.textTitle')}>
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              padding: '12px',
              minHeight: '120px',
              maxHeight: '300px',
              overflow: 'auto',
            }}>
            <HighlightedText text={text} pattern={pattern} flags={flags} />
          </div>
          <div style={{ marginTop: '8px' }}>
            <Input.TextArea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={t('regex.textPlaceholder')}
              autoSize={{ minRows: 4, maxRows: 20 }}
              showCount
            />
          </div>
        </Card>

        <Tabs
          items={[
            {
              key: '1',
              label: t('regex.tabs.matches'),
              children: (
                <Card size="small">
                  <Table
                    dataSource={matchResults}
                    columns={matchColumns}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: t('regex.emptyMatches') }}
                  />
                </Card>
              ),
            },
            {
              key: '2',
              label: t('regex.tabs.replacement'),
              children: (
                <Card size="small" title={t('regex.modifiedText')}>
                  <CopyableTextArea
                    value={replacedText}
                    readOnly
                    autoSize={{ minRows: 4, maxRows: 20 }}
                  />
                </Card>
              ),
            },
          ]}
        />
      </Flex>
      <Modal
        title={t('regex.modalTitle')}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            {t('regex.close')}
          </Button>,
        ]}>
        <SyntaxReference />
      </Modal>
    </>
  );
};

export default RegexTool;
