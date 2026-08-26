import { describe, expect, it } from 'vitest';
import rawAudioContract from '../../../scripts/audio-contract.json' with { type: 'json' };
import rawAudioManifest from './audio-manifest.json' with { type: 'json' };
import { MISSIONS } from './index';
import { GRADE34_CLASSROOM_CONTRACT } from './contract-fixtures/grade34-classroom';
import { GRADE34_RECESS_CONTRACT } from './contract-fixtures/grade34-recess';
import { GRADE56_MATERIALS_CONTRACT } from './contract-fixtures/grade56-materials';
import { GRADE56_DIRECTIONS_CONTRACT } from './contract-fixtures/grade56-directions';
import { GRADE56_EVENTS_CONTRACT } from './contract-fixtures/grade56-events';

const CANONICAL_MISSION_IDS = [
  'g34-classroom-box',
  'g34-classroom-pencil',
  'g34-recess-place',
  'g34-recess-time',
  'g34-recess-rephrase',
  'g56-materials-quantity',
  'g56-materials-person',
  'g56-directions-place',
  'g56-directions-sequence',
  'g56-event-decision',
] as const;

const SPEAKERS = ['Teacher', 'Partner', 'Leader', 'Guide', 'You'] as const;
type Speaker = (typeof SPEAKERS)[number];
interface ParsedTurn {
  speaker: Speaker;
  text: string;
}

const speakerPrefix = new RegExp(`(?=(?:${SPEAKERS.join('|')}):\\s)`);
const speakerTurn = new RegExp(`^(${SPEAKERS.join('|')}):\\s(.+)$`, 's');

function parseSpeakerTurns(transcript: string): ParsedTurn[] {
  const normalized = transcript.trim();
  const segments = normalized.split(speakerPrefix);
  const turns = segments.map((segment) => {
    const match = speakerTurn.exec(segment.trim());
    if (!match) throw new Error(`Transcript is not composed of exact Speaker: text turns: ${transcript}`);
    return { speaker: match[1] as Speaker, text: match[2]! };
  });
  const reconstructed = turns.map(({ speaker, text }) => `${speaker}: ${text}`).join(' ');
  if (reconstructed !== normalized) {
    throw new Error(`Transcript has non-turn text or ambiguous separators: ${transcript}`);
  }
  return turns;
}

const contractMissions = [
  ...GRADE34_CLASSROOM_CONTRACT,
  ...GRADE34_RECESS_CONTRACT,
  ...GRADE56_MATERIALS_CONTRACT,
  ...GRADE56_DIRECTIONS_CONTRACT,
  ...GRADE56_EVENTS_CONTRACT,
];

function dialogueTurns(mission: (typeof MISSIONS)[number]) {
  return mission.dialogue.map(({ speaker, textEn }) => ({ speaker, text: textEn }));
}

function contractDialogueTurns(missionId: string) {
  const mission = contractMissions.find(({ id }) => id === missionId);
  if (!mission) throw new Error(`Missing canonical mission contract: ${missionId}`);
  return mission.dialogue.map(({ speaker, textEn }) => ({ speaker, text: textEn }));
}

function dialogueCue(manifest: typeof rawAudioManifest, missionId: string) {
  const cue = manifest[missionId as keyof typeof manifest]?.[0];
  if (!cue) throw new Error(`Missing observation cue: ${missionId}`);
  expect(cue.id).toBe(`${missionId}-dialogue`);
  return cue.transcriptEn;
}

describe('observation audio dialogue parity', () => {
  it('defines g34-recess-rephrase as the two stable turns from the reviewed transcript', () => {
    const mission = MISSIONS.find(({ id }) => id === 'g34-recess-rephrase');
    expect(mission).toBeDefined();
    expect(mission!.dialogue).toEqual([
      { id: 'g34-recess-rephrase-you-dialogue', speaker: 'You', textEn: 'Let’s do it over there.' },
      { id: 'g34-recess-rephrase-partner-dialogue', speaker: 'Partner', textEn: 'I’m not sure what you mean.' },
    ]);
    expect(mission!.ambiguityOptions.find(({ accepted }) => accepted)?.turnId)
      .toBe('g34-recess-rephrase-you-dialogue');
  });

  it('matches exact speaker and text order across manifest, audio contract, source, and mission contract', () => {
    for (const missionId of CANONICAL_MISSION_IDS) {
      const manifestTurns = parseSpeakerTurns(dialogueCue(rawAudioManifest, missionId));
      const contractTurns = parseSpeakerTurns(dialogueCue(rawAudioContract, missionId));
      const source = MISSIONS.find(({ id }) => id === missionId);
      expect(source).toBeDefined();
      const sourceTurns = dialogueTurns(source!);
      const canonicalTurns = contractDialogueTurns(missionId);
      expect(manifestTurns, `${missionId} manifest`).toEqual(contractTurns);
      expect(manifestTurns, `${missionId} source`).toEqual(sourceTurns);
      expect(sourceTurns, `${missionId} contract`).toEqual(canonicalTurns);
    }
  });
});
