import type { Mission } from '../../domain/mission';
import { AMBIGUITY_RETRY_FEEDBACK_KO, createConfirmationRetryFeedback, createMeaningRetryFeedback } from '../feedback';

export const GRADE56_EVENTS_MISSIONS = [
  {
    id: 'g56-event-decision',
    gradeBand: '5-6',
    titleKo: '행사 최종 계획',
    scenarioKo: '두 시간·장소 제안 가운데 확정된 계획을 확인합니다.',
    politenessContext: 'peer-brief',
    curriculumCodes: ['[6영02-07]', '[6영02-09]', '[6영02-10]'],
    learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [
      { id: 'g56-event-decision-dialogue', speaker: 'Partner', textEn: 'We could meet at two in the library, or at three in the art room. I think the second plan works better.' },
    ],
    ambiguityOptions: [
      { id: 'g56-event-decision--ambiguity-target', turnId: 'g56-event-decision-dialogue', labelEn: 'the final time and place', slotKind: 'decision', accepted: true, feedbackKo: '최종 결정이 무엇인지 찾았어요.' },
      { id: 'g56-event-decision--ambiguity-distractor-a', turnId: 'g56-event-decision-dialogue', labelEn: 'the library', slotKind: 'decision', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
      { id: 'g56-event-decision--ambiguity-distractor-b', turnId: 'g56-event-decision-dialogue', labelEn: 'the art room', slotKind: 'decision', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
    ],
    allowedStrategyIds: ['confirm'],
    repairOptions: [
      { id: 'g56-event-decision--repair-best', strategyId: 'confirm', textEn: 'Do you mean we’re meeting at three in the art room?', naturalness: 'best-fit', accepted: true, feedbackKo: '두 제안 중 최종 시간과 장소를 함께 확인했어요.' },
      { id: 'g56-event-decision--repair-works', strategyId: 'confirm', textEn: 'Is the final plan three o’clock in the art room?', naturalness: 'works', accepted: true, feedbackKo: '최종 계획의 시간과 장소를 다시 묻는 자연스러운 표현이에요.' },
      { id: 'g56-event-decision--repair-retry', strategyId: 'repeat', textEn: 'Could you say that again?', accepted: false, feedbackKo: '두 제안 중 무엇이 최종 결정인지 확인해 보세요.' },
    ],
    clarifyingResponse: { id: 'g56-event-decision-response', speaker: 'Partner', textEn: 'Yes. Three in the art room is the final plan.' },
    meaningOptions: [
      { id: 'g56-event-decision--meaning-correct', labelKo: '오후 3시 미술실이 최종 계획', accepted: true, feedbackKo: '추가 응답과 최종 결정의 의미가 맞아요.' },
      { id: 'g56-event-decision--meaning-retry-a', labelKo: '오후 2시 도서관이 최종 계획', accepted: false, feedbackKo: createMeaningRetryFeedback('decision') },
      { id: 'g56-event-decision--meaning-retry-b', labelKo: '오후 3시 도서관이 최종 계획', accepted: false, feedbackKo: createMeaningRetryFeedback('decision') },
    ],
    confirmationOptions: [
      { id: 'g56-event-decision--confirmation-correct', mode: 'confirm', textEn: 'Got it. The final plan is three o’clock in the art room.', accepted: true, feedbackKo: '오후 3시 미술실이라는 최종 계획을 확인했어요.' },
      { id: 'g56-event-decision--confirmation-retry-a', mode: 'confirm', textEn: 'Got it. The final plan is two o’clock in the library.', accepted: false, feedbackKo: createConfirmationRetryFeedback('decision') },
      { id: 'g56-event-decision--confirmation-retry-b', mode: 'confirm', textEn: 'Got it. The final plan is three o’clock in the library.', accepted: false, feedbackKo: createConfirmationRetryFeedback('decision') },
    ],
    audioCues: [],
  },
] satisfies readonly Mission[];
