import type { AmbiguitySlotKind } from '../domain/mission';

export const SLOT_LABELS_KO = {
  'whole-utterance': '문장 전체',
  object: '대상',
  time: '시간',
  place: '장소',
  quantity: '수량',
  person: '담당자',
  sequence: '순서',
  decision: '최종 결정',
} as const satisfies Record<AmbiguitySlotKind, string>;

export const AMBIGUITY_RETRY_FEEDBACK_KO =
  '어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요.';

export function createMeaningRetryFeedback(slotKind: AmbiguitySlotKind): string {
  return `어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 ${SLOT_LABELS_KO[slotKind]} 정보를 다시 찾아보세요.`;
}

export function createConfirmationRetryFeedback(slotKind: AmbiguitySlotKind): string {
  return `어떤 정보가 아직 없나요? 확인 문장에서 ${SLOT_LABELS_KO[slotKind]} 정보가 바뀌거나 빠졌어요.`;
}
