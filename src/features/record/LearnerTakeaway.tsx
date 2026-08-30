import type { Mission } from '../../domain/mission';
import type { MissionEvidence } from '../../domain/session';
import { buildLearnerTakeawayCopy } from './learnerTakeawayCopy';

export interface LearnerTakeawayProps {
  mission: Mission;
  evidence: MissionEvidence;
}

export function LearnerTakeaway({ mission, evidence }: LearnerTakeawayProps) {
  const copy = buildLearnerTakeawayCopy(mission, evidence);
  return (
    <section className="learner-takeaway" aria-labelledby="learner-takeaway-heading">
      <h3 id="learner-takeaway-heading">오늘 배운 점</h3>
      <p lang="ko">{copy.learnedKo}</p>
      <h3>다음에 해 보기</h3>
      <p lang="ko">{copy.nextStepKo}</p>
    </section>
  );
}
