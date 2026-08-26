import { describe, expect, it } from 'vitest';

import { getMissionById } from '../content/missionRepository';
import type { EvaluationResult, Mission, MissionStage } from './mission';
import {
  buildMissionEvidence,
  createInitialSession,
  missionSessionReducer,
} from './session';

const mission = getMissionById('g34-classroom-box');

function optionId(stage: MissionStage, suffix: string): string {
  return `${mission.id}--${stage}-${suffix}`;
}

function result(stage: MissionStage, id: string, status: EvaluationResult['status']): EvaluationResult {
  return { stage, optionId: id, status, feedbackKo: `${status}:${stage}`, revealAnswer: false };
}

function startSession(selectedMission: Mission = mission) {
  return missionSessionReducer(createInitialSession(), {
    type: 'mission.started',
    missionId: selectedMission.id,
  });
}

function submit(
  state: ReturnType<typeof startSession>,
  stage: MissionStage,
  id: string,
  status: EvaluationResult['status'],
  selectedMission: Mission = mission,
) {
  const selected = missionSessionReducer(state, { type: 'choice.selected', stage, optionId: id });
  return missionSessionReducer(selected, {
    type: 'choice.submitted',
    mission: selectedMission,
    result: result(stage, id, status),
  });
}

describe('missionSessionReducer', () => {
  it('follows center → observe → repair → response → confirm → record', () => {
    let state = startSession();
    expect(state.phase).toBe('observe');

    state = submit(state, 'ambiguity', optionId('ambiguity', 'distractor-a'), 'retry');
    expect(state.phase).toBe('observe');
    state = submit(state, 'ambiguity', optionId('ambiguity', 'target'), 'accepted');
    expect(state.phase).toBe('repair');
    state = submit(state, 'repair', optionId('repair', 'best'), 'accepted');
    expect(state.phase).toBe('response');
    state = submit(state, 'meaning', optionId('meaning', 'retry-a'), 'retry');
    expect(state.phase).toBe('response');
    state = submit(state, 'meaning', optionId('meaning', 'correct'), 'accepted');
    expect(state.phase).toBe('confirm');
    state = submit(state, 'confirmation', optionId('confirmation', 'correct'), 'accepted');

    expect(state.phase).toBe('record');
    expect(state.evidence).toMatchObject({
      missionId: mission.id,
      identifiedSlotKind: 'object',
      repairStrategyId: 'specify',
      firstMeaningOptionId: optionId('meaning', 'retry-a'),
      confirmedMeaningOptionId: optionId('meaning', 'correct'),
      meaningConfirmed: true,
      collaborationFeedbackKo: '비난하지 않고 확인 질문으로 대화를 이어 갔어요.',
    });
    expect(state.attempts).toEqual([
      { stage: 'ambiguity', optionId: optionId('ambiguity', 'distractor-a'), status: 'retry' },
      { stage: 'ambiguity', optionId: optionId('ambiguity', 'target'), status: 'accepted' },
      { stage: 'repair', optionId: optionId('repair', 'best'), status: 'accepted' },
      { stage: 'meaning', optionId: optionId('meaning', 'retry-a'), status: 'retry' },
      { stage: 'meaning', optionId: optionId('meaning', 'correct'), status: 'accepted' },
      { stage: 'confirmation', optionId: optionId('confirmation', 'correct'), status: 'accepted' },
    ]);
    expect(state.evidence?.attempts).toEqual(state.attempts);
  });

  it('retains a retry phase and clears the previous result on a new selection', () => {
    let state = startSession();
    const firstId = optionId('ambiguity', 'distractor-a');
    const secondId = optionId('ambiguity', 'target');
    state = submit(state, 'ambiguity', firstId, 'retry');
    expect(state.latestResult).toMatchObject({ optionId: firstId, status: 'retry' });
    expect(state.selectedOptionIds.ambiguity).toBe(firstId);

    state = missionSessionReducer(state, {
      type: 'choice.selected', stage: 'ambiguity', optionId: secondId,
    });
    expect(state.phase).toBe('observe');
    expect(state.selectedOptionIds.ambiguity).toBe(secondId);
    expect(state.latestResult).toBeNull();
    expect(state.attempts).toHaveLength(1);
  });

  it('records the first meaning choice once, even when retry is followed by acceptance', () => {
    let state = startSession();
    state = submit(state, 'ambiguity', optionId('ambiguity', 'target'), 'accepted');
    state = submit(state, 'repair', optionId('repair', 'best'), 'accepted');
    state = submit(state, 'meaning', optionId('meaning', 'retry-a'), 'retry');
    expect(state.firstMeaningOptionId).toBe(optionId('meaning', 'retry-a'));
    state = submit(state, 'meaning', optionId('meaning', 'correct'), 'accepted');
    expect(state.firstMeaningOptionId).toBe(optionId('meaning', 'retry-a'));
  });

  it('ignores out-of-phase, incomplete, mismatched, and wrong-mission submissions', () => {
    const started = startSession();
    const ambiguityId = optionId('ambiguity', 'target');
    const repairId = optionId('repair', 'best');
    expect(missionSessionReducer(started, {
      type: 'choice.selected', stage: 'repair', optionId: repairId,
    })).toBe(started);
    expect(missionSessionReducer(started, {
      type: 'choice.submitted', mission, result: result('ambiguity', ambiguityId, 'accepted'),
    })).toBe(started);

    const selected = missionSessionReducer(started, {
      type: 'choice.selected', stage: 'ambiguity', optionId: ambiguityId,
    });
    expect(missionSessionReducer(selected, {
      type: 'choice.submitted', mission, result: result('ambiguity', repairId, 'accepted'),
    })).toBe(selected);
    expect(missionSessionReducer(selected, {
      type: 'choice.submitted', mission: { ...mission, id: 'other-mission' },
      result: result('ambiguity', ambiguityId, 'accepted'),
    })).toBe(selected);
    expect(missionSessionReducer(selected, {
      type: 'choice.submitted', mission, result: result('repair', ambiguityId, 'accepted'),
    })).toBe(selected);
  });

  it('restarts the same mission with only missionId retained and returns exactly to center initial state', () => {
    let state = submit(startSession(), 'ambiguity', optionId('ambiguity', 'target'), 'accepted');
    state = missionSessionReducer(state, { type: 'mission.restarted' });
    expect(state).toEqual({
      ...createInitialSession(),
      phase: 'observe',
      missionId: mission.id,
    });

    const returned = missionSessionReducer(state, { type: 'center.returned' });
    expect(returned).toEqual(createInitialSession());
    expect(returned.evidence).toBeNull();
  });

  it('does not mutate input state or mission and replays deterministically', () => {
    const beforeMission = structuredClone(mission);
    const beforeState = createInitialSession();
    const actions = [
      { type: 'mission.started', missionId: mission.id } as const,
      { type: 'choice.selected', stage: 'ambiguity', optionId: optionId('ambiguity', 'target') } as const,
    ];
    const first = actions.reduce(missionSessionReducer, beforeState);
    const second = actions.reduce(missionSessionReducer, createInitialSession());
    expect(first).toEqual(second);
    expect(beforeState).toEqual(createInitialSession());
    expect(mission).toEqual(beforeMission);
  });
});

describe('buildMissionEvidence', () => {
  it('returns strategy, slot, meaning, collaboration, and ordered attempt evidence', () => {
    let state = startSession();
    state = submit(state, 'ambiguity', optionId('ambiguity', 'target'), 'accepted');
    state = submit(state, 'repair', optionId('repair', 'best'), 'accepted');
    state = submit(state, 'meaning', optionId('meaning', 'correct'), 'accepted');
    state = submit(state, 'confirmation', optionId('confirmation', 'correct'), 'accepted');
    expect(buildMissionEvidence(mission, state)).toEqual(state.evidence);
  });

  it('throws controlled errors for incomplete state and IDs absent from the supplied mission', () => {
    expect(() => buildMissionEvidence(mission, createInitialSession())).toThrow(
      'Cannot build evidence before all learning stages are accepted',
    );

    let state = startSession();
    state = submit(state, 'ambiguity', optionId('ambiguity', 'target'), 'accepted');
    state = submit(state, 'repair', optionId('repair', 'best'), 'accepted');
    state = submit(state, 'meaning', optionId('meaning', 'correct'), 'accepted');
    state = submit(state, 'confirmation', optionId('confirmation', 'correct'), 'accepted');

    const invalid = {
      ...state,
      acceptedResults: {
        ...state.acceptedResults,
        ambiguity: result('ambiguity', 'missing-ambiguity', 'accepted'),
      },
    };
    expect(() => buildMissionEvidence(mission, invalid)).toThrow(
      'Cannot build evidence: ambiguity option missing-ambiguity was not found in supplied mission',
    );
  });
});
