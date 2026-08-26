import canonicalContract from '../../../scripts/audio-contract.json';
import { describe, expect, it } from 'vitest';
import { MISSIONS } from '../../content/missionRepository';
import { AUDIO_MANIFEST } from '../../content/missions/audioManifest';

describe('independent canonical audio contract', () => {
  it('deep-equals the runtime manifest to all 10 mission entries and 20 cues', () => {
    expect(AUDIO_MANIFEST).toEqual(canonicalContract);
    expect(Object.keys(canonicalContract)).toHaveLength(10);
    expect(Object.values(canonicalContract).flat()).toHaveLength(20);
    for (const mission of MISSIONS) {
      expect(mission.audioCues).toEqual(canonicalContract[mission.id as keyof typeof canonicalContract]);
    }
  });

  it('locks every canonical cue id, source, mime, and exact transcript independently', () => {
    const cues = Object.values(canonicalContract).flat();
    expect(new Set(cues.map((cue) => cue.id)).size).toBe(20);
    expect(new Set(cues.map((cue) => cue.src)).size).toBe(20);
    for (const cue of cues) {
      expect(cue.id).toMatch(/^(g34|g56)-.+-(dialogue|response)$/);
      expect(cue.src).toBe(`audio/${cue.id.replace(/-(dialogue|response)$/, '')}/${cue.id.endsWith('-dialogue') ? 'dialogue' : 'response'}.mp3`);
      expect(cue.mimeType).toBe('audio/mpeg');
      expect(cue.transcriptEn).not.toBe('');
    }
  });
});
