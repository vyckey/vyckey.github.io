import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Segmented } from 'antd';
import { decodeUrl, encodeUrl } from '../../../utils/encoding';
import TransformPanel from './TransformPanel';

type Direction = 'encode' | 'decode';

const UrlPanel: React.FC = () => {
  const { t } = useTranslation();
  const [direction, setDirection] = useState<Direction>('encode');
  const [formMode, setFormMode] = useState(false);

  return (
    <TransformPanel
      inputPlaceholder={
        direction === 'encode'
          ? t('encoder.url.encodePlaceholder')
          : t('encoder.url.decodePlaceholder')
      }
      outputPlaceholder={t('common.outputPlaceholder')}
      mono
      transform={text =>
        direction === 'encode'
          ? encodeUrl(text, formMode)
          : decodeUrl(text, formMode)
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
          <Checkbox
            checked={formMode}
            onChange={e => setFormMode(e.target.checked)}>
            {t('encoder.url.formMode')}
          </Checkbox>
        </>
      }
    />
  );
};

export default UrlPanel;
