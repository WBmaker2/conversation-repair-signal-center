import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { App } from '../../app/App';
import { LanguageText } from '../../shared/LanguageText';

describe('signal center', () => {
  it('shows the five reviewed missions for each selected grade band', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getAllByRole('button', { name: /미션 시작/ })).toHaveLength(5);
    expect(screen.getByRole('button', { name: '어느 상자 미션 시작' })).toBeVisible();
    expect(screen.getByRole('button', { name: '어떤 연필 미션 시작' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '5~6학년' }));

    expect(screen.getAllByRole('button', { name: /미션 시작/ })).toHaveLength(5);
    expect(screen.getByRole('button', { name: '준비물 수량 미션 시작' })).toBeVisible();
    expect(screen.getByRole('button', { name: '행사 최종 계획 미션 시작' })).toBeVisible();
    expect(screen.getByRole('button', { name: '3~4학년' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '5~6학년' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('현재 선택: 5~6학년')).toBeVisible();
    expect(screen.getByText('먼저 해 보기').closest('article')?.querySelector('button')).toHaveClass('gi-pulse');
  });

  it('uses the mission grid and presents one recommended mission first', () => {
    render(<App />);
    const grid = document.querySelector('.mission-grid');
    expect(grid).toBeInTheDocument();
    expect(grid?.querySelector('article')).toHaveAttribute('data-recommended', 'true');
    expect(screen.getByText('먼저 해 보기')).toBeVisible();
    expect(screen.getByText('먼저 해 보기').closest('article')?.querySelector('button')).toHaveClass('gi-pulse');
  });

  it('keeps the setup and first-action order visible before strategy help', () => {
    render(<App />);
    const center = document.querySelector('.signal-center');
    const children = Array.from(center?.children ?? []);
    const indexOf = (selector: string) => children.findIndex((child) => child.matches(selector));

    expect(indexOf('header')).toBeLessThan(indexOf('section[aria-labelledby="grade-selection-heading"]'));
    expect(indexOf('section[aria-labelledby="grade-selection-heading"]')).toBeLessThan(indexOf('.audio-preference-toggle'));
    expect(indexOf('.audio-preference-toggle')).toBeLessThan(indexOf('section[aria-labelledby="mission-list-heading"]'));
    expect(document.querySelector('details')).not.toHaveAttribute('open');
  });

  it('makes the first action explicit and gives cards a shared visual contract', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '오늘의 첫 행동' })).toBeVisible();
    expect(document.querySelector('.first-action p')).toHaveTextContent('학년을 고른 뒤 어느 상자부터 시작해 보세요.');
    expect(screen.getByText('어느 상자', { selector: 'strong' })).toBeVisible();
    expect(document.querySelector('.setup-panel')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-recommended="true"]')).toHaveLength(1);
    expect(document.querySelectorAll('.mission-card')).toHaveLength(5);
    expect(document.querySelectorAll('.mission-card .gi-pulse')).toHaveLength(1);
    expect(screen.getByText('추천 미션')).toBeVisible();
  });

  it('keeps the recommended card labels in one compact row for narrow screens', () => {
    render(<App />);

    const recommended = document.querySelector('[data-recommended="true"]');
    expect(recommended?.querySelector('.mission-card-labels')).toBeInTheDocument();
    expect(recommended?.querySelector('.mission-card-labels')?.textContent).toContain('추천 미션');
    expect(recommended?.querySelector('.mission-card-labels')?.textContent).toContain('먼저 해 보기');
  });

  it('keeps the controlled voice preference and exposes the optional bundled voice', async () => {
    const user = userEvent.setup();
    render(<App />);

    const voice = screen.getByRole('checkbox', { name: /음성/ });
    expect(voice).not.toBeChecked();
    expect(screen.getByText(/음성은 선택 사항/)).toBeVisible();
    expect(screen.getByText('컴퓨터가 만든 참고 소리예요. 음성 없이도 대본으로 미션을 할 수 있어요.')).not.toBeVisible();

    await user.click(voice);
    expect(voice).toBeChecked();

    await user.click(screen.getByRole('button', { name: '5~6학년' }));
    expect(screen.getByRole('checkbox', { name: /음성/ })).toBeChecked();
  });

  it('renders the promise, strategy guidance, duration, and exact privacy notice', () => {
    render(<App />);

    expect(screen.getByText('못 알아들은 순간은 대화를 이어 가는 신호예요.')).toBeVisible();
    expect(screen.getByText('이해가 안 되면 다시 물어도 괜찮아요.')).toBeVisible();
    expect(screen.getByText('권장 학습 시간 20~30분')).toBeVisible();
    expect(screen.getByText('이름을 묻지 않으며, 새로고침하면 현재 통신 기록이 사라져요.')).toBeVisible();
    expect(screen.getByText('전략 도움말')).toBeVisible();
    expect(screen.getByText('대화 수리 전략')).not.toBeVisible();
  });

  it('shows each strategy purpose before the detailed help is opened', () => {
    render(<App />);

    const summary = screen.getByRole('region', { name: '전략 한눈에 보기' });
    expect(screen.getByRole('heading', { name: '전략 한눈에 보기' })).toBeVisible();
    expect(summary).toHaveTextContent('다시 말해 주세요');
    expect(summary).toHaveTextContent('전체 발화를 놓쳤을 때');
    expect(summary).toHaveTextContent('더 구체적으로');
    expect(summary).toHaveTextContent('대상·시간·장소·수량·담당·순서가 불분명할 때');
    expect(summary).toHaveTextContent('뜻 확인');
    expect(summary).toHaveTextContent('내가 이해한 내용이 맞는지 확인할 때');
    expect(summary).toHaveTextContent('다르게 말하기');
    expect(summary).toHaveTextContent('상대가 내 말을 이해하지 못했을 때');
    expect(screen.getByText('대화 수리 전략')).not.toBeVisible();
  });

  it('renders a recovery action instead of an empty mission grid', async () => {
    const onGradeBandChange = vi.fn();
    const { SignalCenter } = await import('./SignalCenter');
    render(
      <SignalCenter
        gradeBand="3-4"
        missions={[]}
        voiceEnabled={false}
        onGradeBandChange={onGradeBandChange}
        onVoiceEnabledChange={() => undefined}
        onMissionStart={() => undefined}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('이 수준의 미션을 찾을 수 없어요.');
    const recovery = screen.getByRole('button', { name: '5~6학년 미션 보기' });
    expect(recovery).toBeVisible();
    await userEvent.setup().click(recovery);
    expect(onGradeBandChange).toHaveBeenCalledWith('5-6');
    expect(document.querySelector('.mission-grid')).not.toBeInTheDocument();
  });

  it('starts only the selected mission and never asks for personal information', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '어느 상자 미션 시작' }));

    expect(screen.getByRole('heading', { name: '다시 물어볼 부분 찾기' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '어느 상자' })).toBeVisible();
    expect(screen.getByText('교실에 빨간 상자와 파란 상자가 함께 있습니다.')).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/이름|개인정보|학생/)).not.toBeInTheDocument();
  });
});

describe('LanguageText', () => {
  it('marks each learner-visible snippet with its exact language', () => {
    render(
      <div>
        <LanguageText language="en">Which box?</LanguageText>
        <LanguageText language="ko" as="p">
          어느 상자인지 물어보세요.
        </LanguageText>
      </div>,
    );

    expect(screen.getByText('Which box?')).toHaveAttribute('lang', 'en');
    expect(screen.getByText('어느 상자인지 물어보세요.')).toHaveAttribute('lang', 'ko');
  });
});
