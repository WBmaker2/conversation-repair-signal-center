import { useReducer } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getMissionById } from '../content/missionRepository';
import { evaluateMissionChoice } from '../domain/evaluation';
import type { Mission, SessionPhase } from '../domain/mission';
import {
  createInitialSession,
  missionSessionReducer,
  type MissionSessionState,
} from '../domain/session';
import { MissionFlow } from '../app/MissionFlow';

const TARGET_PHASES: readonly Exclude<SessionPhase, 'center'>[] = ['observe', 'repair', 'response', 'confirm', 'record'];
const STAGES = ['ambiguity', 'repair', 'meaning', 'confirmation'] as const;

function getAcceptedOptionForStage(mission: Mission, stage: (typeof STAGES)[number]) {
  const options = stage === 'ambiguity'
    ? mission.ambiguityOptions
    : stage === 'repair'
      ? mission.repairOptions
      : stage === 'meaning'
        ? mission.meaningOptions
        : mission.confirmationOptions;
  const option = options.find((candidate) => candidate.accepted);
  if (!option) throw new Error(`No accepted option for ${mission.id} at ${stage}`);
  return option;
}

export function createSessionAtPhase(mission: Mission, targetPhase: Exclude<SessionPhase, 'center'>): MissionSessionState {
  const targetIndex = TARGET_PHASES.indexOf(targetPhase);
  if (targetIndex < 0) throw new Error(`Invalid target phase: ${String(targetPhase)}`);
  let state = missionSessionReducer(createInitialSession(), { type: 'mission.started', missionId: mission.id });
  for (const stage of STAGES.slice(0, targetIndex)) {
    const option = getAcceptedOptionForStage(mission, stage);
    state = missionSessionReducer(state, { type: 'choice.selected', stage, optionId: option.id });
    state = missionSessionReducer(state, {
      type: 'choice.submitted',
      mission,
      result: evaluateMissionChoice(mission, stage, option.id),
    });
  }
  return state;
}

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

export function renderMissionAtPhase(
  missionId: string,
  phase: Exclude<SessionPhase, 'center'>,
  voiceEnabled = false,
) {
  return { user: userEvent.setup(), ...render(<MissionHarness missionId={missionId} phase={phase} voiceEnabled={voiceEnabled} />) };
}

export const renderMissionAtObservation = (id: string) => renderMissionAtPhase(id, 'observe');
export const renderMissionAtRepair = (id: string) => renderMissionAtPhase(id, 'repair');
export const renderMissionAtResponse = (id: string) => renderMissionAtPhase(id, 'response');
export const renderMissionAtConfirmation = (id: string) => renderMissionAtPhase(id, 'confirm');
