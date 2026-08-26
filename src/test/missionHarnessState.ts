import { evaluateMissionChoice } from '../domain/evaluation';
import type { Mission, SessionPhase } from '../domain/mission';
import {
  createInitialSession,
  missionSessionReducer,
  type MissionSessionState,
} from '../domain/session';

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
