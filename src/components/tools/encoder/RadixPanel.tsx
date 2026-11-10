import React, { useState } from 'react';
import { Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { convertRadixText, RADIXES } from '../../../utils/encoding';
import TransformPanel from './TransformPanel';

const { Text } = Typography;

const radixLabelKeys = {
  2: 'encoder.radix.binary',
  8: 'encoder.radix.octal',
  10: 'encoder.radix.decimal',
  16: 'encoder.radix.hex',
  36: 'encoder.radix.base36',
} as const;

const RadixPanel: React.FC = () => {
  const { t } = useTranslation();
  const [fromRadix, setFromRadix] = useState(10);

  return (
    <TransformPanel
      inputPlaceholder={t('encoder.radix.inputPlaceholder', {
        radix: fromRadix,
      })}
      outputPlaceholder={t('encoder.radix.outputPlaceholder')}
      rows={6}
      mono
      allowSwap={false}
      transform={text =>
        convertRadixText(text, fromRadix, (radix, value) =>
          t('encoder.radix.line', {
            label: t(radixLabelKeys[radix as keyof typeof radixLabelKeys]),
            value,
          })
        )
      }
      options={
        <>
          <Select
            value={fromRadix}
            onChange={setFromRadix}
            style={{ width: 150 }}
            options={RADIXES.map(radix => ({
              label: t(radixLabelKeys[radix]),
              value: radix,
            }))}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('encoder.radix.hint')}
          </Text>
        </>
      }
    />
  );
};

export default RadixPanel;
