import React, { useEffect, useState } from 'react';
import {
  Button,
  ColorPicker,
  Form,
  Input,
  message,
  QRCode,
  Radio,
  Slider,
  Space,
  Upload,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

type RenderType = 'canvas' | 'svg';

interface FormData {
  input: string;
  bgColor: string;
  color: string;
  size: number;
}

type ColorValue = string | { toHexString: () => string } | null | undefined;

interface QRCodeFormValues {
  input: string;
  renderType?: RenderType;
  bgColor: ColorValue;
  color: ColorValue;
  size?: number;
  logo?: UploadFile[];
}

const initialFormData: FormData = {
  input: '',
  bgColor: '#FFFFFF',
  color: '#000000',
  size: 160,
};

const initialFormValues = {
  ...initialFormData,
  renderType: 'canvas' as RenderType,
};

function normalizeColor(value: ColorValue, fallback: string): string {
  if (!value) {
    return fallback;
  }
  return typeof value === 'string' ? value : value.toHexString();
}

const QRCodeGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<QRCodeFormValues>();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [renderType, setRenderType] = useState<RenderType>('canvas');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const logoList = Form.useWatch('logo', form) as UploadFile[] | undefined;

  useEffect(() => {
    const file = logoList?.[0]?.originFileObj;
    if (!file) {
      setLogoUrl(undefined);
      return;
    }

    let cancelled = false;
    const reader = new FileReader();
    reader.onload = () => {
      if (!cancelled && typeof reader.result === 'string') {
        setLogoUrl(reader.result);
      }
    };
    reader.onerror = () => {
      if (!cancelled) {
        setLogoUrl(undefined);
      }
    };
    reader.readAsDataURL(file);

    return () => {
      cancelled = true;
    };
  }, [logoList]);

  function generateQRCode(values: QRCodeFormValues) {
    setFormData({
      input: values.input,
      bgColor: normalizeColor(values.bgColor, initialFormData.bgColor),
      color: normalizeColor(values.color, initialFormData.color),
      size: values.size ?? initialFormData.size,
    });
    setRenderType(values.renderType ?? 'canvas');
  }

  function onReset() {
    form.resetFields();
    setFormData(initialFormData);
    setRenderType('canvas');
    setLogoUrl(undefined);
  }

  function doDownload(url: string, fileName: string, revoke = false) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (revoke) {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  const downloadCanvasQRCode = () => {
    const canvas = document
      .getElementById('myqrcode')
      ?.querySelector<HTMLCanvasElement>('canvas');
    if (!canvas) {
      message.error(t('qrcode.noCanvas'));
      return;
    }

    try {
      const url = canvas.toDataURL('image/png');
      doDownload(url, 'QRCode.png');
    } catch (err) {
      console.error('download canvas qrcode fail', err);
      message.error(t('qrcode.saveFailed'));
    }
  };

  const downloadSvgQRCode = () => {
    const svg = document
      .getElementById('myqrcode')
      ?.querySelector<SVGElement>('svg');
    if (!svg) {
      message.error(t('qrcode.noSvg'));
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    doDownload(url, 'QRCode.svg', true);
  };

  const logoSize = Math.max(24, Math.round(formData.size * 0.2));

  return (
    <>
      <h1>{t('qrcode.title')}</h1>
      <Form
        form={form}
        name="qrcodeForm"
        initialValues={initialFormValues}
        onFinish={generateQRCode}>
        <Form.Item
          name="input"
          rules={[
            {
              required: true,
              message: t('qrcode.required'),
            },
          ]}>
          <Input.TextArea
            allowClear={true}
            rows={6}
            placeholder={t('qrcode.placeholder')}
            showCount={true}
          />
        </Form.Item>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space orientation="vertical">
            <Form.Item name="renderType" label={t('qrcode.imageType')}>
              <Radio.Group
                onChange={e => {
                  setRenderType(e.target.value);
                }}>
                <Radio value="canvas">{t('qrcode.image')}</Radio>
                <Radio value="svg">SVG</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="bgColor" label={t('qrcode.bgColor')}>
              <ColorPicker allowClear showText />
            </Form.Item>
            <Form.Item name="color" label={t('qrcode.color')}>
              <ColorPicker allowClear showText />
            </Form.Item>
            {renderType === 'canvas' && (
              <Form.Item name="size" label={t('qrcode.size')}>
                <Slider
                  min={80}
                  max={1024}
                  marks={{ 80: '80', 160: '160', 1024: '1024' }}
                />
              </Form.Item>
            )}
            <Form.Item
              name="logo"
              label={t('qrcode.logo')}
              valuePropName="fileList"
              getValueFromEvent={(
                event: UploadFile[] | { fileList?: UploadFile[] }
              ) => (Array.isArray(event) ? event : event?.fileList)}>
              <Upload
                listType="picture-card"
                maxCount={1}
                accept="image/png,image/jpeg,image/svg+xml"
                beforeUpload={() => false}>
                <PlusOutlined />
              </Upload>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t('qrcode.generate')}
                </Button>
                <Button type="primary" htmlType="button" onClick={onReset}>
                  {t('common.reset')}
                </Button>
              </Space>
            </Form.Item>
          </Space>
          <div id="myqrcode">
            <Space orientation="vertical" style={{ marginRight: '20px' }}>
              <p>{t('qrcode.previewTitle')}</p>
              <div
                style={{
                  border: 'dashed black 2px',
                  borderColor: '#B7ACAC',
                  width: formData.size * 1.1,
                  height: formData.size * 1.1,
                }}>
                {formData.input && (
                  <QRCode
                    type={renderType}
                    value={formData.input}
                    bgColor={formData.bgColor}
                    color={formData.color}
                    size={formData.size}
                    icon={logoUrl}
                    iconSize={
                      logoUrl
                        ? { width: logoSize, height: logoSize }
                        : undefined
                    }
                    style={{ margin: 'auto' }}
                  />
                )}
              </div>

              <Button
                type="primary"
                disabled={!formData.input}
                onClick={
                  renderType === 'canvas'
                    ? downloadCanvasQRCode
                    : downloadSvgQRCode
                }>
                {t('qrcode.save')}
              </Button>
            </Space>
          </div>
        </Space>
      </Form>
    </>
  );
};

export default QRCodeGenerator;
