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
    setPassword(newPassword);
    setStrength(10);
  }

  function copyPassword() {
    navigator.clipboard
      .writeText(password)
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
          <Input allowClear placeholder="建议使用网站名，比如weixin,taobao,zhihu" />
        </Form.Item>
        <Flex gap="large">
          <Form.Item name="length" label="密码长度">
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
            style={{ backgroundColor: '#00b4f4' }}
            onClick={copyPassword}>
            复制密码
          </Button>
        </Space.Compact>
        <div>
          <Progress
            style={{ marginTop: 15 }}
            showInfo={false}
            status={strength === 0 ? 'exception' : undefined}
            strokeColor="#e7e7e7"
            percent={40}
          />
        </div>
      </Form>
    </div>
  );
}
