import React, { useState } from 'react';
import {
  Alert,
  Button,
  Flex,
  Input,
  message,
  Segmented,
  Select,
  Space,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import CopyableTextArea from '../../CopyableTextArea';
import {
  aesDecryptRaw,
  aesDecryptWithPassphrase,
  aesEncryptRaw,
  aesEncryptWithPassphrase,
  generateAesIvHex,
  generateAesKeyHex,
} from '../../../utils/aes';
import { translateError } from '../../../i18n/translateError';

const { Text } = Typography;

type AesMode = 'passphrase' | 'raw';

export default function AesPanel() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AesMode>('passphrase');
  const [input, setInput] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [keyHex, setKeyHex] = useState(() => generateAesKeyHex(256));
  const [ivHex, setIvHex] = useState(() => generateAesIvHex());
  const [bits, setBits] = useState<128 | 192 | 256>(256);
  const [output, setOutput] = useState('');

  function run(action: 'encrypt' | 'decrypt') {
    if (!input.trim()) {
      message.warning(t('encryption.aes.inputRequired'));
      return;
    }

    try {
      const result =
        action === 'encrypt'
          ? mode === 'passphrase'
            ? aesEncryptWithPassphrase(input, passphrase)
            : aesEncryptRaw(input, keyHex, ivHex)
          : mode === 'passphrase'
            ? aesDecryptWithPassphrase(input, passphrase)
            : aesDecryptRaw(input, keyHex, ivHex);
      setOutput(result);
    } catch (error) {
      message.error(translateError(t, error));
    }
  }

  function generateKey() {
    setKeyHex(generateAesKeyHex(bits));
    setIvHex(generateAesIvHex());
  }

  return (
    <Flex vertical gap={16} style={{ maxWidth: 900 }}>
      <Segmented
        value={mode}
        onChange={value => setMode(value as AesMode)}
        options={[
          { label: t('encryption.aes.mode.passphrase'), value: 'passphrase' },
          { label: t('encryption.aes.mode.raw'), value: 'raw' },
        ]}
      />

      <CopyableTextArea
        value={input}
        onChange={event => setInput(event.target.value)}
        allowClear
        rows={6}
        placeholder={t('encryption.aes.inputPlaceholder')}
      />

      {mode === 'passphrase' ? (
        <Input.Password
          value={passphrase}
          onChange={event => setPassphrase(event.target.value)}
          addonBefore={t('encryption.aes.passphrase')}
          placeholder={t('encryption.aes.passphrasePlaceholder')}
          style={{ maxWidth: 520 }}
        />
      ) : (
        <Flex vertical gap={10}>
          <Space wrap>
            <Text type="secondary">{t('encryption.aes.keyBits')}</Text>
            <Select
              value={bits}
              onChange={value => {
                setBits(value);
                setKeyHex(generateAesKeyHex(value));
              }}
              style={{ width: 130 }}
              options={[128, 192, 256].map(value => ({
                value,
                label: `AES-${value}`,
              }))}
            />
            <Button onClick={generateKey}>
              {t('encryption.aes.generateKey')}
            </Button>
          </Space>
          <Input
            value={keyHex}
            onChange={event => setKeyHex(event.target.value)}
            addonBefore={t('encryption.aes.key')}
            placeholder="32 / 48 / 64 hex chars"
            style={{ fontFamily: 'monospace', maxWidth: 620 }}
          />
          <Input
            value={ivHex}
            onChange={event => setIvHex(event.target.value)}
            addonBefore={t('encryption.aes.iv')}
            placeholder="32 hex chars"
            style={{ fontFamily: 'monospace', maxWidth: 620 }}
          />
        </Flex>
      )}

      <Space wrap>
        <Button type="primary" onClick={() => run('encrypt')}>
          {t('encryption.aes.encrypt')}
        </Button>
        <Button onClick={() => run('decrypt')}>
          {t('encryption.aes.decrypt')}
        </Button>
        <Button
          onClick={() => {
            setInput(output);
            setOutput(input);
          }}>
          {t('common.swap')}
        </Button>
      </Space>

      <CopyableTextArea
        value={output}
        readOnly
        rows={6}
        placeholder={t('encryption.outputPlaceholder')}
      />

      <Alert
        type="info"
        showIcon
        message={
          mode === 'passphrase'
            ? t('encryption.aes.passphraseHint')
            : t('encryption.aes.rawHint')
        }
        style={{ fontSize: 12 }}
      />
    </Flex>
  );
}
