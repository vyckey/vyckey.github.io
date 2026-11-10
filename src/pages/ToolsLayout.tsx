import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, MenuProps, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTools } from '../config/tools';

const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const ToolsLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { t } = useTranslation();
  const { menuTools } = useTools();
  const navigate = useNavigate();
  const location = useLocation();
  const isIndex =
    location.pathname === '/tools' || location.pathname === '/tools/';

  const topItems = useMemo<MenuItem[]>(
    () =>
      menuTools.map(tool => ({
        key: tool.key,
        label: tool.label,
        icon: tool.icon,
      })),
    [menuTools]
  );

  // get tab key from url path
  const getCurrentTabKey = useCallback(() => {
    if (location.pathname === '/tools' || location.pathname === '/tools/') {
      return '';
    }

    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    // check if lastPart is in topItems
    const validKeys: string[] = menuTools.map(tool => tool.key);
    return validKeys.includes(lastPart) ? lastPart : '';
  }, [location]);

  const [selectedKey, setSelectedKey] = useState<string>(getCurrentTabKey());

  useEffect(() => {
    setSelectedKey(getCurrentTabKey());
  }, [location, getCurrentTabKey]);

  const onClickMenu: MenuProps['onClick'] = e => {
    navigate(`/tools/${e.key}`);
  };

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px 0 0',
          background: colorBgContainer,
        }}>
        <Button
          type={isIndex ? 'primary' : 'text'}
          icon={<AppstoreOutlined />}
          style={{ flexShrink: 0, marginLeft: 8, marginRight: 8 }}
          onClick={() => navigate('/tools')}>
          {t('layout.allTools')}
        </Button>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={selectedKey ? [selectedKey] : []}
          style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
          items={topItems}
          onClick={onClickMenu}
        />
        <LanguageSwitcher style={{ flexShrink: 0, marginRight: 8 }} />
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
