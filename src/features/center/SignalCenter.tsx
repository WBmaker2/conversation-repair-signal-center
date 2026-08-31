import type { GradeBand, Mission } from '../../domain/mission';
import { MissionCard } from './MissionCard';
import { StrategyLegend } from './StrategyLegend';
import { LearningPromise } from './LearningPromise';
import { SetupPanel } from './SetupPanel';
import { StrategySummary } from './StrategySummary';
import { EmptyMissionState } from './EmptyMissionState';

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
  const recommendedMission = missions[0];
  return (
    <div className="signal-center">
      <LearningPromise recommendedMissionTitle={recommendedMission?.titleKo ?? '첫 미션'} />

      <SetupPanel
        gradeBand={gradeBand}
        voiceEnabled={voiceEnabled}
        onGradeBandChange={onGradeBandChange}
        onVoiceEnabledChange={onVoiceEnabledChange}
      />

      <section aria-labelledby="mission-list-heading">
        <h2 id="mission-list-heading">미션 선택</h2>
        {missions.length > 0 ? (
          <div className="mission-grid">
            {missions.map((mission, index) => (
              <MissionCard key={mission.id} mission={mission} isRecommended={index === 0} onStart={onMissionStart} />
            ))}
          </div>
        ) : (
          <EmptyMissionState gradeBand={gradeBand} onGradeBandChange={onGradeBandChange} />
        )}
      </section>

      <p className="privacy-note">이름을 묻지 않으며, 새로고침하면 지금까지의 학습 기록이 사라져요.</p>
      <p className="center-status" role="status" aria-live="polite" lang="ko">학년·음성을 고른 뒤 시작하세요.</p>

      <section aria-labelledby="today-strategy-heading">
        <h2 id="today-strategy-heading">오늘의 전략</h2>
        <p>이해가 안 되면 다시 물어도 괜찮아요.</p>
        <p>권장 학습 시간 20~30분</p>
      </section>

      <StrategySummary />
      <StrategyLegend />
    </div>
  );
}
