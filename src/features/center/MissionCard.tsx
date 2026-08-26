import type { Mission } from '../../domain/mission';

export interface MissionCardProps {
  mission: Mission;
  onStart: (missionId: string) => void;
}

function gradeLabel(gradeBand: Mission['gradeBand']) {
  return gradeBand === '3-4' ? '3~4학년' : '5~6학년';
}

function contextLabel(context: Mission['politenessContext']) {
  return context === 'classroom-polite'
    ? '교실에서 정중하게 말하는 상황'
    : '친구와 간단히 말하는 상황';
}

export function MissionCard({ mission, onStart }: MissionCardProps) {
  return (
    <article>
      <h3>{mission.titleKo}</h3>
      <p>{mission.scenarioKo}</p>
      <p>
        <span>{gradeLabel(mission.gradeBand)}</span> · <span>{contextLabel(mission.politenessContext)}</span>
      </p>
      <button type="button" onClick={() => onStart(mission.id)}>
        {mission.titleKo} 미션 시작
      </button>
    </article>
  );
}
