import type { Mission } from '../../domain/mission';

const REGISTERED_KOREAN_TRANSLATIONS: Record<string, readonly string[]> = {
  'the whole sentence': ['문장 전체', '전체 문장'],
  'over there': ['저기', '저곳', '그곳'],
};

function normalize(value: string): string {
  return value.toLocaleLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
}

export function findAmbiguityContentLeaks(mission: Mission): string[] {
  const fields = [mission.scenarioKo, ...mission.dialogue.flatMap((turn) => [turn.supportKo, turn.obscuredLabelKo])]
    .filter((value): value is string => Boolean(value))
    .map(normalize);
  return mission.ambiguityOptions
    .filter((option) => option.accepted)
    .flatMap((option) => [option.labelEn, ...(REGISTERED_KOREAN_TRANSLATIONS[option.labelEn] ?? [])])
    .filter((answer) => fields.some((field) => field.includes(normalize(answer))));
}

export function hasNoDirectAmbiguityAnswerLeak(mission: Mission): boolean {
  return findAmbiguityContentLeaks(mission).length === 0;
}
