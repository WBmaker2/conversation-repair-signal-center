import type { EvaluationResult, Mission } from '../../domain/mission';
import { CriticalActionButton } from '../../shared/CriticalActionButton';
import { FeedbackNotice } from '../../shared/FeedbackNotice';
import { LanguageText } from '../../shared/LanguageText';

export interface ConfirmationCallProps {
  mission: Mission;
  selectedOptionId: string | undefined;
  latestResult: EvaluationResult | null;
  onSelect: (optionId: string) => void;
  onSubmit: (optionId: string) => void;
}

export function ConfirmationCall({
  mission,
  selectedOptionId,
  latestResult,
  onSelect,
  onSubmit,
}: ConfirmationCallProps) {
  const confirmationResult = latestResult?.stage === 'confirmation' ? latestResult : null;

  return (
    <section aria-labelledby="confirmation-call-heading">
      <h2 id="confirm-heading" tabIndex={-1}>확인 통화</h2>
      <p lang="ko">상대의 추가 답을 바탕으로 내가 이해한 뜻을 다시 연결해 보세요.</p>
      <fieldset>
        <legend>내가 이해한 뜻을 영어로 다시 확인해 보세요.</legend>
        {mission.confirmationOptions.map((option) => (
          <label className="choice-label" key={option.id}>
            <input
              type="radio"
              name="confirmation"
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={() => onSelect(option.id)}
            />
            <LanguageText language="en">{option.textEn}</LanguageText>
          </label>
        ))}
      </fieldset>
      <CriticalActionButton
        action="send-confirmation"
        disabled={!selectedOptionId}
        onClick={() => {
          if (selectedOptionId) onSubmit(selectedOptionId);
        }}
      />
      <FeedbackNotice result={confirmationResult} />
    </section>
  );
}
