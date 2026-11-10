import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../../i18n';
import PasswordGenerator from './PasswordGenerator';

describe('PasswordGenerator i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh-CN');
  });

  it('renders Chinese copy by default', () => {
    render(<PasswordGenerator />);

    expect(screen.getByText('密码生成器')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('请输入你的记忆密码')
    ).toBeInTheDocument();
  });

  it('switches every label to English', async () => {
    const user = userEvent.setup();
    render(<PasswordGenerator />);

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('English'));

    expect(await screen.findByText('Password Generator')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Generate password' })
    ).toBeInTheDocument();
    expect(screen.getByText('Master password')).toBeInTheDocument();
  });
});
