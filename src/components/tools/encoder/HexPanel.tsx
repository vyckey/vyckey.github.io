import React, { useState } from 'react';
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
        ? '请输入需要转成 Unicode 转义的文本'
        : '请输入 Unicode 转义，如 \\u4F60\\u597D'
      : direction === 'encode'
        ? '请输入需要转成十六进制的文本（按 UTF-8 字节）'
        : '请输入十六进制内容，如 E4 BD A0 E5 A5 BD';

  return (
    <TransformPanel
      inputPlaceholder={inputPlaceholder}
      outputPlaceholder="输出结果"
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
              { label: '十六进制', value: 'hex' },
              { label: 'Unicode 转义', value: 'unicode' },
            ]}
          />
          <Segmented
            value={direction}
            onChange={value => setDirection(value as Direction)}
            options={[
              { label: '编码', value: 'encode' },
              { label: '解码', value: 'decode' },
            ]}
          />
          {format === 'hex' && direction === 'encode' ? (
            <>
              <Select
                value={separator}
                onChange={setSeparator}
                style={{ width: 110 }}
                options={[
                  { label: '空格分隔', value: ' ' },
                  { label: '无分隔', value: '' },
                  { label: '逗号分隔', value: ',' },
                ]}
              />
              <Checkbox
                checked={uppercase}
                onChange={e => setUppercase(e.target.checked)}>
                大写
              </Checkbox>
            </>
          ) : null}
        </>
      }
    />
  );
};

export default HexPanel;
