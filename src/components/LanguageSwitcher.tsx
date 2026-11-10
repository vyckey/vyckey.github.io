import React from 'react';
import { GlobalOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { languages, resolveLanguage } from '../i18n';

interface LanguageSwitcherProps {
  /** Pin the switcher to the top-right corner, for pages without a header. */
  floating?: boolean;
  style?: React.CSSProperties;
}

const floatingStyle: React.CSSProperties = {
  position: 'fixed',
  top: 16,
  right: 20,
  zIndex: 10,
  width: 116,
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  floating = false,
  style,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Select
      className="language-switcher"
      size="small"
      variant={floating ? 'outlined' : 'borderless'}
      aria-label={t('language.label')}
      value={resolveLanguage(i18n.language)}
      prefix={<GlobalOutlined />}
      popupMatchSelectWidth={false}
      options={languages.map(item => ({
        label: item.label,
        value: item.value,
      }))}
      style={{ width: 104, ...(floating ? floatingStyle : null), ...style }}
      onChange={language => {
        void i18n.changeLanguage(language);
      }}
    />
  );
};

export default LanguageSwitcher;
