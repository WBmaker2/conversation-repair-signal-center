import type {
  EvaluationResult,
  Mission,
  MissionStage,
} from './mission';

type MissionOption =
  | Mission['ambiguityOptions'][number]
  | Mission['repairOptions'][number]
  | Mission['meaningOptions'][number]
  | Mission['confirmationOptions'][number];

export class MissionChoiceError extends Error {
  constructor(missionId: string, stage: MissionStage, optionId: string) {
    super(`Unknown choice ${optionId} for ${missionId} at ${stage}`);
    this.name = 'MissionChoiceError';
  }
}

function getOptionsForStage(mission: Mission, stage: MissionStage): readonly MissionOption[] {
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
}

export function evaluateMissionChoice(
  mission: Mission,
  stage: MissionStage,
  optionId: string,
): EvaluationResult {
  const option = getOptionsForStage(mission, stage).find((candidate) => candidate.id === optionId);
  if (!option) throw new MissionChoiceError(mission.id, stage, optionId);

  return {
    stage,
    optionId,
    status: option.accepted ? 'accepted' : 'retry',
    feedbackKo: option.feedbackKo,
    revealAnswer: false,
    ...('naturalness' in option && option.naturalness
      ? { naturalness: option.naturalness }
      : {}),
  };
}
