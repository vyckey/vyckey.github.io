import React, { useState } from 'react';
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Progress,
  Space,
  Switch,
} from 'antd';
import Title from 'antd/es/typography/Title';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import { hashPassword, generatePassword } from '../../util/password';
import { calculatePasswordStrength } from '../../utils/passwordStrength';
import { copyText } from '../../utils/clipboard';
import '../../index.css';

interface FormData {
  password: string;
  code: string;
  length: number;
  punctuation: boolean;
  capital: boolean;
}

export default function PasswordGenerator() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  function onGeneratePassword(values: FormData) {
    const hash = hashPassword(values.password, values.code);
    const newPassword = generatePassword(
      hash,
      values.length,
      values.punctuation,
      values.capital
    );

    if (!newPassword) {
      setPassword('');
      setStrength(0);
      message.error(t('password.generateFailed'));
      return;
    }

    setPassword(newPassword);
    setStrength(calculatePasswordStrength(newPassword));
  }

  function copyPassword() {
    if (!password) {
      message.warning(t('password.generateFirst'));
      return;
    }

    copyText(password)
      .then(() => message.success(t('common.copySuccess')))
      .catch(() => message.error(t('common.copyFailed')));
  }

  return (
    <div className="form-container">
      <LanguageSwitcher floating />
      <Title level={3} style={{ textAlign: 'center' }}>
        {t('password.title')}
      </Title>
      <Form<FormData>
        initialValues={{
          length: 20,
          punctuation: true,
          capital: true,
        }}
        style={{ marginLeft: 10, marginRight: 10, marginTop: 40 }}
        onFinish={onGeneratePassword}>
        <Form.Item
          name="password"
          label={t('password.memoryPassword')}
          required
          rules={[
            { required: true, message: t('password.memoryPasswordRequired') },
          ]}>
          <Input.Password
            placeholder={t('password.memoryPasswordPlaceholder')}
          />
        </Form.Item>
        <Form.Item
          name="code"
          label={t('password.code')}
          required
          rules={[
            { required: true, message: t('password.codeRequired') },
            { min: 3, message: t('password.codeTooShort') },
          ]}>
          <Input allowClear placeholder={t('password.codePlaceholder')} />
        </Form.Item>
        <Flex gap="large">
          <Form.Item
            name="length"
            label={t('password.length')}
            rules={[{ required: true, message: t('password.lengthRequired') }]}>
            <InputNumber min={8} max={30} />
          </Form.Item>
          <Form.Item name="capital" label={t('password.case')}>
            <Switch
              checkedChildren={t('password.uppercase')}
              unCheckedChildren={t('password.lowercase')}
              defaultChecked
            />
          </Form.Item>
          <Form.Item name="punctuation" label={t('password.punctuation')}>
            <Switch
              checkedChildren={t('password.include')}
              unCheckedChildren={t('password.exclude')}
              defaultChecked
            />
          </Form.Item>
        </Flex>
        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            size="large"
            style={{ backgroundColor: '#4caf50' }}>
            {t('password.generate')}
          </Button>
        </Form.Item>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={password}
            placeholder={t('password.resultPlaceholder')}
          />
          <Button
            type="primary"
            style={{ backgroundColor: '#3498db' }}
            onClick={copyPassword}>
            {t('password.copyPassword')}
          </Button>
        </Space.Compact>
        <div>
          <Progress
            style={{ marginTop: 15 }}
            showInfo={true}
            status={
              strength === 0
                ? 'exception'
                : strength >= 80
                  ? 'success'
                  : 'normal'
            }
            strokeColor={
              strength === 0
                ? '#ff4d4f'
                : strength >= 80
                  ? '#52c41a'
                  : strength >= 50
                    ? '#faad14'
                    : '#ff4d4f'
            }
            percent={strength}
          />
        </div>
      </Form>
    </div>
  );
}
