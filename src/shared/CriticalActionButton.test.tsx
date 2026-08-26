import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CriticalActionButton } from './CriticalActionButton';

describe('CriticalActionButton', () => {
  it.each([
    ['find-ambiguity', '모호한 부분 찾기'],
    ['send-confirmation', '확인 질문 보내기'],
  ] as const)('renders only the required pulse action: %s', (action, label) => {
    render(<CriticalActionButton action={action} />);
    expect(screen.getByRole('button', { name: label })).toHaveClass('gi-pulse');
  });

  it('keeps the pulse hook while disabled so CSS can suppress animation', () => {
    render(<CriticalActionButton action="find-ambiguity" disabled />);
    expect(screen.getByRole('button', { name: '모호한 부분 찾기' })).toHaveClass('gi-pulse');
  });

  it('keeps the action union and button label controlled by the action literal', () => {
    render(<CriticalActionButton action="send-confirmation">caller text</CriticalActionButton>);
    const button = screen.getByRole('button', { name: '확인 질문 보내기' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toHaveTextContent('caller text');
  });
});
