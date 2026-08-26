import type { Mission } from '../../domain/mission';
import { AMBIGUITY_RETRY_FEEDBACK_KO, createConfirmationRetryFeedback, createMeaningRetryFeedback } from '../feedback';

export const GRADE56_MATERIALS_MISSIONS = [
  {
    id: 'g56-materials-quantity',
    gradeBand: '5-6',
    titleKo: '준비물 수량',
    scenarioKo: '모둠 포스터에 필요한 종이 수량을 정합니다.',
    politenessContext: 'classroom-polite',
    curriculumCodes: ['[6영02-07]', '[6영02-09]'],
    learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [
      { id: 'g56-materials-quantity-dialogue', speaker: 'Leader', textEn: 'Please bring some sheets of poster paper tomorrow.' },
    ],
    ambiguityOptions: [
      { id: 'g56-materials-quantity--ambiguity-target', turnId: 'g56-materials-quantity-dialogue', labelEn: 'some sheets', slotKind: 'quantity', accepted: true, feedbackKo: '불명확한 수량을 찾았어요.' },
      { id: 'g56-materials-quantity--ambiguity-distractor-a', turnId: 'g56-materials-quantity-dialogue', labelEn: 'poster paper', slotKind: 'quantity', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
      { id: 'g56-materials-quantity--ambiguity-distractor-b', turnId: 'g56-materials-quantity-dialogue', labelEn: 'tomorrow', slotKind: 'quantity', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
    ],
    allowedStrategyIds: ['specify'],
    repairOptions: [
      { id: 'g56-materials-quantity--repair-best', strategyId: 'specify', textEn: 'How many sheets of poster paper should I bring?', naturalness: 'best-fit', accepted: true, feedbackKo: '필요한 종이 수량을 정확히 물었어요.' },
      { id: 'g56-materials-quantity--repair-works', strategyId: 'specify', textEn: 'How much poster paper should I bring?', naturalness: 'works', accepted: true, feedbackKo: '묻는 범위가 넓지만 필요한 수량을 확인할 수 있어요.' },
      { id: 'g56-materials-quantity--repair-retry', strategyId: 'specify', textEn: 'Who will bring it?', accepted: false, feedbackKo: '담당자가 아니라 필요한 종이 수량을 확인해 보세요.' },
    ],
    clarifyingResponse: { id: 'g56-materials-quantity-response', speaker: 'Leader', textEn: 'Please bring four sheets.' },
    meaningOptions: [
      { id: 'g56-materials-quantity--meaning-correct', labelKo: '포스터 종이 네 장', accepted: true, feedbackKo: '추가 응답과 의미가 맞아요.' },
      { id: 'g56-materials-quantity--meaning-retry-a', labelKo: '포스터 종이 두 장', accepted: false, feedbackKo: createMeaningRetryFeedback('quantity') },
      { id: 'g56-materials-quantity--meaning-retry-b', labelKo: '포스터 종이 네 묶음', accepted: false, feedbackKo: createMeaningRetryFeedback('quantity') },
    ],
    confirmationOptions: [
      { id: 'g56-materials-quantity--confirmation-correct', mode: 'confirm', textEn: 'I’ll bring four sheets of poster paper tomorrow.', accepted: true, feedbackKo: '포스터 종이 네 장이라는 수량을 확인했어요.' },
      { id: 'g56-materials-quantity--confirmation-retry-a', mode: 'confirm', textEn: 'I’ll bring two sheets of poster paper tomorrow.', accepted: false, feedbackKo: createConfirmationRetryFeedback('quantity') },
      { id: 'g56-materials-quantity--confirmation-retry-b', mode: 'confirm', textEn: 'I’ll bring four packs of poster paper tomorrow.', accepted: false, feedbackKo: createConfirmationRetryFeedback('quantity') },
    ],
    audioCues: [],
  },
  {
    id: 'g56-materials-person',
    gradeBand: '5-6',
    titleKo: '준비물 담당자',
    scenarioKo: '테이프와 마커를 누가 가져올지 확인합니다.',
    politenessContext: 'classroom-polite',
    curriculumCodes: ['[6영02-07]', '[6영02-09]', '[6영02-10]'],
    learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [
      { id: 'g56-materials-person-dialogue', speaker: 'Leader', textEn: 'Minseo has the tape. We still need the markers.' },
    ],
    ambiguityOptions: [
      { id: 'g56-materials-person--ambiguity-target', turnId: 'g56-materials-person-dialogue', labelEn: 'who brings the markers', slotKind: 'person', accepted: true, feedbackKo: '빠진 담당자를 찾았어요.' },
      { id: 'g56-materials-person--ambiguity-distractor-a', turnId: 'g56-materials-person-dialogue', labelEn: 'Minseo has the tape', slotKind: 'person', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
      { id: 'g56-materials-person--ambiguity-distractor-b', turnId: 'g56-materials-person-dialogue', labelEn: 'the tape', slotKind: 'person', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
    ],
    allowedStrategyIds: ['specify', 'confirm'],
    repairOptions: [
      { id: 'g56-materials-person--repair-best', strategyId: 'specify', textEn: 'Who will bring the markers?', naturalness: 'best-fit', accepted: true, feedbackKo: '빠진 담당자를 직접 물어 역할을 분명하게 했어요.' },
      { id: 'g56-materials-person--repair-works', strategyId: 'confirm', textEn: 'Do you mean you will bring the markers?', naturalness: 'works', accepted: true, feedbackKo: '가능한 담당자가 맞는지 확인했어요.' },
      { id: 'g56-materials-person--repair-retry', strategyId: 'specify', textEn: 'How many markers?', accepted: false, feedbackKo: '수량보다 누가 맡는지가 아직 정해지지 않았어요.' },
    ],
    clarifyingResponse: { id: 'g56-materials-person-response', speaker: 'Leader', textEn: 'I will bring two packs of markers.' },
    meaningOptions: [
      { id: 'g56-materials-person--meaning-correct', labelKo: '상대가 마커 두 묶음, 민서가 테이프 담당', accepted: true, feedbackKo: '추가 응답과 담당 의미가 맞아요.' },
      { id: 'g56-materials-person--meaning-retry-a', labelKo: '민서가 마커와 테이프 모두 담당', accepted: false, feedbackKo: createMeaningRetryFeedback('person') },
      { id: 'g56-materials-person--meaning-retry-b', labelKo: '상대가 테이프, 민서가 마커 담당', accepted: false, feedbackKo: createMeaningRetryFeedback('person') },
    ],
    confirmationOptions: [
      { id: 'g56-materials-person--confirmation-correct', mode: 'confirm', textEn: 'You’ll bring two packs of markers, and Minseo has the tape.', accepted: true, feedbackKo: '상대와 민서의 준비물 담당을 확인했어요.' },
      { id: 'g56-materials-person--confirmation-retry-a', mode: 'confirm', textEn: 'Minseo will bring the markers and the tape.', accepted: false, feedbackKo: createConfirmationRetryFeedback('person') },
      { id: 'g56-materials-person--confirmation-retry-b', mode: 'confirm', textEn: 'You’ll bring the tape, and Minseo has the markers.', accepted: false, feedbackKo: createConfirmationRetryFeedback('person') },
    ],
    audioCues: [],
  },
] satisfies readonly Mission[];
