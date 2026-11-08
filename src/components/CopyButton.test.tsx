import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CopyButton from './CopyButton';
import { copyText } from '../utils/clipboard';

vi.mock('../utils/clipboard', () => ({
  copyText: vi.fn(),
}));

const copyTextMock = vi.mocked(copyText);

describe('CopyButton', () => {
  beforeEach(() => {
    copyTextMock.mockReset();
    copyTextMock.mockResolvedValue(undefined);
  });

  it('copies numeric zero instead of treating it as empty', async () => {
    render(<CopyButton value={0} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      expect(copyTextMock).toHaveBeenCalledWith('0');
    });
  });

  it('does not call the clipboard for an empty value', async () => {
    render(<CopyButton value="" />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(copyTextMock).not.toHaveBeenCalled();
  });
});
