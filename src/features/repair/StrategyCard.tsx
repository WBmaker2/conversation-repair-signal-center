import type { RepairStrategy } from '../../content/strategies';
import type { Mission } from '../../domain/mission';
import { LanguageText } from '../../shared/LanguageText';

export interface StrategyCardProps {
  strategy: RepairStrategy;
  politenessContext: Mission['politenessContext'];
}

export function StrategyCard({ strategy, politenessContext }: StrategyCardProps) {
  return (
    <article data-strategy-id={strategy.id}>
      <h3 lang="ko">{strategy.labelKo}</h3>
      <p lang="ko">{strategy.purposeKo}</p>
      <p lang="ko">
        {politenessContext === 'classroom-polite' ? '교실에서 정중하게' : '친구 사이에서 간단하게'}
      </p>
      <ul aria-label={`${strategy.labelKo} 예시`}>
        {strategy.examplesEn.map((example) => (
          <li key={example}><LanguageText language="en">{example}</LanguageText></li>
        ))}
      </ul>
    </article>
  );
}
