import type { Mission, MissionStage } from '../../domain/mission';
import type { MissionEvidence } from '../../domain/session';
import { REPAIR_STRATEGIES } from '../../content/strategies';
import { SLOT_LABELS_KO } from '../../content/feedback';
import { TeacherSummary } from './TeacherSummary';
import { LearnerTakeaway } from './LearnerTakeaway';

export interface CommunicationRecordProps {
  mission: Mission;
  evidence: MissionEvidence;
  onRetry: () => void;
  onReturnCenter: () => void;
}

const STAGE_LABELS: Record<MissionStage, string> = {
  ambiguity: '찾은 정보 고르기',
  repair: '다시 물어볼 표현 고르기',
  meaning: '상대 답에서 뜻 찾기',
  confirmation: '내가 이해한 뜻 확인하기',
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
    <div className="record-recovery-actions">
      <button className="primary-action" type="button" onClick={onRetry}>이 미션 다시 하기</button>
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
      <h2 id="record-heading" tabIndex={-1}>학습 기록</h2>
      <p role="alert">{message}</p>
      <p role="status" aria-live="polite" lang="ko">복구 방법을 선택해 학습을 이어 갈 수 있어요.</p>
      <RecoveryActions {...callbacks} />
    </section>
  );
}

function validateEvidence(mission: Mission, value: unknown): Validation {
  if (!isObject(value)) {
    return { ok: false, message: '학습 기록을 읽을 수 없어요. 이 미션을 다시 시작해 주세요.' };
  }
  if (value.missionId !== mission.id) {
    return { ok: false, message: '이 미션 기록을 확인할 수 없어요. 신호센터에서 다시 시작해 주세요.' };
  }
  if (!Array.isArray(value.attempts)) {
    return { ok: false, message: '시도 기록을 읽을 수 없어요. 이 미션을 다시 시작해 주세요.' };
  }

  const seenStages = new Set<MissionStage>();
  const acceptedStages = new Set<MissionStage>();
  for (const attempt of value.attempts) {
    if (!isObject(attempt) || !isMissionStage(attempt.stage) || typeof attempt.optionId !== 'string' || (attempt.status !== 'accepted' && attempt.status !== 'retry')) {
      return { ok: false, message: '시도 기록을 읽을 수 없어요. 이 미션을 다시 시작해 주세요.' };
    }
    const option = optionsForStage(mission, attempt.stage).find(({ id }) => id === attempt.optionId);
    if (!option || (attempt.status === 'accepted') !== option.accepted) {
      return { ok: false, message: '이 미션에서 고른 내용을 확인할 수 없어요. 이 미션을 다시 시작해 주세요.' };
    }
    seenStages.add(attempt.stage);
    if (attempt.status === 'accepted') acceptedStages.add(attempt.stage);
  }
  const allStages = (Object.keys(STAGE_LABELS) as MissionStage[]).every((stage) => seenStages.has(stage) && acceptedStages.has(stage));
  if (!allStages) {
    return { ok: false, message: '필요한 학습 단계가 빠져 있어요. 이 미션을 다시 시작해 주세요.' };
  }

  if (typeof value.identifiedSlotKind !== 'string' || !isSlotKind(value.identifiedSlotKind)
    || !mission.ambiguityOptions.some((option) => option.accepted && option.slotKind === value.identifiedSlotKind)) {
    return { ok: false, message: '찾은 정보가 이 미션과 맞지 않아요. 이 미션을 다시 시작해 주세요.' };
  }
  const strategy = REPAIR_STRATEGIES.find(({ id }) => id === value.repairStrategyId);
  if (!strategy || !mission.allowedStrategyIds.includes(strategy.id)) {
    return { ok: false, message: '고른 수리 전략을 확인할 수 없어요. 이 미션을 다시 시작해 주세요.' };
  }
  if (typeof value.firstMeaningOptionId !== 'string' || !mission.meaningOptions.some(({ id }) => id === value.firstMeaningOptionId)) {
    return { ok: false, message: '처음 생각한 뜻을 확인할 수 없어요. 이 미션을 다시 시작해 주세요.' };
  }
  const confirmedMeaning = mission.meaningOptions.find(({ id }) => id === value.confirmedMeaningOptionId);
  if (!confirmedMeaning || !confirmedMeaning.accepted || value.meaningConfirmed !== true) {
    return { ok: false, message: '확인한 뜻을 확인할 수 없어요. 이 미션을 다시 시작해 주세요.' };
  }
  if (typeof value.collaborationFeedbackKo !== 'string') {
    return { ok: false, message: '대화 태도 기록을 확인할 수 없어요. 이 미션을 다시 시작해 주세요.' };
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
  if (!slotLabel || !strategy || !firstMeaning || !confirmedMeaning) return controlledError('학습 기록을 표시할 수 없어요. 이 미션을 다시 시작해 주세요.', { onRetry, onReturnCenter });

  const attemptCounts = (Object.keys(STAGE_LABELS) as MissionStage[]).map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    count: safeEvidence.attempts.filter((attempt) => attempt.stage === stage).length,
  }));

  return (
    <section aria-labelledby="record-heading">
      <h2 id="record-heading" tabIndex={-1}>학습 기록</h2>
      <p role="status" aria-live="polite" lang="ko">학습 기록이 준비되었습니다.</p>
      <h3>미션</h3>
      <p>{mission.titleKo}</p>
      <LearnerTakeaway mission={mission} evidence={safeEvidence} />
      <dl>
        <div>
        <dt>찾은 정보</dt>
          <dd>{slotLabel}</dd>
        </div>
        <div>
        <dt>고른 방법</dt>
          <dd>{strategy.labelKo}</dd>
        </div>
        <div>
        <dt>처음 생각한 뜻</dt>
          <dd>{firstMeaning.labelKo}</dd>
        </div>
        <div>
        <dt>확인한 뜻</dt>
          <dd>{confirmedMeaning.labelKo}</dd>
        </div>
        <div>
        <dt>확인 질문</dt>
          <dd>의미 확인 완료</dd>
        </div>
        <div>
        <dt>대화 태도</dt>
          <dd>{safeEvidence.collaborationFeedbackKo}</dd>
        </div>
      </dl>

      <h3>다시 해 본 횟수</h3>
      <ul aria-label="다시 해 본 횟수">
        {attemptCounts.map(({ stage, label, count }) => (
          <li key={stage} data-stage={stage}>
            {label}: {count}회
          </li>
        ))}
      </ul>

      <div className="record-recovery-actions">
        <button className="primary-action" type="button" onClick={onRetry}>이 미션 다시 하기</button>
        <button type="button" onClick={onReturnCenter}>신호센터로 돌아가기</button>
      </div>
      <TeacherSummary mission={mission} evidence={safeEvidence} />
    </section>
  );
}
