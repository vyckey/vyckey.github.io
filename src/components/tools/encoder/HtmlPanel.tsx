import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Segmented } from 'antd';
import { escapeHtml, unescapeHtml } from '../../../utils/encoding';
import TransformPanel from './TransformPanel';

type Direction = 'encode' | 'decode';

const HtmlPanel: React.FC = () => {
  const { t } = useTranslation();
  const [direction, setDirection] = useState<Direction>('encode');

  return (
    <TransformPanel
      inputPlaceholder={
        direction === 'encode'
          ? t('encoder.html.encodePlaceholder')
          : t('encoder.html.decodePlaceholder')
      }
      outputPlaceholder={t('common.outputPlaceholder')}
      mono
      transform={text =>
        direction === 'encode' ? escapeHtml(text) : unescapeHtml(text)
      }
      onSwap={() =>
        setDirection(current => (current === 'encode' ? 'decode' : 'encode'))
      }
      options={
        <Segmented
          value={direction}
          onChange={value => setDirection(value as Direction)}
          options={[
            { label: t('encoder.html.escape'), value: 'encode' },
            { label: t('encoder.html.unescape'), value: 'decode' },
          ]}
        />
      }
    />
  );
};

export default HtmlPanel;
