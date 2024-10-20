import React, { useState } from 'react';
import { Button, Flex, Input, message, Select, Tabs } from 'antd';
import { Splitter } from 'antd';
import ReactJson from 'react-json-view';

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
  'shapershift',
  'shapershift:inverted',
  'solarized',
  'sumerfruit',
  'sumerfruit:inverted',
  'threezerotwofour',
  'tomorrow',
  'tube',
  'twilight',
];

const JsonView = () => {
  const [textValue, setTextValue] = useState('');
  const [jsonValue, setJsonValue] = useState({});
  const [indentWidth, setIndentWith] = useState(4);
  const [sortKeys, setSortKeys] = useState(false);
  const [theme, setTheme] = useState('bright:inverted');

  function parseJson(text: string) {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.log('parse json fail', e);
      message.error('JSON解析失败:' + e);
      return null;
    }
  }

  return (
    <>
      <Flex gap="small">
        <Select
          defaultValue="codeschool"
          options={jsonThemes.map(theme => ({
            label: '主题 ' + theme,
            value: theme,
          }))}
          style={{ width: 160, textAlign: 'left' }}
          onChange={value => setTheme(value)}
        />
        <Select
          defaultValue={indentWidth}
          options={[2, 4, 8].map(width => ({
            label: width + '个空格缩进',
            value: width,
          }))}
          onChange={(val: number) => setIndentWith(val)}
        />
        <Button
          onClick={() => {
            if (parseJson(textValue)) {
              message.success('JSON格式正确！');
            }
          }}>
          校验
        </Button>
        <Button
          onClick={() => {
            const jsonObj = parseJson(textValue);
            if (jsonObj) {
              setTextValue(JSON.stringify(jsonObj, null, indentWidth));
            }
          }}>
          美化
        </Button>
        <Button
          onClick={() => {
            const jsonObj = parseJson(textValue);
            if (jsonObj) {
              setTextValue(JSON.stringify(jsonObj));
            }
          }}>
          压缩
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setJsonValue(parseJson(textValue));
          }}>
          解析
        </Button>
        <Button
          onClick={() => {
            setTextValue(JSON.stringify(jsonValue, null, indentWidth));
          }}>
          反解析
        </Button>
        <Button onClick={() => setSortKeys(!sortKeys)}>
          {sortKeys ? '取消' : ''}排序
        </Button>
      </Flex>
      <p></p>
      <Splitter
        style={{ minHeight: 600, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Splitter.Panel defaultSize="40%" min="20%" max="70%">
          <Input.TextArea
            value={textValue}
            // allowClear={true}
            style={{ height: '100%', resize: 'none' }}
            onChange={e => {
              setTextValue(e.target.value);
            }}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          <ReactJson
            src={jsonValue}
            theme={theme}
            indentWidth={indentWidth}
            sortKeys={sortKeys}
            iconStyle="square"
            displayDataTypes={false}
            style={{ textAlign: 'left', height: '100%' }}
          />
        </Splitter.Panel>
      </Splitter>
    </>
  );
};

export default function JsonTools() {
  return (
    <>
      <Tabs
        type="card"
        items={[
          {
            key: 'json_view',
            label: 'JSON解析',
            children: <JsonView />,
          },
        ]}
      />
    </>
  );
}
