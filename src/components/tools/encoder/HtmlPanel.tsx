import React, { useState } from 'react';
import { Segmented } from 'antd';
import { escapeHtml, unescapeHtml } from '../../../utils/encoding';
import TransformPanel from './TransformPanel';

type Direction = 'encode' | 'decode';

const HtmlPanel: React.FC = () => {
  const [direction, setDirection] = useState<Direction>('encode');

  return (
    <TransformPanel
      inputPlaceholder={
        direction === 'encode'
          ? '请输入需要转义的 HTML 文本，如 <div class="box">'
          : '请输入需要反转义的 HTML 实体，如 &lt;div&gt;'
      }
      outputPlaceholder="输出结果"
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
            { label: '转义', value: 'encode' },
            { label: '反转义', value: 'decode' },
          ]}
        />
      }
    />
  );
};

export default HtmlPanel;
