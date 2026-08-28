import type { Mission } from '../../domain/mission';
import type { MissionEvidence } from '../../domain/session';
import type { RepairStrategyId } from '../../domain/mission';

export interface LearnerTakeawayCopy {
  learnedKo: string;
  nextStepKo: string;
}

const SLOT_PROMPTS: Record<MissionEvidence['identifiedSlotKind'], string> = {
  'whole-utterance': '무슨 말인지',
  object: '어느 것인지',
  time: '언제인지',
  place: '어디인지',
  quantity: '몇 개인지',
  person: '누가 맡는지',
  sequence: '어떤 순서인지',
  decision: '어떤 결정인지',
};

const STRATEGY_TEMPLATES: Record<RepairStrategyId, { learned: string; next: string }> = {
  repeat: {
    learned: '다시 말해 달라고 부탁하는 방법을 배웠어요.',
    next: '다시 말해 달라고 부탁해 보세요.',
  },
  specify: {
    learned: '더 구체적으로 물어보는 방법을 배웠어요.',
    next: '구체적으로 물어보세요.',
  },
  confirm: {
    learned: '뜻을 확인하는 방법을 배웠어요.',
    next: '내가 이해한 뜻을 확인해 보세요.',
  },
  rephrase: {
    learned: '다른 말로 다시 설명하는 방법을 배웠어요.',
    next: '다른 말로 다시 설명해 보세요.',
  },
};

export function buildLearnerTakeawayCopy(mission: Mission, evidence: MissionEvidence): LearnerTakeawayCopy {
  const slotPrompt = SLOT_PROMPTS[evidence.identifiedSlotKind] ?? '무엇인지';
  const template = STRATEGY_TEMPLATES[evidence.repairStrategyId] ?? STRATEGY_TEMPLATES.repeat;
  return {
    learnedKo: `${mission.titleKo} 미션에서 ${slotPrompt} 헷갈리는 부분을 찾고, ${template.learned}`,
    nextStepKo: `다음 대화에서 ${slotPrompt} 헷갈리면 ${template.next}`,
  };
}
