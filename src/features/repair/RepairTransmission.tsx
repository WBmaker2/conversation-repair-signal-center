import type { EvaluationResult, Mission } from '../../domain/mission';
import { REPAIR_STRATEGIES } from '../../content/strategies';
import { FeedbackNotice } from '../../shared/FeedbackNotice';
import { LanguageText } from '../../shared/LanguageText';
import { StrategyCard } from './StrategyCard';

export interface RepairTransmissionProps {
  mission: Mission;
  selectedOptionId: string | undefined;
  latestResult: EvaluationResult | null;
  onSelect: (optionId: string) => void;
  onSubmit: (optionId: string) => void;
}

export function RepairTransmission({
  mission,
  selectedOptionId,
  latestResult,
  onSelect,
  onSubmit,
}: RepairTransmissionProps) {
  const visibleStrategies = REPAIR_STRATEGIES.filter(({ id }) => mission.allowedStrategyIds.includes(id));

  return (
    <section aria-labelledby="repair-heading">
      <h2 id="repair-heading">수리 송신</h2>
      <p lang="ko">대화가 막힌 신호에 맞는 표현을 골라 보내 보세요.</p>
      <div aria-label="허용된 수리 전략">
        {visibleStrategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} politenessContext={mission.politenessContext} />
        ))}
      </div>
      <fieldset>
        <legend>어떤 표현으로 다시 물어볼까요?</legend>
        {mission.repairOptions.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="repair"
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={() => onSelect(option.id)}
            />
            <LanguageText language="en">{option.textEn}</LanguageText>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        disabled={!selectedOptionId}
        onClick={() => {
          if (selectedOptionId) onSubmit(selectedOptionId);
        }}
      >
        수리 표현 보내기
      </button>
      <FeedbackNotice result={latestResult} />
    </section>
  );
}
