import React from 'react';
import { Layout, Menu, Button, Tag, Space, Typography } from 'antd';
import {
  GithubOutlined,
  MailOutlined,
  HomeOutlined,
  ToolOutlined,
  ExportOutlined,
  CodeOutlined,
  SafetyCertificateOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import '../App.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const techStack = [
  'React',
  'TypeScript',
  'Node.js',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'Redis',
  'Docker',
];

const expertise = [
  {
    number: '01',
    titleKey: 'homepage.expertise.fullStack.title',
    descriptionKey: 'homepage.expertise.fullStack.description',
    icon: <CodeOutlined />,
  },
  {
    number: '02',
    titleKey: 'homepage.expertise.architecture.title',
    descriptionKey: 'homepage.expertise.architecture.description',
    icon: <ApiOutlined />,
  },
  {
    number: '03',
    titleKey: 'homepage.expertise.security.title',
    descriptionKey: 'homepage.expertise.security.description',
    icon: <SafetyCertificateOutlined />,
  },
] as const;

function Homepage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    {
      key: 'home',
      label: t('homepage.menu.home'),
      icon: <HomeOutlined />,
    },
    {
      key: 'tools',
      label: t('homepage.menu.tools'),
      icon: <ToolOutlined />,
    },
  ];

  const onClickMenu = ({ key }: { key: string }) => {
    if (key === 'home') {
      navigate('/');
    } else if (key === 'tools') {
      navigate('/tools');
    }
  };

  return (
    <Layout className="profile-layout">
      {/* Navigation */}
      <Header className="profile-header">
        <div className="header-inner">
          <a href="/" className="brand">
            <span className="brand-mark">V</span>
            <span>VYCKEY</span>
          </a>

          <Menu
            className="profile-menu"
            mode="horizontal"
            selectedKeys={['home']}
            items={menuItems}
            onClick={onClickMenu}
          />

          <Space size={8} className="header-socials">
            <LanguageSwitcher />
            <Button
              type="text"
              icon={<GithubOutlined />}
              href="https://github.com/vyckey"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            />
            <Button
              type="text"
              icon={<MailOutlined />}
              href="mailto:vyckey@qq.com"
              aria-label="Email"
            />
          </Space>
        </div>
      </Header>

      <Content className="profile-content">
        <div className="profile-container">
          {/* Hero */}
          <section className="hero-section">
            <div className="hero-main">
              <div className="hero-eyebrow">
                <span className="status-dot" />
                {t('homepage.hero.eyebrow')}
              </div>

              <Title className="hero-title">
                {t('homepage.hero.greeting')}{' '}
                <span>{t('homepage.hero.name')}</span>
                <br />
                {t('homepage.hero.line1')}
                <br />
                <span className="accent-text">{t('homepage.hero.line2')}</span>
              </Title>

              <Paragraph className="hero-description">
                {t('homepage.hero.description')}
              </Paragraph>

              <Space size={12} className="hero-actions">
                <Button
                  type="primary"
                  size="large"
                  className="primary-action"
                  href="https://github.com/vyckey"
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('homepage.hero.exploreWork')}
                  <ExportOutlined />
                </Button>

                <Button
                  size="large"
                  className="secondary-action"
                  href="mailto:vyckey@qq.com">
                  {t('homepage.hero.getInTouch')}
                </Button>
              </Space>

              <div className="hero-meta">
                <span>{t('homepage.hero.basedOn')}</span>
                <span className="meta-divider" />
                <span>{t('homepage.hero.drivenBy')}</span>
              </div>
            </div>

            {/* Terminal */}
            <div className="terminal-card">
              <div className="terminal-topbar">
                <div className="terminal-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span>{t('homepage.terminal.window')}</span>
                <span className="terminal-language">
                  {t('homepage.terminal.language')}
                </span>
              </div>

              <div className="terminal-content">
                <div className="terminal-command">
                  <span>➜</span>
                  <span> {t('homepage.terminal.whoami')}</span>
                </div>
                <div className="terminal-output">
                  Vyckey
                  <br />
                  {t('homepage.terminal.role')}
                </div>

                <div className="terminal-command">
                  <span>➜</span>
                  <span> {t('homepage.terminal.interests')}</span>
                </div>
                <div className="terminal-output">
                  {t('homepage.terminal.interest1')}
                  <br />
                  {t('homepage.terminal.interest2')}
                  <br />
                  {t('homepage.terminal.interest3')}
                </div>

                <div className="terminal-command">
                  <span>➜</span>
                  <span> {t('homepage.terminal.mission')}</span>
                </div>
                <div className="terminal-output">
                  {t('homepage.terminal.missionOutput')}
                </div>

                <div className="terminal-command terminal-last">
                  <span>➜</span>
                  <span className="terminal-cursor">_</span>
                </div>
              </div>

              <div className="terminal-footer">
                <span>{t('homepage.terminal.user')}</span>
                <span>{t('homepage.terminal.session')}</span>
              </div>
            </div>
          </section>

          {/* About & Expertise */}
          <section className="section-block">
            <div className="section-heading">
              <div>
                <Text className="section-index">
                  {t('homepage.about.index')}
                </Text>
                <Title level={2}>{t('homepage.about.heading')}</Title>
              </div>
              <Paragraph>{t('homepage.about.intro')}</Paragraph>
            </div>

            <div className="expertise-grid">
              {expertise.map(item => (
                <article className="expertise-card" key={item.number}>
                  <div className="expertise-top">
                    <span>{item.number}</span>
                    <span className="expertise-icon">{item.icon}</span>
                  </div>

                  <Title level={4}>{t(item.titleKey)}</Title>
                  <Paragraph>{t(item.descriptionKey)}</Paragraph>
                  <div className="card-bottom-line" />
                </article>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="section-block tech-section">
            <div className="section-heading">
              <div>
                <Text className="section-index">
                  {t('homepage.tech.index')}
                </Text>
                <Title level={2}>{t('homepage.tech.heading')}</Title>
              </div>
              <Paragraph>{t('homepage.tech.intro')}</Paragraph>
            </div>

            <div className="tech-list">
              {techStack.map(tech => (
                <Tag className="tech-tag" key={tech}>
                  {tech}
                </Tag>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="contact-section">
            <Text className="section-index">{t('homepage.contact.index')}</Text>
            <Title level={2}>{t('homepage.contact.heading')}</Title>
            <Paragraph>{t('homepage.contact.description')}</Paragraph>
            <Button
              type="primary"
              size="large"
              href="mailto:vyckey@qq.com"
              className="primary-action">
              {t('homepage.contact.action')} <ExportOutlined />
            </Button>
          </section>
        </div>
      </Content>

      <Footer className="profile-footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} VYCKEY</span>
          <span>{t('homepage.footer.tagline')}</span>
          <a
            href="https://github.com/vyckey"
            target="_blank"
            rel="noopener noreferrer">
            GITHUB <ExportOutlined />
          </a>
        </div>
      </Footer>
    </Layout>
  );
}

export default Homepage;
