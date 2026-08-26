import type { Mission } from '../../../domain/mission';

export const GRADE56_DIRECTIONS_CONTRACT = [
  {
    id: 'g56-directions-place', gradeBand: '5-6', titleKo: '비슷한 장소 이름', scenarioKo: '길 안내에 체육관과 음악당이 함께 나옵니다.', politenessContext: 'peer-brief', curriculumCodes: ['[6영02-07]', '[6영02-09]'], learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [{ id: 'g56-directions-place-dialogue', speaker: 'Guide', textEn: 'After the bank, turn toward the hall.' }],
    ambiguityOptions: [
      { id: 'g56-directions-place--ambiguity-target', turnId: 'g56-directions-place-dialogue', labelEn: 'the hall', slotKind: 'place', accepted: true, feedbackKo: '불명확한 장소를 찾았어요.' },
      { id: 'g56-directions-place--ambiguity-distractor-a', turnId: 'g56-directions-place-dialogue', labelEn: 'the bank', slotKind: 'place', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요.' },
      { id: 'g56-directions-place--ambiguity-distractor-b', turnId: 'g56-directions-place-dialogue', labelEn: 'After', slotKind: 'place', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요.' },
    ],
    allowedStrategyIds: ['specify', 'confirm'],
    repairOptions: [
      { id: 'g56-directions-place--repair-best', strategyId: 'specify', textEn: 'Which hall do you mean?', naturalness: 'best-fit', accepted: true, feedbackKo: '어느 홀인지 직접 물어 장소를 구체화했어요.' },
      { id: 'g56-directions-place--repair-works', strategyId: 'confirm', textEn: 'Do you mean the music hall?', naturalness: 'works', accepted: true, feedbackKo: '가능한 홀 이름을 확인해 길 안내를 이어 갔어요.' },
      { id: 'g56-directions-place--repair-retry', strategyId: 'repeat', textEn: 'Could you say that again?', accepted: false, feedbackKo: '안내는 들었지만 어느 장소인지 구체화해야 해요.' },
    ],
    clarifyingResponse: { id: 'g56-directions-place-response', speaker: 'Guide', textEn: 'The music hall across from the bakery.' },
    meaningOptions: [
      { id: 'g56-directions-place--meaning-correct', labelKo: '빵집 맞은편 음악당', accepted: true, feedbackKo: '추가 응답과 의미가 맞아요.' },
      { id: 'g56-directions-place--meaning-retry-a', labelKo: '빵집 맞은편 체육관', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요.' },
      { id: 'g56-directions-place--meaning-retry-b', labelKo: '은행 옆 음악당', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요.' },
    ],
    confirmationOptions: [
      { id: 'g56-directions-place--confirmation-correct', mode: 'confirm', textEn: 'I turn toward the music hall across from the bakery.', accepted: true, feedbackKo: '빵집 맞은편 음악당이라는 장소를 확인했어요.' },
      { id: 'g56-directions-place--confirmation-retry-a', mode: 'confirm', textEn: 'I turn toward the sports hall across from the bakery.', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요.' },
      { id: 'g56-directions-place--confirmation-retry-b', mode: 'confirm', textEn: 'I turn toward the music hall beside the bank.', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요.' },
    ], audioCues: [],
  },
  {
    id: 'g56-directions-sequence', gradeBand: '5-6', titleKo: '길 안내 순서', scenarioKo: '약국과 두 번째 신호등 뒤의 이동 순서를 확인합니다.', politenessContext: 'peer-brief', curriculumCodes: ['[6영02-07]', '[6영02-09]'], learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [{ id: 'g56-directions-sequence-dialogue', speaker: 'Guide', textEn: 'Walk past the pharmacy and cross at the second light. Then take the next turn.' }],
    ambiguityOptions: [
      { id: 'g56-directions-sequence--ambiguity-target', turnId: 'g56-directions-sequence-dialogue', labelEn: 'the next turn', slotKind: 'sequence', accepted: true, feedbackKo: '불명확한 이동 순서를 찾았어요.' },
      { id: 'g56-directions-sequence--ambiguity-distractor-a', turnId: 'g56-directions-sequence-dialogue', labelEn: 'the pharmacy', slotKind: 'sequence', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요.' },
      { id: 'g56-directions-sequence--ambiguity-distractor-b', turnId: 'g56-directions-sequence-dialogue', labelEn: 'the second light', slotKind: 'sequence', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요.' },
    ],
    allowedStrategyIds: ['specify', 'confirm'],
    repairOptions: [
      { id: 'g56-directions-sequence--repair-best', strategyId: 'specify', textEn: 'What should I do after the second traffic light?', naturalness: 'best-fit', accepted: true, feedbackKo: '두 번째 신호등 뒤의 순서를 직접 물었어요.' },
      { id: 'g56-directions-sequence--repair-works', strategyId: 'confirm', textEn: 'Do I turn right after the second light?', naturalness: 'works', accepted: true, feedbackKo: '예상한 방향이 맞는지 구체적으로 확인했어요.' },
      { id: 'g56-directions-sequence--repair-retry', strategyId: 'specify', textEn: 'Where is the pharmacy?', accepted: false, feedbackKo: '약국 뒤에 어떤 순서로 움직이는지 확인해 보세요.' },
    ],
    clarifyingResponse: { id: 'g56-directions-sequence-response', speaker: 'Guide', textEn: 'Turn right. The library is the first building on the left.' },
    meaningOptions: [
      { id: 'g56-directions-sequence--meaning-correct', labelKo: '두 번째 신호등 뒤 우회전, 왼쪽 첫 건물 도서관', accepted: true, feedbackKo: '추가 응답과 이동 순서가 맞아요.' },
      { id: 'g56-directions-sequence--meaning-retry-a', labelKo: '두 번째 신호등 뒤 좌회전', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 순서 정보를 다시 찾아보세요.' },
      { id: 'g56-directions-sequence--meaning-retry-b', labelKo: '우회전 뒤 왼쪽 두 번째 건물 도서관', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 순서 정보를 다시 찾아보세요.' },
    ],
    confirmationOptions: [
      { id: 'g56-directions-sequence--confirmation-correct', mode: 'confirm', textEn: 'After the second light, I turn right and find the library on the left.', accepted: true, feedbackKo: '두 번째 신호등 뒤 우회전과 도서관 위치를 확인했어요.' },
      { id: 'g56-directions-sequence--confirmation-retry-a', mode: 'confirm', textEn: 'After the second light, I turn left.', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 확인 문장에서 순서 정보가 바뀌거나 빠졌어요.' },
      { id: 'g56-directions-sequence--confirmation-retry-b', mode: 'confirm', textEn: 'After the second light, I turn right and pass the library on the right.', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 확인 문장에서 순서 정보가 바뀌거나 빠졌어요.' },
    ], audioCues: [],
  },
] satisfies readonly Mission[];
