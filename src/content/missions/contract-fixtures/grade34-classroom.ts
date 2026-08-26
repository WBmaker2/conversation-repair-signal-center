import type { Mission } from '../../../domain/mission';

export const GRADE34_CLASSROOM_CONTRACT = [
  {
    id: 'g34-classroom-box', gradeBand: '3-4', titleKo: '어느 상자', scenarioKo: '교실에 빨간 상자와 파란 상자가 함께 있습니다.', politenessContext: 'classroom-polite', curriculumCodes: ['[4영02-10]'], learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [{ id: 'g34-classroom-box-dialogue', speaker: 'Teacher', textEn: 'Please put the crayons in that box.' }],
    ambiguityOptions: [
      { id: 'g34-classroom-box--ambiguity-target', turnId: 'g34-classroom-box-dialogue', labelEn: 'that box', slotKind: 'object', accepted: true, feedbackKo: '불명확한 대상을 찾았어요.' },
      { id: 'g34-classroom-box--ambiguity-distractor-a', turnId: 'g34-classroom-box-dialogue', labelEn: 'the crayons', slotKind: 'object', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요.' },
      { id: 'g34-classroom-box--ambiguity-distractor-b', turnId: 'g34-classroom-box-dialogue', labelEn: 'Please put', slotKind: 'object', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요.' },
    ],
    allowedStrategyIds: ['specify', 'confirm'],
    repairOptions: [
      { id: 'g34-classroom-box--repair-best', strategyId: 'specify', textEn: 'Which box?', naturalness: 'best-fit', accepted: true, feedbackKo: '어느 상자인지 직접 물어 상황에 꼭 맞는 표현이에요.' },
      { id: 'g34-classroom-box--repair-works', strategyId: 'confirm', textEn: 'Do you mean the blue box?', naturalness: 'works', accepted: true, feedbackKo: '가능한 상자를 정중하게 확인해 대화를 이어 갔어요.' },
      { id: 'g34-classroom-box--repair-retry', strategyId: 'repeat', textEn: 'Could you say that again?', accepted: false, feedbackKo: '말은 들었지만 어느 상자인지가 아직 분명하지 않아요.' },
    ],
    clarifyingResponse: { id: 'g34-classroom-box-response', speaker: 'Teacher', textEn: 'The blue box by the window.' },
    meaningOptions: [
      { id: 'g34-classroom-box--meaning-correct', labelKo: '창가에 있는 파란 상자', accepted: true, feedbackKo: '추가 응답과 의미가 맞아요.' },
      { id: 'g34-classroom-box--meaning-retry-a', labelKo: '문 옆 빨간 상자', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요.' },
      { id: 'g34-classroom-box--meaning-retry-b', labelKo: '책상 아래 파란 상자', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요.' },
    ],
    confirmationOptions: [
      { id: 'g34-classroom-box--confirmation-correct', mode: 'confirm', textEn: 'So, I’ll put the crayons in the blue box by the window.', accepted: true, feedbackKo: '창가의 파란 상자라는 뜻을 정확히 확인했어요.' },
      { id: 'g34-classroom-box--confirmation-retry-a', mode: 'confirm', textEn: 'So, I’ll put the crayons in the red box by the door.', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요.' },
      { id: 'g34-classroom-box--confirmation-retry-b', mode: 'confirm', textEn: 'So, I’ll put the crayons in the blue box under the desk.', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요.' },
    ], audioCues: [],
  },
  {
    id: 'g34-classroom-pencil', gradeBand: '3-4', titleKo: '어떤 연필', scenarioKo: '책상에 긴 연필과 짧은 연필이 있습니다.', politenessContext: 'classroom-polite', curriculumCodes: ['[4영02-10]'], learningTargets: ['understand', 'apply', 'analyze', 'create'],
    dialogue: [{ id: 'g34-classroom-pencil-dialogue', speaker: 'Partner', textEn: 'Can you pass me that one?' }],
    ambiguityOptions: [
      { id: 'g34-classroom-pencil--ambiguity-target', turnId: 'g34-classroom-pencil-dialogue', labelEn: 'that one', slotKind: 'object', accepted: true, feedbackKo: '불명확한 대상을 찾았어요.' },
      { id: 'g34-classroom-pencil--ambiguity-distractor-a', turnId: 'g34-classroom-pencil-dialogue', labelEn: 'pass me', slotKind: 'object', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요.' },
      { id: 'g34-classroom-pencil--ambiguity-distractor-b', turnId: 'g34-classroom-pencil-dialogue', labelEn: 'Can you', slotKind: 'object', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요.' },
    ],
    allowedStrategyIds: ['specify', 'confirm'],
    repairOptions: [
      { id: 'g34-classroom-pencil--repair-best', strategyId: 'specify', textEn: 'Which one?', naturalness: 'best-fit', accepted: true, feedbackKo: '어떤 연필인지 바로 물어 필요한 정보를 찾았어요.' },
      { id: 'g34-classroom-pencil--repair-works', strategyId: 'confirm', textEn: 'Do you mean the long pencil?', naturalness: 'works', accepted: true, feedbackKo: '가능한 연필을 정중하게 확인했어요.' },
      { id: 'g34-classroom-pencil--repair-retry', strategyId: 'specify', textEn: 'What time?', accepted: false, feedbackKo: '시간이 아니라 어떤 물건인지 찾아보세요.' },
    ],
    clarifyingResponse: { id: 'g34-classroom-pencil-response', speaker: 'Partner', textEn: 'The short pencil, please.' },
    meaningOptions: [
      { id: 'g34-classroom-pencil--meaning-correct', labelKo: '짧은 연필', accepted: true, feedbackKo: '추가 응답과 의미가 맞아요.' },
      { id: 'g34-classroom-pencil--meaning-retry-a', labelKo: '긴 연필', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요.' },
      { id: 'g34-classroom-pencil--meaning-retry-b', labelKo: '짧은 자', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요.' },
    ],
    confirmationOptions: [
      { id: 'g34-classroom-pencil--confirmation-correct', mode: 'confirm', textEn: 'Okay, you mean the short pencil.', accepted: true, feedbackKo: '짧은 연필이라는 뜻을 정확히 확인했어요.' },
      { id: 'g34-classroom-pencil--confirmation-retry-a', mode: 'confirm', textEn: 'Okay, you mean the long pencil.', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요.' },
      { id: 'g34-classroom-pencil--confirmation-retry-b', mode: 'confirm', textEn: 'Okay, you mean the short ruler.', accepted: false, feedbackKo: '어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요.' },
    ], audioCues: [],
  },
] satisfies readonly Mission[];
