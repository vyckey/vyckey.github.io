import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ToolsIndex from './ToolsIndex';

function renderIndex() {
  return render(
    <MemoryRouter>
      <ToolsIndex />
    </MemoryRouter>
  );
}

describe('ToolsIndex', () => {
  it('lists every tool with category headings', () => {
    renderIndex();

    expect(screen.getByText('开发者工具箱')).toBeInTheDocument();
    expect(screen.getByText('时间日期')).toBeInTheDocument();
    expect(screen.getByText('编码与加密')).toBeInTheDocument();
    expect(screen.getByText('Markdown 预览')).toBeInTheDocument();
    expect(screen.getByText('密码生成')).toBeInTheDocument();
  });

  it('filters tools by keyword', async () => {
    const user = userEvent.setup();
    renderIndex();

    await user.type(screen.getByPlaceholderText(/搜索工具/), 'jwt');

    expect(screen.getByText('编码/解码')).toBeInTheDocument();
    expect(screen.queryByText('Markdown 预览')).not.toBeInTheDocument();
    expect(screen.queryByText('时间日期')).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    renderIndex();

    await user.type(screen.getByPlaceholderText(/搜索工具/), 'zzzz');

    expect(screen.getByText(/没有找到与/)).toBeInTheDocument();
  });
});
