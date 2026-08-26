import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../../app/App';
import '../../styles/index.css';

describe('update history dialog', () => {
  it('opens, focuses the title, and restores trigger focus on Escape', async () => {
    const user = userEvent.setup();
    render(<App />);
    const trigger = screen.getByRole('button', { name: '업데이트 내역' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: '업데이트 내역' });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'update-history-title');
    expect(screen.getByRole('heading', { name: '업데이트 내역' })).toHaveFocus();
    expect(document.querySelector('main')).toHaveAttribute('inert');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes with the close button and lists dated records', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '업데이트 내역' }));
    expect(screen.getByText('최초 설계 문서를 작성했습니다.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '업데이트 내역 닫기' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
