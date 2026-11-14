import React, { useEffect, useState } from 'react';
import { Alert, Flex, message, Tabs, Typography, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translateError } from '../../i18n/translateError';
import { formatBytes } from '../../utils/format';
import CompressPanel from './image/CompressPanel';
import Base64Panel from './image/Base64Panel';
import FaviconPanel from './image/FaviconPanel';

const { Text } = Typography;

export default function ImageTool() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) {
      setImage(null);
      return;
    }

    let cancelled = false;
    const url = URL.createObjectURL(file);
    const next = new Image();
    setLoading(true);
    setError('');

    next.onload = () => {
      if (!cancelled) {
        setImage(next);
        setLoading(false);
      }
    };
    next.onerror = () => {
      if (!cancelled) {
        setImage(null);
        setLoading(false);
        setError(t('image.errors.loadFailed'));
      }
    };
    next.src = url;

    return () => {
      cancelled = true;
      next.onload = null;
      next.onerror = null;
      URL.revokeObjectURL(url);
    };
  }, [file, t]);

  return (
    <Flex vertical gap={16}>
      <Upload.Dragger
        accept="image/*"
        multiple={false}
        maxCount={1}
        showUploadList={false}
        beforeUpload={selected => {
          if (!selected.type.startsWith('image/')) {
            message.error(t('image.invalidType'));
            return Upload.LIST_IGNORE;
          }
          setFile(selected);
          setImage(null);
          return false;
        }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t('image.dropTitle')}</p>
        <p className="ant-upload-hint">{t('image.dropHint')}</p>
      </Upload.Dragger>

      {error && <Alert type="error" showIcon message={error} />}

      {file && (
        <Flex wrap gap={16} align="center">
          {image && (
            <img
              src={image.src}
              alt={file.name}
              style={{
                maxWidth: 180,
                maxHeight: 120,
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                objectFit: 'contain',
              }}
            />
          )}
          <Flex vertical gap={2}>
            <Text strong>{file.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {file.type || '—'} · {formatBytes(file.size)}
              {image ? ` · ${image.naturalWidth} × ${image.naturalHeight}` : ''}
            </Text>
            {loading && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('image.loading')}
              </Text>
            )}
          </Flex>
        </Flex>
      )}

      <Tabs
        type="card"
        items={[
          {
            key: 'compress',
            label: t('image.tabs.compress'),
            children: <CompressPanel file={file} image={image} />,
          },
          {
            key: 'base64',
            label: t('image.tabs.base64'),
            children: <Base64Panel file={file} />,
          },
          {
            key: 'favicon',
            label: t('image.tabs.favicon'),
            children: <FaviconPanel image={image} />,
          },
        ]}
      />
    </Flex>
  );
}
