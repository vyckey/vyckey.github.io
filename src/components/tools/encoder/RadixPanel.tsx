import React, { useState } from 'react';
import { Select, Typography } from 'antd';
import { convertRadixText, RADIXES } from '../../../utils/encoding';
import TransformPanel from './TransformPanel';

const { Text } = Typography;

const radixLabels: Record<number, string> = {
  2: '二进制 (2)',
  8: '八进制 (8)',
  10: '十进制 (10)',
  16: '十六进制 (16)',
  36: '三十六进制 (36)',
};

const RadixPanel: React.FC = () => {
  const [fromRadix, setFromRadix] = useState(10);

  return (
    <TransformPanel
      inputPlaceholder={`请输入 ${fromRadix} 进制数值（支持 0x / 0b / 0o 前缀和负数）`}
      outputPlaceholder="各进制转换结果"
      rows={6}
      mono
      allowSwap={false}
      transform={text => convertRadixText(text, fromRadix)}
      options={
        <>
          <Select
            value={fromRadix}
            onChange={setFromRadix}
            style={{ width: 150 }}
            options={RADIXES.map(radix => ({
              label: radixLabels[radix],
              value: radix,
            }))}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            使用 BigInt 计算，不受 JavaScript 安全整数范围限制
          </Text>
        </>
      }
    />
  );
};

export default RadixPanel;
