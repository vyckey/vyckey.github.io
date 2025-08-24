import React, { useState, useRef, useEffect } from 'react';
import { Button, Flex, Input, message, Select, Switch, Tabs, InputRef } from 'antd';
import { Splitter } from 'antd';
import ReactJson, { InteractionProps, OnSelectProps, ThemeKeys } from 'react-json-view';
import {
  DownloadOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';

interface JsonViewerProps {
  initialData?: object;
}

const jsonThemes = [
  'apathy',
  'apathy:inverted',
  'ashes',
  'bespin',
  'brewer',
  'bright:inverted',
  'bright',
  'chalk',
  'codeschool',
  'colors',
  'eighties',
  'embers',
  'flat',
  'google',
  'grayscale',
  'grayscale:inverted',
  'greenscreen',
  'harmonic',
  'hopscotch',
  'isotope',
  'marrakesh',
  'mocha',
  'monokai',
  'ocean',
  'paraiso',
  'pop',
  'railscasts',
  'rjv-default',
  'shapeshifter',
  'shapeshifter:inverted',
  'solarized',
  'summerfruit',
  'summerfruit:inverted',
  'threezerotwofour',
  'tomorrow',
  'tube',
  'twilight',
];

const JsonViewer: React.FC<JsonViewerProps> = ({ initialData }) => {
  const [textValue, setTextValue] = useState('');
  const [jsonValue, setJsonValue] = useState<object>(initialData || {});
  const [cachedJsonValue, setCachedJsonValue] = useState<object | undefined>(undefined);
  const [indentWidth, setIndentWidth] = useState<number>(2);
  const [isSortKeys, setIsSortKeys] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeKeys>('rjv-default');
  const [collapsed, setCollapsed] = useState<boolean | number>(false);
  const [enableEditing, setEnableEditing] = useState<boolean>(true);
  const jsonViewRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<InputRef>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Initialize with sample data if no initialData provided
  useEffect(() => {
    if (!initialData) {
      const sampleData = {
        name: 'Vyckey',
        email: 'vyckey@qq.com',
        avatar: 'https://vyckey.github.io/avatar.jpg',
        website: 'https://vyckey.github.io',
        address: {
          city: 'Shanghai',
          country: 'China'
        },
        hobbies: ['reading', 'coding'],
        isActive: true
      };
      setJsonValue(sampleData);
      setTextValue(JSON.stringify(sampleData, null, indentWidth));
    } else {
      setTextValue(JSON.stringify(initialData, null, indentWidth));
    }
  }, [initialData, indentWidth]);

  // Synchronize scrolling between textarea and line numbers
  useEffect(() => {
    const textAreaElement = textAreaRef.current?.input;
    const lineNumbersElement = lineNumbersRef.current;

    if (textAreaElement && lineNumbersElement) {
      // Get computed styles to match line heights
      const computedStyle = window.getComputedStyle(textAreaElement);
      const lineHeight = computedStyle.lineHeight;
      const fontSize = computedStyle.fontSize;
      const fontFamily = computedStyle.fontFamily;
      const paddingTop = computedStyle.paddingTop;

      // Apply the same styles to line numbers
      if (lineNumbersElement) {
        lineNumbersElement.style.lineHeight = lineHeight;
        lineNumbersElement.style.fontSize = fontSize;
        lineNumbersElement.style.fontFamily = fontFamily;
        lineNumbersElement.style.paddingTop = paddingTop;
      }

      const handleScroll = () => {
        lineNumbersElement.scrollTop = textAreaElement.scrollTop;
      };

      textAreaElement.addEventListener('scroll', handleScroll);

      return () => {
        textAreaElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [textValue]);

  function parseJson(text: string) {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.log('parse json fail', e);
      message.error('JSON解析失败: ' + e);
      return null;
    }
  }

  const handleFormat = (indent: number) => {
    const jsonObj = parseJson(textValue);
    if (jsonObj) {
      setTextValue(JSON.stringify(jsonObj, null, indent));
    }
  };

  const handleCompress = () => {
    const jsonObj = parseJson(textValue);
    if (jsonObj) {
      setTextValue(JSON.stringify(jsonObj));
    }
  };

  const handleValidate = () => {
    if (parseJson(textValue)) {
      message.success('JSON格式正确！');
    }
  };

  const handleParse = () => {
    const jsonObj = parseJson(textValue);
    if (jsonObj) {
      setJsonValue(jsonObj);
    }
  };

  const handleStringify = () => {
    setTextValue(JSON.stringify(jsonValue, null, indentWidth));
  };

  const handleEdit = (edit: InteractionProps) => {
    if (enableEditing) {
      setJsonValue(edit.updated_src);
      return true;
    }
    return false;
  };

  const handleAdd = (add: InteractionProps) => {
    if (enableEditing) {
      setJsonValue(add.updated_src);
      return true;
    }
    return false;
  };

  const handleDelete = (del: InteractionProps) => {
    if (enableEditing) {
      setJsonValue(del.updated_src);
      return true;
    }
    return false;
  };

  function sortKeys(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map(item => sortKeys(item));
    } else if (obj !== null && typeof obj === 'object') {
      const o = obj as Record<string, unknown>;
      const sortedObj: Record<string, unknown> = {};
      Object.keys(o).sort().forEach(key => {
        sortedObj[key] = sortKeys(o[key]);
      });
      return sortedObj;
    }
    return obj;
  }

  const handleSortKeys = (isSortKeys: boolean) => {
    setIsSortKeys(isSortKeys);
    if (isSortKeys) {
      setJsonValue((preObj: object) => {
        setCachedJsonValue(preObj);

        const sortedObj = sortKeys(preObj);
        setTextValue(JSON.stringify(sortedObj, null, indentWidth));
        return sortedObj as object;
      });
    } else if (cachedJsonValue) {
      console.log('Restoring cached JSON value');
      setJsonValue(cachedJsonValue);
      setTextValue(JSON.stringify(cachedJsonValue, null, indentWidth));
      setCachedJsonValue(undefined);
    }
  };

  const handleSelect = (select: OnSelectProps) => {
    console.log('Selected:', select);
    // Handle selection if needed
  };

  const handleExport = () => {
    try {
      const obj = JSON.parse(textValue);
      const blob = new Blob([JSON.stringify(obj, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      message.error(`JSON 格式错误: ${errorMessage}`);
    }
  };

  return (
    <>
      <Flex gap='small' wrap align='center'>
        <Select
          showSearch={true}
          defaultValue={theme}
          options={jsonThemes.map(theme => ({
            label: '主题 ' + theme,
            value: theme,
          }))}
          style={{ width: 160, textAlign: 'left' }}
          onChange={value => setTheme(value as ThemeKeys)}
        />
        <Button onClick={handleValidate}>校验</Button>
        <Select
          defaultValue={4}
          options={[2, 4, 8].map(width => ({
            label: width + '空格美化',
            value: width,
          }))}
          onChange={(val: number) => handleFormat(val)}
        />
        <Button onClick={handleCompress}>压缩</Button>
        <Button type='primary' onClick={handleParse}>解析</Button>
        <Button onClick={handleStringify}>反解析</Button>
        <Select
          defaultValue={indentWidth}
          options={[2, 4, 8].map(width => ({
            label: width + '个空格缩进',
            value: width,
          }))}
          onChange={(val: number) => setIndentWidth(val)}
        />
        <Select
          defaultValue={collapsed}
          value={collapsed}
          options={
            [
              { label: '展开全部', value: false },
              { label: '折叠全部', value: true },
              ...Array.from({ length: 5 }, (_, i) => ({
                label: `折叠到 ${i + 1} 层`,
                value: i + 1,
              })),
            ] as { label: string; value: boolean | number }[]
          }
          onChange={(val: boolean | number) => setCollapsed(val)}
          style={{ width: 120 }}
        />
        <Button
          icon={<SortAscendingOutlined />}
          onClick={() => handleSortKeys(!isSortKeys)}>
          {isSortKeys ? '取消' : ''}排序
        </Button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>编辑</span>
          <Switch
            checked={enableEditing}
            onChange={setEnableEditing}
          />
        </div>
        <Button icon={<DownloadOutlined />} onClick={handleExport} >导出文件</Button>
      </Flex>
      <Splitter
        style={{ minHeight: 600, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginTop: 16 }}>
        <Splitter.Panel defaultSize='40%' min='20%' max='70%'>
          <div style={{ display: 'flex', height: '100%' }}>
            {/* Line numbers */}
            <div
              ref={lineNumbersRef}
              style={{
                width: '40px',
                backgroundColor: '#f5f5f5',
                borderRight: '1px solid #d9d9d9',
                textAlign: 'right',
                color: '#999',
                overflow: 'hidden',
                userSelect: 'none'
              }}
            >
              {textValue ? textValue.split('\n').map((_, index) => (
                <div key={index} style={{ padding: '0 4px' }}>
                  {index + 1}
                </div>
              )) : <div style={{ padding: '0 4px' }}>1</div>}
            </div>
            {/* Text area */}
            <Input.TextArea
              ref={textAreaRef}
              value={textValue}
              placeholder='请输入JSON文本'
              style={{
                whiteSpace: 'nowrap',
                overflowX: 'auto',
                height: '100%',
                resize: 'none',
                borderLeft: 'none',
                borderRadius: '0 6px 6px 0'
              }}
              onChange={e => {
                setTextValue(e.target.value);
              }}
            />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div ref={jsonViewRef} style={{ height: '100%', overflow: 'auto' }}>
            <ReactJson
              src={jsonValue}
              theme={theme}
              indentWidth={indentWidth}
              sortKeys={isSortKeys}
              collapsed={collapsed}
              iconStyle='square'
              displayDataTypes={false}
              style={{ textAlign: 'left', height: '100%' }}
              onEdit={handleEdit}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onSelect={handleSelect}
              name={false}
            />
          </div>
        </Splitter.Panel>
      </Splitter>
    </>
  );
};

export default function JsonTools() {
  return (
    <>
      <Tabs
        type='card'
        items={[
          {
            key: 'json_view',
            label: 'JSON解析',
            children: <JsonViewer />,
          },
        ]}
      />
    </>
  );
}
