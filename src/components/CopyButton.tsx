import { Button, message, Tooltip } from 'antd';
import React, { useState } from 'react';

import { CheckOutlined, CopyOutlined } from '@ant-design/icons';

interface CopyButtonProps {
  value: string | number | bigint | undefined;
}

const CopyButton: React.FC<CopyButtonProps> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  function onClick() {
    if (!value) {
      message.warning('内容为空');
      return;
    }
    navigator.clipboard
      .writeText(typeof value === 'string' ? value : value + '')
      .then(() => {
        setCopied(true);
        message.success('复制成功');
        setInterval(() => {
          setCopied(false);
        }, 3000);
      })
      .catch(err => {
        console.error('copy fail', err);
        message.error('复制失败');
      });
  }

  return (
    <>
      <Tooltip title={copied ? '复制成功' : '复制'}>
        <Button
          style={{ border: 'none' }}
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={onClick}
        />
      </Tooltip>
    </>
  );
};

export default CopyButton;
