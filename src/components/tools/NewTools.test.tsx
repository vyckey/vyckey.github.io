import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../../i18n';
import UuidGenerator from './UuidGenerator';
import ColorTool from './ColorTool';
import CidrTool from './CidrTool';
import UrlTool from './UrlTool';
import FileHashTool from './FileHashTool';
import DateCalcTool from './DateCalcTool';
import TotpTool from './TotpTool';
import TextTools from './TextTools';
import ReferenceTool from './ReferenceTool';
import EncryptionTabs from './Encryption';
import ImageTool from './ImageTool';
import ConverterTool from './ConverterTool';
import CssTool from './CssTool';

describe('new tools render', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh-CN');
  });

  it('renders the UUID generator', () => {
    render(<UuidGenerator />);
    expect(screen.getByRole('button', { name: /生\s*成/ })).toBeInTheDocument();
    expect(screen.getByText('UUID v4')).toBeInTheDocument();
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toMatch(
      /^[0-9a-f-]{36}/
    );
  });

  it('renders the color tool', () => {
    render(<ColorTool />);
    expect(screen.getByText('WCAG 对比度检测')).toBeInTheDocument();
    expect(screen.getByText('色阶与互补色')).toBeInTheDocument();
  });

  it('renders the CIDR calculator with a default result', () => {
    render(<CidrTool />);
    expect(screen.getByText('网络地址')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.0')).toBeInTheDocument();
  });

  it('renders the URL parser', () => {
    render(<UrlTool />);
    expect(screen.getByRole('button', { name: /解\s*析/ })).toBeInTheDocument();
    expect(screen.getByText('查询参数')).toBeInTheDocument();
  });

  it('renders the file hash tool', () => {
    render(<FileHashTool />);
    expect(
      screen.getByText('拖拽文件到这里，或点击选择文件')
    ).toBeInTheDocument();
  });

  it('renders the date calculator', () => {
    render(<DateCalcTool />);
    expect(screen.getByText('日期间隔')).toBeInTheDocument();
    expect(screen.getByText('相差天数')).toBeInTheDocument();
  });

  it('renders a TOTP code', () => {
    render(<TotpTool />);
    expect(screen.getByText('当前动态验证码')).toBeInTheDocument();
    expect(
      screen.getByText(/^[0-9]{6}$/, { selector: 'h1' })
    ).toBeInTheDocument();
  });

  it('renders the text stats tool', () => {
    render(<TextTools />);
    expect(screen.getByText('字符数')).toBeInTheDocument();
    expect(screen.getByText('UTF-8 字节')).toBeInTheDocument();
  });

  it('renders the reference tables', () => {
    render(<ReferenceTool />);
    expect(screen.getByText('HTTP 状态码')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('opens the AES tab in the encryption tool', async () => {
    const user = userEvent.setup();
    render(<EncryptionTabs />);

    await user.click(screen.getByRole('tab', { name: 'AES加密/解密' }));
    expect(
      await screen.findByPlaceholderText('请输入需要加密或解密的文本')
    ).toBeInTheDocument();
  });

  it('renders the image toolkit', () => {
    render(<ImageTool />);
    expect(
      screen.getByText('拖拽图片到这里，或点击选择文件')
    ).toBeInTheDocument();
    expect(screen.getByText('Base64')).toBeInTheDocument();
  });

  it('renders the data converter with a sample output', () => {
    render(<ConverterTool />);
    expect(screen.getByText('格式转换')).toBeInTheDocument();
    expect(screen.getByText('YAML')).toBeInTheDocument();
  });

  it('renders the CSS generator', () => {
    render(<CssTool />);
    expect(screen.getByText('实时预览')).toBeInTheDocument();
    expect(
      screen.getByText(
        'background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);'
      )
    ).toBeInTheDocument();
  });
});
