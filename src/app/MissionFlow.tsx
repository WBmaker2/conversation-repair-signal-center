import type { Dispatch } from 'react';
import type { Mission } from '../domain/mission';
import type { MissionSessionAction, MissionSessionState } from '../domain/session';
import { evaluateMissionChoice } from '../domain/evaluation';
import { DialogueObservation } from '../features/observation/DialogueObservation';
import { RepairTransmission } from '../features/repair/RepairTransmission';
import { ResponseReception } from '../features/response/ResponseReception';
import { ConfirmationCall } from '../features/confirmation/ConfirmationCall';
import { CommunicationRecord } from '../features/record/CommunicationRecord';

export interface MissionFlowProps {
  mission: Mission;
  session: MissionSessionState;
  dispatch: Dispatch<MissionSessionAction>;
  voiceEnabled: boolean;
}

export function MissionFlow({ mission, session, dispatch, voiceEnabled }: MissionFlowProps) {
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

  return (
    <section data-session-phase={session.phase} data-voice-enabled={voiceEnabled ? 'true' : 'false'}>
      <header>
        <p>{mission.titleKo}</p>
        <h1>{mission.titleKo}</h1>
        <p>{mission.scenarioKo}</p>
      </header>
      {session.phase === 'observe' ? (
        <DialogueObservation
          mission={mission}
          selectedOptionId={session.selectedOptionIds.ambiguity}
          latestResult={session.latestResult}
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
        <section aria-labelledby="phase-heading">
          <h2 id="phase-heading">통신 기록</h2>
          <p role="alert">학습 증거를 찾을 수 없습니다. 이 미션을 다시 시작해 주세요.</p>
        </section>
      )}
    </section>
  );
}
