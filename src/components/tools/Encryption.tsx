import { Button, Flex, Form, Input, message, Select, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CopyButton from '../CopyButton';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import CopyableTextArea from '../CopyableTextArea';
import { toPkcs8PrivateKey } from '../../utils/rsa';

const MD5Form: React.FC = () => {
  const { t } = useTranslation();
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
              message: t('encryption.md5.required'),
            },
          ]}>
          <CopyableTextArea
            allowClear={true}
            rows={6}
            placeholder={t('encryption.md5.placeholder')}
            showCount={true}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            MD5
          </Button>
        </Form.Item>
      </Form>
      <Space direction="vertical" style={{ width: 510 }}>
        <Input
          addonBefore={t('encryption.md5.lower')}
          value={md5Value}
          suffix={<CopyButton value={md5Value} />}
        />
        <Input
          addonBefore={t('encryption.md5.upper')}
          value={md5Value.toUpperCase()}
          suffix={<CopyButton value={md5Value.toUpperCase()} />}
        />
      </Space>
    </>
  );
};

const SHA256Form: React.FC = () => {
  const { t } = useTranslation();
  const [sha256Value, setSha256Value] = useState('');

  return (
    <>
      <Form
        name="sha256Form"
        onFinish={values => {
          setSha256Value(CryptoJS.SHA256(values.input).toString());
        }}>
        <Form.Item
          name="input"
          rules={[
            {
              required: true,
              message: t('encryption.sha256.required'),
            },
          ]}>
          <CopyableTextArea
            allowClear={true}
            rows={6}
            placeholder={t('encryption.sha256.placeholder')}
            showCount={true}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            SHA256
          </Button>
        </Form.Item>
      </Form>
      <Space direction="vertical" style={{ width: 840 }}>
        <Input
          addonBefore={t('encryption.sha256.lower')}
          value={sha256Value}
          suffix={<CopyButton value={sha256Value} />}
        />
        <Input
          addonBefore={t('encryption.sha256.upper')}
          value={sha256Value.toUpperCase()}
          suffix={<CopyButton value={sha256Value.toUpperCase()} />}
        />
      </Space>
    </>
  );
};

const Base64Form: React.FC = () => {
  const { t } = useTranslation();
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
        message.error(t('encryption.base64.encodeFailed'));
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
        message.error(t('encryption.base64.decodeFailed'));
      });
  }

  function doExchange() {
    const input = form.getFieldsValue()['input'] as string | undefined;
    form.setFieldValue('input', output);
    setOutput(input ?? '');
  }

  return (
    <>
      <Form name="base64Form" form={form} onFinish={doEncode}>
        <Form.Item
          name="input"
          rules={[
            {
              required: true,
              message: t('encryption.base64.required'),
            },
          ]}>
          <CopyableTextArea
            allowClear={true}
            rows={6}
            placeholder={t('encryption.base64.placeholder')}
            showCount={true}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {t('common.encode')}
            </Button>
            <Button type="primary" onClick={doDecode}>
              {t('common.decode')}
            </Button>
            <Button onClick={doExchange}>{t('common.swap')}</Button>
          </Space>
        </Form.Item>
        <CopyableTextArea
          value={output}
          rows={6}
          placeholder={t('encryption.outputPlaceholder')}
          showCount={true}
        />
      </Form>
    </>
  );
};

const RSAForm: React.FC = () => {
  const { t } = useTranslation();
  const [output, setOutput] = useState('');
  const [form] = Form.useForm();

  function generateRSAKey() {
    const bitCount = Number(form.getFieldValue('bitCount')) || 1024;
    const format = form.getFieldValue('format') || 'PKCS#1';

    try {
      const encryptor = new JSEncrypt({
        default_key_size: String(bitCount),
      });
      const rsaKey = encryptor.getKey();
      const privateKey = rsaKey.getPrivateKey();

      form.setFieldValue('publicKey', rsaKey.getPublicKey());
      form.setFieldValue(
        'privateKey',
        format === 'PKCS#8' ? toPkcs8PrivateKey(privateKey) : privateKey
      );
    } catch (e) {
      console.error('generate RSA key fail', e);
      message.error(t('encryption.rsa.generateFailed'));
    }
  }

  function doEncrypt() {
    form
      .validateFields()
      .then(values => {
        if (!values.publicKey?.trim()) {
          message.error(t('encryption.rsa.publicKeyRequired'));
          return;
        }

        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(values.publicKey);
        const encryptedData = encryptor.encrypt(values.input);
        if (!encryptedData) {
          setOutput('');
          message.error(t('encryption.rsa.encryptDetail'));
          return;
        }
        setOutput(encryptedData);
      })
      .catch(err => {
        console.log('RSA encrypt fail', err);
        message.error(t('encryption.rsa.encryptFailed'));
      });
  }

  function doDecrypt() {
    form
      .validateFields()
      .then(values => {
        if (!values.privateKey?.trim()) {
          message.error(t('encryption.rsa.privateKeyRequired'));
          return;
        }

        const encryptor = new JSEncrypt();
        encryptor.setPrivateKey(values.privateKey);
        const decryptedData = encryptor.decrypt(values.input);
        if (!decryptedData) {
          setOutput('');
          message.error(t('encryption.rsa.decryptDetail'));
          return;
        }
        setOutput(decryptedData);
      })
      .catch(err => {
        console.log('RSA decrypt fail', err);
        message.error(t('encryption.rsa.decryptFailed'));
      });
  }

  function doExchange() {
    const input = form.getFieldsValue()['input'] as string | undefined;
    form.setFieldValue('input', output);
    setOutput(input ?? '');
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
          <Form.Item name="bitCount" label={t('encryption.rsa.keyBits')}>
            <Select
              options={[512, 1024, 2048, 4096].map(bit => ({
                label: bit + ' bits',
                value: bit,
              }))}
            />
          </Form.Item>
          <Form.Item name="format" label={t('encryption.rsa.keyFormat')}>
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
            <Button
              style={{ borderColor: 'green', color: 'green' }}
              onClick={generateRSAKey}>
              {t('encryption.rsa.generateKey')}
            </Button>
          </Form.Item>
        </Space>
        <Flex>
          <Form.Item
            name="publicKey"
            label={t('encryption.rsa.publicKey')}
            style={{ flex: 1 }}>
            <CopyableTextArea
              rows={6}
              placeholder={t('encryption.rsa.publicKeyPlaceholder')}
            />
          </Form.Item>
          <Form.Item
            name="privateKey"
            label={t('encryption.rsa.privateKey')}
            style={{ flex: 1 }}>
            <CopyableTextArea
              rows={6}
              placeholder={t('encryption.rsa.privateKeyPlaceholder')}
            />
          </Form.Item>
        </Flex>
        <Form.Item
          name="input"
          rules={[
            {
              required: true,
              message: t('encryption.rsa.required'),
            },
          ]}>
          <CopyableTextArea
            allowClear={true}
            rows={7}
            placeholder={t('encryption.rsa.placeholder')}
            showCount={true}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {t('encryption.rsa.encrypt')}
            </Button>
            <Button type="primary" onClick={doDecrypt}>
              {t('encryption.rsa.decrypt')}
            </Button>
            <Button onClick={doExchange}>{t('common.swap')}</Button>
          </Space>
        </Form.Item>
        <CopyableTextArea
          value={output}
          rows={7}
          placeholder={t('encryption.outputPlaceholder')}
          showCount={true}
        />
      </Form>
    </>
  );
};

const EncryptionTabs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Tabs
        type="card"
        items={[
          {
            key: 'md5_tab',
            label: t('encryption.tabs.md5'),
            children: <MD5Form />,
          },
          {
            key: 'sha256_tab',
            label: t('encryption.tabs.sha256'),
            children: <SHA256Form />,
          },
          {
            key: 'base64_tab',
            label: t('encryption.tabs.base64'),
            children: <Base64Form />,
          },
          {
            key: 'rsa_tab',
            label: t('encryption.tabs.rsa'),
            children: <RSAForm />,
          },
        ]}
      />
    </>
  );
};

export default EncryptionTabs;
