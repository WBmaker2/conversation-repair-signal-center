import { describe, expect, it } from 'vitest';

import { getMissionById, MISSIONS } from '../content/missionRepository';
import type { Mission, MissionStage } from './mission';
import { MissionChoiceError, evaluateMissionChoice } from './evaluation';

type OptionKey = 'ambiguityOptions' | 'repairOptions' | 'meaningOptions' | 'confirmationOptions';

const stageCases: ReadonlyArray<{
  stage: MissionStage;
  optionKey: OptionKey;
  wrongStageOptionKey: OptionKey;
  acceptedSuffix: string;
  retrySuffix: string;
}> = [
  {
    stage: 'ambiguity',
    optionKey: 'ambiguityOptions',
    wrongStageOptionKey: 'repairOptions',
    acceptedSuffix: 'ambiguity-target',
    retrySuffix: 'ambiguity-distractor-a',
  },
  {
    stage: 'repair',
    optionKey: 'repairOptions',
    wrongStageOptionKey: 'meaningOptions',
    acceptedSuffix: 'repair-best',
    retrySuffix: 'repair-retry',
  },
  {
    stage: 'meaning',
    optionKey: 'meaningOptions',
    wrongStageOptionKey: 'confirmationOptions',
    acceptedSuffix: 'meaning-correct',
    retrySuffix: 'meaning-retry-a',
  },
  {
    stage: 'confirmation',
    optionKey: 'confirmationOptions',
    wrongStageOptionKey: 'ambiguityOptions',
    acceptedSuffix: 'confirmation-correct',
    retrySuffix: 'confirmation-retry-a',
  },
];

const baseResultKeys = ['feedbackKo', 'optionId', 'revealAnswer', 'stage', 'status'];
const acceptedRepairResultKeys = ['feedbackKo', 'naturalness', 'optionId', 'revealAnswer', 'stage', 'status'];
const prohibitedResultKeys = [
  'answer',
  'answerId',
  'answerIds',
  'answerText',
  'correctOptionId',
  'score',
  'speed',
  'time',
  'timing',
];

function optionId(mission: Mission, suffix: string): string {
  return `${mission.id}--${suffix}`;
}

function firstOptionId(mission: Mission, key: OptionKey): string {
  const option = mission[key][0];
  if (!option) throw new Error(`Expected ${key} to contain an option`);
  return option.id;
}

function visibleOptionText(option: Mission[OptionKey][number]): string | undefined {
  if ('labelEn' in option) return option.labelEn;
  if ('textEn' in option) return option.textEn;
  if ('labelKo' in option) return option.labelKo;
  return undefined;
}

function expectMissionChoiceError(mission: Mission, stage: MissionStage, selectedId: string): void {
  let caught: unknown;
  try {
    evaluateMissionChoice(mission, stage, selectedId);
  } catch (error) {
    caught = error;
  }

  expect(caught).toBeInstanceOf(MissionChoiceError);
  expect(caught).toBeInstanceOf(Error);
  expect(caught).toMatchObject({
    name: 'MissionChoiceError',
    message: `Unknown choice ${selectedId} for ${mission.id} at ${stage}`,
  });
}

describe('evaluateMissionChoice', () => {
  it('accepts and retries in every stage for every production mission', () => {
    for (const mission of MISSIONS) {
      for (const { stage, optionKey, acceptedSuffix, retrySuffix } of stageCases) {
        const accepted = evaluateMissionChoice(mission, stage, optionId(mission, acceptedSuffix));
        const retry = evaluateMissionChoice(mission, stage, optionId(mission, retrySuffix));
        const acceptedOption = mission[optionKey].find(({ id }) => id === accepted.optionId);
        const retryOption = mission[optionKey].find(({ id }) => id === retry.optionId);

        expect(accepted).toMatchObject({
          stage,
          optionId: optionId(mission, acceptedSuffix),
          status: 'accepted',
          feedbackKo: acceptedOption?.feedbackKo,
          revealAnswer: false,
        });
        expect(retry).toMatchObject({
          stage,
          optionId: optionId(mission, retrySuffix),
          status: 'retry',
          feedbackKo: retryOption?.feedbackKo,
          revealAnswer: false,
        });
      }
    }
  });

  it('preserves the two natural repair expressions and their distinct feedback', () => {
    for (const mission of MISSIONS) {
      const direct = evaluateMissionChoice(mission, 'repair', optionId(mission, 'repair-best'));
      const confirming = evaluateMissionChoice(mission, 'repair', optionId(mission, 'repair-works'));

      expect(direct).toMatchObject({ status: 'accepted', naturalness: 'best-fit', revealAnswer: false });
      expect(confirming).toMatchObject({ status: 'accepted', naturalness: 'works', revealAnswer: false });
      expect(direct.feedbackKo).not.toBe(confirming.feedbackKo);
    }
  });

  it('returns hint-only feedback for every retry without leaking accepted content', () => {
    for (const mission of MISSIONS) {
      for (const { stage, optionKey } of stageCases) {
        const acceptedContentCandidates = mission[optionKey]
          .filter(({ accepted }) => accepted)
          .flatMap((option) => [option.id, visibleOptionText(option)].filter((value): value is string => Boolean(value)));
        const retryOptions = mission[optionKey].filter(({ accepted }) => !accepted);

        for (const retryOption of retryOptions) {
          const retry = evaluateMissionChoice(mission, stage, retryOption.id);

          expect(retry).toMatchObject({ stage, optionId: retryOption.id, status: 'retry', revealAnswer: false });
          expect(Object.keys(retry).sort()).toEqual(baseResultKeys);
          for (const acceptedContent of acceptedContentCandidates) {
            expect(retry.feedbackKo).not.toContain(acceptedContent);
          }
        }
      }
    }

    const boxRetry = evaluateMissionChoice(
      getMissionById('g34-classroom-box'),
      'repair',
      'g34-classroom-box--repair-retry',
    );
    expect(boxRetry.feedbackKo).toBe('말은 들었지만 어느 상자인지가 아직 분명하지 않아요.');
    expect(boxRetry.feedbackKo).not.toContain('Which box?');
  });

  it('returns only the explicit non-revealing evaluation contract', () => {
    for (const mission of MISSIONS) {
      const ambiguity = evaluateMissionChoice(mission, 'ambiguity', optionId(mission, 'ambiguity-target'));
      const repairBest = evaluateMissionChoice(mission, 'repair', optionId(mission, 'repair-best'));
      const repairWorks = evaluateMissionChoice(mission, 'repair', optionId(mission, 'repair-works'));
      const repairRetry = evaluateMissionChoice(mission, 'repair', optionId(mission, 'repair-retry'));
      const meaning = evaluateMissionChoice(mission, 'meaning', optionId(mission, 'meaning-correct'));
      const confirmation = evaluateMissionChoice(mission, 'confirmation', optionId(mission, 'confirmation-correct'));
      const retryResults = stageCases.map(({ stage, optionKey }) =>
        mission[optionKey]
          .filter(({ accepted }) => !accepted)
          .map(({ id }) => evaluateMissionChoice(mission, stage, id)),
      ).flat();
      const results = [ambiguity, repairBest, repairWorks, repairRetry, meaning, confirmation, ...retryResults];

      expect(Object.keys(ambiguity).sort()).toEqual(baseResultKeys);
      expect(Object.keys(repairBest).sort()).toEqual(acceptedRepairResultKeys);
      expect(Object.keys(repairWorks).sort()).toEqual(acceptedRepairResultKeys);
      expect(Object.keys(repairRetry).sort()).toEqual(baseResultKeys);
      expect(Object.keys(meaning).sort()).toEqual(baseResultKeys);
      expect(Object.keys(confirmation).sort()).toEqual(baseResultKeys);
      expect(repairBest).toHaveProperty('naturalness', 'best-fit');
      expect(repairWorks).toHaveProperty('naturalness', 'works');
      expect(repairRetry).not.toHaveProperty('naturalness');
      expect(ambiguity).not.toHaveProperty('naturalness');
      expect(meaning).not.toHaveProperty('naturalness');
      expect(confirmation).not.toHaveProperty('naturalness');

      for (const result of results) {
        for (const key of prohibitedResultKeys) {
          expect(result).not.toHaveProperty(key);
        }
        expect(JSON.stringify(result)).not.toContain('score');
        expect(JSON.stringify(result)).not.toContain('speed');
        expect(JSON.stringify(result)).not.toContain('timing');
      }
    }
  });

  it('does not mutate the mission while evaluating choices', () => {
    for (const mission of MISSIONS) {
      const before = structuredClone(mission);

      for (const { stage, acceptedSuffix, retrySuffix } of stageCases) {
        evaluateMissionChoice(mission, stage, optionId(mission, acceptedSuffix));
        evaluateMissionChoice(mission, stage, optionId(mission, retrySuffix));
      }

      expect(mission).toEqual(before);
    }
  });

  it('rejects every unknown and wrong-stage ID with an exact MissionChoiceError', () => {
    for (const mission of MISSIONS) {
      for (const { stage, wrongStageOptionKey } of stageCases) {
        const unknownId = `${mission.id}--unknown-${stage}`;
        expectMissionChoiceError(mission, stage, unknownId);
        expectMissionChoiceError(mission, stage, firstOptionId(mission, wrongStageOptionKey));
      }
    }
  });
});
