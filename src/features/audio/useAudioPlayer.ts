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
  const generationRef = useRef(0);
  const mountedRef = useRef(true);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    generationRef.current += 1;
    if (audio) {
      if (!audio.paused || isPlayingRef.current) audio.pause();
      audio.currentTime = 0;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    ++generationRef.current;
    return () => {
      generationRef.current += 1;
      if (audio) {
        if (!audio.paused || isPlayingRef.current) audio.pause();
        audio.currentTime = 0;
      }
      isPlayingRef.current = false;
      if (mountedRef.current) setIsPlaying(false);
    };
  }, [audioRef, cueId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      generationRef.current += 1;
    };
  }, []);

  const setPlaybackRate = useCallback((rate: PlaybackRate) => {
    setPlaybackRateState(rate);
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
  }, [audioRef]);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlayingRef.current) {
      generationRef.current += 1;
      isPlayingRef.current = false;
      audio.pause();
      setIsPlaying(false);
      return;
    }
    isPlayingRef.current = true;
    const generation = ++generationRef.current;
    try {
      audio.playbackRate = playbackRate;
      await audio.play();
      if (!mountedRef.current || generationRef.current !== generation || audioRef.current !== audio || !isPlayingRef.current) return;
      setIsPlaying(true);
    } catch {
      if (!mountedRef.current || generationRef.current !== generation || audioRef.current !== audio || !isPlayingRef.current) return;
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, [audioRef, playbackRate]);

  return { isPlaying, playbackRate, togglePlayback, setPlaybackRate, stop };
}
