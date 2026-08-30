import type { GradeBand } from '../../domain/mission';
import { AudioPreferenceToggle } from '../audio/AudioPreferenceToggle';

export interface SetupPanelProps {
  gradeBand: GradeBand;
  voiceEnabled: boolean;
  onGradeBandChange: (gradeBand: GradeBand) => void;
  onVoiceEnabledChange: (enabled: boolean) => void;
}

export function SetupPanel({
  gradeBand,
  voiceEnabled,
  onGradeBandChange,
  onVoiceEnabledChange,
}: SetupPanelProps) {
  return (
    <>
      <section className="setup-panel" aria-labelledby="grade-selection-heading">
        <h2 id="grade-selection-heading">수준에 맞는 미션 고르기</h2>
        <fieldset>
          <legend>학년 수준 선택</legend>
          <button
            type="button"
            className="grade-band-button"
            aria-pressed={gradeBand === '3-4'}
            onClick={() => onGradeBandChange('3-4')}
          >
            3~4학년
          </button>
          <button
            type="button"
            className="grade-band-button"
            aria-pressed={gradeBand === '5-6'}
            onClick={() => onGradeBandChange('5-6')}
          >
            5~6학년
          </button>
        </fieldset>
        <p className="selected-grade" aria-live="polite">현재 선택: {gradeBand === '3-4' ? '3~4학년' : '5~6학년'}</p>
      </section>
      <AudioPreferenceToggle checked={voiceEnabled} onChange={onVoiceEnabledChange} />
    </>
  );
}
