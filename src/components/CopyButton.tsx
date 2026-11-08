import { Button, ButtonProps, message, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { copyText } from '../utils/clipboard';

interface CopyButtonProps extends Omit<ButtonProps, 'value' | 'onClick'> {
  value: string | number | bigint | readonly string[] | null | undefined;
}

const CopyButton: React.FC<CopyButtonProps> = ({ value, ...props }) => {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  function onClick() {
    const text =
      value === undefined || value === null
        ? ''
        : typeof value === 'string'
          ? value
          : String(value);

    if (!text) {
      message.warning('内容为空');
      return;
    }

    copyText(text)
      .then(() => {
        setCopied(true);
        if (resetTimerRef.current) {
          clearTimeout(resetTimerRef.current);
        }
        resetTimerRef.current = setTimeout(() => {
          setCopied(false);
          resetTimerRef.current = null;
        }, 2000);
        message.success('复制成功');
      })
      .catch(err => {
        console.error('copy fail', err);
        message.error('复制失败');
      });
  }

  return (
    <Tooltip title={copied ? '复制成功' : '复制'}>
      <Button
        style={{ border: 'none' }}
        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
        onClick={onClick}
        {...props}
      />
    </Tooltip>
  );
};

export default CopyButton;
