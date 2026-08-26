import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import { axe } from 'jest-axe';
import { App, InvalidMissionFallback } from './App';
import { getMissionById, getMissionsByGradeBand } from '../content/missionRepository';
import { renderMissionAtPhase } from '../test/missionHarness';
import '../styles/index.css';
const baseCss = readFileSync('src/styles/base.css', 'utf8');
const layoutCss = readFileSync('src/styles/layout.css', 'utf8');
const motionCss = readFileSync('src/styles/motion.css', 'utf8');

afterEach(cleanup);

type Phase = 'center' | 'observe' | 'repair' | 'response' | 'confirm' | 'record';
const phaseHeadings: Record<Phase, string> = {
  center: '오늘의 전략',
  observe: '대화 관측',
  repair: '수리 송신',
  response: '응답 수신',
  confirm: '확인 통화',
  record: '통신 기록',
};

function renderAppAtPhase(phase: Phase) {
  if (phase === 'center') return render(<App />);
  return renderMissionAtPhase('g34-classroom-box', phase);
}

function assertMainContract(container: HTMLElement, phase: Phase) {
  expect(container.querySelectorAll('.skip-link')).toHaveLength(1);
  expect(container.querySelectorAll('main#main-content[tabindex="-1"]')).toHaveLength(1);
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: phaseHeadings[phase], level: 2 })).toBeVisible();
  const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const labelled of container.querySelectorAll<HTMLElement>('[aria-labelledby]')) {
    for (const id of labelled.getAttribute('aria-labelledby')!.split(/\s+/)) {
      expect(container.querySelector(`#${CSS.escape(id)}`)?.textContent?.trim()).toBeTruthy();
    }
  }
}

describe('responsive accessibility contract', () => {
  it.each(['center', 'observe', 'repair', 'response', 'confirm', 'record'] as const)('has no axe violations in %s', async (phase) => {
    const { container } = renderAppAtPhase(phase);
    expect((await axe(container)).violations).toHaveLength(0);
    assertMainContract(container, phase);
    expect(document.documentElement).toHaveAttribute('lang', 'ko');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('keeps the skip link as the first keyboard target on center', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(document.activeElement).not.toBe(screen.getByRole('heading', { name: '대화 수리 신호센터' }));
    await user.tab();
    expect(screen.getByRole('link', { name: '본문으로 건너뛰기' })).toHaveFocus();
  });

  it('renders the complete five-mission order for each grade', async () => {
    const user = userEvent.setup();
    render(<App />);
    for (const band of ['3-4', '5-6'] as const) {
      if (band === '5-6') await user.click(screen.getByRole('button', { name: '5~6학년' }));
      const titles = getMissionsByGradeBand(band).map((mission) => mission.titleKo);
      const missionList = screen.getByRole('heading', { name: '미션 선택' }).closest('section');
      expect([...missionList!.querySelectorAll('h3')].map((heading) => heading.textContent)).toEqual(titles);
      if (band === '3-4') await user.click(screen.getByRole('button', { name: '5~6학년' }));
    }
  });

  it('uses all choice groups, labels, live status, details, and language metadata', () => {
    for (const phase of ['observe', 'repair', 'response', 'confirm'] as const) {
      renderAppAtPhase(phase);
      expect(document.querySelectorAll('fieldset')).toHaveLength(1);
      expect(document.querySelectorAll('legend')).toHaveLength(1);
      expect(document.querySelectorAll('.choice-label')).toHaveLength(3);
      expect(screen.getByRole('status')).toHaveAttribute('lang', 'ko');
      expect(document.querySelectorAll('[lang="en"]').length).toBeGreaterThan(0);
      cleanup();
    }
    const record = renderAppAtPhase('record');
    expect(record.container.querySelector('details')).toBeInTheDocument();
  });

  it('focuses headings only on phase changes and retains same-phase control focus', async () => {
    const user = userEvent.setup();
    render(<App />);
    const mission = getMissionById('g34-classroom-box');
    await user.click(screen.getByRole('button', { name: `${mission.titleKo} 미션 시작` }));
    expect(screen.getByRole('heading', { name: '대화 관측' })).toHaveFocus();
    const retry = screen.getByRole('radio', { name: 'the crayons' });
    await user.click(retry);
    expect(retry).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '모호한 부분 찾기' }));
    expect(screen.getByRole('heading', { name: '대화 관측' })).toBeVisible();
    expect(screen.getByRole('button', { name: '모호한 부분 찾기' })).toHaveFocus();
    await user.click(screen.getByRole('radio', { name: 'that box' }));
    await user.click(screen.getByRole('button', { name: '모호한 부분 찾기' }));
    expect(screen.getByRole('heading', { name: '수리 송신' })).toHaveFocus();
  });

  it('completes a canonical mission and focuses service heading after center return', async () => {
    const user = userEvent.setup();
    render(<App />);
    const mission = getMissionById('g34-classroom-box');
    await user.click(screen.getByRole('button', { name: `${mission.titleKo} 미션 시작` }));
    await user.click(screen.getByRole('radio', { name: 'that box' }));
    await user.click(screen.getByRole('button', { name: '모호한 부분 찾기' }));
    await user.click(screen.getByRole('radio', { name: 'Which box?' }));
    await user.click(screen.getByRole('button', { name: '수리 표현 보내기' }));
    await user.click(screen.getByRole('radio', { name: '창가에 있는 파란 상자' }));
    await user.click(screen.getByRole('button', { name: '이해한 뜻 확인하기' }));
    const confirmation = mission.confirmationOptions.find((option) => option.accepted)!;
    await user.click(screen.getByRole('radio', { name: confirmation.textEn }));
    await user.click(screen.getByRole('button', { name: '확인 질문 보내기' }));
    await user.click(screen.getByRole('button', { name: '신호센터로 돌아가기' }));
    expect(screen.getByRole('heading', { name: '대화 수리 신호센터' })).toHaveFocus();
    expect(screen.queryByRole('heading', { name: '통신 기록' })).not.toBeInTheDocument();
  });

  it('focus-manages and recovers the invalid mission fallback', () => {
    render(<InvalidMissionFallback onReturnCenter={() => undefined} />);
    expect(screen.getByRole('heading', { name: '대화 수리 신호센터' })).toHaveFocus();
    expect(screen.getAllByRole('link', { name: '본문으로 건너뛰기' })).toHaveLength(1);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('button', { name: '신호센터로 돌아가기' })).toBeVisible();
  });

  it('enforces the responsive and reduced-motion CSS contracts', () => {
    expect(layoutCss).toContain('@media (max-width: 640px)');
    expect(layoutCss).toContain('grid-template-columns: 1fr');
    expect(baseCss).toContain('min-block-size: 44px');
    expect(baseCss).not.toMatch(/(?:^|\s)(?:min-)?height\s*:/m);
    expect(baseCss).toContain('outline: 3px solid');
    expect(motionCss).toContain('.gi-pulse:not(:disabled)');
    expect(motionCss).toContain('animation: none');
    expect(motionCss).toContain('transition-duration: 0.01ms');
    expect(motionCss).toContain('scroll-behavior: auto');
    expect(motionCss).toContain('outline: 3px solid var(--color-signal)');
    expect(motionCss).toContain('border-inline-start: 4px solid var(--color-signal)');
    render(<App />);
    const minBlockSize = getComputedStyle(screen.getByRole('button', { name: '3~4학년' })).minBlockSize;
    if (minBlockSize) expect(minBlockSize).toBe('44px');
  });

  it('keeps the sequential pulse contract through disabled, retry, acceptance, and record', async () => {
    const user = userEvent.setup();
    const observe = renderAppAtPhase('observe');
    const observeAction = screen.getByRole('button', { name: '모호한 부분 찾기' });
    expect(document.querySelectorAll('.gi-pulse')).toHaveLength(1);
    expect(observeAction).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'the crayons' }));
    expect(observeAction).toBeEnabled();
    await user.click(observeAction);
    expect(screen.getByRole('button', { name: '모호한 부분 찾기' })).toHaveClass('gi-pulse');
    await user.click(screen.getByRole('radio', { name: 'that box' }));
    await user.click(screen.getByRole('button', { name: '모호한 부분 찾기' }));
    expect(document.querySelectorAll('.gi-pulse')).toHaveLength(0);
    observe.unmount();
    renderAppAtPhase('confirm');
    expect(document.querySelectorAll('.gi-pulse')).toHaveLength(1);
    cleanup();
    renderAppAtPhase('record');
    expect(document.querySelectorAll('.gi-pulse')).toHaveLength(0);
  });
});
