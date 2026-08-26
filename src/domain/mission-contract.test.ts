import type {
  AmbiguityOption,
  AmbiguitySlotKind,
  AudioCue,
  ConfirmationOption,
  CurriculumCode,
  DialogueTurn,
  EvaluationResult,
  GradeBand,
  MeaningOption,
  Mission,
  MissionStage,
  Naturalness,
  RepairOption,
  RepairStrategyId,
  SessionPhase,
} from './mission';
import type {
  AttemptRecord,
  MissionEvidence,
  MissionSessionAction,
  MissionSessionState,
} from './session';

const gradeBands = ['3-4', '5-6'] satisfies GradeBand[];
const curriculumCodes = [
  '[4영02-10]',
  '[6영02-07]',
  '[6영02-09]',
  '[6영02-10]',
] satisfies CurriculumCode[];
const repairStrategies = ['repeat', 'specify', 'confirm', 'rephrase'] satisfies RepairStrategyId[];
const ambiguitySlotKinds = [
  'whole-utterance',
  'object',
  'time',
  'place',
  'quantity',
  'person',
  'sequence',
  'decision',
] satisfies AmbiguitySlotKind[];
const missionStages = ['ambiguity', 'repair', 'meaning', 'confirmation'] satisfies MissionStage[];
const sessionPhases = ['center', 'observe', 'repair', 'response', 'confirm', 'record'] satisfies SessionPhase[];
const naturalnessValues = ['best-fit', 'works'] satisfies Naturalness[];

const dialogueTurnFixture = {
  id: 'turn-1',
  speaker: 'Teacher',
  textEn: 'Please put the crayons in that box.',
  supportKo: '그 상자에 크레용을 넣어 주세요.',
  obscuredLabelKo: '어느 상자인지 잘 모르겠어요.',
} satisfies DialogueTurn;

const ambiguityOptionFixture = {
  id: 'contract-fixture--ambiguity-target',
  turnId: dialogueTurnFixture.id,
  labelEn: 'that box',
  slotKind: 'object',
  accepted: true,
  feedbackKo: '대상이 여러 개라서 어느 상자인지 물어볼 수 있어요.',
} satisfies AmbiguityOption;

const repairOptionFixture = {
  id: 'contract-fixture--repair-best',
  strategyId: 'specify',
  textEn: 'Which box?',
  naturalness: 'best-fit',
  accepted: true,
  feedbackKo: '대상을 구체적으로 물었어요.',
} satisfies RepairOption;

const meaningOptionFixture = {
  id: 'contract-fixture--meaning-correct',
  labelKo: '창가 옆 파란 상자',
  accepted: true,
  feedbackKo: '추가 응답의 핵심 정보를 연결했어요.',
} satisfies MeaningOption;

const confirmationOptionFixture = {
  id: 'contract-fixture--confirmation-correct',
  mode: 'confirm',
  textEn: "So, I'll put the crayons in the blue box by the window.",
  accepted: true,
  feedbackKo: '이해한 뜻을 다시 확인했어요.',
} satisfies ConfirmationOption;

const audioCueFixture = {
  id: 'contract-fixture--dialogue',
  src: '/audio/contract-fixture/dialogue.mp3',
  mimeType: 'audio/mpeg',
  transcriptEn: 'Please put the crayons in that box.',
} satisfies AudioCue;

const evaluationResultFixture = {
  stage: 'repair',
  optionId: repairOptionFixture.id,
  status: 'accepted',
  feedbackKo: repairOptionFixture.feedbackKo,
  revealAnswer: false,
  naturalness: repairOptionFixture.naturalness,
} satisfies EvaluationResult;

const missionFixture = {
  id: 'contract-fixture',
  gradeBand: '3-4',
  titleKo: '상자 찾기',
  scenarioKo: '교실에서 물건을 정리합니다.',
  politenessContext: 'classroom-polite',
  curriculumCodes,
  learningTargets: ['understand', 'apply', 'analyze', 'create'],
  dialogue: [dialogueTurnFixture],
  ambiguityOptions: [ambiguityOptionFixture],
  allowedStrategyIds: ['specify'],
  repairOptions: [repairOptionFixture],
  clarifyingResponse: {
    id: 'turn-2',
    speaker: 'Teacher',
    textEn: 'The blue box by the window.',
  },
  meaningOptions: [meaningOptionFixture],
  confirmationOptions: [confirmationOptionFixture],
  audioCues: [audioCueFixture],
} satisfies Mission;

const attemptRecordFixture = {
  stage: evaluationResultFixture.stage,
  optionId: evaluationResultFixture.optionId,
  status: evaluationResultFixture.status,
} satisfies AttemptRecord;

const missionEvidenceFixture = {
  missionId: missionFixture.id,
  identifiedSlotKind: ambiguityOptionFixture.slotKind,
  repairStrategyId: repairOptionFixture.strategyId,
  firstMeaningOptionId: meaningOptionFixture.id,
  confirmedMeaningOptionId: meaningOptionFixture.id,
  meaningConfirmed: true,
  collaborationFeedbackKo: '서로 뜻을 확인하며 대화를 이어 갔어요.',
  attempts: [attemptRecordFixture],
} satisfies MissionEvidence;

const sessionStateFixture = {
  phase: 'record',
  missionId: missionFixture.id,
  selectedOptionIds: {
    ambiguity: ambiguityOptionFixture.id,
    repair: repairOptionFixture.id,
    meaning: meaningOptionFixture.id,
    confirmation: confirmationOptionFixture.id,
  },
  acceptedResults: { repair: evaluationResultFixture },
  latestResult: evaluationResultFixture,
  attempts: [attemptRecordFixture],
  firstMeaningOptionId: meaningOptionFixture.id,
  evidence: missionEvidenceFixture,
} satisfies MissionSessionState;

const actionFixtures = [
  { type: 'mission.started', missionId: missionFixture.id },
  { type: 'choice.selected', stage: 'ambiguity', optionId: ambiguityOptionFixture.id },
  { type: 'choice.submitted', mission: missionFixture, result: evaluationResultFixture },
  { type: 'mission.restarted' },
  { type: 'center.returned' },
] satisfies MissionSessionAction[];

// @ts-expect-error GradeBand must reject unsupported grade labels.
const invalidGradeBand: GradeBand = '2-3';
// @ts-expect-error CurriculumCode must reject unsupported curriculum labels.
const invalidCurriculumCode: CurriculumCode = '[4영02-11]';
// @ts-expect-error RepairStrategyId must reject unknown strategies.
const invalidRepairStrategy: RepairStrategyId = 'clarify';
// @ts-expect-error AmbiguitySlotKind must reject unknown slot kinds.
const invalidSlotKind: AmbiguitySlotKind = 'color';
// @ts-expect-error MissionStage must reject non-mission stages.
const invalidMissionStage: MissionStage = 'response';
// @ts-expect-error SessionPhase must reject unknown phases.
const invalidSessionPhase: SessionPhase = 'complete';
// @ts-expect-error Naturalness must reject unsupported feedback labels.
const invalidNaturalness: Naturalness = 'acceptable';
const invalidEvaluationResult: EvaluationResult = {
  ...evaluationResultFixture,
  // @ts-expect-error EvaluationResult must keep revealAnswer as the literal false.
  revealAnswer: true,
};
const invalidMissionEvidence: MissionEvidence = {
  ...missionEvidenceFixture,
  // @ts-expect-error MissionEvidence must keep meaningConfirmed as the literal true.
  meaningConfirmed: false,
};
// @ts-expect-error MissionSessionAction must reject unknown discriminants.
const invalidSessionAction: MissionSessionAction = { type: 'unknown' };

void invalidGradeBand;
void invalidCurriculumCode;
void invalidRepairStrategy;
void invalidSlotKind;
void invalidMissionStage;
void invalidSessionPhase;
void invalidNaturalness;
void invalidEvaluationResult;
void invalidMissionEvidence;
void invalidSessionAction;

it('keeps every mission contract member explicit', () => {
  expect(gradeBands).toEqual(['3-4', '5-6']);
  expect(curriculumCodes).toHaveLength(4);
  expect(repairStrategies).toEqual(['repeat', 'specify', 'confirm', 'rephrase']);
  expect(ambiguitySlotKinds).toHaveLength(8);
  expect(missionStages).toEqual(['ambiguity', 'repair', 'meaning', 'confirmation']);
  expect(sessionPhases).toEqual(['center', 'observe', 'repair', 'response', 'confirm', 'record']);
  expect(naturalnessValues).toEqual(['best-fit', 'works']);
  expect(missionFixture.audioCues[0]).toMatchObject({
    mimeType: 'audio/mpeg',
    transcriptEn: dialogueTurnFixture.textEn,
  });
});

it('keeps session state and every action variant usable', () => {
  expect(sessionStateFixture.evidence?.meaningConfirmed).toBe(true);
  expect(sessionStateFixture.latestResult?.revealAnswer).toBe(false);
  expect(actionFixtures.map((action) => action.type)).toEqual([
    'mission.started',
    'choice.selected',
    'choice.submitted',
    'mission.restarted',
    'center.returned',
  ]);
});
