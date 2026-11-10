import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Segmented } from 'antd';
import TransformPanel from './TransformPanel';

type CaseMode = 'upper' | 'lower';

const CaseConvertPanel: React.FC = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<CaseMode>('upper');

  return (
    <TransformPanel
      inputPlaceholder={t('encoder.case.inputPlaceholder')}
      outputPlaceholder={t('encoder.case.outputPlaceholder')}
      transform={text =>
        mode === 'upper' ? text.toUpperCase() : text.toLowerCase()
      }
      options={
        <Segmented
          value={mode}
          onChange={value => setMode(value as CaseMode)}
          options={[
            { label: t('encoder.case.upper'), value: 'upper' },
            { label: t('encoder.case.lower'), value: 'lower' },
          ]}
        />
      }
    />
  );
};

export default CaseConvertPanel;
