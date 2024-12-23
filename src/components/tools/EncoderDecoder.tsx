import { Button, Form, message, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import CopyableTextArea from '../CopyableTextArea';

const CaseConvertForm: React.FC = () => {
  const [output, setOutput] = useState('');
  const [form] = Form.useForm();

  function doEncode() {
    form
      .validateFields()
      .then(values => {
        setOutput(values.input.toUpperCase());
      })
      .catch(err => {
        console.log('encode fail', err);
        message.error('编码失败！');
      });
  }

  function doDecode() {
    form
      .validateFields()
      .then(values => {
        setOutput(values.input.toLowerCase());
      })
      .catch(err => {
        console.log('decode fail', err);
        message.error('解码失败！');
      });
  }

  function doExchange() {
    const input = form.getFieldsValue()['input'];
    form.setFieldValue('input', output);
    setOutput(input);
  }

  return (
    <>
      <Form name="caseConvertForm" form={form} onFinish={doEncode}>
        <Form.Item
          name="input"
          rules={[
            {
              required: true,
              message: '请输入需要进行大小写转换的文本！',
            },
          ]}>
          <CopyableTextArea
            allowClear={true}
            rows={6}
            placeholder="请输入需要进行大小写转换的文本"
            showCount={true}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              大写
            </Button>
            <Button type="primary" onClick={doDecode}>
              小写
            </Button>
            <Button onClick={doExchange}>↕ 交换</Button>
          </Space>
        </Form.Item>
        <CopyableTextArea
          value={output}
          rows={6}
          placeholder="输出文本"
          showCount={true}
        />
      </Form>
    </>
  );
};

export default function EncoderDecoderTabs() {
  return (
    <>
      <Tabs
        type="card"
        items={[
          {
            key: 'case_convert_tab',
            label: '大写/小写',
            children: <CaseConvertForm />,
          },
        ]}
      />
    </>
  );
}
