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
