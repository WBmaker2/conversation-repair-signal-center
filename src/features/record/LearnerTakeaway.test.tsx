import { describe, expect, it } from 'vitest';
import { getMissionById } from '../../content/missionRepository';
import type { MissionEvidence } from '../../domain/session';
import { buildLearnerTakeawayCopy } from './learnerTakeawayCopy';

const mission = getMissionById('g34-classroom-box');
const evidence: MissionEvidence = {
  missionId: mission.id,
  identifiedSlotKind: 'object',
  repairStrategyId: 'specify',
  firstMeaningOptionId: mission.meaningOptions[0]!.id,
  confirmedMeaningOptionId: mission.meaningOptions[0]!.id,
  meaningConfirmed: true,
  collaborationFeedbackKo: '비난하지 않고 확인 질문으로 대화를 이어 갔어요.',
  attempts: [],
};

describe('LearnerTakeaway', () => {
  it('builds a natural specify takeaway for the selected slot', () => {
    const copy = buildLearnerTakeawayCopy(mission, evidence);
    expect(copy.learnedKo).toBe('어느 상자 미션에서 어느 것인지 헷갈리는 부분을 찾고, 더 구체적으로 물어보는 방법을 배웠어요.');
    expect(copy.nextStepKo).toBe('다음 대화에서 어느 것인지 헷갈리면 구체적으로 물어보세요.');
    expect(copy.nextStepKo).not.toContain('점수');
  });

  it.each([
    ['repeat', '다시 말해 달라고 부탁하는 방법을 배웠어요.', '다시 말해 달라고 부탁해 보세요.'],
    ['confirm', '뜻을 확인하는 방법을 배웠어요.', '내가 이해한 뜻을 확인해 보세요.'],
    ['rephrase', '다른 말로 다시 설명하는 방법을 배웠어요.', '다른 말로 다시 설명해 보세요.'],
  ] as const)('uses a natural %s strategy template', (strategyId, learnedEnding, nextEnding) => {
    const copy = buildLearnerTakeawayCopy(mission, { ...evidence, repairStrategyId: strategyId });
    expect(copy.learnedKo).toBe(`어느 상자 미션에서 어느 것인지 헷갈리는 부분을 찾고, ${learnedEnding}`);
    expect(copy.nextStepKo).toBe(`다음 대화에서 어느 것인지 헷갈리면 ${nextEnding}`);
  });

  it.each([
    ['whole-utterance', '무슨 말인지'],
    ['object', '어느 것인지'],
    ['time', '언제인지'],
    ['place', '어디인지'],
    ['quantity', '몇 개인지'],
    ['person', '누가 맡는지'],
    ['sequence', '어떤 순서인지'],
    ['decision', '어떤 결정인지'],
  ] as const)('uses the natural %s slot phrase in both sentences', (slotKind, prompt) => {
    const copy = buildLearnerTakeawayCopy(mission, { ...evidence, identifiedSlotKind: slotKind });
    expect(copy.learnedKo).toContain(`어느 상자 미션에서 ${prompt} 헷갈리는 부분을 찾고`);
    expect(copy.nextStepKo).toContain(`다음 대화에서 ${prompt} 헷갈리면`);
  });
});
