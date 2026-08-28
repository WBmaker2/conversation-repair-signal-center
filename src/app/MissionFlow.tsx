import { useEffect, type Dispatch } from 'react';
import type { Mission } from '../domain/mission';
import type { MissionSessionAction, MissionSessionState } from '../domain/session';
import { evaluateMissionChoice } from '../domain/evaluation';
import { DialogueObservation } from '../features/observation/DialogueObservation';
import { RepairTransmission } from '../features/repair/RepairTransmission';
import { ResponseReception } from '../features/response/ResponseReception';
import { ConfirmationCall } from '../features/confirmation/ConfirmationCall';
import { CommunicationRecord } from '../features/record/CommunicationRecord';
import { PhaseProgress, type LearningPhase } from '../shared/PhaseProgress';

export interface MissionFlowProps {
  mission: Mission;
  session: MissionSessionState;
  dispatch: Dispatch<MissionSessionAction>;
  voiceEnabled: boolean;
}

export function MissionFlow({ mission, session, dispatch, voiceEnabled }: MissionFlowProps) {
  useEffect(() => {
    document.documentElement.lang = 'ko';
  }, []);

  useEffect(() => {
    document.getElementById(`${session.phase}-heading`)?.focus();
  }, [session.phase]);

  const selectAmbiguity = (optionId: string) => {
    dispatch({ type: 'choice.selected', stage: 'ambiguity', optionId });
  };
  const submitAmbiguity = (optionId: string) => {
    dispatch({
      type: 'choice.submitted',
      mission,
      result: evaluateMissionChoice(mission, 'ambiguity', optionId),
    });
  };
  const selectRepair = (optionId: string) => {
    dispatch({ type: 'choice.selected', stage: 'repair', optionId });
  };
  const submitRepair = (optionId: string) => {
    dispatch({
      type: 'choice.submitted',
      mission,
      result: evaluateMissionChoice(mission, 'repair', optionId),
    });
  };
  const selectMeaning = (optionId: string) => {
    dispatch({ type: 'choice.selected', stage: 'meaning', optionId });
  };
  const submitMeaning = (optionId: string) => {
    dispatch({
      type: 'choice.submitted',
      mission,
      result: evaluateMissionChoice(mission, 'meaning', optionId),
    });
  };
  const selectConfirmation = (optionId: string) => {
    dispatch({ type: 'choice.selected', stage: 'confirmation', optionId });
  };
  const submitConfirmation = (optionId: string) => {
    dispatch({
      type: 'choice.submitted',
      mission,
      result: evaluateMissionChoice(mission, 'confirmation', optionId),
    });
  };

  const isLearningPhase = (phase: MissionSessionState['phase']): phase is LearningPhase => (
    phase === 'observe' || phase === 'repair' || phase === 'response' || phase === 'confirm'
  );

  return (
    <>
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
      <main id="main-content" tabIndex={-1} className="app-shell">
      <section className="mission-workspace" data-session-phase={session.phase} data-voice-enabled={voiceEnabled ? 'true' : 'false'}>
      <header>
        <p className="eyebrow">대화 수리 미션</p>
        <h1>{mission.titleKo}</h1>
        <p lang="ko">{mission.scenarioKo}</p>
      </header>
      {isLearningPhase(session.phase) ? (
        <>
          <PhaseProgress
            phase={session.phase}
            onBack={session.phase === 'observe' ? undefined : () => dispatch({ type: 'phase.back' })}
          />
          <div className="mission-navigation" aria-label="미션 조작">
            <button type="button" onClick={() => dispatch({ type: 'center.returned' })}>신호센터로 돌아가기</button>
            <button type="button" onClick={() => dispatch({ type: 'mission.restarted' })}>이 미션 다시 하기</button>
          </div>
        </>
      ) : null}
      {session.phase === 'observe' ? (
        <DialogueObservation
          mission={mission}
          selectedOptionId={session.selectedOptionIds.ambiguity}
          latestResult={session.latestResult}
          voiceEnabled={voiceEnabled}
          onSelect={selectAmbiguity}
          onSubmit={submitAmbiguity}
        />
      ) : session.phase === 'repair' ? (
        <RepairTransmission
          mission={mission}
          selectedOptionId={session.selectedOptionIds.repair}
          latestResult={session.latestResult}
          onSelect={selectRepair}
          onSubmit={submitRepair}
        />
      ) : session.phase === 'response' ? (
        <ResponseReception
          mission={mission}
          selectedOptionId={session.selectedOptionIds.meaning}
          latestResult={session.latestResult}
          voiceEnabled={voiceEnabled}
          onSelect={selectMeaning}
          onSubmit={submitMeaning}
        />
      ) : session.phase === 'confirm' ? (
        <ConfirmationCall
          mission={mission}
          selectedOptionId={session.selectedOptionIds.confirmation}
          latestResult={session.latestResult}
          onSelect={selectConfirmation}
          onSubmit={submitConfirmation}
        />
      ) : session.phase === 'record' && session.evidence ? (
        <CommunicationRecord
          mission={mission}
          evidence={session.evidence}
          onRetry={() => dispatch({ type: 'mission.restarted' })}
          onReturnCenter={() => dispatch({ type: 'center.returned' })}
        />
      ) : (
        <section aria-labelledby="record-heading">
          <h2 id="record-heading" tabIndex={-1}>통신 기록</h2>
          <p role="alert">학습 증거를 찾을 수 없습니다. 이 미션을 다시 시작해 주세요.</p>
          <div>
            <button type="button" onClick={() => dispatch({ type: 'mission.restarted' })}>이 미션 다시 하기</button>
            <button type="button" onClick={() => dispatch({ type: 'center.returned' })}>신호센터로 돌아가기</button>
          </div>
        </section>
      )}
      </section>
      </main>
    </>
  );
}
