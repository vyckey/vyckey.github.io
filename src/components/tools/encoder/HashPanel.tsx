import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Select } from 'antd';
import { HASH_ALGORITHMS, hashText, HashAlgorithm } from '../../../utils/hash';
import TransformPanel from './TransformPanel';

const HashPanel: React.FC = () => {
  const { t } = useTranslation();
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('MD5');
  const [uppercase, setUppercase] = useState(false);

  return (
    <TransformPanel
      inputPlaceholder={t('encoder.hash.inputPlaceholder')}
      outputPlaceholder={t('encoder.hash.outputPlaceholder')}
      rows={6}
      mono
      allowSwap={false}
      transform={text => hashText(text, algorithm, uppercase)}
      options={
        <>
          <Select
            value={algorithm}
            onChange={value => setAlgorithm(value as HashAlgorithm)}
            style={{ width: 140 }}
            options={HASH_ALGORITHMS}
          />
          <Checkbox
            checked={uppercase}
            onChange={e => setUppercase(e.target.checked)}>
            {t('common.uppercase')}
          </Checkbox>
        </>
      }
    />
  );
};

export default HashPanel;
