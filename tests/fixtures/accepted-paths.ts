import { getMissionById, MISSION_IDS, MISSIONS } from '../../src/content/missionRepository';
import type { GradeBand } from '../../src/domain/mission';
import type { Page } from '@playwright/test';

export interface AcceptedMissionPath {
  missionId: string;
  gradeBand: GradeBand;
  ambiguityLabel: string;
  repairExpression: string;
  meaningLabelKo: string;
  confirmationExpression: string;
}

const acceptedPaths: readonly AcceptedMissionPath[] = MISSIONS.map((mission) => ({
  missionId: mission.id,
  gradeBand: mission.gradeBand,
  ambiguityLabel: mission.ambiguityOptions.find(({ accepted }) => accepted)!.labelEn,
  repairExpression: mission.repairOptions.find(({ accepted, naturalness }) => accepted && naturalness === 'best-fit')!.textEn,
  meaningLabelKo: mission.meaningOptions.find(({ accepted }) => accepted)!.labelKo,
  confirmationExpression: mission.confirmationOptions.find(({ accepted }) => accepted)!.textEn,
}));

if (acceptedPaths.length !== MISSION_IDS.length || !acceptedPaths.every(({ missionId }) => MISSION_IDS.includes(missionId as typeof MISSION_IDS[number]))) {
  throw new Error('Accepted paths must cover the canonical mission IDs.');
}

export const ACCEPTED_PATHS = acceptedPaths;

export async function chooseGradeAndMission(page: Page, path: AcceptedMissionPath) {
  await page.getByRole('button', { name: path.gradeBand === '3-4' ? '3~4학년' : '5~6학년' }).click();
  const mission = getMissionById(path.missionId);
  await page.getByRole('button', { name: `${mission.titleKo} 미션 시작` }).click();
}

export async function completeAcceptedPath(
  page: Page,
  path: AcceptedMissionPath,
  repairExpression = path.repairExpression,
) {
  await page.getByRole('radio', { name: path.ambiguityLabel }).check();
  await page.getByRole('button', { name: '모호한 부분 찾기' }).click();
  await page.getByRole('radio', { name: repairExpression }).check();
  await page.getByRole('button', { name: '수리 표현 보내기' }).click();
  await page.getByRole('radio', { name: path.meaningLabelKo }).check();
  await page.getByRole('button', { name: '이해한 뜻 확인하기' }).click();
  await page.getByRole('radio', { name: path.confirmationExpression }).check();
  await page.getByRole('button', { name: '확인 질문 보내기' }).click();
}
