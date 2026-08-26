import type { Mission } from '../../domain/mission';
import { AMBIGUITY_RETRY_FEEDBACK_KO, createConfirmationRetryFeedback, createMeaningRetryFeedback } from '../feedback';
import { getAudioCues } from './audioManifest';

export const GRADE34_RECESS_MISSIONS = [
  {
    id: 'g34-recess-place',
    gradeBand: '3-4',
    titleKo: '약속 장소',
    scenarioKo: '놀이터에 그네, 운동장 문, 벤치가 보입니다.',
    politenessContext: 'peer-brief',
    curriculumCodes: ['[4영02-10]'],
    learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [
      { id: 'g34-recess-place-dialogue', speaker: 'Partner', textEn: 'Let’s meet there after lunch.' },
    ],
    ambiguityOptions: [
      { id: 'g34-recess-place--ambiguity-target', turnId: 'g34-recess-place-dialogue', labelEn: 'there', slotKind: 'place', accepted: true, feedbackKo: '불명확한 장소를 찾았어요.' },
      { id: 'g34-recess-place--ambiguity-distractor-a', turnId: 'g34-recess-place-dialogue', labelEn: 'after lunch', slotKind: 'place', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
      { id: 'g34-recess-place--ambiguity-distractor-b', turnId: 'g34-recess-place-dialogue', labelEn: 'Let’s meet', slotKind: 'place', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
    ],
    allowedStrategyIds: ['specify', 'confirm'],
    repairOptions: [
      { id: 'g34-recess-place--repair-best', strategyId: 'specify', textEn: 'Where should we meet?', naturalness: 'best-fit', accepted: true, feedbackKo: '빠진 장소를 직접 물어 약속을 분명하게 했어요.' },
      { id: 'g34-recess-place--repair-works', strategyId: 'confirm', textEn: 'Do you mean by the swings?', naturalness: 'works', accepted: true, feedbackKo: '떠올린 장소가 맞는지 확인해 대화를 이어 갔어요.' },
      { id: 'g34-recess-place--repair-retry', strategyId: 'specify', textEn: 'What time?', accepted: false, feedbackKo: '만날 때는 알지만 만날 장소가 아직 없어요.' },
    ],
    clarifyingResponse: { id: 'g34-recess-place-response', speaker: 'Partner', textEn: 'At the bench beside the playground gate.' },
    meaningOptions: [
      { id: 'g34-recess-place--meaning-correct', labelKo: '운동장 문 옆 벤치', accepted: true, feedbackKo: '추가 응답과 의미가 맞아요.' },
      { id: 'g34-recess-place--meaning-retry-a', labelKo: '그네 옆', accepted: false, feedbackKo: createMeaningRetryFeedback('place') },
      { id: 'g34-recess-place--meaning-retry-b', labelKo: '교실 문 앞', accepted: false, feedbackKo: createMeaningRetryFeedback('place') },
    ],
    confirmationOptions: [
      { id: 'g34-recess-place--confirmation-correct', mode: 'confirm', textEn: 'We’ll meet at the bench beside the playground gate.', accepted: true, feedbackKo: '운동장 문 옆 벤치라는 뜻을 정확히 확인했어요.' },
      { id: 'g34-recess-place--confirmation-retry-a', mode: 'confirm', textEn: 'We’ll meet by the swings.', accepted: false, feedbackKo: createConfirmationRetryFeedback('place') },
      { id: 'g34-recess-place--confirmation-retry-b', mode: 'confirm', textEn: 'We’ll meet by the classroom door.', accepted: false, feedbackKo: createConfirmationRetryFeedback('place') },
    ],
    audioCues: getAudioCues('g34-recess-place'),
  },
  {
    id: 'g34-recess-time',
    gradeBand: '3-4',
    titleKo: '놀이 시작 시간',
    scenarioKo: '종이 울려 친구의 문장 전체를 놓쳤습니다.',
    politenessContext: 'peer-brief',
    curriculumCodes: ['[4영02-10]'],
    learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [
      { id: 'g34-recess-time-dialogue', speaker: 'Partner', textEn: 'You could not catch this sentence because the bell rang.', obscuredLabelKo: '종소리 때문에 이 문장 전체를 놓쳤습니다.' },
    ],
    ambiguityOptions: [
      { id: 'g34-recess-time--ambiguity-target', turnId: 'g34-recess-time-dialogue', labelEn: 'the whole sentence', slotKind: 'whole-utterance', accepted: true, feedbackKo: '놓친 문장 전체를 찾았어요.' },
      { id: 'g34-recess-time--ambiguity-distractor-a', turnId: 'g34-recess-time-dialogue', labelEn: 'the bell sound', slotKind: 'whole-utterance', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
      { id: 'g34-recess-time--ambiguity-distractor-b', turnId: 'g34-recess-time-dialogue', labelEn: 'the speaker', slotKind: 'whole-utterance', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
    ],
    allowedStrategyIds: ['repeat'],
    repairOptions: [
      { id: 'g34-recess-time--repair-best', strategyId: 'repeat', textEn: 'Could you say that again?', naturalness: 'best-fit', accepted: true, feedbackKo: '문장 전체를 놓친 상황에 꼭 맞는 다시 말하기 표현이에요.' },
      { id: 'g34-recess-time--repair-works', strategyId: 'repeat', textEn: 'Sorry, can you repeat that?', naturalness: 'works', accepted: true, feedbackKo: '미안함을 덧붙여 정중하게 반복을 요청했어요.' },
      { id: 'g34-recess-time--repair-retry', strategyId: 'specify', textEn: 'Which one?', accepted: false, feedbackKo: '문장 전체를 놓쳤을 때 쓰는 다시 말하기 신호를 찾아보세요.' },
    ],
    clarifyingResponse: { id: 'g34-recess-time-response', speaker: 'Partner', textEn: 'Let’s start the game at one thirty.' },
    meaningOptions: [
      { id: 'g34-recess-time--meaning-correct', labelKo: '오후 1시 30분', accepted: true, feedbackKo: '추가 응답과 의미가 맞아요.' },
      { id: 'g34-recess-time--meaning-retry-a', labelKo: '오후 1시', accepted: false, feedbackKo: createMeaningRetryFeedback('whole-utterance') },
      { id: 'g34-recess-time--meaning-retry-b', labelKo: '오후 2시 30분', accepted: false, feedbackKo: createMeaningRetryFeedback('whole-utterance') },
    ],
    confirmationOptions: [
      { id: 'g34-recess-time--confirmation-correct', mode: 'confirm', textEn: 'The game starts at one thirty, right?', accepted: true, feedbackKo: '놀이 시작 시간이 오후 1시 30분이라는 뜻을 확인했어요.' },
      { id: 'g34-recess-time--confirmation-retry-a', mode: 'confirm', textEn: 'The game starts at one, right?', accepted: false, feedbackKo: createConfirmationRetryFeedback('whole-utterance') },
      { id: 'g34-recess-time--confirmation-retry-b', mode: 'confirm', textEn: 'The game starts at two thirty, right?', accepted: false, feedbackKo: createConfirmationRetryFeedback('whole-utterance') },
    ],
    audioCues: getAudioCues('g34-recess-time'),
  },
  {
    id: 'g34-recess-rephrase',
    gradeBand: '3-4',
    titleKo: '장소를 다시 설명하기',
    scenarioKo: '친구가 “저기”가 어디인지 이해하지 못했습니다.',
    politenessContext: 'peer-brief',
    curriculumCodes: ['[4영02-10]'],
    learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [
      { id: 'g34-recess-rephrase-dialogue', speaker: 'Partner', textEn: 'Let’s do it over there.' },
    ],
    ambiguityOptions: [
      { id: 'g34-recess-rephrase--ambiguity-target', turnId: 'g34-recess-rephrase-dialogue', labelEn: 'over there', slotKind: 'place', accepted: true, feedbackKo: '불명확한 장소를 찾았어요.' },
      { id: 'g34-recess-rephrase--ambiguity-distractor-a', turnId: 'g34-recess-rephrase-dialogue', labelEn: 'Let’s', slotKind: 'place', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
      { id: 'g34-recess-rephrase--ambiguity-distractor-b', turnId: 'g34-recess-rephrase-dialogue', labelEn: 'do it', slotKind: 'place', accepted: false, feedbackKo: AMBIGUITY_RETRY_FEEDBACK_KO },
    ],
    allowedStrategyIds: ['rephrase'],
    repairOptions: [
      { id: 'g34-recess-rephrase--repair-best', strategyId: 'rephrase', textEn: 'Let me say it another way. Let’s draw with chalk beside the hopscotch grid.', naturalness: 'best-fit', accepted: true, feedbackKo: '장소를 구체적으로 넣어 내 뜻을 분명하게 바꾸어 말했어요.' },
      { id: 'g34-recess-rephrase--repair-works', strategyId: 'rephrase', textEn: 'I mean the place beside the hopscotch grid.', naturalness: 'works', accepted: true, feedbackKo: '핵심 장소를 다른 말로 풀어 상대가 이해할 수 있게 했어요.' },
      { id: 'g34-recess-rephrase--repair-retry', strategyId: 'repeat', textEn: 'Could you say that again?', accepted: false, feedbackKo: '상대가 내 말을 이해하지 못했으니 내 뜻을 다른 말로 풀어보세요.' },
    ],
    clarifyingResponse: { id: 'g34-recess-rephrase-response', speaker: 'Partner', textEn: 'Okay, beside the hopscotch grid.' },
    meaningOptions: [
      { id: 'g34-recess-rephrase--meaning-correct', labelKo: '사방치기 칸 옆', accepted: true, feedbackKo: '추가 응답과 의미가 맞아요.' },
      { id: 'g34-recess-rephrase--meaning-retry-a', labelKo: '큰 나무 아래', accepted: false, feedbackKo: createMeaningRetryFeedback('place') },
      { id: 'g34-recess-rephrase--meaning-retry-b', labelKo: '그네 옆', accepted: false, feedbackKo: createMeaningRetryFeedback('place') },
    ],
    confirmationOptions: [
      { id: 'g34-recess-rephrase--confirmation-correct', mode: 'rephrase', textEn: 'Right, I mean the place beside the hopscotch grid.', accepted: true, feedbackKo: '사방치기 칸 옆이라는 뜻을 다시 분명하게 말했어요.' },
      { id: 'g34-recess-rephrase--confirmation-retry-a', mode: 'rephrase', textEn: 'Right, I mean the place under the big tree.', accepted: false, feedbackKo: createConfirmationRetryFeedback('place') },
      { id: 'g34-recess-rephrase--confirmation-retry-b', mode: 'rephrase', textEn: 'Right, I mean the place beside the swings.', accepted: false, feedbackKo: createConfirmationRetryFeedback('place') },
    ],
    audioCues: getAudioCues('g34-recess-rephrase'),
  },
] satisfies readonly Mission[];
