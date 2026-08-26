import type {
  GradeBand,
  Mission,
  MissionStage,
  RepairStrategyId,
} from '../domain/mission';
import { CURRICULUM_LINKS } from './curriculum';
import { REPAIR_STRATEGIES } from './strategies';

export type ValidationCode =
  | 'PACK_COUNT'
  | 'DUPLICATE_ID'
  | 'GRADE_BAND_COUNT'
  | 'STRATEGY_COVERAGE'
  | 'MISSING_STAGE_OPTION'
  | 'REPAIR_NOT_ALLOWED'
  | 'MULTIPLE_EXPRESSION_REQUIRED'
  | 'DUPLICATE_FEEDBACK'
  | 'CURRICULUM_LINK_REQUIRED'
  | 'LEARNING_TARGET_REQUIRED'
  | 'EXTERNAL_AUDIO_URL'
  | 'TRANSCRIPT_REQUIRED';

export interface ValidationIssue {
  missionId: string | 'pack';
  code: ValidationCode;
  field: string;
  messageKo: string;
}

export interface ContentValidationReport {
  valid: boolean;
  issues: ValidationIssue[];
  coverage: {
    missionCount: number;
    gradeBandCounts: Record<GradeBand, number>;
    strategyIds: RepairStrategyId[];
    missionsWithMultipleAcceptedRepairs: string[];
  };
}

const EXPECTED_MISSION_COUNT = 10;
const EXPECTED_GRADE_BAND_COUNT = 5;
const EXPECTED_LEARNING_TARGETS = ['understand', 'apply', 'analyze', 'create'] as const;
const STAGES: readonly MissionStage[] = ['ambiguity', 'repair', 'meaning', 'confirmation'];

function issue(
  missionId: ValidationIssue['missionId'],
  code: ValidationCode,
  field: string,
  messageKo: string,
): ValidationIssue {
  return { missionId, code, field, messageKo };
}

function acceptedCount<T extends { accepted: boolean }>(options: readonly T[]): number {
  return options.filter((option) => option.accepted).length;
}

function missionStages(mission: Mission): Record<MissionStage, number> {
  return {
    ambiguity: acceptedCount(mission.ambiguityOptions),
    repair: acceptedCount(mission.repairOptions),
    meaning: acceptedCount(mission.meaningOptions),
    confirmation: acceptedCount(mission.confirmationOptions),
  };
}

export function validateMissionPack(missions: readonly Mission[]): ContentValidationReport {
  const orderedMissions = [...missions].sort((left, right) => left.id.localeCompare(right.id));
  const gradeBandCounts: Record<GradeBand, number> = { '3-4': 0, '5-6': 0 };
  const strategyIds = REPAIR_STRATEGIES
    .filter((strategy) => orderedMissions.some((mission) => mission.allowedStrategyIds.includes(strategy.id)))
    .map((strategy) => strategy.id);
  const missionsWithMultipleAcceptedRepairs = orderedMissions
    .filter((mission) => acceptedCount(mission.repairOptions) >= 2)
    .map((mission) => mission.id);
  const issues: ValidationIssue[] = [];

  for (const mission of orderedMissions) gradeBandCounts[mission.gradeBand] += 1;

  if (missions.length !== EXPECTED_MISSION_COUNT) {
    issues.push(issue('pack', 'PACK_COUNT', 'missions', '미션은 정확히 10개여야 합니다.'));
  }

  const seenIds = new Set<string>();
  for (const mission of orderedMissions) {
    if (seenIds.has(mission.id)) {
      issues.push(issue(mission.id, 'DUPLICATE_ID', 'id', '미션 ID는 서로 달라야 합니다.'));
    }
    seenIds.add(mission.id);
  }

  if (Object.values(gradeBandCounts).some((count) => count !== EXPECTED_GRADE_BAND_COUNT)) {
    issues.push(issue('pack', 'GRADE_BAND_COUNT', 'gradeBandCounts', '각 학년군 미션은 5개여야 합니다.'));
  }

  if (strategyIds.length !== REPAIR_STRATEGIES.length) {
    issues.push(issue('pack', 'STRATEGY_COVERAGE', 'allowedStrategyIds', '네 가지 수리 전략이 모두 사용되어야 합니다.'));
  }

  const curriculumCodes = new Set(CURRICULUM_LINKS.map((link) => link.code));
  for (const mission of orderedMissions) {
    const stages = missionStages(mission);
    for (const stage of STAGES) {
      if (stages[stage] === 0) {
        issues.push(issue(mission.id, 'MISSING_STAGE_OPTION', `${stage}Options`, `${stage} 단계에 수락 선택지가 필요합니다.`));
      }
    }

    const acceptedRepairs = mission.repairOptions.filter((option) => option.accepted);
    for (const option of acceptedRepairs) {
      if (!mission.allowedStrategyIds.includes(option.strategyId)) {
        issues.push(issue(mission.id, 'REPAIR_NOT_ALLOWED', 'repairOptions.strategyId', '수락 수리 표현은 허용 전략이어야 합니다.'));
      }
    }
    if (acceptedRepairs.length < 2) {
      issues.push(issue(mission.id, 'MULTIPLE_EXPRESSION_REQUIRED', 'repairOptions', '수락 수리 표현이 2개 이상 필요합니다.'));
    }
    const feedbacks = acceptedRepairs.map((option) => option.feedbackKo);
    if (new Set(feedbacks).size !== feedbacks.length) {
      issues.push(issue(mission.id, 'DUPLICATE_FEEDBACK', 'repairOptions.feedbackKo', '수락 수리 표현의 피드백은 서로 달라야 합니다.'));
    }

    if (mission.curriculumCodes.length === 0 || mission.curriculumCodes.some((code) => !curriculumCodes.has(code))) {
      issues.push(issue(mission.id, 'CURRICULUM_LINK_REQUIRED', 'curriculumCodes', '교육과정 연결 코드가 하나 이상 필요합니다.'));
    }
    for (const target of EXPECTED_LEARNING_TARGETS) {
      if (!mission.learningTargets.includes(target)) {
        issues.push(issue(mission.id, 'LEARNING_TARGET_REQUIRED', 'learningTargets', `학습 목표 ${target} 연결이 필요합니다.`));
      }
    }

    for (const cue of mission.audioCues) {
      if (!cue.src.startsWith('audio/')) {
        issues.push(issue(mission.id, 'EXTERNAL_AUDIO_URL', 'audioCues.src', '음원은 로컬 audio/ 경로여야 합니다.'));
      }
      if (cue.transcriptEn.trim().length === 0) {
        issues.push(issue(mission.id, 'TRANSCRIPT_REQUIRED', 'audioCues.transcriptEn', '제공된 음원에는 비어 있지 않은 대본이 필요합니다.'));
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    coverage: {
      missionCount: missions.length,
      gradeBandCounts,
      strategyIds,
      missionsWithMultipleAcceptedRepairs,
    },
  };
}
