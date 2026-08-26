import type { CurriculumCode, MissionStage } from '../domain/mission';

export interface CurriculumLink {
  code: CurriculumCode;
  descriptionKo: string;
  evidenceStages: readonly MissionStage[];
}

export const CURRICULUM_LINKS = [
  {
    code: '[4영02-10]',
    descriptionKo: '대화 예절을 지키며 의사소통에 참여하기',
    evidenceStages: ['repair', 'confirmation'],
  },
  {
    code: '[6영02-07]',
    descriptionKo: '일상생활의 담화나 글에서 세부 정보를 묻고 답하기',
    evidenceStages: ['ambiguity', 'meaning'],
  },
  {
    code: '[6영02-09]',
    descriptionKo: '적절한 매체와 전략을 활용하여 의미를 생성하고 표현하기',
    evidenceStages: ['ambiguity', 'repair', 'meaning', 'confirmation'],
  },
  {
    code: '[6영02-10]',
    descriptionKo: '자신감을 가지고 협력적으로 의사소통 활동에 참여하기',
    evidenceStages: ['repair', 'confirmation'],
  },
] as const satisfies readonly CurriculumLink[];
