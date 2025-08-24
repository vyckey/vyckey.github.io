import React, { useState } from 'react';
import { Button, Flex, Input, Table, Tabs, Tag, Typography, Card, Space, Dropdown, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
  CaretDownFilled,
  FlagFilled
} from '@ant-design/icons';
import CopyableTextArea from '../CopyableTextArea';

const { Text } = Typography;

interface MatchResult {
  key: number;
  index: number;
  match: string;
  groups: string[];
}

// 自定义高亮文本显示组件
const HighlightedText: React.FC<{ text: string; pattern: string; flags: string }> = ({ text, pattern, flags }) => {
  // 生成带高亮的文本
  const highlightMatches = (text: string, pattern: string, flags: string) => {
    if (!pattern) return text;

    try {
      // 确保全局标志存在用于高亮显示
      const effectiveFlags = flags.includes('g') ? flags : `g${flags}`;
      const regex = new RegExp(`(${pattern})`, effectiveFlags);
      const parts = text.split(regex);

      // 定义多种颜色用于区分不同匹配
      const highlightColors = [
        '#ffecb3', // 浅黄色
        '#b3e5fc', // 浅蓝色
        '#c8e6c9', // 浅绿色
        '#ffcdd2', // 浅红色
        '#e1bee7', // 浅紫色
        '#fff9c4', // 浅黄
        '#b2ebf2', // 浅青色
        '#d7ccc8', // 浅棕色
      ];

      return parts.map((part, index) => {
        // 如果是匹配的部分（奇数索引），则高亮显示
        if (index % 2 === 1) {
          // 计算颜色索引，循环使用颜色
          const colorIndex = Math.floor(index / 2) % highlightColors.length;
          return <span key={index} style={{ backgroundColor: highlightColors[colorIndex], padding: '0 2px' }}>{part}</span>;
        }
        return part;
      });
    } catch {
      // 如果正则表达式无效，返回原始文本
      return text;
    }
  };

  return <div style={{ whiteSpace: 'pre-wrap', minHeight: '20px' }}>{highlightMatches(text, pattern, flags)}</div>;
};

// 语法参考组件
const SyntaxReference: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>字符匹配</div>
        <div style={{ padding: '4px 0' }}><Text code>.</Text> - 匹配除换行符以外的任意字符</div>
        <div style={{ padding: '4px 0' }}><Text code>[abc]</Text> - 匹配a, b或c的一个字符</div>
        <div style={{ padding: '4px 0' }}><Text code>[a-z]</Text> - 匹配a到z的一个字符</div>
        <div style={{ padding: '4px 0' }}><Text code>[^abc]</Text> - 匹配除a, b, c以外的一个字符</div>
        <div style={{ padding: '4px 0' }}><Text code>aa|bb</Text> - 匹配aa或bb的两个字符</div>
        <div style={{ padding: '4px 0' }}><Text code>\w</Text> - 匹配字母、数字、下划线</div>
        <div style={{ padding: '4px 0' }}><Text code>\d</Text> - 匹配数字</div>
        <div style={{ padding: '4px 0' }}><Text code>\s</Text> - 匹配空白字符</div>
        <div style={{ padding: '4px 0' }}><Text code>\W, \D, \S</Text> - 分别是上面的反义</div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>位置匹配</div>
        <div style={{ padding: '4px 0' }}><Text code>^</Text> - 匹配字符串开始</div>
        <div style={{ padding: '4px 0' }}><Text code>$</Text> - 匹配字符串结束</div>
        <div style={{ padding: '4px 0' }}><Text code>\b</Text> - 匹配单词边界</div>
        <div style={{ padding: '4px 0' }}><Text code>\B</Text> - 匹配非单词边界</div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>量词</div>
        <div style={{ padding: '4px 0' }}><Text code>*</Text> - 匹配0次或多次</div>
        <div style={{ padding: '4px 0' }}><Text code>+</Text> - 匹配1次或多次</div>
        <div style={{ padding: '4px 0' }}><Text code>?</Text> - 匹配0次或1次</div>
        <div style={{ padding: '4px 0' }}><Text code>{'{n}'}</Text> - 匹配n次</div>
        <div style={{ padding: '4px 0' }}><Text code>{'{n,}'}</Text> - 匹配n次及以上</div>
        <div style={{ padding: '4px 0' }}><Text code>{'{m,n}'}</Text> - 匹配m到n次</div>
      </div>

      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>分组和引用</div>
        <div style={{ padding: '4px 0' }}><Text code>(...)</Text> - 分组</div>
        <div style={{ padding: '4px 0' }}><Text code>(?:...)</Text> - 非捕获分组</div>
        <div style={{ padding: '4px 0' }}><Text code>(?=...)</Text> - 正向先行断言</div>
        <div style={{ padding: '4px 0' }}><Text code>(?!...)</Text> - 负向先行断言</div>
      </div>
    </div>
  );
};

// 常用表达式下拉组件（用于放置在修饰符右侧）
const CommonExpressionsDropdown: React.FC<{
  setPattern: (pattern: string) => void;
}> = ({ setPattern }) => {
  const { Text } = Typography;

  const commonPatterns: { name: string; pattern: string; description: string }[] = [
    {
      name: '英文和数字',
      pattern: '^[A-Za-z0-9]+$',
      description: '匹配英文字符和数字的组合'
    },
    {
      name: '26个英文字母',
      pattern: '^[A-Za-z]+$',
      description: '匹配英文字母'
    },
    {
      name: '数字和26个英文字母',
      pattern: '^[A-Za-z0-9]+$',
      description: '匹配数字和英文字母的组合'
    },
    {
      name: '数字、字母或下划线',
      pattern: '^\\w+$',
      description: '匹配数字、字母或下划线'
    },
    {
      name: '汉字',
      pattern: '^[\\u4e00-\\u9fa5]+$',
      description: '匹配一个或多个汉字'
    },
    {
      name: 'Email地址',
      pattern: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
      description: '匹配标准的Email地址格式'
    },
    {
      name: '域名',
      pattern: '[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\\.?',
      description: '匹配域名格式'
    },
    {
      name: 'Internet URL',
      pattern: '^[a-zA-Z]+://[^\\s]+$',
      description: '匹配Internet URL地址'
    },
    {
      name: '日期格式',
      pattern: '\\d{4}-\\d{2}-\\d{2}',
      description: '匹配YYYY-MM-DD日期格式'
    },
    {
      name: '电话号码（区号-号码）',
      pattern: '^(\\d{3,4}-)?\\d{7,8}$',
      description: '匹配带区号的电话号码'
    },
    {
      name: '国内电话号码',
      pattern: '\\d{3}-\\d{8}|\\d{4}-\\d{7}',
      description: '匹配国内固定电话号码'
    },
    {
      name: '身份证号',
      pattern: '(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}[\\dXx]$)',
      description: '匹配15位或18位身份证号码'
    },
    {
      name: '中国邮政编码',
      pattern: '[1-9]\\d{5}(?!\\d)',
      description: '匹配中国邮政编码'
    },
    {
      name: 'URL链接',
      pattern: 'https?://(?:[-\\w.])+(?:\\:[0-9]+)?(?:/(?:[\\w/_.])*(?:\\?(?:[\\w&=%.])*)?(?:#(?:[\\w.])*)?)?',
      description: '匹配HTTP/HTTPS链接'
    },
    {
      name: 'IPv4地址',
      pattern: '((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}',
      description: '匹配IPv4地址格式'
    },
    {
      name: 'IP地址',
      pattern: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      description: '匹配IPv4地址'
    },
  ];

  const commonPatternsMenuItems: MenuProps['items'] = commonPatterns.map((item, index) => ({
    key: index.toString(),
    label: (
      <div>
        <div><strong>{item.name}</strong></div>
        <div><Text code>{item.pattern}</Text></div>
        <div style={{ fontSize: '12px', color: '#666' }}>{item.description}</div>
      </div>
    ),
    onClick: () => setPattern(item.pattern),
  }));

  return (
    <Dropdown menu={{ items: commonPatternsMenuItems }} trigger={['click']}>
      <Button>常用表达式</Button>
    </Dropdown>
  );
};

const RegexTool: React.FC = () => {
  const [pattern, setPattern] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [replacedText, setReplacedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [flags, setFlags] = useState<string>('g'); // 默认全局匹配
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleMatch = () => {
    setError('');
    try {
      console.log('matching', pattern, flags, text)
      const regex = new RegExp(pattern, flags);
      const matches = [];
      let match;
      let index = 0;

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          key: index,
          index: match.index,
          match: match[0],
          groups: match.slice(1)
        });
        index++;

        // 防止无限循环
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
          // 如果仍然没有进展，跳出循环以防止真正的无限循环
          if (match.index === regex.lastIndex) {
            break;
          }
        }
      }

      setMatchResults(matches);
      setReplacedText(text.replace(new RegExp(pattern, flags), replaceText));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regular expression');
      setMatchResults([]);
      setReplacedText('');
    }
  };

  const handleReplace = () => {
    setError('');
    try {
      const regex = new RegExp(pattern, flags);
      const result = text.replace(regex, replaceText);
      setReplacedText(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regular expression');
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
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      render: (_, __, index) => index + 1,
    },
    {
      title: '位置',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '匹配内容',
      dataIndex: 'match',
      key: 'match',
    },
    {
      title: '捕获组',
      dataIndex: 'groups',
      key: 'groups',
      render: (groups: string[]) => (
        <Space wrap>
          {groups.map((group, i) => (
            <Tag key={i} color='blue'>{group || '(空)'}</Tag>
          ))}
        </Space>
      ),
    },
  ];

  // 修饰符菜单项
  const flagMenuItems: MenuProps['items'] = [
    {
      flag: 'g',
      name: '全局匹配 (g)'
    },
    {
      flag: 'i',
      name: '忽略大小写 (i)'
    },
    {
      flag: 'm',
      name: '多行匹配 (m)'
    },
    {
      flag: 's',
      name: '单行匹配 (s)'
    }
  ].map(({ flag, name }) => ({
    key: flag,
    label: (
      <Flex gap='small' align='center'>
        <input
          type='checkbox'
          checked={flags.includes(flag)}
          onChange={() => toggleFlag(flag)}
          style={{ margin: 0 }}
        />
        <span>{name}</span>
      </Flex>
    ),
    onClick: () => toggleFlag(flag),
  })) as MenuProps['items'];

  return (
    <>
      <Flex vertical gap='middle' style={{ flex: 1, minWidth: 300 }}>
        <Card
          size='small'
          title='正则表达式工具'
          extra={<Button type='link' onClick={() => setIsModalVisible(true)} style={{ padding: 0 }}>语法参考</Button>}
        >
          <Flex vertical gap='small'>
            <Flex gap='small' align='center'>
              <Text strong>正则表达式:</Text>
              <Input
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                addonBefore='/'
                addonAfter={flags}
                placeholder='输入正则表达式，如: \d+'
                style={{ flex: 1 }}
              />
              <Dropdown menu={{ items: flagMenuItems }} trigger={['click']}>
                <Button icon={<FlagFilled />}>修饰符<CaretDownFilled /></Button>
              </Dropdown>
              <CommonExpressionsDropdown setPattern={setPattern} />
            </Flex>

            <Flex gap='small' align='center'>
              <Text strong>替换为:</Text>
              <Input
                value={replaceText}
                onChange={e => setReplaceText(e.target.value)}
                placeholder='输入替换文本'
                style={{ flex: 1 }}
              />
            </Flex>

            <Flex gap='small'>
              <Button type='primary' onClick={handleMatch}>查找匹配</Button>
              <Button onClick={handleReplace}>文本替换</Button>
              <Button onClick={handleClear}>清空</Button>
            </Flex>

            {error && (
              <Text type='danger'>{error}</Text>
            )}
          </Flex>
        </Card>

        <Card size='small' title='待匹配文本'>
          <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '12px', minHeight: '120px', maxHeight: '300px', overflow: 'auto' }}>
            <HighlightedText text={text} pattern={pattern} flags={flags} />
          </div>
          <div style={{ marginTop: '8px' }}>
            <Input.TextArea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder='在此输入待匹配的文本'
              autoSize={{ minRows: 4, maxRows: 20 }}
              showCount
            />
          </div>
        </Card>

        <Tabs
          items={[
            {
              key: '1',
              label: '匹配结果',
              children: (
                <Card size='small'>
                  <Table
                    dataSource={matchResults}
                    columns={matchColumns}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: '暂无匹配结果' }}
                  />
                </Card>
              ),
            },
            {
              key: '2',
              label: '替换结果',
              children: (
                <Card size='small' title='替换后的文本'>
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
        title='正则表达式语法参考'
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        footer={[
          <Button key='close' onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <SyntaxReference />
      </Modal>
    </>
  );
};

export default RegexTool;