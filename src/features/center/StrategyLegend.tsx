import { REPAIR_STRATEGIES } from '../../content/strategies';
import { LanguageText } from '../../shared/LanguageText';

export function StrategyLegend() {
  return (
    <section aria-labelledby="strategy-legend-heading">
      <h2 id="strategy-legend-heading">대화 수리 전략</h2>
      <ul>
        {REPAIR_STRATEGIES.map((strategy) => (
          <li key={strategy.id}>
            <h3>{strategy.labelKo}</h3>
            <p>{strategy.purposeKo}</p>
            <ul aria-label={`${strategy.labelKo} 예시`}>
              {strategy.examplesEn.map((example) => (
                <li key={example}>
                  <LanguageText language="en">{example}</LanguageText>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
