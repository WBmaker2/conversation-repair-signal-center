import type { Mission, EvaluationResult } from '../../domain/mission';
import { CriticalActionButton } from '../../shared/CriticalActionButton';
import { FeedbackNotice } from '../../shared/FeedbackNotice';
import { LanguageText } from '../../shared/LanguageText';
import { MissionAudioPlayer } from '../audio/MissionAudioPlayer';
import { DialogueTurnView } from './DialogueTurnView';

export interface DialogueObservationProps {
  mission: Mission;
  selectedOptionId: string | undefined;
  latestResult: EvaluationResult | null;
  voiceEnabled?: boolean;
  onSelect: (optionId: string) => void;
  onSubmit: (optionId: string) => void;
}

export function DialogueObservation({
  mission,
  selectedOptionId,
  latestResult,
  voiceEnabled = false,
  onSelect,
  onSubmit,
}: DialogueObservationProps) {
  return (
    <section aria-labelledby="observe-heading">
      <p className="phase-label">대화 관측</p>
      <h2 id="observe-heading" tabIndex={-1}>다시 물어볼 부분 찾기</h2>
      <p>대화에서 어떤 부분이 분명하지 않은지 살펴보세요.</p>
      <ol className="dialogue-list" aria-label="대화 순서">
        {mission.dialogue.map((turn, index) => (
          <DialogueTurnView key={turn.id} turn={turn} sequence={index + 1} />
        ))}
      </ol>
      {voiceEnabled && mission.audioCues[0] ? (
        <MissionAudioPlayer cue={mission.audioCues[0]} labelKo="대화 듣기" />
      ) : null}
      <fieldset>
        <legend>어느 부분이 분명하지 않나요?</legend>
        {mission.ambiguityOptions.map((option) => (
          <label className="choice-label" key={option.id}>
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
