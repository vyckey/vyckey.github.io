import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EncoderDecoderTabs from './EncoderDecoder';

describe('EncoderDecoder', () => {
  it('converts case in the default tab', async () => {
    const user = userEvent.setup();
    render(<EncoderDecoderTabs />);

    await user.type(
      screen.getByPlaceholderText(/需要转换大小写的文本/),
      'Hello'
    );
    expect(screen.getByPlaceholderText('转换结果')).toHaveValue('HELLO');
  });

  it('encodes text as Base64', async () => {
    const user = userEvent.setup();
    render(<EncoderDecoderTabs />);

    await user.click(screen.getByRole('tab', { name: 'Base64' }));
    await user.type(screen.getByPlaceholderText(/需要编码的文本/), 'hello');

    expect(screen.getByPlaceholderText('输出结果')).toHaveValue('aGVsbG8=');
  });

  it('decodes a JWT', async () => {
    const user = userEvent.setup();
    render(<EncoderDecoderTabs />);

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
      'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    await user.click(screen.getByRole('tab', { name: 'JWT 解析' }));
    await user.type(screen.getByPlaceholderText(/粘贴 JWT/), token);

    expect(await screen.findByText(/alg: HS256/)).toBeInTheDocument();
    expect(screen.getByText(/"name": "John Doe"/)).toBeInTheDocument();
  });

  it('rejects an invalid hex string', async () => {
    const user = userEvent.setup();
    render(<EncoderDecoderTabs />);

    await user.click(screen.getByRole('tab', { name: 'Hex / Unicode' }));
    await user.click(screen.getByText('解码'));
    await user.type(screen.getByPlaceholderText(/请输入十六进制内容/), 'E4B');

    expect(await screen.findByText(/偶数/)).toBeInTheDocument();
  });
});
