import type { Dispatch } from 'react';
import type { Mission } from '../domain/mission';
import type { MissionSessionAction, MissionSessionState } from '../domain/session';
import { evaluateMissionChoice } from '../domain/evaluation';
import { DialogueObservation } from '../features/observation/DialogueObservation';

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
      ) : (
        <section aria-labelledby="phase-heading">
          <h2 id="phase-heading">
            {session.phase === 'repair' ? '수리 송신' : session.phase === 'response' ? '응답 수신' : session.phase === 'confirm' ? '확인 통화' : '통신 기록'}
          </h2>
          <p>다음 학습 단계가 준비되어 있습니다.</p>
        </section>
      )}
    </section>
  );
}
