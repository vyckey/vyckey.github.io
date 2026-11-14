import React, { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Flex,
  Input,
  Row,
  Segmented,
  Select,
  Space,
  Tabs,
  Typography,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CopyableTextArea from '../CopyableTextArea';
import { translateError } from '../../i18n/translateError';
import { downloadText } from '../../utils/download';
import { I18nError } from '../../utils/errors';
import {
  DATA_FORMATS,
  DataFormat,
  parseData,
  stringifyData,
} from '../../utils/dataConvert';
import {
  generateGo,
  generateJava,
  generateTypeScript,
} from '../../utils/codegen';

const { Text } = Typography;

const FORMAT_LABELS: Record<DataFormat, string> = {
  json: 'JSON',
  yaml: 'YAML',
  toml: 'TOML',
  csv: 'CSV',
  markdown: 'Markdown',
};

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Ada Lovelace",
  "active": true,
  "roles": ["admin", "developer"],
  "profile": {
    "email": "ada@example.com",
    "age": 36
  }
}`;

const SAMPLES: Record<DataFormat, string> = {
  json: SAMPLE_JSON,
  yaml: `id: 1
name: Ada Lovelace
active: true
roles:
  - admin
  - developer
profile:
  email: ada@example.com
  age: 36`,
  toml: `id = 1
name = "Ada Lovelace"
active = true
roles = ["admin", "developer"]

[profile]
email = "ada@example.com"
age = 36`,
  csv: `id,name,active,roles,profile
1,Ada Lovelace,true,"admin|developer","{""email"":""ada@example.com"",""age"":36}"`,
  markdown: `| id | name | active | roles | profile |
| --- | --- | --- | --- | --- |
| 1 | Ada Lovelace | true | admin, developer | {"email":"ada@example.com","age":36} |`,
};

function FormatPanel() {
  const { t } = useTranslation();
  const [inputFormat, setInputFormat] = useState<DataFormat>('json');
  const [outputFormat, setOutputFormat] = useState<DataFormat>('yaml');
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState(() => {
    try {
      return stringifyData(parseData(SAMPLE_JSON, 'json'), 'yaml');
    } catch {
      return '';
    }
  });
  const [error, setError] = useState('');

  function convert(nextInput = input) {
    try {
      const value = parseData(nextInput, inputFormat);
      setOutput(stringifyData(value, outputFormat));
      setError('');
    } catch (convertError) {
      setOutput('');
      setError(translateError(t, convertError));
    }
  }

  function swap() {
    const nextInputFormat = outputFormat;
    const nextOutputFormat = inputFormat;
    setInputFormat(nextInputFormat);
    setOutputFormat(nextOutputFormat);
    setInput(output);
    setOutput(input);
    setError('');
  }

  return (
    <Flex vertical gap={16}>
      <Flex wrap gap={12} align="center">
        <Space size={6}>
          <Text type="secondary">{t('converter.inputFormat')}</Text>
          <Select<DataFormat>
            value={inputFormat}
            onChange={setInputFormat}
            style={{ width: 130 }}
            options={DATA_FORMATS.map(format => ({
              value: format,
              label: FORMAT_LABELS[format],
            }))}
          />
        </Space>
        <Text>→</Text>
        <Space size={6}>
          <Text type="secondary">{t('converter.outputFormat')}</Text>
          <Select<DataFormat>
            value={outputFormat}
            onChange={setOutputFormat}
            style={{ width: 130 }}
            options={DATA_FORMATS.map(format => ({
              value: format,
              label: FORMAT_LABELS[format],
            }))}
          />
        </Space>
        <Button type="primary" onClick={() => convert()}>
          {t('converter.convert')}
        </Button>
        <Button onClick={swap}>{t('common.swap')}</Button>
        <Button
          onClick={() => {
            setInput(SAMPLES[inputFormat]);
            setOutput('');
            setError('');
          }}>
          {t('converter.sample')}
        </Button>
        <Button
          onClick={() => {
            setInput('');
            setOutput('');
            setError('');
          }}>
          {t('common.clear')}
        </Button>
      </Flex>

      {error && <Alert type="error" showIcon message={error} />}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Flex vertical gap={6}>
            <Text strong>{t('converter.input')}</Text>
            <CopyableTextArea
              value={input}
              onChange={event => setInput(event.target.value)}
              allowClear
              rows={16}
              placeholder={t('converter.inputPlaceholder')}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          </Flex>
        </Col>
        <Col xs={24} lg={12}>
          <Flex vertical gap={6}>
            <Flex justify="space-between" align="center">
              <Text strong>{t('converter.output')}</Text>
              <Button
                size="small"
                icon={<DownloadOutlined />}
                disabled={!output}
                onClick={() =>
                  downloadText(
                    output,
                    `converted.${outputFormat === 'markdown' ? 'md' : outputFormat}`,
                    'text/plain;charset=utf-8'
                  )
                }>
                {t('common.download')}
              </Button>
            </Flex>
            <CopyableTextArea
              value={output}
              readOnly
              rows={16}
              placeholder={t('converter.emptyOutput')}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          </Flex>
        </Col>
      </Row>

      {(outputFormat === 'csv' || outputFormat === 'markdown') && (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('converter.recordsHint')}
        </Text>
      )}
    </Flex>
  );
}

type CodeLanguage = 'typescript' | 'go' | 'java';

const CODE_EXTENSIONS: Record<CodeLanguage, string> = {
  typescript: 'ts',
  go: 'go',
  java: 'java',
};

function CodePanel() {
  const { t } = useTranslation();
  const [input, setInput] = useState(SAMPLE_JSON);
  const [language, setLanguage] = useState<CodeLanguage>('typescript');
  const [rootName, setRootName] = useState('Root');

  const result = useMemo(() => {
    if (!input.trim()) {
      return { code: '', error: '' };
    }

    try {
      const value = JSON.parse(input);
      const code =
        language === 'go'
          ? generateGo(value, rootName)
          : language === 'java'
            ? generateJava(value, rootName)
            : generateTypeScript(value, rootName);
      return { code, error: '' };
    } catch (error) {
      return {
        code: '',
        error:
          error instanceof SyntaxError
            ? translateError(
                t,
                new I18nError('converter.errors.invalidJSON', {
                  message: error.message,
                })
              )
            : translateError(t, error),
      };
    }
  }, [input, language, rootName, t]);

  return (
    <Flex vertical gap={16}>
      <Flex wrap gap={12} align="center">
        <Segmented
          value={language}
          onChange={value => setLanguage(value as CodeLanguage)}
          options={[
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Go', value: 'go' },
            { label: 'Java', value: 'java' },
          ]}
        />
        <Space size={6}>
          <Text type="secondary">{t('converter.rootName')}</Text>
          <Input
            value={rootName}
            onChange={event => setRootName(event.target.value)}
            style={{ width: 160 }}
          />
        </Space>
        <Button
          icon={<DownloadOutlined />}
          disabled={!result.code}
          onClick={() =>
            downloadText(
              result.code,
              `${rootName || 'Root'}.${CODE_EXTENSIONS[language]}`,
              'text/plain;charset=utf-8'
            )
          }>
          {t('common.download')}
        </Button>
      </Flex>

      {result.error && <Alert type="error" showIcon message={result.error} />}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Flex vertical gap={6}>
            <Text strong>{t('converter.jsonInput')}</Text>
            <CopyableTextArea
              value={input}
              onChange={event => setInput(event.target.value)}
              allowClear
              rows={18}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          </Flex>
        </Col>
        <Col xs={24} lg={12}>
          <Flex vertical gap={6}>
            <Text strong>{t('converter.generated')}</Text>
            <CopyableTextArea
              value={result.code}
              readOnly
              rows={18}
              placeholder={t('converter.emptyOutput')}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          </Flex>
        </Col>
      </Row>

      <Text type="secondary" style={{ fontSize: 12 }}>
        {t('converter.codeHint')}
      </Text>
    </Flex>
  );
}

export default function ConverterTool() {
  const { t } = useTranslation();

  return (
    <Tabs
      type="card"
      items={[
        {
          key: 'formats',
          label: t('converter.tabs.formats'),
          children: <FormatPanel />,
        },
        {
          key: 'code',
          label: t('converter.tabs.code'),
          children: <CodePanel />,
        },
      ]}
    />
  );
}
