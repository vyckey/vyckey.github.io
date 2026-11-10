import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Segmented } from 'antd';
import { decodeBase64, encodeBase64 } from '../../../utils/encoding';
import TransformPanel from './TransformPanel';

type Direction = 'encode' | 'decode';

const Base64Panel: React.FC = () => {
  const { t } = useTranslation();
  const [direction, setDirection] = useState<Direction>('encode');
  const [urlSafe, setUrlSafe] = useState(false);

  return (
    <TransformPanel
      inputPlaceholder={
        direction === 'encode'
          ? t('encoder.base64.encodePlaceholder')
          : t('encoder.base64.decodePlaceholder')
      }
      outputPlaceholder={t('common.outputPlaceholder')}
      mono
      transform={text =>
        direction === 'encode'
          ? encodeBase64(text, urlSafe)
          : decodeBase64(text)
      }
      onSwap={() =>
        setDirection(current => (current === 'encode' ? 'decode' : 'encode'))
      }
      options={
        <>
          <Segmented
            value={direction}
            onChange={value => setDirection(value as Direction)}
            options={[
              { label: t('common.encode'), value: 'encode' },
              { label: t('common.decode'), value: 'decode' },
            ]}
          />
          {direction === 'encode' ? (
            <Checkbox
              checked={urlSafe}
              onChange={e => setUrlSafe(e.target.checked)}>
              {t('encoder.base64.urlSafe')}
            </Checkbox>
          ) : null}
        </>
      }
    />
  );
};

export default Base64Panel;
