import React from 'react';
import { AppstoreOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Result, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <LanguageSwitcher floating />
      <Result
        status="404"
        title="404"
        subTitle={t('notFound.subtitle')}
        extra={
          <Space wrap>
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}>
              {t('notFound.backHome')}
            </Button>
            <Button
              icon={<AppstoreOutlined />}
              onClick={() => navigate('/tools')}>
              {t('notFound.browseTools')}
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default NotFound;
