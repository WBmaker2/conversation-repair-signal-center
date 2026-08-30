import type { GradeBand } from '../../domain/mission';

export interface EmptyMissionStateProps {
  gradeBand: GradeBand;
  onGradeBandChange: (gradeBand: GradeBand) => void;
}

export function EmptyMissionState({ gradeBand, onGradeBandChange }: EmptyMissionStateProps) {
  const alternateGradeBand: GradeBand = gradeBand === '3-4' ? '5-6' : '3-4';
  const alternateLabel = alternateGradeBand === '3-4' ? '3~4학년' : '5~6학년';

  return (
    <div className="empty-mission-state" role="alert">
      <p>이 수준의 미션을 찾을 수 없어요.</p>
      <p>다른 수준을 골라 미션을 다시 찾아볼까요?</p>
      <button type="button" onClick={() => onGradeBandChange(alternateGradeBand)}>
        {alternateLabel} 미션 보기
      </button>
    </div>
  );
}
