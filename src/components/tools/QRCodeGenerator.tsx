import React, { useState } from 'react';
import {
  Button,
  ColorPicker,
  Form,
  Input,
  QRCode,
  Radio,
  Slider,
  Space,
  Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

type RenderType = 'canvas' | 'svg';

interface FormData {
  input: string;
  renderType: RenderType;
  bgColor: string;
  color: string;
  size: number;
}

const initialFormData: FormData = {
  input: '',
  renderType: 'canvas',
  bgColor: '#FFFFFF',
  color: '#000000',
  size: 160,
};

const QRCodeGenerator: React.FC = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState(initialFormData);
  const [renderType, setRenderType] = useState<RenderType>('canvas');

  function generateQRCode(values) {
    const data = { ...values };
    if (typeof data.bgColor !== 'string') {
      data.bgColor = data.bgColor.toHexString();
    }
    if (typeof data.color !== 'string') {
      data.color = data.color.toHexString();
    }
    setFormData(data);
  }

  function onReset() {
    form.resetFields();
  }

  function doDownload(url: string, fileName: string) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const downloadCanvasQRCode = () => {
    const canvas = document
      .getElementById('myqrcode')
      ?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      doDownload(url, 'QRCode.png');
    }
  };

  const downloadSvgQRCode = () => {
    const svg = document
      .getElementById('myqrcode')
      ?.querySelector<SVGElement>('svg');
    const svgData = new XMLSerializer().serializeToString(svg!);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    doDownload(url, 'QRCode.svg');
  };

  return (
    <>
      <h1>二维码生成</h1>
      <Form
        name="qrcodeForm"
        initialValues={initialFormData}
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
          <Space direction="vertical">
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
              <ColorPicker
                allowClear
                showText
                onChangeComplete={color => {
                  console.log(color.toCssString());
                }}
              />
            </Form.Item>
            <Form.Item name="color" label="颜色">
              <ColorPicker
                allowClear
                showText
                onChangeComplete={color => {
                  console.log(color.toCssString());
                }}
              />
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
            <Form.Item name="logo" label="LOGO">
              <Upload
                listType="picture-card"
                maxCount={1}
                accept="image/png, image/jpeg, image/svg"
                action={file => {
                  console.log('upload', file);
                }}>
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
            <Space direction="vertical" style={{ marginRight: '20px' }}>
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
                    style={{ marginBottom: 16, margin: 'auto auto' }}
                  />
                )}
              </div>

              <Button
                type="primary"
                disabled={formData.input ? false : true}
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
