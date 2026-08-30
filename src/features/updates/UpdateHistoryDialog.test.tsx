import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../../app/App';
import { UpdateHistoryDialog } from './UpdateHistoryDialog';
import { CHANGELOG } from '../../content/changelog';
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
    expect(document.querySelector('.app-background')).toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: '업데이트 내역' })).toHaveAttribute('inert');
    const outsideTargets = [
      screen.getByRole('link', { name: '본문으로 건너뛰기' }),
      document.querySelector('main'),
      screen.getByRole('button', { name: '업데이트 내역' }),
    ];
    await user.tab();
    expect(screen.getByRole('button', { name: '업데이트 내역 닫기' })).toHaveFocus();
    expect(outsideTargets).not.toContain(document.activeElement);
    await user.tab();
    expect(screen.getByRole('heading', { name: '업데이트 내역' })).toHaveFocus();
    expect(outsideTargets).not.toContain(document.activeElement);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.querySelector('.app-background')).not.toHaveAttribute('inert');
  });

  it('closes with the close button and lists dated records', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '업데이트 내역' }));
    expect(screen.getByText('최초 설계 문서를 작성했습니다.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '업데이트 내역 닫기' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('cleans up Escape listeners when StrictMode re-runs effects', async () => {
    const onClose = vi.fn();
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const view = render(<StrictMode><UpdateHistoryDialog records={CHANGELOG} onClose={onClose} /></StrictMode>);
    try {
      const added = addSpy.mock.calls.filter(([type]) => type === 'keydown');
      expect(added).toHaveLength(2);
      await userEvent.setup().keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledOnce();
    } finally {
      view.unmount();
      const removed = removeSpy.mock.calls.filter(([type]) => type === 'keydown');
      expect(removed).toHaveLength(2);
      addSpy.mockRestore();
      removeSpy.mockRestore();
    }
  });

  it('keeps repeated date and category records free of duplicate React keys', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      render(<UpdateHistoryDialog records={CHANGELOG} onClose={() => undefined} />);
      const warnings = consoleError.mock.calls.flat().join(' ');
      expect(warnings).not.toMatch(/same key|unique "key"/i);
    } finally {
      consoleError.mockRestore();
    }
  });

  it('keeps the same update trigger available throughout a mission phase', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '어느 상자 미션 시작' }));
    const trigger = screen.getByRole('button', { name: '업데이트 내역' });
    expect(trigger).toBeVisible();
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: '업데이트 내역' })).toBeVisible();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });
});
