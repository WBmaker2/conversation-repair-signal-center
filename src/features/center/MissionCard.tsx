import type { Mission } from '../../domain/mission';

export interface MissionCardProps {
  mission: Mission;
  onStart: (missionId: string) => void;
  isRecommended?: boolean;
}

function gradeLabel(gradeBand: Mission['gradeBand']) {
  return gradeBand === '3-4' ? '3~4학년' : '5~6학년';
}

function contextLabel(context: Mission['politenessContext']) {
  return context === 'classroom-polite'
    ? '교실에서 정중하게 말하는 상황'
    : '친구와 간단히 말하는 상황';
}

export function MissionCard({ mission, onStart, isRecommended = false }: MissionCardProps) {
  return (
    <article className="mission-card" data-recommended={isRecommended ? 'true' : undefined}>
      {isRecommended ? (
        <div className="mission-card-labels">
          <p className="mission-badge">추천 미션</p>
          <p id={`${mission.id}-recommendation`} className="mission-recommendation">먼저 해 보기</p>
        </div>
      ) : null}
      <h3>{mission.titleKo}</h3>
      <p className="mission-scenario">{mission.scenarioKo}</p>
      <p className="mission-context">
        <span>{gradeLabel(mission.gradeBand)}</span> · <span>{contextLabel(mission.politenessContext)}</span>
      </p>
      <button
        type="button"
        className={isRecommended ? 'gi-pulse primary-action' : undefined}
        aria-describedby={isRecommended ? `${mission.id}-recommendation` : undefined}
        onClick={() => onStart(mission.id)}
      >
        {mission.titleKo} 미션 시작
      </button>
    </article>
  );
}
