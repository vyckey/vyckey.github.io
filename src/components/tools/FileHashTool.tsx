import React, { useState } from 'react';
import {
  Alert,
  Flex,
  Input,
  message,
  Progress,
  Space,
  Tag,
  Typography,
  Upload,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CopyButton from '../CopyButton';
import {
  FILE_HASH_ALGORITHMS,
  FileHashAlgorithm,
  hashFile,
} from '../../utils/fileHash';
import { translateError } from '../../i18n/translateError';

const { Text, Title } = Typography;

const ALGORITHM_LABELS: Record<FileHashAlgorithm, string> = {
  MD5: 'MD5',
  SHA1: 'SHA-1',
  SHA256: 'SHA-256',
  SHA512: 'SHA-512',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

export default function FileHashTool() {
  const { t } = useTranslation();
  const [hashes, setHashes] = useState<
    Partial<Record<FileHashAlgorithm, string>>
  >({});
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [expected, setExpected] = useState('');

  async function handleFile(selected: File) {
    setFile(selected);
    setHashes({});
    setProgress(0);
    setBusy(true);

    try {
      const result = await hashFile(
        selected,
        FILE_HASH_ALGORITHMS,
        setProgress
      );
      setHashes(result);
    } catch (error) {
      message.error(translateError(t, error));
    } finally {
      setBusy(false);
    }
  }

  const normalizedExpected = expected.trim().toLowerCase();
  const hashesMatch = normalizedExpected
    ? Object.values(hashes).some(
        value => value?.toLowerCase() === normalizedExpected
      )
    : null;

  return (
    <Flex vertical gap={16}>
      <Upload.Dragger
        accept="*"
        multiple={false}
        maxCount={1}
        showUploadList={false}
        disabled={busy}
        beforeUpload={selected => {
          void handleFile(selected);
          return false;
        }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t('fileHash.dropTitle')}</p>
        <p className="ant-upload-hint">{t('fileHash.dropHint')}</p>
      </Upload.Dragger>

      {file && (
        <Flex justify="space-between" align="center" wrap gap={8}>
          <Space direction="vertical" size={0}>
            <Text strong>{file.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatSize(file.size)}
            </Text>
          </Space>
          {busy && (
            <Progress
              percent={progress}
              status="active"
              style={{ width: 240 }}
            />
          )}
        </Flex>
      )}

      <Space direction="vertical" style={{ width: '100%' }} size={10}>
        {FILE_HASH_ALGORITHMS.map(algorithm => (
          <Input
            key={algorithm}
            addonBefore={
              <span style={{ display: 'inline-block', width: 64 }}>
                {ALGORITHM_LABELS[algorithm]}
              </span>
            }
            value={hashes[algorithm] ?? ''}
            readOnly
            placeholder="—"
            style={{ fontFamily: 'monospace' }}
            suffix={<CopyButton value={hashes[algorithm] ?? ''} />}
          />
        ))}
      </Space>

      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          {t('fileHash.verifyTitle')}
        </Title>
        <Input
          value={expected}
          allowClear
          onChange={event => setExpected(event.target.value)}
          placeholder={t('fileHash.verifyPlaceholder')}
          style={{ fontFamily: 'monospace' }}
        />
        {hashesMatch !== null && (
          <div style={{ marginTop: 8 }}>
            <Tag color={hashesMatch ? 'success' : 'error'}>
              {hashesMatch ? t('fileHash.match') : t('fileHash.mismatch')}
            </Tag>
          </div>
        )}
      </div>

      <Alert
        type="info"
        showIcon
        message={t('fileHash.privacy')}
        style={{ fontSize: 12 }}
      />
    </Flex>
  );
}
