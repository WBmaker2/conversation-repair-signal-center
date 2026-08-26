import type { Dispatch } from 'react';
import type { Mission } from '../domain/mission';
import type { MissionSessionAction, MissionSessionState } from '../domain/session';

export interface MissionFlowProps {
  mission: Mission;
  session: MissionSessionState;
  dispatch: Dispatch<MissionSessionAction>;
  voiceEnabled: boolean;
}

export function MissionFlow({ mission, session, dispatch, voiceEnabled }: MissionFlowProps) {
  // The reducer is intentionally threaded through this shell for the later learning phases.
  void dispatch;

  return (
    <section data-session-phase={session.phase} data-voice-enabled={voiceEnabled ? 'true' : 'false'}>
      <header>
        <p>{mission.titleKo}</p>
        <h1>{mission.titleKo}</h1>
        <p>{mission.scenarioKo}</p>
      </header>
      <section aria-labelledby="observation-heading">
        <h2 id="observation-heading">대화 관측</h2>
        <p>대화에서 어떤 부분이 분명하지 않은지 살펴보세요.</p>
      </section>
    </section>
  );
}
