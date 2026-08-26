import { useReducer, useState, type JSX } from 'react';
import { MissionFlow } from './MissionFlow';
import { SignalCenter } from '../features/center/SignalCenter';
import { getMissionsByGradeBand, MISSIONS } from '../content/missionRepository';
import type { GradeBand } from '../domain/mission';
import { createInitialSession, missionSessionReducer } from '../domain/session';

export function App(): JSX.Element {
  const [gradeBand, setGradeBand] = useState<GradeBand>('3-4');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [session, dispatch] = useReducer(missionSessionReducer, undefined, createInitialSession);

  if (session.phase !== 'center') {
    const mission = MISSIONS.find((candidate) => candidate.id === session.missionId);
    if (mission) {
      return (
        <main id="main-content">
          <MissionFlow mission={mission} session={session} dispatch={dispatch} voiceEnabled={voiceEnabled} />
        </main>
      );
    }
    return (
      <main id="main-content">
        <h1>대화 수리 신호센터</h1>
        <p>이 미션을 찾을 수 없어요. 신호센터에서 다른 미션을 골라 주세요.</p>
      </main>
    );
  }

  return (
    <main id="main-content">
      <SignalCenter
        gradeBand={gradeBand}
        missions={getMissionsByGradeBand(gradeBand)}
        voiceEnabled={voiceEnabled}
        onGradeBandChange={setGradeBand}
        onVoiceEnabledChange={setVoiceEnabled}
        onMissionStart={(missionId) => dispatch({ type: 'mission.started', missionId })}
      />
    </main>
  );
}
