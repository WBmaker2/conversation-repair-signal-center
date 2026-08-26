import type { Mission, EvaluationResult } from '../../domain/mission';
import { CriticalActionButton } from '../../shared/CriticalActionButton';
import { FeedbackNotice } from '../../shared/FeedbackNotice';
import { LanguageText } from '../../shared/LanguageText';
import { DialogueTurnView } from './DialogueTurnView';

export interface DialogueObservationProps {
  mission: Mission;
  selectedOptionId: string | undefined;
  latestResult: EvaluationResult | null;
  onSelect: (optionId: string) => void;
  onSubmit: (optionId: string) => void;
}

export function DialogueObservation({
  mission,
  selectedOptionId,
  latestResult,
  onSelect,
  onSubmit,
}: DialogueObservationProps) {
  return (
    <section aria-labelledby="observation-heading">
      <h2 id="observation-heading">대화 관측</h2>
      <p>대화에서 어떤 부분이 분명하지 않은지 살펴보세요.</p>
      <ol aria-label="대화 순서">
        {mission.dialogue.map((turn, index) => (
          <DialogueTurnView key={turn.id} turn={turn} sequence={index + 1} />
        ))}
      </ol>
      <fieldset>
        <legend>어느 부분이 분명하지 않나요?</legend>
        {mission.ambiguityOptions.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="ambiguity"
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={() => onSelect(option.id)}
            />
            <LanguageText language="en">{option.labelEn}</LanguageText>
          </label>
        ))}
      </fieldset>
      <CriticalActionButton
        action="find-ambiguity"
        disabled={!selectedOptionId}
        onClick={() => {
          if (selectedOptionId) onSubmit(selectedOptionId);
        }}
      />
      <FeedbackNotice result={latestResult} />
    </section>
  );
}
