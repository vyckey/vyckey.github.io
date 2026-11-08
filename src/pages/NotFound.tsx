import React from 'react';
import { AppstoreOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Result, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 24,
        background: '#f0f2f5',
      }}>
      <Result
        status="404"
        title="404"
        subTitle="页面不存在，或者链接已经失效"
        extra={
          <Space wrap>
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}>
              返回首页
            </Button>
            <Button
              icon={<AppstoreOutlined />}
              onClick={() => navigate('/tools')}>
              浏览全部工具
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default NotFound;
