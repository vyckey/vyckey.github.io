import { Button, Form, Input, message, Select, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import CopyButton from '../CopyButton';
import CryptoJS from 'crypto-js';
import CopyableTextArea from '../CopyableTextArea';

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
          <CopyableTextArea
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
          <CopyableTextArea
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

const RSAForm: React.FC = () => {
  const [output, setOutput] = useState('');
  const [form] = Form.useForm();

  function doEncrypt() {
    form
      .validateFields()
      .then(values => {
        console.log(values);
        const encryptedData = CryptoJS.RSA.encrypt(values.input, values.publicKey);
        setOutput(encryptedData);
      })
      .catch(err => {
        console.log('RSA encrypt fail', err);
        message.error('加密失败！');
      });
  }

  function doDecrypt() {
    form
      .validateFields()
      .then(values => {
        const decryptedData = CryptoJS.RSA.decrypt(values.input, values.privateKey);
        return decryptedData;
      })
      .catch(err => {
        console.log('RSA decrypt fail', err);
        message.error('解密失败！');
      });
  }

  function doExchange() {
    const input = form.getFieldsValue()['input'];
    form.setFieldValue('input', output);
    setOutput(input);
  }

  return (
    <>
      <Form
        name="rsaForm"
        form={form}
        initialValues={{
          bitCount: 1024,
          format: 'PKCS#1',
        }}
        onFinish={doEncrypt}>
        <Space>
          <Form.Item name="bitCount" label="秘钥位数">
            <Select
              options={[512, 1024, 2048, 4096].map(bit => ({
                label: bit + ' bits',
                value: bit,
              }))}
            />
          </Form.Item>
          <Form.Item name="format" label="秘钥格式">
            <Select
              options={[
                {
                  label: 'PKCS#1',
                  value: 'PKCS#1',
                },
                {
                  label: 'PKCS#8',
                  value: 'PKCS#8',
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button style={{ borderColor: 'green', color: 'green' }}>
              生成秘钥对
            </Button>
          </Form.Item>
        </Space>
        <Space
          align="center"
          style={{ width: '100%', justifyContent: 'space-between' }}>
          <Form.Item name="publicKey" label="公钥" style={{ width: '100%' }}>
            <CopyableTextArea rows={6} placeholder="请输入公钥" />
          </Form.Item>
          <Form.Item name="privateKey" label="私钥">
            <CopyableTextArea rows={6} placeholder="请输入私钥" />
          </Form.Item>
        </Space>

        <Form.Item
          name="input"
          rules={[
            {
              required: true,
              message: '请输入需要进行加密或解密的文本！',
            },
          ]}>
          <CopyableTextArea
            allowClear={true}
            rows={6}
            placeholder="请输入需要进行加密或解密的文本"
            showCount={true}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              加密
            </Button>
            <Button type="primary" onClick={doDecrypt}>
              解密
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

const EncryptionTabs: React.FC = () => {
  return (
    <>
      <Tabs
        type="card"
        items={[
          {
            key: 'md5_tab',
            label: 'MD5签名',
            children: <MD5Form />,
          },
          {
            key: 'base64_tab',
            label: 'Base64编码/解码',
            children: <Base64Form />,
          },
          {
            key: 'rsa_tab',
            label: 'RSA加密/解密',
            children: <RSAForm />,
          },
        ]}
      />
    </>
  );
};

export default EncryptionTabs;
