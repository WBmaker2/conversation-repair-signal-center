import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PhaseProgress } from './PhaseProgress';

describe('PhaseProgress', () => {
  it('shows four semantic steps and marks the current step with aria-current', () => {
    render(<PhaseProgress phase="response" onBack={vi.fn()} />);
    expect(screen.getByRole('list')).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('3/4');
    expect(screen.getByRole('button', { name: '이전 단계 보기' })).toBeVisible();
  });

  it('does not offer a previous action on the first step', () => {
    render(<PhaseProgress phase="observe" />);
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('1/4');
    expect(screen.queryByRole('button', { name: '이전 단계 보기' })).not.toBeInTheDocument();
  });

  it('calls back only when the previous action is activated', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<PhaseProgress phase="confirm" onBack={onBack} />);
    await user.click(screen.getByRole('button', { name: '이전 단계 보기' }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
