import React, { useState } from 'react';
import { Checkbox, Segmented } from 'antd';
import { decodeUrl, encodeUrl } from '../../../utils/encoding';
import TransformPanel from './TransformPanel';

type Direction = 'encode' | 'decode';

const UrlPanel: React.FC = () => {
  const [direction, setDirection] = useState<Direction>('encode');
  const [formMode, setFormMode] = useState(false);

  return (
    <TransformPanel
      inputPlaceholder={
        direction === 'encode'
          ? '请输入需要 URL 编码的文本或链接'
          : '请输入需要 URL 解码的内容，如 %E4%BD%A0%E5%A5%BD'
      }
      outputPlaceholder="输出结果"
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
              { label: '编码', value: 'encode' },
              { label: '解码', value: 'decode' },
            ]}
          />
          <Checkbox
            checked={formMode}
            onChange={e => setFormMode(e.target.checked)}>
            表单模式（空格 ↔ +）
          </Checkbox>
        </>
      }
    />
  );
};

export default UrlPanel;
