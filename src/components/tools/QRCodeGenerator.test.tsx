import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import QRCodeGenerator from './QRCodeGenerator';

vi.mock('antd', async importOriginal => {
  const actual = await importOriginal<typeof import('antd')>();
  return {
    ...actual,
    QRCode: () => null,
  };
});

describe('QRCodeGenerator', () => {
  it('resets the form fields and preview data', async () => {
    render(<QRCodeGenerator />);

    const input = screen.getByPlaceholderText(
      '请输入文本'
    ) as HTMLTextAreaElement;

    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: '生成二维码' }));

    await waitFor(() => {
      expect(input.value).toBe('hello');
    });

    fireEvent.click(screen.getByRole('button', { name: /重\s*置/ }));

    await waitFor(() => {
      const currentInput = screen.getByPlaceholderText(
        '请输入文本'
      ) as HTMLTextAreaElement;
      expect(currentInput.value).toBe('');
    });
  });
});
