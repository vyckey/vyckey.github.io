import React, { useState } from 'react';
import { Checkbox, Segmented } from 'antd';
import { decodeBase64, encodeBase64 } from '../../../utils/encoding';
import TransformPanel from './TransformPanel';

type Direction = 'encode' | 'decode';

const Base64Panel: React.FC = () => {
  const [direction, setDirection] = useState<Direction>('encode');
  const [urlSafe, setUrlSafe] = useState(false);

  return (
    <TransformPanel
      inputPlaceholder={
        direction === 'encode'
          ? '请输入需要编码的文本（支持中文和 Emoji）'
          : '请输入需要解码的 Base64 字符串'
      }
      outputPlaceholder="输出结果"
      mono
      transform={text =>
        direction === 'encode'
          ? encodeBase64(text, urlSafe)
          : decodeBase64(text)
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
          {direction === 'encode' ? (
            <Checkbox
              checked={urlSafe}
              onChange={e => setUrlSafe(e.target.checked)}>
              URL 安全（使用 - _，去掉 =）
            </Checkbox>
          ) : null}
        </>
      }
    />
  );
};

export default Base64Panel;
