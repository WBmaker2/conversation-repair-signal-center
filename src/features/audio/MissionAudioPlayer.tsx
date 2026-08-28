import { useEffect, useRef } from 'react';
import type { AudioCue } from '../../domain/mission';
import { useAudioPlayer, type PlaybackRate } from './useAudioPlayer';

export interface MissionAudioPlayerProps {
  cue: AudioCue;
  labelKo: string;
}

export function MissionAudioPlayer({ cue, labelKo }: MissionAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, playbackRate, playbackError, togglePlayback, setPlaybackRate, stop } = useAudioPlayer(audioRef, cue.id);
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
      {playbackError ? <p role="status" aria-live="polite">{playbackError}</p> : null}
      <p>컴퓨터가 만든 참고 소리이며 발음 점수는 없어요. 아래 대본으로도 연습할 수 있어요.</p>
    </figure>
  );
}
