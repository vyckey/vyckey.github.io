import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Segmented, Select } from 'antd';
import {
  hexToText,
  textToHex,
  textToUnicodeEscape,
  unicodeEscapeToText,
} from '../../../utils/encoding';
import TransformPanel from './TransformPanel';

type HexFormat = 'hex' | 'unicode';
type Direction = 'encode' | 'decode';

const HexPanel: React.FC = () => {
  const { t } = useTranslation();
  const [format, setFormat] = useState<HexFormat>('hex');
  const [direction, setDirection] = useState<Direction>('encode');
  const [separator, setSeparator] = useState(' ');
  const [uppercase, setUppercase] = useState(true);

  const transform = (text: string) => {
    if (format === 'unicode') {
      return direction === 'encode'
        ? textToUnicodeEscape(text)
        : unicodeEscapeToText(text);
    }

    return direction === 'encode'
      ? textToHex(text, { separator, uppercase })
      : hexToText(text);
  };

  const inputPlaceholder =
    format === 'unicode'
      ? direction === 'encode'
        ? t('encoder.hex.unicodeEncodePlaceholder')
        : t('encoder.hex.unicodeDecodePlaceholder')
      : direction === 'encode'
        ? t('encoder.hex.hexEncodePlaceholder')
        : t('encoder.hex.hexDecodePlaceholder');

  return (
    <TransformPanel
      inputPlaceholder={inputPlaceholder}
      outputPlaceholder={t('common.outputPlaceholder')}
      mono
      transform={transform}
      onSwap={() =>
        setDirection(current => (current === 'encode' ? 'decode' : 'encode'))
      }
      options={
        <>
          <Segmented
            value={format}
            onChange={value => setFormat(value as HexFormat)}
            options={[
              { label: t('encoder.hex.formatHex'), value: 'hex' },
              { label: t('encoder.hex.formatUnicode'), value: 'unicode' },
            ]}
          />
          <Segmented
            value={direction}
            onChange={value => setDirection(value as Direction)}
            options={[
              { label: t('common.encode'), value: 'encode' },
              { label: t('common.decode'), value: 'decode' },
            ]}
          />
          {format === 'hex' && direction === 'encode' ? (
            <>
              <Select
                value={separator}
                onChange={setSeparator}
                style={{ width: 110 }}
                options={[
                  { label: t('encoder.hex.separatorSpace'), value: ' ' },
                  { label: t('encoder.hex.separatorNone'), value: '' },
                  { label: t('encoder.hex.separatorComma'), value: ',' },
                ]}
              />
              <Checkbox
                checked={uppercase}
                onChange={e => setUppercase(e.target.checked)}>
                {t('common.uppercase')}
              </Checkbox>
            </>
          ) : null}
        </>
      }
    />
  );
};

export default HexPanel;
