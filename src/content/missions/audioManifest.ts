import type { AudioCue } from '../../domain/mission';
import rawAudioManifest from './audio-manifest.json' with { type: 'json' };

export const AUDIO_MANIFEST = rawAudioManifest as Readonly<Record<string, readonly AudioCue[]>>;

export function getAudioCues(missionId: string): readonly AudioCue[] {
  const cues = AUDIO_MANIFEST[missionId];
  if (!cues) throw new Error(`Missing audio cues for mission: ${missionId}`);
  return cues;
}
