import { describe, expect, it } from 'vitest';
import type { Mission } from '../../domain/mission';
import { validateMissionPack } from '../missionValidation';
import { MISSIONS, MISSION_IDS } from './index';
import { getMissionById, getMissionsByGradeBand } from '../missionRepository';
import { GRADE34_CLASSROOM_CONTRACT } from './contract-fixtures/grade34-classroom';
import { GRADE34_RECESS_CONTRACT } from './contract-fixtures/grade34-recess';
import { GRADE56_MATERIALS_CONTRACT } from './contract-fixtures/grade56-materials';
import { GRADE56_DIRECTIONS_CONTRACT } from './contract-fixtures/grade56-directions';
import { GRADE56_EVENTS_CONTRACT } from './contract-fixtures/grade56-events';

const EXPECTED_IDS = [
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

describe('reviewed ten-mission content pack', () => {
  it('ships exactly the reviewed ten-mission pack', () => {
    expect(MISSION_IDS).toEqual(EXPECTED_IDS);
    expect(MISSIONS).toHaveLength(10);
    expect(validateMissionPack(MISSIONS)).toMatchObject({ valid: true, issues: [] });
  });

  it('deep-equals every production mission to independent canonical literals', () => {
    const expected = [
      ...GRADE34_CLASSROOM_CONTRACT,
      ...GRADE34_RECESS_CONTRACT,
      ...GRADE56_MATERIALS_CONTRACT,
      ...GRADE56_DIRECTIONS_CONTRACT,
      ...GRADE56_EVENTS_CONTRACT,
    ];
    expect(MISSIONS).toEqual(expected);
    expect(expected).toHaveLength(10);
  });

  it('covers both grade bands, all strategies, and multiple valid expressions', () => {
    const report = validateMissionPack(MISSIONS);
    expect(report.coverage.gradeBandCounts).toEqual({ '3-4': 5, '5-6': 5 });
    expect(report.coverage.strategyIds.sort()).toEqual(['confirm', 'repeat', 'rephrase', 'specify']);
    expect(report.coverage.missionsWithMultipleAcceptedRepairs).toHaveLength(10);
  });

  it('keeps every mission stage at exactly three options with stable global IDs', () => {
    const optionIds = new Set<string>();
    for (const mission of MISSIONS) {
      const stages: readonly (readonly { id: string; accepted: boolean }[])[] = [
        mission.ambiguityOptions,
        mission.repairOptions,
        mission.meaningOptions,
        mission.confirmationOptions,
      ];
      expect(new Set(mission.allowedStrategyIds).size).toBe(mission.allowedStrategyIds.length);
      for (const [stageIndex, options] of stages.entries()) {
        expect(options).toHaveLength(3);
        expect(options.filter((option) => option.accepted)).toHaveLength(stageIndex === 1 ? 2 : 1);
        for (const option of options) {
          expect(option.id).toMatch(new RegExp(`^${mission.id}--`));
          expect(optionIds.has(option.id)).toBe(false);
          optionIds.add(option.id);
        }
      }
      expect(mission.audioCues).toHaveLength(2);
      expect(mission.audioCues.map((cue) => cue.id)).toEqual([
        `${mission.id}-dialogue`,
        `${mission.id}-response`,
      ]);
      expect(mission.audioCues.every((cue) => cue.src.startsWith('audio/'))).toBe(true);
      expect(mission.audioCues.every((cue) => cue.transcriptEn.trim().length > 0)).toBe(true);
    }
    expect(optionIds.size).toBe(120);
  });

  it('preserves the exact contracted dialogue, responses, labels, and feedback', () => {
    const expected: Record<string, Partial<Mission>> = {
      'g34-classroom-box': {
        dialogue: [{ id: 'g34-classroom-box-dialogue', speaker: 'Teacher', textEn: 'Please put the crayons in that box.' }],
        clarifyingResponse: { id: 'g34-classroom-box-response', speaker: 'Teacher', textEn: 'The blue box by the window.' },
      },
      'g34-classroom-pencil': {
        dialogue: [{ id: 'g34-classroom-pencil-dialogue', speaker: 'Partner', textEn: 'Can you pass me that one?' }],
        clarifyingResponse: { id: 'g34-classroom-pencil-response', speaker: 'Partner', textEn: 'The short pencil, please.' },
      },
      'g34-recess-place': {
        dialogue: [{ id: 'g34-recess-place-dialogue', speaker: 'Partner', textEn: 'Let’s meet there after lunch.' }],
        clarifyingResponse: { id: 'g34-recess-place-response', speaker: 'Partner', textEn: 'At the bench beside the playground gate.' },
      },
      'g34-recess-time': {
        dialogue: [{ id: 'g34-recess-time-dialogue', speaker: 'Partner', textEn: 'You could not catch this sentence because the bell rang.', obscuredLabelKo: '종소리 때문에 이 문장 전체를 놓쳤습니다.' }],
        clarifyingResponse: { id: 'g34-recess-time-response', speaker: 'Partner', textEn: 'Let’s start the game at one thirty.' },
      },
      'g34-recess-rephrase': {
        dialogue: [{ id: 'g34-recess-rephrase-dialogue', speaker: 'Partner', textEn: 'Let’s do it over there.' }],
        clarifyingResponse: { id: 'g34-recess-rephrase-response', speaker: 'Partner', textEn: 'Okay, beside the hopscotch grid.' },
      },
      'g56-materials-quantity': {
        dialogue: [{ id: 'g56-materials-quantity-dialogue', speaker: 'Leader', textEn: 'Please bring some sheets of poster paper tomorrow.' }],
        clarifyingResponse: { id: 'g56-materials-quantity-response', speaker: 'Leader', textEn: 'Please bring four sheets.' },
      },
      'g56-materials-person': {
        dialogue: [{ id: 'g56-materials-person-dialogue', speaker: 'Leader', textEn: 'Minseo has the tape. We still need the markers.' }],
        clarifyingResponse: { id: 'g56-materials-person-response', speaker: 'Leader', textEn: 'I will bring two packs of markers.' },
      },
      'g56-directions-place': {
        dialogue: [{ id: 'g56-directions-place-dialogue', speaker: 'Guide', textEn: 'After the bank, turn toward the hall.' }],
        clarifyingResponse: { id: 'g56-directions-place-response', speaker: 'Guide', textEn: 'The music hall across from the bakery.' },
      },
      'g56-directions-sequence': {
        dialogue: [{ id: 'g56-directions-sequence-dialogue', speaker: 'Guide', textEn: 'Walk past the pharmacy and cross at the second light. Then take the next turn.' }],
        clarifyingResponse: { id: 'g56-directions-sequence-response', speaker: 'Guide', textEn: 'Turn right. The library is the first building on the left.' },
      },
      'g56-event-decision': {
        dialogue: [{ id: 'g56-event-decision-dialogue', speaker: 'Partner', textEn: 'We could meet at two in the library, or at three in the art room. I think the second plan works better.' }],
        clarifyingResponse: { id: 'g56-event-decision-response', speaker: 'Partner', textEn: 'Yes. Three in the art room is the final plan.' },
      },
    };
    for (const [id, values] of Object.entries(expected)) {
      expect(getMissionById(id)).toMatchObject(values);
    }
    expect(getMissionById('g34-recess-time').dialogue[0]).toMatchObject({
      textEn: 'You could not catch this sentence because the bell rang.',
      obscuredLabelKo: '종소리 때문에 이 문장 전체를 놓쳤습니다.',
    });
    expect(getMissionById('g34-recess-rephrase').confirmationOptions.every((option) => option.mode === 'rephrase')).toBe(true);
    expect(MISSIONS.filter((mission) => mission.id !== 'g34-recess-rephrase').every((mission) => mission.confirmationOptions.every((option) => option.mode === 'confirm'))).toBe(true);
  });

  it('locks every contracted option string, accepted flag, strategy, and naturalness', () => {
    const contract = {
      'g34-classroom-box': {
        ambiguity: ['that box', 'the crayons', 'Please put'], repair: ['Which box?', 'Do you mean the blue box?', 'Could you say that again?'],
        meaning: ['창가에 있는 파란 상자', '문 옆 빨간 상자', '책상 아래 파란 상자'], confirmation: ['So, I’ll put the crayons in the blue box by the window.', 'So, I’ll put the crayons in the red box by the door.', 'So, I’ll put the crayons in the blue box under the desk.'], strategies: ['specify', 'confirm', 'repeat'],
      },
      'g34-classroom-pencil': {
        ambiguity: ['that one', 'pass me', 'Can you'], repair: ['Which one?', 'Do you mean the long pencil?', 'What time?'],
        meaning: ['짧은 연필', '긴 연필', '짧은 자'], confirmation: ['Okay, you mean the short pencil.', 'Okay, you mean the long pencil.', 'Okay, you mean the short ruler.'], strategies: ['specify', 'confirm', 'specify'],
      },
      'g34-recess-place': {
        ambiguity: ['there', 'after lunch', 'Let’s meet'], repair: ['Where should we meet?', 'Do you mean by the swings?', 'What time?'],
        meaning: ['운동장 문 옆 벤치', '그네 옆', '교실 문 앞'], confirmation: ['We’ll meet at the bench beside the playground gate.', 'We’ll meet by the swings.', 'We’ll meet by the classroom door.'], strategies: ['specify', 'confirm', 'specify'],
      },
      'g34-recess-time': {
        ambiguity: ['the whole sentence', 'the bell sound', 'the speaker'], repair: ['Could you say that again?', 'Sorry, can you repeat that?', 'Which one?'],
        meaning: ['오후 1시 30분', '오후 1시', '오후 2시 30분'], confirmation: ['The game starts at one thirty, right?', 'The game starts at one, right?', 'The game starts at two thirty, right?'], strategies: ['repeat', 'repeat', 'specify'],
      },
      'g34-recess-rephrase': {
        ambiguity: ['over there', 'Let’s', 'do it'], repair: ['Let me say it another way. Let’s draw with chalk beside the hopscotch grid.', 'I mean the place beside the hopscotch grid.', 'Could you say that again?'],
        meaning: ['사방치기 칸 옆', '큰 나무 아래', '그네 옆'], confirmation: ['Right, I mean the place beside the hopscotch grid.', 'Right, I mean the place under the big tree.', 'Right, I mean the place beside the swings.'], strategies: ['rephrase', 'rephrase', 'repeat'],
      },
      'g56-materials-quantity': {
        ambiguity: ['some sheets', 'poster paper', 'tomorrow'], repair: ['How many sheets of poster paper should I bring?', 'How much poster paper should I bring?', 'Who will bring it?'],
        meaning: ['포스터 종이 네 장', '포스터 종이 두 장', '포스터 종이 네 묶음'], confirmation: ['I’ll bring four sheets of poster paper tomorrow.', 'I’ll bring two sheets of poster paper tomorrow.', 'I’ll bring four packs of poster paper tomorrow.'], strategies: ['specify', 'specify', 'specify'],
      },
      'g56-materials-person': {
        ambiguity: ['who brings the markers', 'Minseo has the tape', 'the tape'], repair: ['Who will bring the markers?', 'Do you mean you will bring the markers?', 'How many markers?'],
        meaning: ['상대가 마커 두 묶음, 민서가 테이프 담당', '민서가 마커와 테이프 모두 담당', '상대가 테이프, 민서가 마커 담당'], confirmation: ['You’ll bring two packs of markers, and Minseo has the tape.', 'Minseo will bring the markers and the tape.', 'You’ll bring the tape, and Minseo has the markers.'], strategies: ['specify', 'confirm', 'specify'],
      },
      'g56-directions-place': {
        ambiguity: ['the hall', 'the bank', 'After'], repair: ['Which hall do you mean?', 'Do you mean the music hall?', 'Could you say that again?'],
        meaning: ['빵집 맞은편 음악당', '빵집 맞은편 체육관', '은행 옆 음악당'], confirmation: ['I turn toward the music hall across from the bakery.', 'I turn toward the sports hall across from the bakery.', 'I turn toward the music hall beside the bank.'], strategies: ['specify', 'confirm', 'repeat'],
      },
      'g56-directions-sequence': {
        ambiguity: ['the next turn', 'the pharmacy', 'the second light'], repair: ['What should I do after the second traffic light?', 'Do I turn right after the second light?', 'Where is the pharmacy?'],
        meaning: ['두 번째 신호등 뒤 우회전, 왼쪽 첫 건물 도서관', '두 번째 신호등 뒤 좌회전', '우회전 뒤 왼쪽 두 번째 건물 도서관'], confirmation: ['After the second light, I turn right and find the library on the left.', 'After the second light, I turn left.', 'After the second light, I turn right and pass the library on the right.'], strategies: ['specify', 'confirm', 'specify'],
      },
      'g56-event-decision': {
        ambiguity: ['the final time and place', 'the library', 'the art room'], repair: ['Do you mean we’re meeting at three in the art room?', 'Is the final plan three o’clock in the art room?', 'Could you say that again?'],
        meaning: ['오후 3시 미술실이 최종 계획', '오후 2시 도서관이 최종 계획', '오후 3시 도서관이 최종 계획'], confirmation: ['Got it. The final plan is three o’clock in the art room.', 'Got it. The final plan is two o’clock in the library.', 'Got it. The final plan is three o’clock in the library.'], strategies: ['confirm', 'confirm', 'repeat'],
      },
    } as const;
    for (const mission of MISSIONS) {
      const row = contract[mission.id as keyof typeof contract];
      expect(mission.ambiguityOptions.map((option) => option.labelEn)).toEqual(row.ambiguity);
      expect(mission.repairOptions.map((option) => option.textEn)).toEqual(row.repair);
      expect(mission.meaningOptions.map((option) => option.labelKo)).toEqual(row.meaning);
      expect(mission.confirmationOptions.map((option) => option.textEn)).toEqual(row.confirmation);
      expect(mission.repairOptions.map((option) => option.strategyId)).toEqual(row.strategies);
      expect(mission.repairOptions.map((option) => option.accepted)).toEqual([true, true, false]);
      expect(mission.repairOptions.map((option) => option.naturalness)).toEqual(['best-fit', 'works', undefined]);
    }
  });

  it('provides repository lookup and immutable ordered exports', () => {
    expect(getMissionsByGradeBand('3-4')).toHaveLength(5);
    expect(getMissionsByGradeBand('5-6')).toHaveLength(5);
    expect(getMissionById(EXPECTED_IDS[0])).toBe(MISSIONS[0]);
    expect(() => getMissionById('missing-mission')).toThrow('Unknown mission id: missing-mission');
    expect(MISSION_IDS).toEqual(MISSIONS.map((mission) => mission.id));
  });
});
