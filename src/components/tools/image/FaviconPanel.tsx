import React, { useEffect, useState } from 'react';
import { Alert, Button, Empty, Flex, Space, Spin, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translateError } from '../../../i18n/translateError';
import { downloadBlob } from '../../../utils/download';
import { createIcoBlob, renderFavicon } from '../../../utils/image';

const { Text } = Typography;

const FAVICON_SIZES = [16, 32, 48, 64, 128, 180, 192, 256, 512];
const ICO_SIZES = [16, 32, 48, 256];

interface GeneratedIcon {
  blob: Blob;
  url: string;
}

interface Props {
  image: HTMLImageElement | null;
}

export default function FaviconPanel({ image }: Props) {
  const { t } = useTranslation();
  const [icons, setIcons] = useState<Partial<Record<number, GeneratedIcon>>>(
    {}
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!image) {
      setIcons({});
      return;
    }

    let cancelled = false;
    const urls: string[] = [];
    setIcons({});
    setBusy(true);
    setError('');

    void (async () => {
      try {
        const next: Partial<Record<number, GeneratedIcon>> = {};

        for (const size of FAVICON_SIZES) {
          const blob = await renderFavicon(image, size);
          if (cancelled) {
            return;
          }
          const url = URL.createObjectURL(blob);
          urls.push(url);
          next[size] = { blob, url };
        }

        if (!cancelled) {
          setIcons(next);
        }
      } catch (renderError) {
        if (!cancelled) {
          setError(translateError(t, renderError));
        }
      } finally {
        if (!cancelled) {
          setBusy(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [image, t]);

  if (!image) {
    return <Empty description={t('image.noFile')} />;
  }

  const icoReady = ICO_SIZES.every(size => icons[size]);

  async function downloadIco() {
    const sources = await Promise.all(
      ICO_SIZES.map(async size => ({
        size,
        data: await icons[size]!.blob.arrayBuffer(),
      }))
    );
    downloadBlob(createIcoBlob(sources), 'favicon.ico');
  }

  return (
    <Flex vertical gap={16}>
      <Text type="secondary">{t('image.favicon.hint')}</Text>

      {error && <Alert type="error" showIcon message={error} />}

      {busy ? (
        <Flex justify="center" style={{ padding: 32 }}>
          <Spin tip={t('image.favicon.generating')} />
        </Flex>
      ) : (
        <Flex wrap gap={16}>
          {FAVICON_SIZES.map(size => {
            const icon = icons[size];
            return (
              <Flex
                key={size}
                vertical
                align="center"
                gap={8}
                style={{
                  width: 132,
                  padding: 12,
                  border: '1px solid #f0f0f0',
                  borderRadius: 10,
                }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      'repeating-conic-gradient(#f5f5f5 0% 25%, #ffffff 0% 50%) 50% / 12px 12px',
                    borderRadius: 6,
                  }}>
                  {icon && (
                    <img
                      src={icon.url}
                      alt={`${size}x${size}`}
                      style={{
                        maxWidth: 64,
                        maxHeight: 64,
                        imageRendering: size <= 32 ? 'pixelated' : 'auto',
                      }}
                    />
                  )}
                </div>
                <Text style={{ fontSize: 12 }}>
                  {t('image.favicon.sizeLabel', { size })}
                </Text>
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  disabled={!icon}
                  onClick={() => {
                    if (icon) {
                      downloadBlob(icon.blob, `favicon-${size}x${size}.png`);
                    }
                  }}>
                  {t('image.favicon.download')}
                </Button>
              </Flex>
            );
          })}
        </Flex>
      )}

      <Space>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          disabled={!icoReady || busy}
          onClick={() => void downloadIco()}>
          {t('image.favicon.downloadIco')}
        </Button>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('image.favicon.icoHint')}
        </Text>
      </Space>
    </Flex>
  );
}
