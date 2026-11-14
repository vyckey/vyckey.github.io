import React, { useState } from 'react';
import {
  Button,
  Flex,
  Input,
  InputNumber,
  Segmented,
  Slider,
  Space,
  Switch,
  Tabs,
  Typography,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CopyButton from '../CopyButton';
import {
  CornerRadius,
  FilterValues,
  GradientStop,
  GradientType,
  ShadowLayer,
  buildBorderRadius,
  buildBoxShadow,
  buildFilter,
  buildGradient,
} from '../../utils/css';

const { Text } = Typography;

const COLOR_INPUT_STYLE: React.CSSProperties = {
  width: 40,
  height: 32,
  padding: 0,
  border: '1px solid #d9d9d9',
  borderRadius: 6,
  background: 'transparent',
  cursor: 'pointer',
};

function CodeBlock({ code }: { code: string }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: '12px 48px 12px 14px',
        borderRadius: 8,
        background: '#0f172a',
        overflowX: 'auto',
      }}>
      <pre
        style={{
          margin: 0,
          color: '#e2e8f0',
          fontSize: 12,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
        {code}
      </pre>
      <div style={{ position: 'absolute', top: 8, right: 8 }}>
        <CopyButton value={code} size="small" />
      </div>
    </div>
  );
}

function GradientPanel() {
  const { t } = useTranslation();
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#6366f1', position: 0 },
    { color: '#8b5cf6', position: 50 },
    { color: '#ec4899', position: 100 },
  ]);

  const gradient = buildGradient(type, angle, stops);

  function updateStop(index: number, patch: Partial<GradientStop>) {
    setStops(current =>
      current.map((stop, stopIndex) =>
        stopIndex === index ? { ...stop, ...patch } : stop
      )
    );
  }

  return (
    <Flex vertical gap={16}>
      <Flex wrap gap={16} align="center">
        <Segmented
          value={type}
          onChange={value => setType(value as GradientType)}
          options={[
            { label: t('css.gradient.linear'), value: 'linear' },
            { label: t('css.gradient.radial'), value: 'radial' },
            { label: t('css.gradient.conic'), value: 'conic' },
          ]}
        />
        {type !== 'radial' && (
          <Space size={8} style={{ minWidth: 260 }}>
            <Text type="secondary">{t('css.gradient.angle')}</Text>
            <Slider
              min={0}
              max={360}
              value={angle}
              onChange={setAngle}
              style={{ width: 160 }}
            />
            <Text>{angle}°</Text>
          </Space>
        )}
        <Button
          size="small"
          onClick={() => {
            setType('linear');
            setAngle(135);
            setStops([
              { color: '#6366f1', position: 0 },
              { color: '#8b5cf6', position: 50 },
              { color: '#ec4899', position: 100 },
            ]);
          }}>
          {t('common.reset')}
        </Button>
      </Flex>

      <Flex vertical gap={8}>
        <Text strong>{t('css.gradient.stops')}</Text>
        {stops.map((stop, index) => (
          <Flex key={index} wrap gap={10} align="center">
            <input
              type="color"
              value={stop.color}
              onChange={event =>
                updateStop(index, { color: event.target.value })
              }
              style={COLOR_INPUT_STYLE}
              aria-label={t('css.gradient.color')}
            />
            <Input
              value={stop.color}
              onChange={event =>
                updateStop(index, { color: event.target.value })
              }
              style={{ width: 120, fontFamily: 'monospace' }}
            />
            <Slider
              min={0}
              max={100}
              value={stop.position}
              onChange={value => updateStop(index, { position: value })}
              style={{ width: 220 }}
            />
            <InputNumber
              min={0}
              max={100}
              value={stop.position}
              onChange={value =>
                updateStop(index, { position: Number(value) || 0 })
              }
              addonAfter="%"
              style={{ width: 90 }}
            />
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              disabled={stops.length <= 2}
              onClick={() =>
                setStops(current =>
                  current.filter((_, stopIndex) => stopIndex !== index)
                )
              }
            />
          </Flex>
        ))}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() =>
            setStops(current => [
              ...current,
              { color: '#22d3ee', position: 50 },
            ])
          }>
          {t('css.gradient.addStop')}
        </Button>
      </Flex>

      <Text strong>{t('css.preview')}</Text>
      <div
        style={{
          height: 220,
          borderRadius: 12,
          border: '1px solid #f0f0f0',
          background: gradient,
        }}
      />

      <Text strong>{t('css.code')}</Text>
      <CodeBlock code={`background: ${gradient};`} />
    </Flex>
  );
}

const DEFAULT_SHADOWS: ShadowLayer[] = [
  {
    x: 0,
    y: 10,
    blur: 30,
    spread: 0,
    color: '#0f172a',
    inset: false,
  },
  {
    x: 0,
    y: 2,
    blur: 6,
    spread: 0,
    color: '#64748b',
    inset: false,
  },
];

function ShadowPanel() {
  const { t } = useTranslation();
  const [layers, setLayers] = useState<ShadowLayer[]>(DEFAULT_SHADOWS);
  const shadow = buildBoxShadow(layers);

  function updateLayer(index: number, patch: Partial<ShadowLayer>) {
    setLayers(current =>
      current.map((layer, layerIndex) =>
        layerIndex === index ? { ...layer, ...patch } : layer
      )
    );
  }

  const numberFields: Array<{
    key: 'x' | 'y' | 'blur' | 'spread';
    label: string;
  }> = [
    { key: 'x', label: t('css.shadow.x') },
    { key: 'y', label: t('css.shadow.y') },
    { key: 'blur', label: t('css.shadow.blur') },
    { key: 'spread', label: t('css.shadow.spread') },
  ];

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center">
        <Text strong>{t('css.shadow.layers')}</Text>
        <Space>
          <Button size="small" onClick={() => setLayers(DEFAULT_SHADOWS)}>
            {t('common.reset')}
          </Button>
          <Button
            size="small"
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() =>
              setLayers(current => [
                ...current,
                {
                  x: 0,
                  y: 4,
                  blur: 12,
                  spread: 0,
                  color: '#0f172a',
                  inset: false,
                },
              ])
            }>
            {t('css.shadow.addLayer')}
          </Button>
        </Space>
      </Flex>

      {layers.map((layer, index) => (
        <Flex
          key={index}
          vertical
          gap={10}
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid #f0f0f0',
          }}>
          <Flex justify="space-between" align="center">
            <Text strong>
              {t('css.shadow.layer')} {index + 1}
            </Text>
            <Space>
              <Space size={6}>
                <Switch
                  size="small"
                  checked={layer.inset}
                  onChange={checked => updateLayer(index, { inset: checked })}
                />
                <Text type="secondary">{t('css.shadow.inset')}</Text>
              </Space>
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                disabled={layers.length <= 1}
                onClick={() =>
                  setLayers(current =>
                    current.filter((_, layerIndex) => layerIndex !== index)
                  )
                }
              />
            </Space>
          </Flex>

          <Flex wrap gap={16} align="center">
            {numberFields.map(field => (
              <Space key={field.key} size={6}>
                <Text type="secondary">{field.label}</Text>
                <InputNumber
                  min={-100}
                  max={200}
                  value={layer[field.key]}
                  onChange={value =>
                    updateLayer(index, {
                      [field.key]: Number(value) || 0,
                    })
                  }
                  style={{ width: 82 }}
                />
              </Space>
            ))}
            <Space size={6}>
              <input
                type="color"
                value={layer.color}
                onChange={event =>
                  updateLayer(index, { color: event.target.value })
                }
                style={COLOR_INPUT_STYLE}
                aria-label={t('css.shadow.color')}
              />
              <Input
                value={layer.color}
                onChange={event =>
                  updateLayer(index, { color: event.target.value })
                }
                style={{ width: 110, fontFamily: 'monospace' }}
              />
            </Space>
          </Flex>
        </Flex>
      ))}

      <Text strong>{t('css.preview')}</Text>
      <Flex
        justify="center"
        align="center"
        style={{
          minHeight: 240,
          borderRadius: 12,
          background: '#f5f5f7',
        }}>
        <div
          style={{
            width: 240,
            height: 140,
            borderRadius: 12,
            background: '#ffffff',
            boxShadow: shadow,
          }}
        />
      </Flex>

      <Text strong>{t('css.code')}</Text>
      <CodeBlock code={`box-shadow: ${shadow};`} />
    </Flex>
  );
}

const DEFAULT_RADIUS: CornerRadius = {
  topLeft: 16,
  topRight: 16,
  bottomRight: 16,
  bottomLeft: 16,
};

type CornerKey = keyof CornerRadius;

function RadiusPanel() {
  const { t } = useTranslation();
  const [radius, setRadius] = useState<CornerRadius>(DEFAULT_RADIUS);
  const [linked, setLinked] = useState(true);

  const corners: Array<{ key: CornerKey; label: string }> = [
    { key: 'topLeft', label: t('css.radius.topLeft') },
    { key: 'topRight', label: t('css.radius.topRight') },
    { key: 'bottomRight', label: t('css.radius.bottomRight') },
    { key: 'bottomLeft', label: t('css.radius.bottomLeft') },
  ];

  function update(key: CornerKey, value: number) {
    setRadius(current =>
      linked
        ? {
            topLeft: value,
            topRight: value,
            bottomRight: value,
            bottomLeft: value,
          }
        : { ...current, [key]: value }
    );
  }

  const value = buildBorderRadius(radius);

  return (
    <Flex vertical gap={16}>
      <Flex wrap gap={16} align="center">
        <Space size={6}>
          <Switch size="small" checked={linked} onChange={setLinked} />
          <Text>{t('css.radius.linked')}</Text>
        </Space>
        <Button
          size="small"
          onClick={() => {
            setRadius(DEFAULT_RADIUS);
            setLinked(true);
          }}>
          {t('common.reset')}
        </Button>
      </Flex>

      <Flex vertical gap={10} style={{ maxWidth: 560 }}>
        {corners.map(corner => (
          <Flex key={corner.key} gap={12} align="center">
            <Text style={{ width: 96 }}>{corner.label}</Text>
            <Slider
              min={0}
              max={200}
              value={radius[corner.key]}
              onChange={next => update(corner.key, next)}
              style={{ flex: 1 }}
            />
            <InputNumber
              min={0}
              max={200}
              value={radius[corner.key]}
              onChange={next => update(corner.key, Number(next) || 0)}
              style={{ width: 82 }}
            />
          </Flex>
        ))}
      </Flex>

      <Text strong>{t('css.preview')}</Text>
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: 220, background: '#f5f5f7', borderRadius: 12 }}>
        <div
          style={{
            width: 240,
            height: 140,
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            borderRadius: value,
          }}
        />
      </Flex>

      <Text strong>{t('css.code')}</Text>
      <CodeBlock code={`border-radius: ${value};`} />
    </Flex>
  );
}

const DEFAULT_FILTER: FilterValues = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  saturate: 100,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
};

function FilterPanel() {
  const { t } = useTranslation();
  const [values, setValues] = useState<FilterValues>(DEFAULT_FILTER);
  const filter = buildFilter(values);

  const controls: Array<{
    key: keyof FilterValues;
    min: number;
    max: number;
    step?: number;
    suffix: string;
  }> = [
    { key: 'blur', min: 0, max: 20, suffix: 'px' },
    { key: 'brightness', min: 0, max: 200, suffix: '%' },
    { key: 'contrast', min: 0, max: 200, suffix: '%' },
    { key: 'grayscale', min: 0, max: 100, suffix: '%' },
    { key: 'saturate', min: 0, max: 200, suffix: '%' },
    { key: 'sepia', min: 0, max: 100, suffix: '%' },
    { key: 'hueRotate', min: 0, max: 360, suffix: 'deg' },
    { key: 'invert', min: 0, max: 100, suffix: '%' },
    { key: 'opacity', min: 0, max: 100, suffix: '%' },
  ];

  return (
    <Flex vertical gap={16}>
      <Flex justify="flex-end">
        <Button size="small" onClick={() => setValues(DEFAULT_FILTER)}>
          {t('common.reset')}
        </Button>
      </Flex>

      <Flex vertical gap={10} style={{ maxWidth: 560 }}>
        {controls.map(control => (
          <Flex key={control.key} gap={12} align="center">
            <Text style={{ width: 96 }}>{t(`css.filter.${control.key}`)}</Text>
            <Slider
              min={control.min}
              max={control.max}
              step={control.step ?? 1}
              value={values[control.key]}
              onChange={next =>
                setValues(current => ({ ...current, [control.key]: next }))
              }
              style={{ flex: 1 }}
            />
            <InputNumber
              min={control.min}
              max={control.max}
              step={control.step ?? 1}
              value={values[control.key]}
              onChange={next =>
                setValues(current => ({
                  ...current,
                  [control.key]: Number(next) || 0,
                }))
              }
              addonAfter={control.suffix}
              style={{ width: 104 }}
            />
          </Flex>
        ))}
      </Flex>

      <Text strong>{t('css.preview')}</Text>
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: 220, background: '#f5f5f7', borderRadius: 12 }}>
        <Flex
          align="center"
          justify="center"
          style={{
            width: 240,
            height: 140,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #22d3ee, #6366f1, #ec4899)',
            color: '#ffffff',
            fontSize: 22,
            fontWeight: 600,
            filter,
          }}>
          CSS Filter
        </Flex>
      </Flex>

      <Text strong>{t('css.code')}</Text>
      <CodeBlock code={`filter: ${filter};`} />
    </Flex>
  );
}

export default function CssTool() {
  const { t } = useTranslation();

  return (
    <Tabs
      type="card"
      items={[
        {
          key: 'gradient',
          label: t('css.tabs.gradient'),
          children: <GradientPanel />,
        },
        {
          key: 'shadow',
          label: t('css.tabs.shadow'),
          children: <ShadowPanel />,
        },
        {
          key: 'radius',
          label: t('css.tabs.radius'),
          children: <RadiusPanel />,
        },
        {
          key: 'filter',
          label: t('css.tabs.filter'),
          children: <FilterPanel />,
        },
      ]}
    />
  );
}
