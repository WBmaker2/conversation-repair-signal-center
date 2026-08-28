import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(screen.getByText('오늘의 전략: 이해가 안 되면 다시 물어도 괜찮아요.')).toBeVisible();
    expect(screen.getByText('권장 학습 시간 20~30분')).toBeVisible();
    expect(screen.getByText('이름을 묻지 않으며, 새로고침하면 현재 통신 기록이 사라져요.')).toBeVisible();
    expect(screen.getByText('전략 도움말')).toBeVisible();
    expect(screen.getByText('대화 수리 전략')).not.toBeVisible();
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
