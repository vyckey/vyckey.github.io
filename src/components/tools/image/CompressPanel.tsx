import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Divider,
  Empty,
  Flex,
  InputNumber,
  Select,
  Slider,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translateError } from '../../../i18n/translateError';
import { downloadBlob } from '../../../utils/download';
import { formatBytes } from '../../../utils/format';
import {
  IMAGE_FORMATS,
  ImageFormat,
  imageExtension,
  renderImage,
  scaleSize,
} from '../../../utils/image';

const { Text } = Typography;

interface Props {
  file: File | null;
  image: HTMLImageElement | null;
}

interface Output {
  blob: Blob;
  url: string;
}

const PRESETS = [1, 0.75, 0.5, 0.25];

export default function CompressPanel({ file, image }: Props) {
  const { t } = useTranslation();
  const [format, setFormat] = useState<ImageFormat>('image/jpeg');
  const [quality, setQuality] = useState(85);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [output, setOutput] = useState<Output | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const outputUrlRef = useRef<string | null>(null);

  const ratio = image ? image.naturalWidth / image.naturalHeight : 1;

  useEffect(() => {
    if (!image) {
      return;
    }

    setWidth(image.naturalWidth);
    setHeight(image.naturalHeight);
    setFormat(
      file?.type === 'image/png'
        ? 'image/png'
        : file?.type === 'image/webp'
          ? 'image/webp'
          : 'image/jpeg'
    );
    setOutput(null);
    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = null;
    }
  }, [file?.type, image]);

  useEffect(() => {
    return () => {
      if (outputUrlRef.current) {
        URL.revokeObjectURL(outputUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!image || width < 1 || height < 1) {
      return;
    }

    let cancelled = false;
    setProcessing(true);

    const timer = setTimeout(() => {
      renderImage(image, {
        width,
        height,
        format,
        quality: quality / 100,
        background: format === 'image/jpeg' ? '#ffffff' : null,
      })
        .then(blob => {
          if (cancelled) {
            return;
          }

          const url = URL.createObjectURL(blob);
          if (outputUrlRef.current) {
            URL.revokeObjectURL(outputUrlRef.current);
          }
          outputUrlRef.current = url;
          setOutput({ blob, url });
          setError('');
        })
        .catch(processError => {
          if (!cancelled) {
            setError(translateError(t, processError));
          }
        })
        .finally(() => {
          if (!cancelled) {
            setProcessing(false);
          }
        });
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [format, height, image, quality, t, width]);

  if (!image || !file) {
    return <Empty description={t('image.noFile')} />;
  }

  function updateWidth(value: number | null) {
    const next = Math.max(1, Math.round(Number(value) || 1));
    setWidth(next);
    if (keepRatio) {
      setHeight(Math.max(1, Math.round(next / ratio)));
    }
  }

  function updateHeight(value: number | null) {
    const next = Math.max(1, Math.round(Number(value) || 1));
    setHeight(next);
    if (keepRatio) {
      setWidth(Math.max(1, Math.round(next * ratio)));
    }
  }

  function applyPreset(scale: number) {
    const size = scaleSize(
      { width: image!.naturalWidth, height: image!.naturalHeight },
      scale
    );
    setWidth(size.width);
    setHeight(size.height);
  }

  const savedPercent =
    output && file.size > 0
      ? Math.round((1 - output.blob.size / file.size) * 100)
      : 0;

  return (
    <Flex vertical gap={16}>
      <Flex wrap gap={20} align="flex-end">
        <Flex vertical gap={4}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('image.format')}
          </Text>
          <Select<ImageFormat>
            value={format}
            onChange={setFormat}
            style={{ width: 130 }}
            options={IMAGE_FORMATS.map(value => ({
              value,
              label: imageExtension(value).toUpperCase(),
            }))}
          />
        </Flex>

        <Flex vertical gap={4} style={{ width: 220 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('image.quality')}
          </Text>
          <Slider
            min={1}
            max={100}
            value={quality}
            disabled={format === 'image/png'}
            onChange={setQuality}
          />
        </Flex>

        <Flex vertical gap={4}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('image.width')}
          </Text>
          <InputNumber
            min={1}
            max={20000}
            value={width}
            onChange={updateWidth}
            style={{ width: 110 }}
          />
        </Flex>

        <Flex vertical gap={4}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('image.height')}
          </Text>
          <InputNumber
            min={1}
            max={20000}
            value={height}
            onChange={updateHeight}
            style={{ width: 110 }}
          />
        </Flex>

        <Space size={6} style={{ paddingBottom: 4 }}>
          <Switch size="small" checked={keepRatio} onChange={setKeepRatio} />
          <Text>{t('image.keepRatio')}</Text>
        </Space>
      </Flex>

      <Flex wrap gap={8} align="center">
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('image.presets')}
        </Text>
        {PRESETS.map(scale => (
          <Button key={scale} size="small" onClick={() => applyPreset(scale)}>
            {Math.round(scale * 100)}%
          </Button>
        ))}
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('image.backgroundHint')}
        </Text>
      </Flex>

      {error && <Alert type="error" showIcon message={error} />}

      <Divider style={{ margin: '4px 0' }} />

      <Flex wrap gap={20} align="flex-start">
        <Flex vertical gap={8} style={{ flex: '1 1 320px', minWidth: 280 }}>
          <Text strong>{t('image.output')}</Text>
          <div
            style={{
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              borderRadius: 10,
              border: '1px solid #f0f0f0',
              background:
                'repeating-conic-gradient(#f5f5f5 0% 25%, #ffffff 0% 50%) 50% / 20px 20px',
            }}>
            {output ? (
              <img
                src={output.url}
                alt={t('image.output')}
                style={{
                  maxWidth: '100%',
                  maxHeight: 320,
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Text type="secondary">
                {processing ? t('image.processing') : '—'}
              </Text>
            )}
          </div>
        </Flex>

        <Flex vertical gap={10} style={{ flex: '0 1 260px' }}>
          <Text>
            {t('image.dimensions')}: {width} × {height}
          </Text>
          <Text>
            {t('image.resultSize')}:{' '}
            {output ? formatBytes(output.blob.size) : '—'}
          </Text>
          {output && (
            <Tag color={savedPercent >= 0 ? 'success' : 'warning'}>
              {savedPercent > 0
                ? t('image.saved', { percent: savedPercent })
                : savedPercent < 0
                  ? t('image.increased', { percent: Math.abs(savedPercent) })
                  : t('image.sameSize')}
            </Tag>
          )}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            disabled={!output}
            onClick={() => {
              if (!output) {
                return;
              }
              const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
              downloadBlob(
                output.blob,
                `${baseName}-${width}x${height}.${imageExtension(format)}`
              );
            }}>
            {t('image.download')}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
