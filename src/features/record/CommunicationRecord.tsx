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

type Validation =
  | { ok: true; evidence: MissionEvidence }
  | { ok: false; message: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMissionStage(value: unknown): value is MissionStage {
  return value === 'ambiguity' || value === 'repair' || value === 'meaning' || value === 'confirmation';
}

function optionsForStage(mission: Mission, stage: MissionStage) {
  switch (stage) {
    case 'ambiguity': return mission.ambiguityOptions;
    case 'repair': return mission.repairOptions;
    case 'meaning': return mission.meaningOptions;
    case 'confirmation': return mission.confirmationOptions;
  }
}

function isSlotKind(value: string): value is keyof typeof SLOT_LABELS_KO {
  return Object.prototype.hasOwnProperty.call(SLOT_LABELS_KO, value);
}

function RecoveryActions({ onRetry, onReturnCenter }: Pick<CommunicationRecordProps, 'onRetry' | 'onReturnCenter'>) {
  return (
    <div>
      <button type="button" onClick={onRetry}>이 미션 다시 하기</button>
      <button type="button" onClick={onReturnCenter}>신호센터로 돌아가기</button>
    </div>
  );
}

function controlledError(
  message: string,
  callbacks: Pick<CommunicationRecordProps, 'onRetry' | 'onReturnCenter'>,
) {
  return (
    <section aria-labelledby="record-heading">
      <h2 id="record-heading" tabIndex={-1}>통신 기록</h2>
      <p role="alert">{message}</p>
      <RecoveryActions {...callbacks} />
    </section>
  );
}

function validateEvidence(mission: Mission, value: unknown): Validation {
  if (!isObject(value)) {
    return { ok: false, message: '통신 기록의 학습 증거를 읽을 수 없습니다. 이 미션을 다시 시작해 주세요.' };
  }
  if (value.missionId !== mission.id) {
    return { ok: false, message: '이 미션의 통신 기록을 확인할 수 없습니다. 신호센터에서 다시 시작해 주세요.' };
  }
  if (!Array.isArray(value.attempts)) {
    return { ok: false, message: '통신 기록의 시도 정보가 올바르지 않습니다. 이 미션을 다시 시작해 주세요.' };
  }

  const seenStages = new Set<MissionStage>();
  const acceptedStages = new Set<MissionStage>();
  for (const attempt of value.attempts) {
    if (!isObject(attempt) || !isMissionStage(attempt.stage) || typeof attempt.optionId !== 'string' || (attempt.status !== 'accepted' && attempt.status !== 'retry')) {
      return { ok: false, message: '통신 기록의 시도 정보가 올바르지 않습니다. 이 미션을 다시 시작해 주세요.' };
    }
    const option = optionsForStage(mission, attempt.stage).find(({ id }) => id === attempt.optionId);
    if (!option || (attempt.status === 'accepted') !== option.accepted) {
      return { ok: false, message: '통신 기록의 선택 근거가 미션과 맞지 않습니다. 이 미션을 다시 시작해 주세요.' };
    }
    seenStages.add(attempt.stage);
    if (attempt.status === 'accepted') acceptedStages.add(attempt.stage);
  }
  const allStages = (Object.keys(STAGE_LABELS) as MissionStage[]).every((stage) => seenStages.has(stage) && acceptedStages.has(stage));
  if (!allStages) {
    return { ok: false, message: '통신 기록에 필요한 학습 단계가 빠져 있습니다. 이 미션을 다시 시작해 주세요.' };
  }

  if (typeof value.identifiedSlotKind !== 'string' || !isSlotKind(value.identifiedSlotKind)
    || !mission.ambiguityOptions.some((option) => option.accepted && option.slotKind === value.identifiedSlotKind)) {
    return { ok: false, message: '통신 기록의 불명확한 정보가 미션과 맞지 않습니다. 이 미션을 다시 시작해 주세요.' };
  }
  const strategy = REPAIR_STRATEGIES.find(({ id }) => id === value.repairStrategyId);
  if (!strategy || !mission.allowedStrategyIds.includes(strategy.id)) {
    return { ok: false, message: '통신 기록의 수리 전략을 확인할 수 없습니다. 이 미션을 다시 시작해 주세요.' };
  }
  if (typeof value.firstMeaningOptionId !== 'string' || !mission.meaningOptions.some(({ id }) => id === value.firstMeaningOptionId)) {
    return { ok: false, message: '통신 기록의 처음 이해를 확인할 수 없습니다. 이 미션을 다시 시작해 주세요.' };
  }
  const confirmedMeaning = mission.meaningOptions.find(({ id }) => id === value.confirmedMeaningOptionId);
  if (!confirmedMeaning || !confirmedMeaning.accepted || value.meaningConfirmed !== true) {
    return { ok: false, message: '통신 기록의 확인된 이해를 확인할 수 없습니다. 이 미션을 다시 시작해 주세요.' };
  }
  if (typeof value.collaborationFeedbackKo !== 'string') {
    return { ok: false, message: '통신 기록의 협력 피드백을 확인할 수 없습니다. 이 미션을 다시 시작해 주세요.' };
  }
  return { ok: true, evidence: value as unknown as MissionEvidence };
}

export function CommunicationRecord({
  mission,
  evidence,
  onRetry,
  onReturnCenter,
}: CommunicationRecordProps) {
  const validation = validateEvidence(mission, evidence);
  if (!validation.ok) return controlledError(validation.message, { onRetry, onReturnCenter });
  const safeEvidence = validation.evidence;
  const slotLabel = isSlotKind(safeEvidence.identifiedSlotKind)
    ? SLOT_LABELS_KO[safeEvidence.identifiedSlotKind]
    : null;
  const strategy = REPAIR_STRATEGIES.find(({ id }) => id === safeEvidence.repairStrategyId);
  const firstMeaning = mission.meaningOptions.find(({ id }) => id === safeEvidence.firstMeaningOptionId);
  const confirmedMeaning = mission.meaningOptions.find(({ id }) => id === safeEvidence.confirmedMeaningOptionId);
  if (!slotLabel || !strategy || !firstMeaning || !confirmedMeaning) return controlledError('통신 기록을 표시할 수 없습니다. 이 미션을 다시 시작해 주세요.', { onRetry, onReturnCenter });

  const attemptCounts = (Object.keys(STAGE_LABELS) as MissionStage[]).map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    count: safeEvidence.attempts.filter((attempt) => attempt.stage === stage).length,
  }));

  return (
    <section aria-labelledby="record-heading">
      <h2 id="record-heading" tabIndex={-1}>통신 기록</h2>
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
          <dd>{safeEvidence.collaborationFeedbackKo}</dd>
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
      <TeacherSummary mission={mission} evidence={safeEvidence} />
    </section>
  );
}
