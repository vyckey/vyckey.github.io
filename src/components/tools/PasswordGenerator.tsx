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
import { hashPassword, generatePassword } from '../../util/password';
import { calculatePasswordStrength } from '../../utils/passwordStrength';
import { copyText } from '../../utils/clipboard';
import '../../index.css';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  interface FormData {
    password: string;
    code: string;
    length: number;
    punctuation: boolean;
    capital: boolean;
  }

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
      message.error('生成失败，请调整密码长度或字符选项');
      return;
    }

    setPassword(newPassword);
    setStrength(calculatePasswordStrength(newPassword));
  }

  function copyPassword() {
    if (!password) {
      message.warning('请先生成密码');
      return;
    }

    copyText(password)
      .then(() => message.success('复制成功'))
      .catch(() => message.error('复制失败'));
  }

  return (
    <div className="form-container">
      <Title level={3} style={{ textAlign: 'center' }}>
        密码生成器
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
          label="记忆密码"
          required
          rules={[{ required: true, message: '请输入记忆密码!' }]}>
          <Input.Password placeholder="请输入你的记忆密码" />
        </Form.Item>
        <Form.Item
          name="code"
          label="区分代码"
          required
          rules={[
            { required: true, message: '请输入区分代码' },
            { min: 3, message: '区分代码过短!' },
          ]}>
          <Input
            allowClear
            placeholder="建议使用网站名，比如weixin,taobao,zhihu"
          />
        </Form.Item>
        <Flex gap="large">
          <Form.Item
            name="length"
            label="密码长度"
            rules={[{ required: true, message: '请输入密码长度' }]}>
            <InputNumber min={8} max={30} />
          </Form.Item>
          <Form.Item name="capital" label="大小写">
            <Switch
              checkedChildren="大写"
              unCheckedChildren="小写"
              defaultChecked
            />
          </Form.Item>
          <Form.Item name="punctuation" label="标点符号">
            <Switch
              checkedChildren="包含"
              unCheckedChildren="不包含"
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
            生成密码
          </Button>
        </Form.Item>
        <Space.Compact style={{ width: '100%' }}>
          <Input value={password} placeholder="请点击生成密码按钮" />
          <Button
            type="primary"
            style={{ backgroundColor: '#3498db' }}
            onClick={copyPassword}>
            复制密码
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
