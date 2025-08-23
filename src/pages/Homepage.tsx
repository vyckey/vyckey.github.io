import React, { useState, useEffect } from 'react';
import { Button, Typography, Layout, Menu } from 'antd';
import {
  GithubOutlined,
  MailOutlined,
  HomeOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Header, Footer, Content } = Layout;

function Homepage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const menuItems = [
    {
      key: 'home',
      label: 'HomePage',
      icon: <HomeOutlined />,
    },
    {
      key: 'tools',
      label: 'Developer Tools',
      icon: <ToolOutlined />,
    },
  ];

  const onClickMenu: import('antd').MenuProps['onClick'] = (e) => {
    if (e.key === 'home') {
      navigate('/');
    } else {
      navigate(`/tools/timestamp`);
    }
  };

  return (
    <Layout className='bright-homepage'>
      {/* Navigation Bar */}
      <Header className='bright-header'>
        <div className='logo'>
          <Title level={3} style={{ color: '#1890ff', margin: 0 }}>VYCKEY</Title>
        </div>
        <Menu
          theme='light'
          mode='horizontal'
          items={menuItems}
          onClick={onClickMenu}
          selectedKeys={['home']}
          style={{ flex: 1, minWidth: 0 }}
        />
        <div className='nav-icons'>
          <Button
            type='text'
            icon={<GithubOutlined />}
            href='https://github.com/vyckey'
            target='_blank'
            className='nav-icon-button'
          />
          <Button
            type='text'
            icon={<MailOutlined />}
            href='mailto:vyckey@qq.com'
            className='nav-icon-button'
          />
        </div>
      </Header>

      {/* Main Content */}
      <Content className='bright-content'>
        <div className='terminal-container'>
          <div className='terminal-header'>
            <div className='terminal-dots'>
              <span className='dot red'></span>
              <span className='dot yellow'></span>
              <span className='dot green'></span>
            </div>
            <div className='terminal-title'>vyckey@profile: ~</div>
          </div>
          <div className='terminal-body'>
            <div className='terminal-line'>
              <span className='prompt'>vyckey@developer:~$</span>
              <span className='command'>cat about.txt</span>
            </div>
            <div className='terminal-response'>
              <p>Hello! I&apos;m a passionate Full Stack Developer and Cyber Security Enthusiast.</p>
              <p>I specialize in creating efficient, secure, and innovative web applications using modern technologies.</p>
              <p>My expertise includes React, TypeScript, Node.js, and various security practices.</p>
            </div>
            <div className='terminal-line'>
              <span className='prompt'>vyckey@developer:~$</span>
              <span className='command'>cat mission.txt</span>
            </div>
            <div className='terminal-response'>
              <p>Building secure, efficient, and innovative applications that make a positive impact on the world.</p>
            </div>
            <div className='terminal-line'>
              <span className='prompt'>vyckey@developer:~$</span>
              <span className='cursor'>_</span>
            </div>
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer className='bright-footer'>
        <div className='footer-content'>
          <Paragraph style={{ margin: 0 }}>
            © {new Date().getFullYear()} Vyckey. Building the future with code | {currentTime.toLocaleString()}
          </Paragraph>
        </div>
      </Footer>
    </Layout>
  );
}

export default Homepage;