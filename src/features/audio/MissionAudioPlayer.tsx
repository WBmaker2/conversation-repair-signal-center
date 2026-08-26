import { useEffect, useRef } from 'react';
import type { AudioCue } from '../../domain/mission';
import { useAudioPlayer, type PlaybackRate } from './useAudioPlayer';

export interface MissionAudioPlayerProps {
  cue: AudioCue;
  labelKo: string;
}

export function MissionAudioPlayer({ cue, labelKo }: MissionAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, playbackRate, togglePlayback, setPlaybackRate, stop } = useAudioPlayer(audioRef, cue.id);
  const playerLabel = `${labelKo} 음원`;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = playbackRate;
  }, [playbackRate]);

  return (
    <figure aria-label={playerLabel}>
      <figcaption>{labelKo}</figcaption>
      <audio
        ref={audioRef}
        data-testid="audio-element"
        src={`${import.meta.env.BASE_URL}${cue.src}`}
        preload="metadata"
        aria-label={playerLabel}
        onEnded={stop}
      />
      <div>
        <button type="button" onClick={() => void togglePlayback()}>
          {isPlaying ? '일시 정지' : '재생'}
        </button>
        <label>
          재생 속도
          <select
            value={playbackRate}
            aria-label="재생 속도"
            onChange={(event) => setPlaybackRate(Number(event.target.value) as PlaybackRate)}
          >
            <option value="0.75">0.75×</option>
            <option value="1">1×</option>
            <option value="1.25">1.25×</option>
          </select>
        </label>
      </div>
      <p lang="en">{cue.transcriptEn}</p>
      <p>번들 음성은 선택 가능한 로컬 합성 참고 음원이며, 교사·사람의 녹음이나 발음 평가가 아닙니다.</p>
    </figure>
  );
}
