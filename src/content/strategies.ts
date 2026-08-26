import type { RepairStrategyId } from '../domain/mission';

export interface RepairStrategy {
  id: RepairStrategyId;
  labelKo: string;
  purposeKo: string;
  examplesEn: readonly string[];
}

export const REPAIR_STRATEGIES = [
  {
    id: 'repeat',
    labelKo: '다시 말해 주세요',
    purposeKo: '전체 발화를 놓쳤을 때',
    examplesEn: ['Could you say that again?'],
  },
  {
    id: 'specify',
    labelKo: '더 구체적으로',
    purposeKo: '대상·시간·장소·수량·담당·순서가 불분명할 때',
    examplesEn: ['Which one?', 'What time?'],
  },
  {
    id: 'confirm',
    labelKo: '뜻 확인',
    purposeKo: '내가 이해한 내용이 맞는지 확인할 때',
    examplesEn: ['Do you mean the blue box?'],
  },
  {
    id: 'rephrase',
    labelKo: '다르게 말하기',
    purposeKo: '상대가 내 말을 이해하지 못했을 때',
    examplesEn: ['Let me say it another way.'],
  },
] as const satisfies readonly RepairStrategy[];
