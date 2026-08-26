import type { Dispatch } from 'react';
import type { Mission } from '../domain/mission';
import type { MissionSessionAction, MissionSessionState } from '../domain/session';
import { evaluateMissionChoice } from '../domain/evaluation';
import { DialogueObservation } from '../features/observation/DialogueObservation';
import { RepairTransmission } from '../features/repair/RepairTransmission';
import { ResponseReception } from '../features/response/ResponseReception';

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
      ) : (
        <section aria-labelledby="phase-heading">
          <h2 id="phase-heading">
            {session.phase === 'confirm' ? '확인 통화' : '통신 기록'}
          </h2>
          <p>다음 학습 단계가 준비되어 있습니다.</p>
        </section>
      )}
    </section>
  );
}
