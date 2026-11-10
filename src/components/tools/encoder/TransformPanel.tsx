import React, { useMemo, useState } from 'react';
import { Alert, Button, Flex, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translateError } from '../../../i18n/translateError';
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
  outputPlaceholder,
  options,
  allowSwap = true,
  onSwap,
  rows = 8,
  mono = false,
}) => {
  const { t } = useTranslation();
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
        error: translateError(t, e),
      };
    }
  }, [input, transform, t]);

  const monoStyle = mono ? { fontFamily: MONO_FONT } : undefined;

  return (
    <Flex vertical gap={8} style={{ maxWidth: 960 }}>
      {options ? (
        <Flex wrap gap={12} align="center">
          {options}
        </Flex>
      ) : null}

      <Text strong>{t('common.input')}</Text>
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
          {t('encoder.panel.swap')}
        </Button>
      ) : null}

      <Text strong>{t('common.output')}</Text>
      <CopyableTextArea
        value={output}
        readOnly
        rows={rows}
        showCount
        placeholder={outputPlaceholder ?? t('common.outputPlaceholder')}
        style={monoStyle}
      />

      {error ? <Alert type="error" showIcon title={error} /> : null}
    </Flex>
  );
};

export default TransformPanel;
