import { useReducer } from 'react';
import { getMissionById } from '../content/missionRepository';
import type { SessionPhase } from '../domain/mission';
import { missionSessionReducer } from '../domain/session';
import { MissionFlow } from '../app/MissionFlow';
import { createSessionAtPhase } from './missionHarnessState';

interface MissionHarnessProps {
  missionId: string;
  phase: Exclude<SessionPhase, 'center'>;
  voiceEnabled: boolean;
}

export function MissionHarness({ missionId, phase, voiceEnabled }: MissionHarnessProps) {
  const mission = getMissionById(missionId);
  const [session, dispatch] = useReducer(
    missionSessionReducer,
    createSessionAtPhase(mission, phase),
  );
  return <MissionFlow mission={mission} session={session} dispatch={dispatch} voiceEnabled={voiceEnabled} />;
}
