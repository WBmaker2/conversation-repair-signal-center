import type { EvaluationResult, Mission } from '../../domain/mission';
import { FeedbackNotice } from '../../shared/FeedbackNotice';
import { LanguageText } from '../../shared/LanguageText';
import { MissionAudioPlayer } from '../audio/MissionAudioPlayer';

export interface ResponseReceptionProps {
  mission: Mission;
  selectedOptionId: string | undefined;
  latestResult: EvaluationResult | null;
  voiceEnabled?: boolean;
  onSelect: (optionId: string) => void;
  onSubmit: (optionId: string) => void;
}

export function ResponseReception({
  mission,
  selectedOptionId,
  latestResult,
  voiceEnabled = false,
  onSelect,
  onSubmit,
}: ResponseReceptionProps) {
  return (
    <section aria-labelledby="response-heading">
      <h2 id="response-heading">응답 수신</h2>
      <blockquote>
        <LanguageText language="en">{mission.clarifyingResponse.textEn}</LanguageText>
        {mission.clarifyingResponse.supportKo && (
          <LanguageText language="ko" as="p">{mission.clarifyingResponse.supportKo}</LanguageText>
        )}
      </blockquote>
      {voiceEnabled && mission.audioCues[1] ? (
        <MissionAudioPlayer cue={mission.audioCues[1]} labelKo="응답 듣기" />
      ) : null}
      <fieldset>
        <legend>상대가 확인해 준 뜻은 무엇인가요?</legend>
        {mission.meaningOptions.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="meaning"
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={() => onSelect(option.id)}
            />
            <LanguageText language="ko">{option.labelKo}</LanguageText>
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
        이해한 뜻 확인하기
      </button>
      <FeedbackNotice result={latestResult} />
    </section>
  );
}
