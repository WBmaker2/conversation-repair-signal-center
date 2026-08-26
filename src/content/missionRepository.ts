import type { GradeBand, Mission } from '../domain/mission';
import { MISSIONS } from './missions';

export { MISSIONS, MISSION_IDS } from './missions';

export function getMissionById(id: string): Mission {
  const mission = MISSIONS.find((candidate) => candidate.id === id);
  if (!mission) throw new Error(`Unknown mission id: ${id}`);
  return mission;
}

export function getMissionsByGradeBand(gradeBand: GradeBand): readonly Mission[] {
  return MISSIONS.filter((mission) => mission.gradeBand === gradeBand);
}
