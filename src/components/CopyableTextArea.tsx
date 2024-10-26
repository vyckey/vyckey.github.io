import TextArea, { TextAreaProps, TextAreaRef } from 'antd/es/input/TextArea';
import React from 'react';
import CopyButton from './CopyButton';

export default function CopyableTextArea({
  value,
  ...props
}: TextAreaProps & React.RefAttributes<TextAreaRef>) {
  return (
    <div style={{ position: 'relative' }}>
      <TextArea value={value} allowClear={false} {...props} />
      <div
        style={{ position: 'absolute', right: '2px', top: '2px', zIndex: 1 }}>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
