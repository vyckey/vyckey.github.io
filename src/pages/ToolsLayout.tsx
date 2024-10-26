import React, { useEffect } from 'react';
import {
  ClockCircleOutlined,
  DiffOutlined,
  CodeOutlined,
  LockOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, MenuProps, theme } from 'antd';
// import '../layout.css';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const topItems: MenuItem[] = [
  {
    key: 'timestamp',
    label: '时间戳',
    icon: <ClockCircleOutlined />,
  },
  {
    key: 'timer',
    label: '计时器',
    icon: <ClockCircleOutlined />,
  },
  {
    key: 'textdiff',
    label: '文本对比',
    icon: <DiffOutlined />,
  },
  {
    key: 'encryption',
    label: '加密/解密',
    icon: <LockOutlined />,
  },
  {
    key: 'json',
    label: 'JSON',
    icon: <CodeOutlined />,
  },
  {
    key: 'qrcode',
    label: '二维码生成',
    icon: <QrcodeOutlined />,
  },
];

const ToolsLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  useEffect(() => {
    navigate('timestamp');
  }, [navigate]);

  const onClickMenu: MenuProps['onClick'] = e => {
    console.log('click ', e);
    // const path = e.keyPath.reverse().join('/')
    navigate(e.keyPath[0]);
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['timestamp']}
          style={{ flex: 1, minWidth: 0 }}
          items={topItems}
          onClick={onClickMenu}
        />
      </Header>
      <Layout>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 800,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            textAlign: 'left',
          }}>
          {/* 渲染当前激活的路由组件 */}
          <Outlet />
        </Content>
      </Layout>

      <Footer style={{ textAlign: 'center' }}>
        Developer Tools ©{new Date().getFullYear()} Created by Vyckey
      </Footer>
    </Layout>
  );
};

export default ToolsLayout;
