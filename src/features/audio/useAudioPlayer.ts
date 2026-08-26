import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export type PlaybackRate = 0.75 | 1 | 1.25;

export interface UseAudioPlayerResult {
  isPlaying: boolean;
  playbackRate: PlaybackRate;
  togglePlayback: () => Promise<void>;
  setPlaybackRate: (rate: PlaybackRate) => void;
  stop: () => void;
}

export function useAudioPlayer(
  audioRef: RefObject<HTMLAudioElement | null>,
  cueId: string,
): UseAudioPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState<PlaybackRate>(1);
  const isPlayingRef = useRef(false);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      if (!audio.paused || isPlayingRef.current) audio.pause();
      audio.currentTime = 0;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        if (!audio.paused || isPlayingRef.current) audio.pause();
        audio.currentTime = 0;
      }
      isPlayingRef.current = false;
      setIsPlaying(false);
    };
  }, [audioRef, cueId]);

  const setPlaybackRate = useCallback((rate: PlaybackRate) => {
    setPlaybackRateState(rate);
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
  }, [audioRef]);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
      return;
    }
    try {
      audio.playbackRate = playbackRate;
      await audio.play();
      isPlayingRef.current = true;
      setIsPlaying(true);
    } catch {
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, [audioRef, isPlaying, playbackRate]);

  return { isPlaying, playbackRate, togglePlayback, setPlaybackRate, stop };
}
