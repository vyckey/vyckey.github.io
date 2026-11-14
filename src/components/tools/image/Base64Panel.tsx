import React, { useEffect, useState } from 'react';
import { Alert, Empty, Flex, Segmented, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import CopyableTextArea from '../../CopyableTextArea';
import { translateError } from '../../../i18n/translateError';
import { formatBytes } from '../../../utils/format';
import { blobToDataUrl } from '../../../utils/image';

const { Text } = Typography;

type Mode = 'dataUrl' | 'raw';

interface Props {
  file: File | null;
}

export default function Base64Panel({ file }: Props) {
  const { t } = useTranslation();
  const [dataUrl, setDataUrl] = useState('');
  const [mode, setMode] = useState<Mode>('dataUrl');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) {
      setDataUrl('');
      return;
    }

    let cancelled = false;
    blobToDataUrl(file)
      .then(result => {
        if (!cancelled) {
          setDataUrl(result);
          setError('');
        }
      })
      .catch(readError => {
        if (!cancelled) {
          setError(translateError(t, readError));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file, t]);

  if (!file) {
    return <Empty description={t('image.noFile')} />;
  }

  const value = mode === 'dataUrl' ? dataUrl : (dataUrl.split(',')[1] ?? '');

  return (
    <Flex vertical gap={12}>
      <Flex wrap gap={12} align="center" justify="space-between">
        <Segmented
          value={mode}
          onChange={next => setMode(next as Mode)}
          options={[
            { label: t('image.base64.dataUrl'), value: 'dataUrl' },
            { label: t('image.base64.raw'), value: 'raw' },
          ]}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          {file.type || '—'} · {formatBytes(file.size)} ·{' '}
          {formatBytes(value.length)}
        </Text>
      </Flex>

      {error && <Alert type="error" showIcon message={error} />}

      <CopyableTextArea
        value={value}
        readOnly
        rows={12}
        style={{ fontFamily: 'monospace', fontSize: 12 }}
      />

      <Text type="secondary" style={{ fontSize: 12 }}>
        {t('image.base64.hint')}
      </Text>
    </Flex>
  );
}
