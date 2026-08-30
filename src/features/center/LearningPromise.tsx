export interface LearningPromiseProps {
  recommendedMissionTitle: string;
}

export function LearningPromise({ recommendedMissionTitle }: LearningPromiseProps) {
  return (
    <header className="learning-promise">
      <h1 id="service-heading" tabIndex={-1}>대화 수리 신호센터</h1>
      <p>못 알아들은 순간은 대화를 이어 가는 신호예요.</p>
      <div className="first-action" aria-labelledby="first-action-heading">
        <h2 id="first-action-heading">오늘의 첫 행동</h2>
        <p>학년을 고른 뒤 <strong>{recommendedMissionTitle}</strong>부터 시작해 보세요.</p>
      </div>
    </header>
  );
}
