import React, { useMemo, useState } from 'react';
import { Alert, Button, Flex, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import CopyableTextArea from '../../CopyableTextArea';

const { Text } = Typography;

export const MONO_FONT = 'Menlo, Monaco, Consolas, "Courier New", monospace';

export interface TransformPanelProps {
  transform: (input: string) => string;
  inputPlaceholder: string;
  outputPlaceholder?: string;
  /** Extra controls (direction switches, algorithm selects, ...). */
  options?: React.ReactNode;
  allowSwap?: boolean;
  /** Called after the output is moved into the input, e.g. to flip direction. */
  onSwap?: () => void;
  rows?: number;
  mono?: boolean;
}

/**
 * Shared input/output panel for text transformations. The result is derived
 * from the input on every change, so there is no submit button and no stale
 * output when switching tabs.
 */
const TransformPanel: React.FC<TransformPanelProps> = ({
  transform,
  inputPlaceholder,
  outputPlaceholder = '输出结果',
  options,
  allowSwap = true,
  onSwap,
  rows = 8,
  mono = false,
}) => {
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input) {
      return { output: '', error: '' };
    }

    try {
      return { output: transform(input), error: '' };
    } catch (e) {
      return {
        output: '',
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }, [input, transform]);

  const monoStyle = mono ? { fontFamily: MONO_FONT } : undefined;

  return (
    <Flex vertical gap={8} style={{ maxWidth: 960 }}>
      {options ? (
        <Flex wrap gap={12} align="center">
          {options}
        </Flex>
      ) : null}

      <Text strong>输入</Text>
      <CopyableTextArea
        value={input}
        onChange={e => setInput(e.target.value)}
        allowClear
        rows={rows}
        showCount
        placeholder={inputPlaceholder}
        style={monoStyle}
      />

      {allowSwap ? (
        <Button
          icon={<SwapOutlined />}
          disabled={!output}
          onClick={() => {
            setInput(output);
            onSwap?.();
          }}>
          交换（输出 → 输入）
        </Button>
      ) : null}

      <Text strong>输出</Text>
      <CopyableTextArea
        value={output}
        readOnly
        rows={rows}
        showCount
        placeholder={outputPlaceholder}
        style={monoStyle}
      />

      {error ? <Alert type="error" showIcon title={error} /> : null}
    </Flex>
  );
};

export default TransformPanel;
