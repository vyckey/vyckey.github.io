import TextArea, { TextAreaProps, TextAreaRef } from 'antd/es/input/TextArea';
import React from 'react';
import CopyButton from './CopyButton';

export default function CopyableTextArea({
  value,
  allowClear,
  ...props
}: TextAreaProps & React.RefAttributes<TextAreaRef>) {
  // TextArea renders its clear icon in the top-right corner. Keep the copy
  // button to the left of it so both actions remain clickable.
  const copyRight = allowClear ? 30 : 2;

  return (
    <div style={{ position: 'relative' }}>
      <TextArea value={value} allowClear={allowClear} {...props} />
      <div
        style={{
          position: 'absolute',
          right: copyRight,
          top: 2,
          zIndex: 1,
        }}>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
