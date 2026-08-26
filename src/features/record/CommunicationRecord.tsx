import type { Mission, MissionStage } from '../../domain/mission';
import type { MissionEvidence } from '../../domain/session';
import { REPAIR_STRATEGIES } from '../../content/strategies';
import { SLOT_LABELS_KO } from '../../content/feedback';
import { TeacherSummary } from './TeacherSummary';

export interface CommunicationRecordProps {
  mission: Mission;
  evidence: MissionEvidence;
  onRetry: () => void;
  onReturnCenter: () => void;
}

const STAGE_LABELS: Record<MissionStage, string> = {
  ambiguity: '불명확한 부분 찾기',
  repair: '수리 표현 선택',
  meaning: '추가 응답 이해',
  confirmation: '확인 통화',
};

function isSlotKind(value: string): value is keyof typeof SLOT_LABELS_KO {
  return Object.prototype.hasOwnProperty.call(SLOT_LABELS_KO, value);
}

function controlledError(message: string) {
  return (
    <section aria-labelledby="record-error-heading">
      <h2 id="record-error-heading">통신 기록</h2>
      <p role="alert">{message}</p>
    </section>
  );
}

export function CommunicationRecord({
  mission,
  evidence,
  onRetry,
  onReturnCenter,
}: CommunicationRecordProps) {
  if (mission.id !== evidence.missionId) {
    return controlledError('이 미션의 통신 기록을 확인할 수 없습니다. 신호센터에서 다시 시작해 주세요.');
  }

  const slotLabel = isSlotKind(evidence.identifiedSlotKind)
    ? SLOT_LABELS_KO[evidence.identifiedSlotKind]
    : null;
  const strategy = REPAIR_STRATEGIES.find(({ id }) => id === evidence.repairStrategyId);
  const strategyIsAllowed = strategy ? mission.allowedStrategyIds.includes(strategy.id) : false;
  const slotIsInMission = isSlotKind(evidence.identifiedSlotKind)
    && mission.ambiguityOptions.some((option) => option.accepted && option.slotKind === evidence.identifiedSlotKind);
  const firstMeaning = mission.meaningOptions.find(({ id }) => id === evidence.firstMeaningOptionId);
  const confirmedMeaning = mission.meaningOptions.find(({ id }) => id === evidence.confirmedMeaningOptionId);

  if (!slotLabel || !slotIsInMission || !strategy || !strategyIsAllowed || !firstMeaning || !confirmedMeaning || !confirmedMeaning.accepted || evidence.meaningConfirmed !== true) {
    return controlledError('통신 기록의 학습 증거가 완전하지 않습니다. 이 미션을 다시 시작해 주세요.');
  }

  const attemptCounts = (Object.keys(STAGE_LABELS) as MissionStage[]).map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    count: evidence.attempts.filter((attempt) => attempt.stage === stage).length,
  }));

  return (
    <section aria-labelledby="record-heading">
      <h2 id="record-heading">통신 기록</h2>
      <h3>미션</h3>
      <p>{mission.titleKo}</p>
      <dl>
        <div>
          <dt>찾은 슬롯 종류</dt>
          <dd>{slotLabel}</dd>
        </div>
        <div>
          <dt>사용 전략</dt>
          <dd>{strategy.labelKo}</dd>
        </div>
        <div>
          <dt>처음 이해</dt>
          <dd>{firstMeaning.labelKo}</dd>
        </div>
        <div>
          <dt>확인된 이해</dt>
          <dd>{confirmedMeaning.labelKo}</dd>
        </div>
        <div>
          <dt>뜻 확인</dt>
          <dd>의미 확인 완료</dd>
        </div>
        <div>
          <dt>협력 태도</dt>
          <dd>{evidence.collaborationFeedbackKo}</dd>
        </div>
      </dl>

      <h3>단계별 시도</h3>
      <ul aria-label="단계별 시도 횟수">
        {attemptCounts.map(({ stage, label, count }) => (
          <li key={stage} data-stage={stage}>
            {label}: {count}회
          </li>
        ))}
      </ul>

      <div>
        <button type="button" onClick={onRetry}>이 미션 다시 하기</button>
        <button type="button" onClick={onReturnCenter}>신호센터로 돌아가기</button>
      </div>
      <TeacherSummary mission={mission} evidence={evidence} />
    </section>
  );
}
