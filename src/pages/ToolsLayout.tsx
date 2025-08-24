import React, { useCallback, useEffect, useState } from 'react';
import {
  ClockCircleOutlined,
  DiffOutlined,
  CodeOutlined,
  FontSizeOutlined,
  LockOutlined,
  QrcodeOutlined,
  HomeOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, MenuProps, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

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
    key: 'encoder_decoder',
    label: '编码/解码',
    icon: <CodeOutlined />,
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
  {
    key: 'ipaddress',
    label: 'IP地址查询',
    icon: <HomeOutlined />,
  },
  {
    key: 'cron',
    label: 'Cron表达式',
    icon: <ScheduleOutlined />,
  },
  {
    key: 'regex',
    label: '正则表达式',
    icon: <FontSizeOutlined />,
  },
];

const ToolsLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  
  // get tab key from url path
  const getCurrentTabKey = useCallback(() => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    // check if lastPart is in topItems
    const validKeys = topItems.map(item => item!.key);
    return validKeys.includes(lastPart) ? lastPart : 'timestamp';
  }, [location]);

  const [selectedKey, setSelectedKey] = useState<string>(getCurrentTabKey());

  useEffect(() => {
    setSelectedKey(getCurrentTabKey());
  }, [location, getCurrentTabKey]);

  const onClickMenu: MenuProps['onClick'] = e => {
    console.log('click ', e);
    // const path = e.keyPath.reverse().join('/')
    navigate(e.keyPath[0]);
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 0' }}>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[selectedKey]}
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
