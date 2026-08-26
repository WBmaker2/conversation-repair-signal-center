import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { axe } from 'jest-axe';
import { App } from './App';
import { renderMissionAtPhase } from '../test/missionHarness';

afterEach(cleanup);

function renderAppAtPhase(phase: 'center' | 'observe' | 'repair' | 'response' | 'confirm' | 'record') {
  if (phase === 'center') return render(<App />);
  return renderMissionAtPhase('g34-classroom-box', phase);
}

describe('responsive accessibility contract', () => {
  it.each(['center', 'observe', 'repair', 'response', 'confirm', 'record'] as const)('has no axe violations in %s', async (phase) => {
    const { container } = renderAppAtPhase(phase);
    const result = await axe(container);
    expect(result.violations).toHaveLength(0);
  });

  it('starts with exactly one skip link, main landmark, service heading, and phase heading', () => {
    render(<App />);
    expect(screen.getAllByRole('link', { name: '본문으로 건너뛰기' })).toHaveLength(1);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0);
    expect(document.documentElement).toHaveAttribute('lang', 'ko');
  });

  it('keeps choice labels as full-size surfaces and only one current pulse', () => {
    renderMissionAtPhase('g34-classroom-box', 'observe');
    expect(document.querySelectorAll('.choice-label')).toHaveLength(3);
    expect(document.querySelectorAll('.gi-pulse')).toHaveLength(1);
    expect(screen.getByRole('button', { name: '모호한 부분 찾기' })).toHaveClass('gi-pulse');
  });
});
