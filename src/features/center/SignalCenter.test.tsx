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
  });

  it('keeps the controlled voice preference and exposes the optional bundled voice', async () => {
    const user = userEvent.setup();
    render(<App />);

    const voice = screen.getByRole('checkbox', { name: /음성/ });
    expect(voice).not.toBeChecked();
    expect(screen.getByText(/음성은 선택 사항/)).toBeVisible();

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
    expect(screen.getByText('다시 말해 주세요')).toBeVisible();
    expect(screen.getByText('더 구체적으로')).toBeVisible();
    expect(screen.getByText('뜻 확인')).toBeVisible();
    expect(screen.getByText('다르게 말하기')).toBeVisible();
    expect(screen.getByText('전체 발화를 놓쳤을 때')).toBeVisible();
    expect(screen.getByText('대상·시간·장소·수량·담당·순서가 불분명할 때')).toBeVisible();
    expect(screen.getByText('내가 이해한 내용이 맞는지 확인할 때')).toBeVisible();
    expect(screen.getByText('상대가 내 말을 이해하지 못했을 때')).toBeVisible();
  });

  it('starts only the selected mission and never asks for personal information', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '어느 상자 미션 시작' }));

    expect(screen.getByRole('heading', { name: '대화 관측' })).toBeVisible();
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
