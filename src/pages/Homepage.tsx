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
    title: 'Full Stack Development',
    description:
      'Building modern web applications with clean architecture and thoughtful user experiences.',
    icon: <CodeOutlined />,
  },
  {
    number: '02',
    title: 'System Architecture',
    description:
      'Designing scalable backend systems, distributed services and reliable data architectures.',
    icon: <ApiOutlined />,
  },
  {
    number: '03',
    title: 'Cyber Security',
    description:
      'Exploring application security, authentication, privacy and secure software engineering.',
    icon: <SafetyCertificateOutlined />,
  },
];

function Homepage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'home',
      label: 'Home',
      icon: <HomeOutlined />,
    },
    {
      key: 'tools',
      label: 'Developer Tools',
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
                DEVELOPER · BUILDER · EXPLORER
              </div>

              <Title className="hero-title">
                Hello, I'm <span>Vyckey.</span>
                <br />
                I build things
                <br />
                <span className="accent-text">for the web.</span>
              </Title>

              <Paragraph className="hero-description">
                Full Stack Developer passionate about software engineering,
                system architecture and cybersecurity. I enjoy turning complex
                ideas into elegant solutions.
              </Paragraph>

              <Space size={12} className="hero-actions">
                <Button
                  type="primary"
                  size="large"
                  className="primary-action"
                  href="https://github.com/vyckey"
                  target="_blank"
                  rel="noopener noreferrer">
                  Explore my work
                  <ExportOutlined />
                </Button>

                <Button
                  size="large"
                  className="secondary-action"
                  href="mailto:vyckey@qq.com">
                  Get in touch
                </Button>
              </Space>

              <div className="hero-meta">
                <span>Based on curiosity.</span>
                <span className="meta-divider" />
                <span>Driven by engineering.</span>
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
                <span>about.me — zsh</span>
                <span className="terminal-language">EN</span>
              </div>

              <div className="terminal-content">
                <div className="terminal-command">
                  <span>➜</span>
                  <span> whoami</span>
                </div>
                <div className="terminal-output">
                  Vyckey
                  <br />
                  Full Stack Developer
                </div>

                <div className="terminal-command">
                  <span>➜</span>
                  <span> cat interests.txt</span>
                </div>
                <div className="terminal-output">
                  Software Engineering
                  <br />
                  System Architecture
                  <br />
                  Application Security
                </div>

                <div className="terminal-command">
                  <span>➜</span>
                  <span> echo $MISSION</span>
                </div>
                <div className="terminal-output">
                  Build something meaningful.
                </div>

                <div className="terminal-command terminal-last">
                  <span>➜</span>
                  <span className="terminal-cursor">_</span>
                </div>
              </div>

              <div className="terminal-footer">
                <span>USER: VYCKEY</span>
                <span>SESSION: ACTIVE</span>
              </div>
            </div>
          </section>

          {/* About & Expertise */}
          <section className="section-block">
            <div className="section-heading">
              <div>
                <Text className="section-index">01 / WHAT I DO</Text>
                <Title level={2}>Curiosity drives creation.</Title>
              </div>
              <Paragraph>
                Exploring technologies, solving problems and building things
                that matter.
              </Paragraph>
            </div>

            <div className="expertise-grid">
              {expertise.map(item => (
                <article className="expertise-card" key={item.number}>
                  <div className="expertise-top">
                    <span>{item.number}</span>
                    <span className="expertise-icon">{item.icon}</span>
                  </div>

                  <Title level={4}>{item.title}</Title>
                  <Paragraph>{item.description}</Paragraph>
                  <div className="card-bottom-line" />
                </article>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="section-block tech-section">
            <div className="section-heading">
              <div>
                <Text className="section-index">02 / TECHNOLOGIES</Text>
                <Title level={2}>Tools I work with.</Title>
              </div>
              <Paragraph>
                A collection of technologies I use to bring ideas to life.
              </Paragraph>
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
            <Text className="section-index">03 / LET'S CONNECT</Text>
            <Title level={2}>Have an interesting idea?</Title>
            <Paragraph>
              I'm always interested in exchanging ideas, exploring technology
              and building something new.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              href="mailto:vyckey@qq.com"
              className="primary-action">
              Say hello <ExportOutlined />
            </Button>
          </section>
        </div>
      </Content>

      <Footer className="profile-footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} VYCKEY</span>
          <span>BUILDING THE FUTURE WITH CODE.</span>
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
