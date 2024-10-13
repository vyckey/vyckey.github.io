import { Button, Form, Input, message, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import CopyButton from './CopyButton';
import CryptoJS from 'crypto-js';

const MD5Form: React.FC = () => {
  const [md5Value, setMd5Value] = useState('');

  return (
    <>
      <Form
        name="md5Form"
        onFinish={values => {
          setMd5Value(CryptoJS.MD5(values.input).toString());
        }}>
        <Form.Item
          name="input"
          rules={[
            {
              required: true,
              message: '请输入需要进行MD5的文本！',
            },
          ]}>
          <Input.TextArea
            allowClear={true}
            rows={6}
            placeholder="请输入需要进行MD5的文本"
            showCount={true}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            MD5
          </Button>
        </Form.Item>
      </Form>
      <Space direction="vertical">
        <Input
          addonBefore="MD5 32位小写"
          value={md5Value}
          suffix={<CopyButton value={md5Value} />}
        />
        <Input
          addonBefore="MD5 32位大写"
          value={md5Value.toUpperCase()}
          suffix={<CopyButton value={md5Value.toUpperCase()} />}
        />
      </Space>
    </>
  );
};

const Base64Form: React.FC = () => {
  const [output, setOutput] = useState('');
  const [form] = Form.useForm();

  function doEncode() {
    form
      .validateFields()
      .then(values => {
        const encode = CryptoJS.enc.Base64.stringify(
          CryptoJS.enc.Utf8.parse(values.input)
        );
        setOutput(encode);
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
        const decode = CryptoJS.enc.Base64.parse(values.input).toString(
          CryptoJS.enc.Utf8
        );
        setOutput(decode);
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
      <Form name="base64Form" form={form} onFinish={doEncode}>
        <Form.Item
          name="input"
          rules={[
            {
              required: true,
              message: '请输入需要进行编码或解码的文本！',
            },
          ]}>
          <Input.TextArea
            allowClear={true}
            rows={6}
            placeholder="请输入需要进行编码或解码的文本"
            showCount={true}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              编码
            </Button>
            <Button type="primary" onClick={doDecode}>
              解码
            </Button>
            <Button type="primary" onClick={doExchange}>
              ↕ 交换
            </Button>
          </Space>
        </Form.Item>
        <Input.TextArea
          value={output}
          rows={6}
          placeholder="输出文本"
          showCount={true}
        />
      </Form>
    </>
  );
};

const EncryptionTabs: React.FC = () => {
  return (
    <>
      <Tabs
        type="card"
        items={[
          {
            key: 'md5_tab',
            label: 'MD5',
            children: <MD5Form />,
          },
          {
            key: 'base64_tab',
            label: 'Base64',
            children: <Base64Form />,
          },
          {
            key: 'datetime_tab',
            label: 'DateTime',
            children: <Base64Form />,
          },
        ]}
      />
    </>
  );
};

export default EncryptionTabs;
