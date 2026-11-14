import React, { useMemo, useState } from 'react';
import {
  Button,
  Divider,
  Flex,
  Input,
  message,
  Slider,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import CopyButton from '../CopyButton';
import {
  complementary,
  contrastRatio,
  darken,
  lighten,
  parseHexColor,
  rgbToHex,
  rgbToHsl,
} from '../../utils/color';
import { copyText } from '../../utils/clipboard';

const { Text, Title } = Typography;

const FALLBACK_HEX = '#4f8cff';

const COLOR_INPUT_STYLE: React.CSSProperties = {
  width: 40,
  height: 32,
  padding: 0,
  border: '1px solid #d9d9d9',
  borderRadius: 6,
  background: 'transparent',
  cursor: 'pointer',
};

export default function ColorTool() {
  const { t } = useTranslation();
  const [hex, setHex] = useState(FALLBACK_HEX);
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#111827');

  const rgb = useMemo(
    () => parseHexColor(hex) ?? parseHexColor(FALLBACK_HEX)!,
    [hex]
  );
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);

  const contrast = useMemo(() => {
    const foreground = parseHexColor(textColor) ?? { r: 255, g: 255, b: 255 };
    const background = parseHexColor(backgroundColor) ?? {
      r: 0,
      g: 0,
      b: 0,
    };
    return contrastRatio(foreground, background);
  }, [textColor, backgroundColor]);

  function updateChannel(channel: 'r' | 'g' | 'b', value: number) {
    setHex(rgbToHex({ ...rgb, [channel]: value }));
  }

  function copyColor(value: string) {
    copyText(value)
      .then(() => message.success(t('common.copySuccess')))
      .catch(() => message.error(t('common.copyFailed')));
  }

  const palette = [
    ...[0.8, 0.6, 0.4, 0.2, 0].map(amount => lighten(rgb, amount)),
    ...[0.2, 0.4, 0.6, 0.8].map(amount => darken(rgb, amount)),
    complementary(rgb),
  ];

  return (
    <Flex vertical gap={16} style={{ maxWidth: 980 }}>
      <Space wrap size={12}>
        <input
          type="color"
          value={rgbToHex(rgb)}
          onChange={event => setHex(event.target.value)}
          style={COLOR_INPUT_STYLE}
          aria-label={t('color.pick')}
        />
        <Input
          value={hex}
          onChange={event => setHex(event.target.value)}
          onBlur={() => {
            const parsed = parseHexColor(hex);
            if (parsed) {
              setHex(rgbToHex(parsed));
            }
          }}
          addonBefore="HEX"
          suffix={<CopyButton value={hex} />}
          style={{ width: 220, fontFamily: 'monospace' }}
        />
        <div
          style={{
            width: 96,
            height: 32,
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            background: rgbToHex(rgb),
          }}
        />
      </Space>

      <div style={{ maxWidth: 560 }}>
        {(
          [
            ['r', t('color.red')],
            ['g', t('color.green')],
            ['b', t('color.blue')],
          ] as const
        ).map(([channel, label]) => (
          <Flex key={channel} align="center" gap={12}>
            <Text style={{ width: 72 }}>{label}</Text>
            <Slider
              min={0}
              max={255}
              value={rgb[channel]}
              onChange={value => updateChannel(channel, value)}
              style={{ flex: 1 }}
            />
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb[channel]}
              onChange={event =>
                updateChannel(
                  channel,
                  Math.min(255, Math.max(0, Number(event.target.value) || 0))
                )
              }
              style={{ width: 72 }}
            />
          </Flex>
        ))}
      </div>

      <Space direction="vertical" style={{ width: '100%', maxWidth: 560 }}>
        <Input
          addonBefore="RGB"
          value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
          readOnly
          suffix={<CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />}
        />
        <Input
          addonBefore="HSL"
          value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
          readOnly
          suffix={<CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />}
        />
      </Space>

      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          {t('color.palette')}
        </Title>
        <Flex wrap gap={8}>
          {palette.map((color, index) => {
            const value = rgbToHex(color);
            return (
              <Tooltip key={`${value}-${index}`} title={value}>
                <button
                  type="button"
                  onClick={() => copyColor(value)}
                  style={{
                    width: 36,
                    height: 36,
                    padding: 0,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: 6,
                    background: value,
                    cursor: 'pointer',
                  }}
                />
              </Tooltip>
            );
          })}
        </Flex>
      </div>

      <Divider style={{ margin: '4px 0' }} />

      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          {t('color.contrast')}
        </Title>
        <Flex wrap gap={16} align="center" style={{ marginBottom: 12 }}>
          <Space size={6}>
            <Text type="secondary">{t('color.foreground')}</Text>
            <input
              type="color"
              value={textColor}
              onChange={event => setTextColor(event.target.value)}
              style={COLOR_INPUT_STYLE}
              aria-label={t('color.foreground')}
            />
            <Input
              value={textColor}
              onChange={event => setTextColor(event.target.value)}
              style={{ width: 110, fontFamily: 'monospace' }}
            />
          </Space>
          <Space size={6}>
            <Text type="secondary">{t('color.background')}</Text>
            <input
              type="color"
              value={backgroundColor}
              onChange={event => setBackgroundColor(event.target.value)}
              style={COLOR_INPUT_STYLE}
              aria-label={t('color.background')}
            />
            <Input
              value={backgroundColor}
              onChange={event => setBackgroundColor(event.target.value)}
              style={{ width: 110, fontFamily: 'monospace' }}
            />
          </Space>
        </Flex>

        <Flex
          align="center"
          justify="center"
          style={{
            minHeight: 96,
            borderRadius: 8,
            border: '1px solid #f0f0f0',
            background: backgroundColor,
            color: textColor,
            fontSize: 24,
            fontWeight: 600,
          }}>
          Aa {t('color.sample')}
        </Flex>

        <Flex wrap gap={12} align="center" style={{ marginTop: 12 }}>
          <Text strong>
            {t('color.ratio')}: {contrast}:1
          </Text>
          <Tag color={contrast >= 4.5 ? 'success' : 'error'}>
            AA {contrast >= 4.5 ? t('color.pass') : t('color.fail')}
          </Tag>
          <Tag color={contrast >= 7 ? 'success' : 'error'}>
            AAA {contrast >= 7 ? t('color.pass') : t('color.fail')}
          </Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('color.aaHint')}
          </Text>
        </Flex>
      </div>
    </Flex>
  );
}
