import React from 'react';
import { LockOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Layout, Menu, MenuProps, theme } from 'antd';
// import '../layout.css';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const topItems: MenuItem[] = [
  {
    key: 'encryption',
    label: '加密/解密',
    icon: <LockOutlined />,
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
          defaultSelectedKeys={['2']}
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
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          {/* 渲染当前激活的路由组件 */}
          <Outlet />
        </Content>
      </Layout>

      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default ToolsLayout;
