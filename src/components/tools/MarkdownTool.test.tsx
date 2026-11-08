import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarkdownTool from './MarkdownTool';

describe('MarkdownTool', () => {
  it('renders the sample markdown as HTML', () => {
    render(<MarkdownTool />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Markdown 预览' })
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('updates the preview while typing', async () => {
    const user = userEvent.setup();
    render(<MarkdownTool />);

    const editor = screen.getByPlaceholderText('# 在这里输入 Markdown');
    await user.clear(editor);
    await user.type(editor, '# Hello');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Hello' })
    ).toBeInTheDocument();
  });
});
