import { describe, expect, it } from 'vitest';
import { MISSIONS } from './index';
import { findAmbiguityContentLeaks, hasNoDirectAmbiguityAnswerLeak } from './contentIntegrity';

describe('ambiguity content integrity', () => {
  it('does not expose an accepted ambiguity label or registered Korean translation', () => {
    for (const mission of MISSIONS) {
      expect(findAmbiguityContentLeaks(mission), mission.id).toEqual([]);
      expect(hasNoDirectAmbiguityAnswerLeak(mission)).toBe(true);
    }
  });

  it('normalizes punctuation and spacing but does not reject unrelated context words', () => {
    const mission = MISSIONS.find(({ id }) => id === 'g34-recess-time')!;
    expect(findAmbiguityContentLeaks({
      ...mission,
      scenarioKo: '종이 울려 친구의 문장 전체를 놓쳤습니다.',
    })).toContain('문장 전체');
    expect(findAmbiguityContentLeaks({
      ...mission,
      scenarioKo: '종이 울려 친구의 말을 잘 듣지 못했습니다.',
      dialogue: [{
        id: mission.dialogue[0]!.id,
        speaker: mission.dialogue[0]!.speaker,
        textEn: mission.dialogue[0]!.textEn,
      }],
    })).toEqual([]);
  });
});
