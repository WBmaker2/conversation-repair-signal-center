import type { Mission } from '../../domain/mission';
import { GRADE34_CLASSROOM_MISSIONS } from './grade34-classroom';
import { GRADE34_RECESS_MISSIONS } from './grade34-recess';
import { GRADE56_MATERIALS_MISSIONS } from './grade56-materials';
import { GRADE56_DIRECTIONS_MISSIONS } from './grade56-directions';
import { GRADE56_EVENTS_MISSIONS } from './grade56-events';

export const MISSIONS = [
  ...GRADE34_CLASSROOM_MISSIONS,
  ...GRADE34_RECESS_MISSIONS,
  ...GRADE56_MATERIALS_MISSIONS,
  ...GRADE56_DIRECTIONS_MISSIONS,
  ...GRADE56_EVENTS_MISSIONS,
] as const satisfies readonly Mission[];

export const MISSION_IDS = [
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
