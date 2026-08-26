import { createElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SessionPhase } from '../domain/mission';
import { MissionHarness } from './missionHarnessComponent';

export { createSessionAtPhase } from './missionHarnessState';

export function renderMissionAtPhase(
  missionId: string,
  phase: Exclude<SessionPhase, 'center'>,
  voiceEnabled = false,
) {
  return {
    user: userEvent.setup(),
    ...render(createElement(MissionHarness, { missionId, phase, voiceEnabled })),
  };
}

export const renderMissionAtObservation = (id: string) => renderMissionAtPhase(id, 'observe');
export const renderMissionAtRepair = (id: string) => renderMissionAtPhase(id, 'repair');
export const renderMissionAtResponse = (id: string) => renderMissionAtPhase(id, 'response');
export const renderMissionAtConfirmation = (id: string) => renderMissionAtPhase(id, 'confirm');
