import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getMissionById } from '../../content/missionRepository';
import { CriticalActionButton } from '../../shared/CriticalActionButton';
import {
  createSessionAtPhase,
  renderMissionAtConfirmation,
  renderMissionAtObservation,
  renderMissionAtRepair,
  renderMissionAtResponse,
} from '../../test/missionHarness';

describe('DialogueObservation', () => {
  it('keeps the learner in observation and announces a Korean hint after a wrong slot', async () => {
    const { user } = renderMissionAtObservation('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: 'the crayons' }));
    await user.click(screen.getByRole('button', { name: '모호한 부분 찾기' }));
    expect(screen.getByRole('status')).toHaveTextContent('어떤 정보가 아직 없나요?');
    expect(screen.getByRole('heading', { name: '대화 관측' })).toBeVisible();
    expect(screen.queryByText('Which box?')).not.toBeInTheDocument();
  });

  it('moves to repair transmission after selecting the ambiguous slot', async () => {
    const { user } = renderMissionAtObservation('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: 'that box' }));
    await user.click(screen.getByRole('button', { name: '모호한 부분 찾기' }));
    expect(screen.getByRole('heading', { name: '수리 송신' })).toBeVisible();
  });

  it('renders ordered dialogue language metadata and an initially disabled action', () => {
    renderMissionAtObservation('g34-recess-time');
    const mission = getMissionById('g34-recess-time');
    const turns = screen.getByRole('list', { name: '대화 순서' }).querySelectorAll('li');
    expect([...turns].map((turn) => turn.textContent)).toEqual(
      mission.dialogue.map((turn, index) => `${index + 1}.${turn.speaker}${turn.textEn}${turn.obscuredLabelKo ?? ''}`),
    );
    expect(screen.getByText(mission.dialogue[0]!.textEn)).toHaveAttribute('lang', 'en');
    expect(screen.getByText(mission.dialogue[0]!.obscuredLabelKo!)).toHaveAttribute('lang', 'ko');
    expect(screen.getByRole('button', { name: '모호한 부분 찾기' })).toBeDisabled();
  });

  it('renders exactly three controlled ambiguity radios with keyboard selection', async () => {
    const user = userEvent.setup();
    renderMissionAtObservation('g34-classroom-box');
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(screen.getByRole('group', { name: '어느 부분이 분명하지 않나요?' })).toBeVisible();
    await user.tab();
    await user.keyboard(' ');
    expect(radios[0]).toBeChecked();
    expect(screen.getByRole('button', { name: '모호한 부분 찾기' })).toBeEnabled();
  });

  it('does not leak answer data after retry and keeps the selected radio', async () => {
    const { user } = renderMissionAtObservation('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: 'the crayons' }));
    await user.click(screen.getByRole('button', { name: '모호한 부분 찾기' }));
    expect(screen.getByRole('radio', { name: 'the crayons' })).toBeChecked();
    expect(screen.queryByText('Which box?')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('lang', 'ko');
  });

  it('advances to repair only after the accepted ambiguity option', async () => {
    const { user } = renderMissionAtObservation('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: 'that box' }));
    await user.click(screen.getByRole('button', { name: '모호한 부분 찾기' }));
    expect(screen.getByRole('heading', { name: '수리 송신' })).toBeVisible();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders semantic headings for every harness phase without later-stage interactions', () => {
    for (const [renderPhase, heading] of [
      [renderMissionAtRepair, '수리 송신'],
      [renderMissionAtResponse, '응답 수신'],
      [renderMissionAtConfirmation, '확인 통화'],
    ] as const) {
      renderPhase('g34-classroom-box');
      expect(screen.getByRole('heading', { name: heading })).toBeVisible();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      cleanup();
    }
  });

  it('keeps the critical action contract despite caller children and type', () => {
    render(
      <CriticalActionButton action="send-confirmation" className="caller-class" type="submit" aria-label="다른 이름">
        caller text
      </CriticalActionButton>,
    );
    const button = screen.getByRole('button', { name: '확인 질문 보내기' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('gi-pulse', 'caller-class');
    expect(button).not.toHaveTextContent('caller text');
    expect(screen.queryByRole('button', { name: '다른 이름' })).not.toBeInTheDocument();
  });

  it('keeps one stable Korean status region from the initial render through retry', async () => {
    const { user } = renderMissionAtObservation('g34-classroom-box');
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('lang', 'ko');
    await user.click(screen.getByRole('radio', { name: 'the crayons' }));
    await user.click(screen.getByRole('button', { name: '모호한 부분 찾기' }));
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('어떤 정보가 아직 없나요?');
  });

  it('reports invalid phase and missing accepted replay options with controlled errors', () => {
    const mission = getMissionById('g34-classroom-box');
    expect(() => createSessionAtPhase(mission, 'not-a-phase' as never)).toThrow('Invalid target phase: not-a-phase');
    const noAcceptedAmbiguity = {
      ...mission,
      ambiguityOptions: mission.ambiguityOptions.map((option) => ({ ...option, accepted: false })),
    };
    expect(() => createSessionAtPhase(noAcceptedAmbiguity, 'repair')).toThrow(
      'No accepted option for g34-classroom-box at ambiguity',
    );
  });
});
