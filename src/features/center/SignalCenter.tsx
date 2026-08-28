import type { GradeBand, Mission } from '../../domain/mission';
import { AudioPreferenceToggle } from '../audio/AudioPreferenceToggle';
import { MissionCard } from './MissionCard';
import { StrategyLegend } from './StrategyLegend';

export interface SignalCenterProps {
  gradeBand: GradeBand;
  missions: readonly Mission[];
  voiceEnabled: boolean;
  onGradeBandChange: (gradeBand: GradeBand) => void;
  onVoiceEnabledChange: (enabled: boolean) => void;
  onMissionStart: (missionId: string) => void;
}

export function SignalCenter({
  gradeBand,
  missions,
  voiceEnabled,
  onGradeBandChange,
  onVoiceEnabledChange,
  onMissionStart,
}: SignalCenterProps) {
  return (
    <div className="signal-center">
      <header>
        <h1 id="service-heading" tabIndex={-1}>대화 수리 신호센터</h1>
        <p>못 알아들은 순간은 대화를 이어 가는 신호예요.</p>
      </header>

      <p>이름을 묻지 않으며, 새로고침하면 현재 통신 기록이 사라져요.</p>
      <p role="status" aria-live="polite" lang="ko">학년·음성을 고른 뒤 시작하세요.</p>

      <section aria-labelledby="grade-selection-heading">
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

      <section aria-labelledby="mission-list-heading">
        <h2 id="mission-list-heading">미션 선택</h2>
        <div className="mission-grid">
          {missions.map((mission, index) => (
            <MissionCard key={mission.id} mission={mission} isRecommended={index === 0} onStart={onMissionStart} />
          ))}
        </div>
      </section>

      <section aria-labelledby="today-strategy-heading">
        <h2 id="today-strategy-heading">오늘의 전략</h2>
        <p>오늘의 전략: 이해가 안 되면 다시 물어도 괜찮아요.</p>
        <p>권장 학습 시간 20~30분</p>
      </section>

      <StrategyLegend />
    </div>
  );
}
