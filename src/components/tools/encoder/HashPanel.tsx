import React, { useState } from 'react';
import { Checkbox, Select } from 'antd';
import { HASH_ALGORITHMS, hashText, HashAlgorithm } from '../../../utils/hash';
import TransformPanel from './TransformPanel';

const HashPanel: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('MD5');
  const [uppercase, setUppercase] = useState(false);

  return (
    <TransformPanel
      inputPlaceholder="请输入需要计算哈希的文本"
      outputPlaceholder="哈希结果（Hexadecimal）"
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
            大写
          </Checkbox>
        </>
      }
    />
  );
};

export default HashPanel;
