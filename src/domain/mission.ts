export type GradeBand = '3-4' | '5-6';

export type CurriculumCode =
  | '[4영02-10]'
  | '[6영02-07]'
  | '[6영02-09]'
  | '[6영02-10]';

export type RepairStrategyId = 'repeat' | 'specify' | 'confirm' | 'rephrase';

export type AmbiguitySlotKind =
  | 'whole-utterance'
  | 'object'
  | 'time'
  | 'place'
  | 'quantity'
  | 'person'
  | 'sequence'
  | 'decision';

export type MissionStage = 'ambiguity' | 'repair' | 'meaning' | 'confirmation';

export type SessionPhase =
  | 'center'
  | 'observe'
  | 'repair'
  | 'response'
  | 'confirm'
  | 'record';

export type Naturalness = 'best-fit' | 'works';

export interface DialogueTurn {
  id: string;
  speaker: string;
  textEn: string;
  supportKo?: string;
  obscuredLabelKo?: string;
}

export interface AmbiguityOption {
  id: string;
  turnId: string;
  labelEn: string;
  slotKind: AmbiguitySlotKind;
  accepted: boolean;
  feedbackKo: string;
}

export interface RepairOption {
  id: string;
  strategyId: RepairStrategyId;
  textEn: string;
  naturalness?: Naturalness;
  accepted: boolean;
  feedbackKo: string;
}

export interface MeaningOption {
  id: string;
  labelKo: string;
  accepted: boolean;
  feedbackKo: string;
}

export interface ConfirmationOption {
  id: string;
  mode: 'confirm' | 'rephrase';
  textEn: string;
  accepted: boolean;
  feedbackKo: string;
}

export interface AudioCue {
  id: string;
  src: string;
  mimeType: 'audio/mpeg';
  transcriptEn: string;
}

export interface Mission {
  id: string;
  gradeBand: GradeBand;
  titleKo: string;
  scenarioKo: string;
  politenessContext: 'classroom-polite' | 'peer-brief';
  curriculumCodes: CurriculumCode[];
  learningTargets: Array<'understand' | 'apply' | 'analyze' | 'create'>;
  dialogue: DialogueTurn[];
  ambiguityOptions: AmbiguityOption[];
  allowedStrategyIds: RepairStrategyId[];
  repairOptions: RepairOption[];
  clarifyingResponse: DialogueTurn;
  meaningOptions: MeaningOption[];
  confirmationOptions: ConfirmationOption[];
  audioCues: AudioCue[];
}

export interface EvaluationResult {
  stage: MissionStage;
  optionId: string;
  status: 'accepted' | 'retry';
  feedbackKo: string;
  revealAnswer: false;
  naturalness?: Naturalness;
}
