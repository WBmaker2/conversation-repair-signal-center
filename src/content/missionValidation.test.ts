import { describe, expect, it } from 'vitest';
import type {
  AmbiguityOption,
  ConfirmationOption,
  MeaningOption,
  Mission,
  RepairOption,
} from '../domain/mission';
import {
  AMBIGUITY_RETRY_FEEDBACK_KO,
  createConfirmationRetryFeedback,
  createMeaningRetryFeedback,
  SLOT_LABELS_KO,
} from './feedback';
import { validateMissionPack, type ValidationCode } from './missionValidation';
import { CURRICULUM_LINKS } from './curriculum';
import { REPAIR_STRATEGIES } from './strategies';

const BASE_ID = 'fixture-mission';
const SLOT_KINDS = [
  'whole-utterance',
  'object',
  'time',
  'place',
  'quantity',
  'person',
  'sequence',
  'decision',
] as const;

function acceptedAmbiguity(slotKind: (typeof SLOT_KINDS)[number]): AmbiguityOption {
  return {
    id: `${BASE_ID}--ambiguity-target`,
    turnId: `${BASE_ID}-turn`,
    labelEn: 'that item',
    slotKind,
    accepted: true,
    feedbackKo: '모호한 정보를 찾았어요.',
  };
}

function acceptedRepair(overrides: Partial<RepairOption> = {}): RepairOption {
  return {
    id: `${BASE_ID}--repair-best`,
    strategyId: 'specify',
    textEn: 'Which item?',
    naturalness: 'best-fit',
    accepted: true,
    feedbackKo: '필요한 정보를 직접 물었어요.',
    ...overrides,
  };
}

function acceptedMeaning(): MeaningOption {
  return {
    id: `${BASE_ID}--meaning-correct`,
    labelKo: '파란 물건',
    accepted: true,
    feedbackKo: '추가 답과 의미가 맞아요.',
  };
}

function acceptedConfirmation(): ConfirmationOption {
  return {
    id: `${BASE_ID}--confirmation-correct`,
    mode: 'confirm',
    textEn: 'So, I will bring the blue item.',
    accepted: true,
    feedbackKo: '이해한 뜻을 확인했어요.',
  };
}

function makeValidMission(overrides: Partial<Mission> = {}): Mission {
  const id = overrides.id ?? BASE_ID;
  const turnId = `${id}-turn`;
  const base: Mission = {
    id,
    gradeBand: '3-4',
    titleKo: '어떤 물건',
    scenarioKo: '교실에서 물건을 확인합니다.',
    politenessContext: 'classroom-polite',
    curriculumCodes: ['[4영02-10]'],
    learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [{ id: turnId, speaker: 'A', textEn: 'Please bring that item.' }],
    ambiguityOptions: [
      {
        ...acceptedAmbiguity('object'),
        id: `${id}--ambiguity-target`,
        turnId,
      },
      {
        id: `${id}--ambiguity-distractor-a`,
        turnId,
        labelEn: 'Please',
        slotKind: 'object',
        accepted: false,
        feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO,
      },
      {
        id: `${id}--ambiguity-distractor-b`,
        turnId,
        labelEn: 'bring',
        slotKind: 'object',
        accepted: false,
        feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO,
      },
    ],
    allowedStrategyIds: ['repeat', 'specify', 'confirm', 'rephrase'],
    repairOptions: [
      acceptedRepair({ id: `${id}--repair-best` }),
      acceptedRepair({
        id: `${id}--repair-works`,
        textEn: 'Do you mean the blue item?',
        naturalness: 'works',
        feedbackKo: '가능한 대상을 확인했어요.',
      }),
      {
        id: `${id}--repair-retry`,
        strategyId: 'repeat',
        textEn: 'Thank you.',
        accepted: false,
        feedbackKo: '어떤 정보가 아직 없나요?',
      },
    ],
    clarifyingResponse: {
      id: `${id}-response`,
      speaker: 'A',
      textEn: 'The blue item by the window.',
    },
    meaningOptions: [
      { ...acceptedMeaning(), id: `${id}--meaning-correct` },
      {
        id: `${id}--meaning-retry-a`,
        labelKo: '빨간 물건',
        accepted: false,
        feedbackKo: createMeaningRetryFeedback('object'),
      },
      {
        id: `${id}--meaning-retry-b`,
        labelKo: '창문',
        accepted: false,
        feedbackKo: createMeaningRetryFeedback('object'),
      },
    ],
    confirmationOptions: [
      { ...acceptedConfirmation(), id: `${id}--confirmation-correct` },
      {
        id: `${id}--confirmation-retry-a`,
        mode: 'confirm',
        textEn: 'So, I will bring the red item.',
        accepted: false,
        feedbackKo: createConfirmationRetryFeedback('object'),
      },
      {
        id: `${id}--confirmation-retry-b`,
        mode: 'confirm',
        textEn: 'So, I will bring the item.',
        accepted: false,
        feedbackKo: createConfirmationRetryFeedback('object'),
      },
    ],
    audioCues: [],
  };
  return { ...base, ...overrides, id };
}

function makeTenMissionPack(template = makeValidMission()): Mission[] {
  return Array.from({ length: 10 }, (_, index) => {
    const id = index === 0 ? template.id : `${template.id}-${index + 1}`;
    return {
      ...template,
      id,
      gradeBand: index < 5 ? '3-4' : '5-6',
      dialogue: template.dialogue.map((turn) => ({ ...turn, id: `${id}-turn` })),
    };
  });
}

describe('content catalogs', () => {
  it('defines the four exact repair strategies', () => {
    expect(REPAIR_STRATEGIES).toEqual([
      { id: 'repeat', labelKo: '다시 말해 주세요', purposeKo: '전체 발화를 놓쳤을 때', examplesEn: ['Could you say that again?'] },
      { id: 'specify', labelKo: '더 구체적으로', purposeKo: '대상·시간·장소·수량·담당·순서가 불분명할 때', examplesEn: ['Which one?', 'What time?'] },
      { id: 'confirm', labelKo: '뜻 확인', purposeKo: '내가 이해한 내용이 맞는지 확인할 때', examplesEn: ['Do you mean the blue box?'] },
      { id: 'rephrase', labelKo: '다르게 말하기', purposeKo: '상대가 내 말을 이해하지 못했을 때', examplesEn: ['Let me say it another way.'] },
    ]);
  });

  it('preserves every curriculum description and stage mapping', () => {
    expect(CURRICULUM_LINKS).toEqual([
      { code: '[4영02-10]', descriptionKo: '대화 예절을 지키며 의사소통에 참여하기', evidenceStages: ['repair', 'confirmation'] },
      { code: '[6영02-07]', descriptionKo: '일상생활의 담화나 글에서 세부 정보를 묻고 답하기', evidenceStages: ['ambiguity', 'meaning'] },
      { code: '[6영02-09]', descriptionKo: '적절한 매체와 전략을 활용하여 의미를 생성하고 표현하기', evidenceStages: ['ambiguity', 'repair', 'meaning', 'confirmation'] },
      { code: '[6영02-10]', descriptionKo: '자신감을 가지고 협력적으로 의사소통 활동에 참여하기', evidenceStages: ['repair', 'confirmation'] },
    ]);
  });

  it('builds complete Korean hints from every exact slot label', () => {
    expect(Object.keys(SLOT_LABELS_KO)).toHaveLength(8);
    for (const slotKind of SLOT_KINDS) {
      expect(createMeaningRetryFeedback(slotKind)).toContain(SLOT_LABELS_KO[slotKind]);
      expect(createConfirmationRetryFeedback(slotKind)).toContain(SLOT_LABELS_KO[slotKind]);
    }
    expect(createMeaningRetryFeedback('quantity')).toBe(
      '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 수량 정보를 다시 찾아보세요.',
    );
    expect(createConfirmationRetryFeedback('decision')).toBe(
      '어떤 정보가 아직 없나요? 확인 문장에서 최종 결정 정보가 바뀌거나 빠졌어요.',
    );
  });
});

describe('validateMissionPack', () => {
  it('accepts a complete ten-mission pack', () => {
    const report = validateMissionPack(makeTenMissionPack());
    expect(report).toEqual({
      valid: true,
      issues: [],
      coverage: {
        missionCount: 10,
        gradeBandCounts: { '3-4': 5, '5-6': 5 },
        strategyIds: ['repeat', 'specify', 'confirm', 'rephrase'],
        missionsWithMultipleAcceptedRepairs: [
          'fixture-mission',
          'fixture-mission-10',
          'fixture-mission-2',
          'fixture-mission-3',
          'fixture-mission-4',
          'fixture-mission-5',
          'fixture-mission-6',
          'fixture-mission-7',
          'fixture-mission-8',
          'fixture-mission-9',
        ],
      },
    });
  });

  it('rejects a pack without ten missions and all four strategies', () => {
    const report = validateMissionPack([makeValidMission({ id: 'only-one', allowedStrategyIds: ['specify'] })]);
    expect(report.valid).toBe(false);
    expect(report.issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['PACK_COUNT', 'GRADE_BAND_COUNT', 'STRATEGY_COVERAGE']),
    );
  });

  it('reports duplicate IDs and wrong grade-band counts', () => {
    const pack = makeTenMissionPack();
    const first = pack[0];
    const sixth = pack[5];
    if (!first || !sixth) throw new Error('fixture pack is incomplete');
    pack[5] = { ...sixth, id: first.id, gradeBand: '3-4' };
    const report = validateMissionPack(pack);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'DUPLICATE_ID', missionId: first.id }),
      expect.objectContaining({ code: 'GRADE_BAND_COUNT', missionId: 'pack' }),
    ]));
  });

  it('requires an accepted option at every learning stage', () => {
    const mission = makeValidMission({
      ambiguityOptions: makeValidMission().ambiguityOptions.map((option) => ({ ...option, accepted: false })),
      repairOptions: makeValidMission().repairOptions.map((option) => ({ ...option, accepted: false })),
      meaningOptions: makeValidMission().meaningOptions.map((option) => ({ ...option, accepted: false })),
      confirmationOptions: makeValidMission().confirmationOptions.map((option) => ({ ...option, accepted: false })),
    });
    const issues = validateMissionPack(makeTenMissionPack(mission)).issues;
    expect(issues.filter(({ code }) => code === 'MISSING_STAGE_OPTION')).toHaveLength(40);
  });

  it('rejects accepted repair options outside allowed strategies', () => {
    const mission = makeValidMission({
      allowedStrategyIds: ['specify'],
      repairOptions: [
        acceptedRepair({ id: 'wrong-contract', strategyId: 'repeat' }),
        acceptedRepair({ id: 'second-contract', strategyId: 'specify', naturalness: 'works' }),
      ],
    });
    expect(validateMissionPack(makeTenMissionPack(mission)).issues).toContainEqual(
      expect.objectContaining({ missionId: mission.id, code: 'REPAIR_NOT_ALLOWED' }),
    );
  });

  it('requires multiple accepted repairs with distinct naturalness feedback', () => {
    const missing = makeValidMission({ repairOptions: [acceptedRepair()] });
    const duplicate = makeValidMission({
      repairOptions: [
        acceptedRepair({ feedbackKo: '같은 피드백' }),
        acceptedRepair({ id: 'other', feedbackKo: '같은 피드백', naturalness: 'works' }),
      ],
    });
    expect(validateMissionPack(makeTenMissionPack(missing)).issues.map(({ code }) => code))
      .toContain('MULTIPLE_EXPRESSION_REQUIRED');
    expect(validateMissionPack(makeTenMissionPack(duplicate)).issues.map(({ code }) => code))
      .toContain('DUPLICATE_FEEDBACK');
  });

  it('requires a curriculum link and all four learning targets', () => {
    const mission = makeValidMission({ curriculumCodes: [], learningTargets: [] });
    const codes = validateMissionPack(makeTenMissionPack(mission)).issues.map(({ code }) => code);
    expect(codes).toContain('CURRICULUM_LINK_REQUIRED');
    expect(codes).toContain('LEARNING_TARGET_REQUIRED');
  });

  it('rejects external audio URLs and blank transcripts but allows empty audio arrays', () => {
    const emptyReport = validateMissionPack(makeTenMissionPack());
    expect(emptyReport.issues.map(({ code }) => code)).not.toContain('EXTERNAL_AUDIO_URL');
    const mission = makeValidMission({
      audioCues: [
        { id: 'external', src: 'https://example.com/audio.mp3', mimeType: 'audio/mpeg', transcriptEn: 'hello' },
        { id: 'blank', src: 'audio/fixture.mp3', mimeType: 'audio/mpeg', transcriptEn: '   ' },
      ],
    });
    const codes = validateMissionPack(makeTenMissionPack(mission)).issues.map(({ code }) => code);
    expect(codes).toEqual(expect.arrayContaining(['EXTERNAL_AUDIO_URL', 'TRANSCRIPT_REQUIRED']));
  });

  it('does not mutate readonly mission input and keeps issue ordering stable', () => {
    const pack = Object.freeze(makeTenMissionPack(makeValidMission({ id: 'ordered' })));
    const before = pack.map((mission) => mission.id);
    const first = validateMissionPack(pack);
    const second = validateMissionPack(pack);
    expect(pack.map((mission) => mission.id)).toEqual(before);
    expect(first).toEqual(second);
  });

  it.each<ValidationCode>([
    'PACK_COUNT', 'DUPLICATE_ID', 'GRADE_BAND_COUNT', 'STRATEGY_COVERAGE',
    'MISSING_STAGE_OPTION', 'REPAIR_NOT_ALLOWED', 'MULTIPLE_EXPRESSION_REQUIRED',
    'DUPLICATE_FEEDBACK', 'CURRICULUM_LINK_REQUIRED', 'LEARNING_TARGET_REQUIRED',
    'EXTERNAL_AUDIO_URL', 'TRANSCRIPT_REQUIRED',
  ])('exposes validation code %s in the contract', (code) => {
    expect(code).toMatch(/^[A-Z_]+$/);
  });
});
