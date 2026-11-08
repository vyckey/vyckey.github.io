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
      message.error('未找到二维码画布');
      return;
    }

    try {
      const url = canvas.toDataURL('image/png');
      doDownload(url, 'QRCode.png');
    } catch (err) {
      console.error('download canvas qrcode fail', err);
      message.error('保存二维码失败');
    }
  };

  const downloadSvgQRCode = () => {
    const svg = document
      .getElementById('myqrcode')
      ?.querySelector<SVGElement>('svg');
    if (!svg) {
      message.error('未找到二维码 SVG');
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
      <h1>二维码生成</h1>
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
              message: '请输入文本！',
            },
          ]}>
          <Input.TextArea
            allowClear={true}
            rows={6}
            placeholder="请输入文本"
            showCount={true}
          />
        </Form.Item>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space orientation="vertical">
            <Form.Item name="renderType" label="图片类型">
              <Radio.Group
                onChange={e => {
                  setRenderType(e.target.value);
                }}>
                <Radio value="canvas">图片</Radio>
                <Radio value="svg">SVG</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="bgColor" label="背景颜色">
              <ColorPicker allowClear showText />
            </Form.Item>
            <Form.Item name="color" label="颜色">
              <ColorPicker allowClear showText />
            </Form.Item>
            {renderType === 'canvas' && (
              <Form.Item name="size" label="图片大小">
                <Slider
                  min={80}
                  max={1024}
                  marks={{ 80: '80', 160: '160', 1024: '1024' }}
                />
              </Form.Item>
            )}
            <Form.Item
              name="logo"
              label="LOGO"
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
                  生成二维码
                </Button>
                <Button type="primary" htmlType="button" onClick={onReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Space>
          <div id="myqrcode">
            <Space orientation="vertical" style={{ marginRight: '20px' }}>
              <p>二维码</p>
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
                保存图片
              </Button>
            </Space>
          </div>
        </Space>
      </Form>
    </>
  );
};

export default QRCodeGenerator;
