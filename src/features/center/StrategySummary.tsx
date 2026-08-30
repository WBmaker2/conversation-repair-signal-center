import { REPAIR_STRATEGIES } from '../../content/strategies';

export function StrategySummary() {
  return (
    <section className="strategy-summary" aria-labelledby="strategy-summary-heading">
      <h2 id="strategy-summary-heading">전략 한눈에 보기</h2>
      <ul>
        {REPAIR_STRATEGIES.map((strategy) => (
          <li key={strategy.id}>
            <strong>{strategy.labelKo}</strong>
            <span>{strategy.purposeKo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
