import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getMissionById } from '../../content/missionRepository';
import { buildMissionEvidence } from '../../domain/session';
import { renderWithUser } from '../../test/renderWithApp';
import { CommunicationRecord } from './CommunicationRecord';
import { TeacherSummary } from './TeacherSummary';
import { createSessionAtPhase } from '../../test/missionHarness';

function completedEvidence(missionId: string) {
  const mission = getMissionById(missionId);
  const state = createSessionAtPhase(mission, 'record');
  if (!state.evidence) throw new Error('test session should have evidence');
  return { mission, evidence: buildMissionEvidence(mission, state) };
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
    expect(screen.getByRole('alert')).toHaveTextContent('학습 증거가 완전하지 않습니다');
    expect(screen.queryByText('의미 확인 완료')).not.toBeInTheDocument();
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
