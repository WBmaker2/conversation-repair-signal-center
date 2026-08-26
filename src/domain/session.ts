import type {
  AmbiguitySlotKind,
  EvaluationResult,
  Mission,
  MissionStage,
  RepairStrategyId,
  SessionPhase,
} from './mission';

export interface AttemptRecord {
  stage: MissionStage;
  optionId: string;
  status: EvaluationResult['status'];
}

export interface MissionEvidence {
  missionId: string;
  identifiedSlotKind: AmbiguitySlotKind;
  repairStrategyId: RepairStrategyId;
  firstMeaningOptionId: string;
  confirmedMeaningOptionId: string;
  meaningConfirmed: true;
  collaborationFeedbackKo: string;
  attempts: AttemptRecord[];
}

export interface MissionSessionState {
  phase: SessionPhase;
  missionId: string | null;
  selectedOptionIds: Partial<Record<MissionStage, string>>;
  acceptedResults: Partial<Record<MissionStage, EvaluationResult>>;
  latestResult: EvaluationResult | null;
  attempts: AttemptRecord[];
  firstMeaningOptionId: string | null;
  evidence: MissionEvidence | null;
}

export type MissionSessionAction =
  | { type: 'mission.started'; missionId: string }
  | { type: 'choice.selected'; stage: MissionStage; optionId: string }
  | { type: 'choice.submitted'; mission: Mission; result: EvaluationResult }
  | { type: 'mission.restarted' }
  | { type: 'center.returned' };

const stagePhase: Record<MissionStage, SessionPhase> = {
  ambiguity: 'observe',
  repair: 'repair',
  meaning: 'response',
  confirmation: 'confirm',
};

const nextPhase: Record<MissionStage, SessionPhase> = {
  ambiguity: 'repair',
  repair: 'response',
  meaning: 'confirm',
  confirmation: 'record',
};

function assertNever(value: never): never {
  throw new Error(`Unhandled mission stage: ${String(value)}`);
}

function optionsForStage(mission: Mission, stage: MissionStage): readonly { id: string }[] {
  switch (stage) {
    case 'ambiguity':
      return mission.ambiguityOptions;
    case 'repair':
      return mission.repairOptions;
    case 'meaning':
      return mission.meaningOptions;
    case 'confirmation':
      return mission.confirmationOptions;
  }
  return assertNever(stage);
}

function hasMissionOption(mission: Mission, stage: MissionStage, optionId: string): boolean {
  return optionsForStage(mission, stage).some(({ id }) => id === optionId);
}

function isCurrentStage(state: MissionSessionState, stage: MissionStage): boolean {
  return stagePhase[stage] === state.phase;
}

export function createInitialSession(): MissionSessionState {
  return {
    phase: 'center',
    missionId: null,
    selectedOptionIds: {},
    acceptedResults: {},
    latestResult: null,
    attempts: [],
    firstMeaningOptionId: null,
    evidence: null,
  };
}

export function missionSessionReducer(
  state: MissionSessionState,
  action: MissionSessionAction,
): MissionSessionState {
  switch (action.type) {
    case 'mission.started':
      if (state.phase !== 'center') return state;
      return { ...createInitialSession(), phase: 'observe', missionId: action.missionId };

    case 'choice.selected':
      if (!isCurrentStage(state, action.stage)) return state;
      return {
        ...state,
        selectedOptionIds: { ...state.selectedOptionIds, [action.stage]: action.optionId },
        latestResult: null,
      };

    case 'choice.submitted': {
      const { mission, result } = action;
      if (
        mission.id !== state.missionId ||
        !isCurrentStage(state, result.stage) ||
        state.selectedOptionIds[result.stage] !== result.optionId ||
        !hasMissionOption(mission, result.stage, result.optionId)
      ) {
        return state;
      }

      const submittedResult = { ...result };
      const acceptedResults = result.status === 'accepted'
        ? { ...state.acceptedResults, [result.stage]: submittedResult }
        : state.acceptedResults;
      const firstMeaningOptionId = result.stage === 'meaning' && state.firstMeaningOptionId === null
        ? result.optionId
        : state.firstMeaningOptionId;
      const nextState: MissionSessionState = {
        ...state,
        phase: result.status === 'accepted' ? nextPhase[result.stage] : state.phase,
        acceptedResults,
        latestResult: submittedResult,
        attempts: [...state.attempts, { stage: result.stage, optionId: result.optionId, status: result.status }],
        firstMeaningOptionId,
      };

      if (result.stage === 'confirmation' && result.status === 'accepted') {
        return { ...nextState, evidence: buildMissionEvidence(mission, nextState) };
      }
      return nextState;
    }

    case 'mission.restarted':
      if (state.missionId === null) return state;
      return { ...createInitialSession(), phase: 'observe', missionId: state.missionId };

    case 'center.returned':
      return createInitialSession();
  }
  return assertNever(action);
}

function incompleteEvidence(): never {
  throw new Error('Cannot build evidence before all learning stages are accepted');
}

function acceptedResult(
  state: MissionSessionState,
  stage: MissionStage,
): EvaluationResult {
  const candidate = state.acceptedResults[stage];
  if (!candidate || candidate.stage !== stage || candidate.status !== 'accepted') return incompleteEvidence();
  return candidate;
}

function findEvidenceOption<T extends { id: string }>(
  options: readonly T[],
  stage: MissionStage,
  optionId: string,
): T {
  const option = options.find(({ id }) => id === optionId);
  if (!option) {
    throw new Error(`Cannot build evidence: ${stage} option ${optionId} was not found in supplied mission`);
  }
  return option;
}

export function buildMissionEvidence(
  mission: Mission,
  state: MissionSessionState,
): MissionEvidence {
  if (state.phase !== 'record' || state.missionId !== mission.id) return incompleteEvidence();

  const ambiguityResult = acceptedResult(state, 'ambiguity');
  const repairResult = acceptedResult(state, 'repair');
  const meaningResult = acceptedResult(state, 'meaning');
  const confirmationResult = acceptedResult(state, 'confirmation');
  if (!state.firstMeaningOptionId) return incompleteEvidence();

  const ambiguity = findEvidenceOption(mission.ambiguityOptions, 'ambiguity', ambiguityResult.optionId);
  const repair = findEvidenceOption(mission.repairOptions, 'repair', repairResult.optionId);
  findEvidenceOption(mission.meaningOptions, 'meaning', meaningResult.optionId);
  findEvidenceOption(mission.meaningOptions, 'meaning', state.firstMeaningOptionId);
  findEvidenceOption(mission.confirmationOptions, 'confirmation', confirmationResult.optionId);

  return {
    missionId: mission.id,
    identifiedSlotKind: ambiguity.slotKind,
    repairStrategyId: repair.strategyId,
    firstMeaningOptionId: state.firstMeaningOptionId,
    confirmedMeaningOptionId: meaningResult.optionId,
    meaningConfirmed: true,
    collaborationFeedbackKo: '비난하지 않고 확인 질문으로 대화를 이어 갔어요.',
    attempts: state.attempts.map((attempt) => ({ ...attempt })),
  };
}
