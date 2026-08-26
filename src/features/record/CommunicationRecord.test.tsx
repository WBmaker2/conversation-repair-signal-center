import { screen } from '@testing-library/react';
import { useReducer } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { getMissionById, MISSIONS } from '../../content/missionRepository';
import { buildMissionEvidence } from '../../domain/session';
import { renderWithUser } from '../../test/renderWithApp';
import { CommunicationRecord } from './CommunicationRecord';
import { TeacherSummary } from './TeacherSummary';
import { createSessionAtPhase } from '../../test/missionHarness';
import { MissionFlow } from '../../app/MissionFlow';
import type { MissionEvidence, MissionSessionState } from '../../domain/session';
import { createInitialSession, missionSessionReducer } from '../../domain/session';
import type { MissionStage } from '../../domain/mission';

function completedEvidence(missionId: string) {
  const mission = getMissionById(missionId);
  const state = createSessionAtPhase(mission, 'record');
  if (!state.evidence) throw new Error('test session should have evidence');
  return { mission, evidence: buildMissionEvidence(mission, state) };
}

function retryRichEvidence(missionId: string) {
  const mission = getMissionById(missionId);
  let state = missionSessionReducer(createInitialSession(), { type: 'mission.started', missionId });
  const stages: readonly MissionStage[] = ['ambiguity', 'repair', 'meaning', 'confirmation'];
  for (const stage of stages) {
    const options = stage === 'ambiguity'
      ? mission.ambiguityOptions
      : stage === 'repair'
        ? mission.repairOptions
        : stage === 'meaning'
          ? mission.meaningOptions
          : mission.confirmationOptions;
    const retry = options.find((option) => !option.accepted);
    const accepted = options.find((option) => option.accepted);
    if (!retry || !accepted) throw new Error(`retry-rich fixture incomplete for ${missionId}/${stage}`);
    state = missionSessionReducer(state, { type: 'choice.selected', stage, optionId: retry.id });
    state = missionSessionReducer(state, { type: 'choice.submitted', mission, result: { stage, optionId: retry.id, status: 'retry', feedbackKo: retry.feedbackKo, revealAnswer: false } });
    state = missionSessionReducer(state, { type: 'choice.selected', stage, optionId: accepted.id });
    state = missionSessionReducer(state, { type: 'choice.submitted', mission, result: { stage, optionId: accepted.id, status: 'accepted', feedbackKo: accepted.feedbackKo, revealAnswer: false } });
  }
  if (!state.evidence) throw new Error(`retry-rich fixture has no evidence for ${missionId}`);
  return { mission, evidence: state.evidence };
}

function MissionFlowHarness({ initialState, exposeState = false }: { initialState: MissionSessionState; exposeState?: boolean }) {
  const mission = getMissionById(initialState.missionId ?? 'g34-classroom-box');
  const [session, dispatch] = useReducer(missionSessionReducer, initialState);
  return (
    <>
      <MissionFlow mission={mission} session={session} dispatch={dispatch} voiceEnabled={false} />
      {exposeState && <output data-testid="session-state">{JSON.stringify(session)}</output>}
    </>
  );
}

describe('CommunicationRecord', () => {
  it('shows first and confirmed meaning without score, speed, transcript, or free text input', () => {
    const { mission, evidence } = completedEvidence('g34-classroom-box');
    renderWithUser(<CommunicationRecord mission={mission} evidence={evidence} onRetry={() => undefined} onReturnCenter={() => undefined} />);

    expect(screen.getByRole('heading', { name: '통신 기록' })).toBeVisible();
    expect(screen.getByText('처음 이해')).toBeVisible();
    expect(screen.getByText('확인된 이해')).toBeVisible();
    expect(screen.getByText('의미 확인 완료')).toBeVisible();
    expect(screen.queryByText(/발음 점수|속도 점수|순위|성적/)).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders the exact mission slot, strategy, collaboration feedback, and attempt counts', () => {
    const { mission, evidence } = completedEvidence('g56-materials-person');
    renderWithUser(<CommunicationRecord mission={mission} evidence={evidence} onRetry={() => undefined} onReturnCenter={() => undefined} />);

    expect(screen.getByText('담당자')).toBeVisible();
    expect(screen.getByText('더 구체적으로')).toBeVisible();
    expect(screen.getByText('비난하지 않고 확인 질문으로 대화를 이어 갔어요.')).toBeVisible();
    expect(screen.getByText(/불명확한 부분 찾기.*1회/)).toBeVisible();
    expect(screen.getByText(/확인 통화.*1회/)).toBeVisible();
  });

  it('dispatches retry and center actions through the supplied callbacks', async () => {
    const onRetry = vi.fn();
    const onReturnCenter = vi.fn();
    const { user } = renderWithUser(<CommunicationRecord {...completedEvidence('g34-classroom-pencil')} onRetry={onRetry} onReturnCenter={onReturnCenter} />);
    await user.click(screen.getByRole('button', { name: '이 미션 다시 하기' }));
    await user.click(screen.getByRole('button', { name: '신호센터로 돌아가기' }));
    expect(onRetry).toHaveBeenCalledOnce();
    expect(onReturnCenter).toHaveBeenCalledOnce();
  });

  it('renders a controlled error for impossible evidence references', () => {
    const { mission, evidence } = completedEvidence('g34-classroom-box');
    renderWithUser(
      <CommunicationRecord
        mission={mission}
        evidence={{ ...evidence, confirmedMeaningOptionId: 'missing-meaning' }}
        onRetry={() => undefined}
        onReturnCenter={() => undefined}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/통신 기록|학습 증거/);
    expect(screen.queryByText('의미 확인 완료')).not.toBeInTheDocument();
  });

  it('renders recovery controls for null or malformed evidence without throwing', () => {
    const { mission, evidence } = completedEvidence('g34-classroom-box');
    const malformed: readonly unknown[] = [
      null,
      { ...evidence, attempts: null },
      { ...evidence, attempts: 'not-an-array' },
      { ...evidence, attempts: [{ ...evidence.attempts[0], stage: 'unknown-stage' }] },
      { ...evidence, attempts: [{ ...evidence.attempts[0], optionId: 'unknown-option' }] },
      { ...evidence, attempts: [{ ...evidence.attempts[0], status: 'accepted' }] },
    ];
    for (const invalidEvidence of malformed) {
      const { unmount } = renderWithUser(
        <CommunicationRecord
          mission={mission}
          evidence={invalidEvidence as MissionEvidence}
          onRetry={() => undefined}
          onReturnCenter={() => undefined}
        />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent(/통신 기록|학습 증거/);
      expect(screen.getByRole('button', { name: '이 미션 다시 하기' })).toBeVisible();
      expect(screen.getByRole('button', { name: '신호센터로 돌아가기' })).toBeVisible();
      unmount();
    }
  });

  it('counts two attempts in every stage for every mission and preserves first meaning', () => {
    for (const mission of MISSIONS) {
      const fixture = retryRichEvidence(mission.id);
      const { unmount } = renderWithUser(<CommunicationRecord mission={fixture.mission} evidence={fixture.evidence} onRetry={() => undefined} onReturnCenter={() => undefined} />);
      expect(screen.getByText(/불명확한 부분 찾기: 2회/)).toBeVisible();
      expect(screen.getByText(/수리 표현 선택: 2회/)).toBeVisible();
      expect(screen.getByText(/추가 응답 이해: 2회/)).toBeVisible();
      expect(screen.getByText(/확인 통화: 2회/)).toBeVisible();
      expect(screen.getByText('처음 이해')).toBeVisible();
      expect(screen.getByText('확인된 이해')).toBeVisible();
      unmount();
    }
  });

  it('uses actual MissionFlow reducer callbacks for retry and center recovery', async () => {
    const fixture = completedEvidence('g34-classroom-box');
    const retryView = renderWithUser(<MissionFlowHarness initialState={{ ...createSessionAtPhase(fixture.mission, 'record'), evidence: fixture.evidence }} />);
    await retryView.user.click(screen.getByRole('button', { name: '이 미션 다시 하기' }));
    expect(retryView.container.querySelector('[data-session-phase="observe"]')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '대화 관측' })).toBeVisible();
    retryView.unmount();

    const centerView = renderWithUser(<MissionFlowHarness initialState={{ ...createSessionAtPhase(fixture.mission, 'record'), evidence: fixture.evidence }} exposeState />);
    await centerView.user.click(screen.getByRole('button', { name: '신호센터로 돌아가기' }));
    expect(JSON.parse(screen.getByTestId('session-state').textContent ?? '{}')).toEqual(createInitialSession());
  });

  it('makes null-evidence record recovery reachable from MissionFlow', () => {
    const mission = getMissionById('g34-classroom-box');
    renderWithUser(<MissionFlowHarness initialState={{ ...createSessionAtPhase(mission, 'record'), evidence: null }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('학습 증거를 찾을 수 없습니다');
    expect(screen.getByRole('button', { name: '이 미션 다시 하기' })).toBeVisible();
    expect(screen.getByRole('button', { name: '신호센터로 돌아가기' })).toBeVisible();
  });
});

describe('TeacherSummary', () => {
  it('keeps curriculum, four targets, and four concrete evidence items behind details', async () => {
    const { mission, evidence } = completedEvidence('g56-event-decision');
    const { user } = renderWithUser(<TeacherSummary mission={mission} evidence={evidence} />);
    expect(screen.getByRole('group', { name: '교사용 보기' })).toBeInTheDocument();
    expect(screen.getByText('교사용 보기')).toBeVisible();
    expect(screen.getByText('[6영02-09]')).not.toBeVisible();

    await user.click(screen.getByText('교사용 보기'));
    expect(screen.getByText('[6영02-09]')).toBeVisible();
    expect(screen.getByText('불명확한 부분을 찾았어요')).toBeVisible();
    expect(screen.getByText('상황에 맞는 수리 전략을 골랐어요')).toBeVisible();
    expect(screen.getByText('상대의 추가 응답과 의미를 연결했어요')).toBeVisible();
    expect(screen.getByText('확인 질문으로 협력적으로 대화를 이어 갔어요')).toBeVisible();
    expect(screen.queryByText(/점수|순위|진단|자유 메모|학생 이름/)).not.toBeInTheDocument();
  });
});
