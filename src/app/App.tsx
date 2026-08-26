import { useEffect, useReducer, useRef, useState, type JSX } from 'react';
import { MissionFlow } from './MissionFlow';
import { SignalCenter } from '../features/center/SignalCenter';
import { getMissionsByGradeBand, MISSIONS } from '../content/missionRepository';
import type { GradeBand } from '../domain/mission';
import { createInitialSession, missionSessionReducer } from '../domain/session';
import { CHANGELOG } from '../content/changelog';
import { UpdateHistoryButton } from '../features/updates/UpdateHistoryButton';
import { UpdateHistoryDialog } from '../features/updates/UpdateHistoryDialog';

export function App(): JSX.Element {
  const [gradeBand, setGradeBand] = useState<GradeBand>('3-4');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const updateTriggerRef = useRef<HTMLButtonElement>(null);
  const restoreUpdateFocus = useRef(false);
  const [session, dispatch] = useReducer(missionSessionReducer, undefined, createInitialSession);
  const previousPhase = useRef(session.phase);

  useEffect(() => {
    document.documentElement.lang = 'ko';
  }, []);

  useEffect(() => {
    if (session.phase === 'center' && previousPhase.current !== 'center') {
      document.getElementById('service-heading')?.focus();
    }
    previousPhase.current = session.phase;
  }, [session.phase]);

  useEffect(() => {
    if (!updatesOpen && restoreUpdateFocus.current) {
      restoreUpdateFocus.current = false;
      updateTriggerRef.current?.focus();
    }
  }, [updatesOpen]);

  const closeUpdates = () => {
    restoreUpdateFocus.current = true;
    setUpdatesOpen(false);
  };

  if (session.phase !== 'center') {
    const mission = MISSIONS.find((candidate) => candidate.id === session.missionId);
    if (mission) {
      return <MissionFlow mission={mission} session={session} dispatch={dispatch} voiceEnabled={voiceEnabled} />;
    }
    return <InvalidMissionFallback onReturnCenter={() => dispatch({ type: 'center.returned' })} />;
  }

  return (
    <>
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
      <main id="main-content" tabIndex={-1} className="app-shell" inert={updatesOpen ? true : undefined}>
        <SignalCenter
          gradeBand={gradeBand}
          missions={getMissionsByGradeBand(gradeBand)}
          voiceEnabled={voiceEnabled}
          onGradeBandChange={setGradeBand}
          onVoiceEnabledChange={setVoiceEnabled}
          onMissionStart={(missionId) => dispatch({ type: 'mission.started', missionId })}
        />
        <UpdateHistoryButton ref={updateTriggerRef} onClick={() => setUpdatesOpen(true)} />
      </main>
      {updatesOpen && <UpdateHistoryDialog records={CHANGELOG} onClose={closeUpdates} />}
    </>
  );
}

export interface InvalidMissionFallbackProps {
  onReturnCenter: () => void;
}

export function InvalidMissionFallback({ onReturnCenter }: InvalidMissionFallbackProps): JSX.Element {
  useEffect(() => {
    document.getElementById('invalid-mission-heading')?.focus();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
      <main id="main-content" tabIndex={-1} className="app-shell">
        <h1 id="invalid-mission-heading" tabIndex={-1}>대화 수리 신호센터</h1>
        <h2 id="record-heading" tabIndex={-1}>통신 기록</h2>
        <p>이 미션을 찾을 수 없어요. 신호센터에서 다른 미션을 골라 주세요.</p>
        <button type="button" onClick={onReturnCenter}>신호센터로 돌아가기</button>
      </main>
    </>
  );
}
