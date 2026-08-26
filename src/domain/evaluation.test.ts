import { describe, expect, it } from 'vitest';

import { getMissionById, MISSIONS } from '../content/missionRepository';
import type { Mission, MissionStage } from './mission';
import { MissionChoiceError, evaluateMissionChoice } from './evaluation';

const stageCases: ReadonlyArray<{
  stage: MissionStage;
  optionKey: 'ambiguityOptions' | 'repairOptions' | 'meaningOptions' | 'confirmationOptions';
  acceptedSuffix: string;
  retrySuffix: string;
}> = [
  {
    stage: 'ambiguity',
    optionKey: 'ambiguityOptions',
    acceptedSuffix: 'ambiguity-target',
    retrySuffix: 'ambiguity-distractor-a',
  },
  {
    stage: 'repair',
    optionKey: 'repairOptions',
    acceptedSuffix: 'repair-best',
    retrySuffix: 'repair-retry',
  },
  {
    stage: 'meaning',
    optionKey: 'meaningOptions',
    acceptedSuffix: 'meaning-correct',
    retrySuffix: 'meaning-retry-a',
  },
  {
    stage: 'confirmation',
    optionKey: 'confirmationOptions',
    acceptedSuffix: 'confirmation-correct',
    retrySuffix: 'confirmation-retry-a',
  },
];

const resultKeys = ['feedbackKo', 'naturalness', 'optionId', 'revealAnswer', 'stage', 'status'];
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

  it('returns hint-only retry feedback without leaking accepted English', () => {
    for (const mission of MISSIONS) {
      const retry = evaluateMissionChoice(mission, 'repair', optionId(mission, 'repair-retry'));
      const acceptedEnglish = mission.repairOptions
        .filter(({ accepted }) => accepted)
        .map(({ textEn }) => textEn);

      expect(retry).toMatchObject({ status: 'retry', revealAnswer: false });
      for (const answerText of acceptedEnglish) {
        expect(retry.feedbackKo).not.toContain(answerText);
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

  it('returns only the non-revealing evaluation contract', () => {
    for (const mission of MISSIONS) {
      for (const { stage, acceptedSuffix, retrySuffix } of stageCases) {
        for (const selectedSuffix of [acceptedSuffix, retrySuffix]) {
          const result = evaluateMissionChoice(mission, stage, optionId(mission, selectedSuffix));
          const keys = Object.keys(result).sort();

          expect(keys).toEqual(
            result.naturalness ? resultKeys : resultKeys.filter((key) => key !== 'naturalness'),
          );
          for (const key of prohibitedResultKeys) {
            expect(result).not.toHaveProperty(key);
          }
          expect(JSON.stringify(result)).not.toContain('score');
          expect(JSON.stringify(result)).not.toContain('speed');
          expect(JSON.stringify(result)).not.toContain('timing');
        }
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

  it('rejects wrong-stage and unknown option IDs with an exact MissionChoiceError', () => {
    const mission = getMissionById('g34-classroom-box');
    const cases: ReadonlyArray<{ stage: MissionStage; optionId: string }> = [
      { stage: 'ambiguity', optionId: optionId(mission, 'repair-best') },
      { stage: 'repair', optionId: optionId(mission, 'meaning-correct') },
      { stage: 'meaning', optionId: optionId(mission, 'confirmation-correct') },
      { stage: 'confirmation', optionId: `${mission.id}--unknown` },
    ];

    for (const { stage, optionId: selectedId } of cases) {
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
  });
});
