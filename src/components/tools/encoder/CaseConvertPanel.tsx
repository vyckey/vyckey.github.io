import React, { useState } from 'react';
import { Segmented } from 'antd';
import TransformPanel from './TransformPanel';

type CaseMode = 'upper' | 'lower';

const CaseConvertPanel: React.FC = () => {
  const [mode, setMode] = useState<CaseMode>('upper');

  return (
    <TransformPanel
      inputPlaceholder="请输入需要转换大小写的文本"
      outputPlaceholder="转换结果"
      transform={text =>
        mode === 'upper' ? text.toUpperCase() : text.toLowerCase()
      }
      options={
        <Segmented
          value={mode}
          onChange={value => setMode(value as CaseMode)}
          options={[
            { label: '转为大写', value: 'upper' },
            { label: '转为小写', value: 'lower' },
          ]}
        />
      }
    />
  );
};

export default CaseConvertPanel;
